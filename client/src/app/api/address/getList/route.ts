import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Address from '@/db/models/Address';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {owner} = body;

    if (owner) {
        try {
            const addresses = await Address.find({owner});

            return NextResponse.json(addresses, {status: 200});
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
