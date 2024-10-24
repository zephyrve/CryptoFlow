import React from 'react';
import {InvoiceForm} from "@/app/(privates)/invoice/create/InvoiceForm";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

const Page = () => {
    return (
        <Card className={'w-full overflow-hidden border-none'}>
            <CardHeader
                className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
            >
                Create Invoice
            </CardHeader>
            <CardContent>
                <InvoiceForm/>
            </CardContent>
        </Card>
    );
};

export default Page;