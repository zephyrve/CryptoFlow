'use client'
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useAccount} from "wagmi";
import React, {useCallback, useEffect} from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import Loader from "@/components/share/Loader";
import {useGeneratePdf} from "@/hooks/useGeneratePdf";
import {useInvoicesStore} from "@/stores/useInvoicesStore";
import {Alert, AlertDescription} from "@/components/ui/alert";
import InvoicesTableRowReceiver from "@/app/(privates)/invoice/received/InvoiceTableRowReceive";
import {Card} from "@/components/ui/card";
import {useAddressesStore} from "@/stores/useAddressesStore";

export function ReceivedInvoicesTable() {
    const {chainId, address} = useAccount()
    const {
        setIsOpenPayModal,
        getReceivedInvoices,
        receivedInvoices,
        isLoadingReceivedInvoices,
        setIsOpenEditModal,
        setSelectedInvoiceStatusToUpdate,
        setSelectedInvoice,
        selectedInvoice,
        setIsOpenDetailsModal
    } = useInvoicesStore()
    const {isLoading, generatePdf} = useGeneratePdf()

    useEffect(() => {
        if (address) getReceivedInvoices({address})
    }, [address]);

    const onOpenPayModal = useCallback((invoice: any) => {
        return () => {
            setIsOpenPayModal(true)
            setSelectedInvoice(invoice)
        };
    }, []);

    const onOpenRejectModal = useCallback((invoice: any) => {
        return () => {
            setSelectedInvoice(invoice)
            setSelectedInvoiceStatusToUpdate(4)
            setIsOpenEditModal(true)
        };
    }, []);

    const onDownloadPdf = useCallback((invoice: any) => {
        return async () => {
            setSelectedInvoice(invoice)
            await generatePdf(invoice)
            setSelectedInvoice(null)
        };
    }, []);

    const onOpenDetailsModal = useCallback((invoice: any) => {
        return async () => {
            setSelectedInvoice(invoice)
            setIsOpenDetailsModal(true)
        };
    }, []);

    return (
        <>
            <Loader
                className={'flex justify-center'}
                isShow={isLoadingReceivedInvoices && receivedInvoices?.length === 0}
            />

            {!isLoadingReceivedInvoices && receivedInvoices?.length === 0 &&
                <Alert>
                    <AlertDescription>No invoices available</AlertDescription>
                </Alert>
            }

            {receivedInvoices?.length > 0 &&
                <Card className="flex w-full">
                    <ScrollArea type="always" className="w-1 flex-1">
                        <div className="flex gap-2 pb-1">
                            <Table className={'min-w-[900px]'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Token</TableHead>
                                        <TableHead className={'text-center'}>Sender</TableHead>
                                        <TableHead className={'text-center'}>Items</TableHead>
                                        <TableHead className={'text-center'}>Tax</TableHead>
                                        <TableHead className={'text-center'}>Due</TableHead>
                                        <TableHead className={'text-center'}>Created At</TableHead>
                                        <TableHead className={'text-center'}>Status</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chainId && receivedInvoices?.map((invoice, index) => {
                                        return <InvoicesTableRowReceiver
                                            index={index}
                                            invoice={invoice}
                                            onOpenPayModal={onOpenPayModal}
                                            onOpenRejectModal={onOpenRejectModal}
                                            onDownloadPdf={onDownloadPdf}
                                            isLoadingPdf={isLoading}
                                            onOpenDetailsModal={onOpenDetailsModal}
                                        />
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </Card>
            }
        </>
    )
}
