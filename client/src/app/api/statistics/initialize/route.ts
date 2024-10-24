import { NextResponse } from 'next/server';
import { connect } from '@/db/connect';
import UserStatistics from '@/db/models/UserStatistics';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const { walletAddress } = body;

    if (walletAddress) {
        try {
            const existingStats = await UserStatistics.find({
                walletAddress: { $regex: new RegExp(walletAddress, 'i') }
            });

            if (existingStats) {
                return NextResponse.json({ error: "User statistics already exist" }, { status: 200 });
            }

            const userStats = new UserStatistics({
                walletAddress,
                transactionsCount: 0,
                totalAmountTransacted: 0.0,
                successfulTransactions: 0,
                failedTransactions: 0,
                transactionHistory: []
            });

            const savedStats = await userStats.save();
            return NextResponse.json(savedStats, { status: 201 });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "User ID is required" }, { status: 422 });
}
