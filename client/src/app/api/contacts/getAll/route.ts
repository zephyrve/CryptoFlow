import {NextResponse} from 'next/server';
import {connect} from '@/db/connect';
import Contact from '@/db/models/Contact';

export async function POST(req: Request) {
    await connect();

    const body = await req.json();
    const {owner} = body;

    if (owner) {
        try {
            const submissions = await Contact.find({owner: {$regex: new RegExp(owner, 'i')}});
            return NextResponse.json(submissions, {status: 200});
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return NextResponse.json({error: error.message}, {status: 500});
            }
            return NextResponse.json({error: "An unknown error occurred"}, {status: 500});
        }
    }

    return NextResponse.json({error: "Required data is missing or incomplete"}, {status: 422});
}
