import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Address from '@/db/models/Address';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {id} = body;

    if (id) {
        try {
            const address = await Address.findById(id);

            if (!address) {
                return NextResponse.json({error: "Address not found"}, {status: 404});
            }

            await address.deleteOne();

            return NextResponse.json({message: "deleted"}, {status: 200});
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
