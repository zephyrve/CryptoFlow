import { NextResponse } from 'next/server';
import { connect } from '@/db/connect';
import Contact from '@/db/models/Contact';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const { name, email,  message } = body;

    if (name && email && message) {
        try {
            const contactSubmission = new Contact(body);
            const savedSubmission = await contactSubmission.save();
            return NextResponse.json(savedSubmission, { status: 201 });
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
