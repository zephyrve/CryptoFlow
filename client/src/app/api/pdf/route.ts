import {NextRequest, NextResponse} from "next/server";
import {PdfTemplate} from "@/app/api/pdf/PdfTemplate";
import {Browser} from "@/app/api/pdf/Browser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const invoiceData = await req.json();
    const {owner, recipient, items, totalAmount, createdAt, status, tokenAddress} = invoiceData;

    if (!owner || !recipient || !items || !totalAmount || !createdAt || status === undefined || !tokenAddress) {
        return NextResponse.json(
            {error: "Owner, recipient, items, total amount, created date, status, and token address are required."},
            {status: 422}
        );
    }

    const invoiceHtml = PdfTemplate(invoiceData);

    let browser;
    try {
        browser = await Browser();
        const page = await browser.newPage();
        await page.setContent(invoiceHtml, {waitUntil: 'networkidle0'});
        const pdfBuffer = await page.pdf({format: 'A4', printBackground: true});

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="invoice.pdf"',
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            {error: "Failed to generate PDF."},
            {status: 500}
        );
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
