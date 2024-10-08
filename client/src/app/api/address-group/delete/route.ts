import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import AddressGroup from '@/db/models/AddressGroup';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {id} = body;

    if (id) {
        try {
            const group = await AddressGroup.findById(id);
            if (!group) {
                return NextResponse.json({error: "Group not found"}, {status: 404});
            }
            await group.deleteOne();
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
