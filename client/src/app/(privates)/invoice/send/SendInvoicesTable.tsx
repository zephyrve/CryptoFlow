'use client'
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {useAccount} from "wagmi";
import React, {useCallback, useEffect} from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import Loader from "@/components/share/Loader";
import {useGeneratePdf} from "@/hooks/useGeneratePdf";
import {useInvoicesStore} from "@/stores/useInvoicesStore";
import {Alert, AlertDescription} from "@/components/ui/alert";
import InvoicesTableRowSend from "@/app/(privates)/invoice/send/InvoicesTableRowSend";
import {Card} from "@/components/ui/card";

export function SendInvoicesTable() {
    const {chainId, address} = useAccount()
    const {
        getSentInvoices,
        isLoadingSentInvoices,
        sentInvoices,
        setIsOpenEditModal,
        setSelectedInvoiceStatusToUpdate,
        setSelectedInvoice,
    } = useInvoicesStore()
    const {isLoading: isLoadingPdf, generatePdf} = useGeneratePdf()

    useEffect(() => {
        if (address) getSentInvoices({address})
    }, [address]);

    const onCancelModal = useCallback((invoice: any) => {
        return () => {
            setSelectedInvoice(invoice)
            setSelectedInvoiceStatusToUpdate(2)
            setIsOpenEditModal(true)
        };
    }, []);

    const onPauseModal = useCallback((invoice: any) => {
        return () => {
            setSelectedInvoice(invoice)
            setSelectedInvoiceStatusToUpdate(3)
            setIsOpenEditModal(true)
        };
    }, []);

    const onActivateModal = useCallback((invoice: any) => {
        return () => {
            setSelectedInvoice(invoice)
            setSelectedInvoiceStatusToUpdate(1)
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

    return (
        <>
            <Loader
                className={'flex justify-center'}
                isShow={isLoadingSentInvoices && sentInvoices?.length === 0}
            />

            {!isLoadingSentInvoices && sentInvoices?.length === 0 &&
                <Alert>
                    <AlertDescription>No invoices available</AlertDescription>
                </Alert>
            }

            {sentInvoices?.length > 0 &&
                <Card className="flex w-full">
                    <ScrollArea type="always" className="w-1 flex-1">
                        <div className="flex gap-2 pb-1">
                            <Table className={'min-w-[900px]'}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Token</TableHead>
                                        <TableHead className={'text-center'}>Client</TableHead>
                                        <TableHead className={'text-center'}>Items</TableHead>
                                        <TableHead className={'text-center'}>Tax</TableHead>
                                        <TableHead className={'text-center'}>Due</TableHead>
                                        <TableHead className={'text-center'}>Created At</TableHead>
                                        <TableHead className={'text-center'}>Status</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {chainId && sentInvoices?.map((invoice, index) => {
                                        return <InvoicesTableRowSend
                                            onCancelModal={onCancelModal}
                                            onPauseModal={onPauseModal}
                                            onActivateModal={onActivateModal}
                                            onDownloadPdf={onDownloadPdf}
                                            index={index} invoice={invoice}
                                            isLoadingPdf={isLoadingPdf}
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
