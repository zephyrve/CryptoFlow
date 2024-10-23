import { NextResponse, NextRequest } from 'next/server';
import { connect } from '@/db/connect';
import UserStatistics from '@/db/models/UserStatistics';

export async function GET(req: NextRequest) {
    await connect();
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('address')

    if (walletAddress) {
        try {
            const userStats = await UserStatistics.findOne({
                walletAddress: { $regex: new RegExp(walletAddress, 'i') }
            });

            if (!userStats) {
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
            }

            return NextResponse.json(userStats, { status: 200 });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Wallet address is required" }, { status: 422 });
}
