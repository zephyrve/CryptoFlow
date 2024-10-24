import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Address from '@/db/models/Address';

export async function PUT(req: Request) {
    await connect();

    const body = await req.json();
    const {walletAddress, id, ...updateData} = body;

    if (id === null || id === undefined) {
        return NextResponse.json({error: "ID address is required"}, {status: 422});
    }

    try {
        const existingAddress = await Address.findById(id);

        if (!existingAddress) {
            return NextResponse.json({error: "Address not found"}, {status: 404});
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        );

        return NextResponse.json(updatedAddress, {status: 200});
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
    }
}
