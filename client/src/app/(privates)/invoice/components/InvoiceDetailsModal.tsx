'use client'

import React from "react"
import {useGeneratePdf} from "@/hooks/useGeneratePdf"
import {Download, ExternalLink, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Separator} from "@/components/ui/separator"
import {useAddressesStore} from "@/stores/useAddressesStore";
import {useInvoicesStore} from "@/stores/useInvoicesStore";
import {getShortAddress, shortAddress, truncateNumberByLength} from "@/utils/funstions";
import {getInvoiceAmount, getLineItemAmount} from "@/utils/invoices";
import {Card} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import Link from "next/link";
import {chains} from "@/utils/chainSettings";
import {useAccount} from "wagmi";

const InvoiceDetailsModal = () => {
    const {addresses} = useAddressesStore()
    const {selectedInvoice, isOpenDetailsModal, setIsOpenDetailsModal} = useInvoicesStore()
    const {isLoading, generatePdf} = useGeneratePdf()
    const recipientName = addresses.find(addr => addr.walletAddress.toLowerCase() === selectedInvoice?.recipient.toLowerCase())
    const senderName = addresses.find(addr => addr.walletAddress.toLowerCase() === selectedInvoice?.owner.toLowerCase())
    const {chainId} = useAccount()
    return (
        <Dialog open={isOpenDetailsModal} onOpenChange={setIsOpenDetailsModal}>
            <DialogContent className="max-w-[90%]  flex flex-col">
                <DialogHeader>
                    <DialogTitle>Invoice Details</DialogTitle>
                </DialogHeader>
                <div className="flex-grow  p-0">
                    <div className="flex flex-col gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Sender:</span>
                                {senderName && <Badge variant="secondary">{senderName.name}</Badge>}
                            </div>
                            <Link
                                className="text-sm text-muted-foreground flex justify-start align-middle items-center w-max gap-2"
                                target="_blank"
                                href={chains[chainId ?? 1029].explorer
                                    .concat("address/")
                                    .concat(selectedInvoice?.owner)}
                            >
                                <div>{getShortAddress(selectedInvoice?.owner, 16)}</div>
                                <ExternalLink size={15}/>
                            </Link>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">Recipient:</span>
                                {recipientName && <Badge variant="secondary">{recipientName.name}</Badge>}
                            </div>
                            <Link
                                className="text-sm text-muted-foreground flex justify-start align-middle items-center w-max gap-2"
                                target="_blank"
                                href={chains[chainId ?? 1029].explorer
                                    .concat("address/")
                                    .concat(selectedInvoice?.recipient)}
                            >
                                <div>{getShortAddress(selectedInvoice?.recipient, 16)}</div>
                                <ExternalLink size={15}/>
                            </Link>
                        </div>
                    </div>
                    <Separator className="my-4"/>
                    <Card className="flex w-full">
                        <ScrollArea type="always" className="w-1 flex-1">
                            <div className="flex gap-2 pb-1">
                                <Table className={'min-w-[450px]'}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-center">QTY</TableHead>
                                            <TableHead className="text-center text-nowrap">Unit Price</TableHead>
                                            <TableHead className="text-center text-nowrap">Discount (%)</TableHead>
                                            <TableHead className="text-center text-nowrap">Tax (%)</TableHead>
                                            <TableHead className="text-center">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedInvoice?.items.map((item, index) => {
                                            const lineItemAmount = getLineItemAmount(item)
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className={'h-15 text-left'}>
                                                        <Badge variant="outline">{item.description}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center h-15">
                                                        <Badge
                                                            variant="secondary">{truncateNumberByLength(item.qty, 5)}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center h-15">
                                                        <Badge variant="secondary">1</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center h-15">
                                                        <Badge variant="outline">{item.discount}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center h-15">
                                                        <Badge variant="secondary">{item.tax}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center h-15">
                                                        <Badge
                                                            variant="secondary">{truncateNumberByLength(lineItemAmount, 5)} BTT</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                    </Card>
                </div>

                {selectedInvoice &&
                    <div className={'flex w-full justify-end'}>
                        <Card className={'w-full sm:w-max'}>
                            {(() => {
                                const {amountWithoutTax, totalTaxAmount, totalAmount} = getInvoiceAmount(selectedInvoice?.items!)
                                return (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={4} className={'h-15'}></TableCell>
                                            <TableCell className={'font-bold h-15'}>Amount Without Tax:</TableCell>
                                            <TableCell className="text-right font-medium text-md h-15">
                                                <Badge className={'font-medium text-md'}
                                                    variant="secondary">{truncateNumberByLength(amountWithoutTax, 5)} BTT</Badge>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={'h-15'} colSpan={4}></TableCell>
                                            <TableCell className={'font-bold h-15 '}>Total Tax Amount:</TableCell>
                                            <TableCell className="text-right h-15">
                                                <Badge className={'font-medium text-md h-15'}
                                                    variant="secondary">{truncateNumberByLength(totalTaxAmount, 6)} BTT</Badge>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={'h-15'} colSpan={4}></TableCell>
                                            <TableCell className={'font-bold h-15'}>Total Amount:</TableCell>
                                            <TableCell className="text-right h-15">
                                                <Badge className={'font-medium text-md h-15'}
                                                    variant="secondary">{truncateNumberByLength(totalAmount, 5)} BTT</Badge>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )
                            })()}
                        </Card>
                    </div>
                }

                <DialogFooter className="flex justify-between items-center">
                    <Button
                        variant="default"
                        disabled={isLoading}
                        isLoading={isLoading}
                        onClick={() => generatePdf(selectedInvoice)}
                    >
                        <Download size={18}/>
                        Download PDF
                    </Button>
                    <Button
                        className={'flex gap-1 align-middle items-center'}
                        variant="outline"
                        onClick={() => setIsOpenDetailsModal(false)}
                    >
                        <X className={'p-0 m-0'} size={18}/>
                        <div className={'p-0 m-0'}>Close</div>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default InvoiceDetailsModal