import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Invoice from '@/db/models/Invoice';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {_id, status} = body;

    if (_id && status) {
        try {
            const updatedInvoice = await Invoice.findOneAndUpdate(
                {_id},
                {status},
                {new: true}
            );

            if (!updatedInvoice) {
                return NextResponse.json({error: 'Invoice not found!'}, {status: 404});
            }

            return NextResponse.json(updatedInvoice, {status: 200});
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({error: error.message}, {status: 500});
            }
            return NextResponse.json({error: 'An unknown error occurred'}, {status: 500});
        }
    }

    return NextResponse.json({error: 'data_incomplete'}, {status: 422});
}
