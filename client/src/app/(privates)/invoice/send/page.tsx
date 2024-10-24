'use client'

import React from 'react';
import {SendInvoicesTable} from "@/app/(privates)/invoice/send/SendInvoicesTable";
import UpdateInvoiceStatusModal from "@/app/(privates)/invoice/components/UpdateInvoiceStatusModal";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import CancelPaymentModal from "@/app/(privates)/payment/components/CancelPaymentModal";
import TransferPaymentModal from "@/app/(privates)/payment/components/TransferPaymentModal";
import WithdrawModal from "@/app/(privates)/payment/received/WithdrawModal";
import InvoiceDetailsModal from "@/app/(privates)/invoice/components/InvoiceDetailsModal";

const Page = () => {
    return (
        <>
            <InvoiceDetailsModal/>
            <CancelPaymentModal/>
            <TransferPaymentModal/>
            <WithdrawModal/>
            <UpdateInvoiceStatusModal isReceived={false}/>
            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Sent Invoices
                </CardHeader>
                <CardContent className={'mt-0 pt-0'}>
                    <SendInvoicesTable/>
                </CardContent>
            </Card>
        </>
    );
};

export default Page;