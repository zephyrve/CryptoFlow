import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Address from '@/db/models/Address';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {owner, walletAddress} = body;

    if (owner && walletAddress) {
        try {
            const existingAddress = await Address.findOne({
                walletAddress: { $regex: new RegExp(walletAddress, 'i') },
                owner: { $regex: new RegExp(owner, 'i') }
            });

            if (existingAddress) {
                return NextResponse.json({error: "Address already exists"}, {status: 409});
            }

            const address = new Address(body);
            const savedAddress = await address.save();
            return NextResponse.json(savedAddress, {status: 200});
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({error: error.message}, {status: 500});
            }
            return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
        }
    }

    return NextResponse.json({error: "data_incomplete"}, {status: 422});
}
