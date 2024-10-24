import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import AddressGroup from '@/db/models/AddressGroup';

export async function PUT(req: Request) {
    await connect();

    const body = await req.json();
    const {id, ...updateData} = body;

    if (id === null || id === undefined) {
        return NextResponse.json({error: "ID is required"}, {status: 422});
    }

    try {
        const existingAddressGroup = await AddressGroup.findById(id);

        if (!existingAddressGroup) {
            return NextResponse.json({error: "Address group not found"}, {status: 404});
        }

        const updatedAddressGroup = await AddressGroup.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        );

        return NextResponse.json(updatedAddressGroup, {status: 200});
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
    }
}
