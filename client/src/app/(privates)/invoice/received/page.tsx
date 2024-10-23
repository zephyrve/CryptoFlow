'use client'

import React from 'react';
import {ReceivedInvoicesTable} from "@/app/(privates)/invoice/received/ReceivedInvoicesTable";
import UpdateInvoiceStatusModal from "@/app/(privates)/invoice/components/UpdateInvoiceStatusModal";
import PayInvoiceModal from "@/app/(privates)/invoice/components/PayInvoiceModal";
import CancelPaymentModal from "@/app/(privates)/payment/components/CancelPaymentModal";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import InvoiceDetailsModal from "@/app/(privates)/invoice/components/InvoiceDetailsModal";

const Page = () => {
    return (
        <>
            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Received Invoices
                </CardHeader>
                <CardContent>
                    <ReceivedInvoicesTable/>
                </CardContent>
            </Card>
            <InvoiceDetailsModal/>
            <UpdateInvoiceStatusModal isReceived={true}/>
            <PayInvoiceModal/>
            <CancelPaymentModal/>
        </>
    );
};

export default Page;