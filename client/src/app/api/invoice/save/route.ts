import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Invoice from '@/db/models/Invoice';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {recipient, tokenAddress, items} = body;

    if (recipient && tokenAddress && Array.isArray(items) && items.length > 0) {
        try {
            const invoice = new Invoice(body);

            const savedInvoice = await invoice.save();

            return NextResponse.json(savedInvoice, {status: 200});
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
