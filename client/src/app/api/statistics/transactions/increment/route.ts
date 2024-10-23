import {NextRequest, NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import UserStatistics from '@/db/models/UserStatistics';

export async function POST(req: NextRequest) {
    await connect();
    const {walletAddress, success} = await req.json();

    if (!walletAddress || success === undefined) {
        return NextResponse.json({error: "Wallet address and success flag are required"}, {status: 422});
    }

    try {
        const userStats = await UserStatistics.findOne({
            walletAddress: { $regex: new RegExp(walletAddress, 'i') }
        });

        if (!userStats) {
            return NextResponse.json({error: "User statistics not found"}, {status: 404});
        }

        if (success) {
            userStats.successfulTransactions += 1;
        } else {
            userStats.failedTransactions += 1;
        }

        userStats.transactionsCount += 1;

        const updatedStats = await userStats.save();

        return NextResponse.json(updatedStats, {status: 200});
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
    }
}
