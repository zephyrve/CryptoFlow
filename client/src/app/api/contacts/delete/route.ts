import { NextResponse } from 'next/server';
import { connect } from '@/db/connect';
import Contact from '@/db/models/Contact';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const { id } = body;

    if (id) {
        try {
            const submission = await Contact.findById(id);

            if (!submission) {
                return NextResponse.json({ error: "Submission not found" }, { status: 404 });
            }

            await submission.deleteOne();
            return NextResponse.json({ message: "Submission deleted" }, { status: 200 });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Required data is missing or incomplete" }, { status: 422 });
}