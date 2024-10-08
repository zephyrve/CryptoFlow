import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import AddressGroup from '@/db/models/AddressGroup';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {owner, name, description} = body;

    if (owner && name) {
        try {
            const group = new AddressGroup(body);

            const savedGroup = await group.save();

            return NextResponse.json(savedGroup, {status: 200});
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
