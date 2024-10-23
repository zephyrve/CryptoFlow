import React, {memo, useMemo} from 'react';
import {TableCell, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {chains, tokenAddressInfo} from "@/utils/chainSettings";
import {getShortAddress, timestampToDate, truncateNumberByLength} from "@/utils/funstions";
import {getInvoiceStatus} from "@/utils/paymentStatus";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Loader from "@/components/share/Loader";
import {DollarSign, DownloadIcon, EllipsisVerticalIcon, FileTextIcon, UserIcon, XIcon} from "lucide-react";
import {InvoiceType, useInvoicesStore} from "@/stores/useInvoicesStore";
import {checkInvoiceActionable, getInvoiceAmount} from "@/utils/invoices";
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const InvoicesTableRowReceiver = memo(({
                                           index,
                                           invoice,
                                           onDownloadPdf,
                                           onOpenPayModal,
                                           onOpenRejectModal,
                                           isLoadingPdf,
                                           onOpenDetailsModal
                                       }: {
    index: any, invoice: InvoiceType,
    onDownloadPdf: any
    isLoadingPdf: any
    onOpenPayModal: any
    onOpenRejectModal: any
    onOpenDetailsModal: any
}) => {
    const {chainId, address} = useAccount()
    const {selectedInvoice} = useInvoicesStore()
    const {due, totalTaxAmount} = getInvoiceAmount(invoice?.items!);
    const token = tokenAddressInfo[chainId ?? 1029][CONTRACT_ADDRESS]
    const {addresses} = useAddressesStore()
    const tokenSymbol = token.symbol;
    const {allowPay, allowReject} = checkInvoiceActionable(
        invoice,
        false,
    );

    let userName = useMemo(() => {
        if (invoice.owner.length === 42) {
            return addresses.find(addr => addr.walletAddress.toLowerCase() === invoice.owner.toLowerCase())?.name ?? ''
        }
        return ''
    }, [addresses, invoice])


    return (
        <TableRow
            className={index % 2 == 0 ? 'bg-muted' : ''}
            key={invoice._id}
        >
            <TableCell className="font-medium">
                <Image
                    className={'bg-white rounded-full'} width={30} height={30}
                    src={token.logo} alt={''}
                />
            </TableCell>
            <TableCell className={'text-center flex justify-center align-middle items-center gap-1'}>
                <Badge className={'font-medium text-md h-min'} variant={'secondary'}>
                    <Link
                        target="_blank"
                        href={chains[chainId ?? 1029].explorer
                            .concat("address/")
                            .concat(invoice.owner)}
                    >
                        {getShortAddress(invoice?.owner, 8)}
                    </Link>
                </Badge>

                {userName !== ''
                    ? <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <UserIcon size={15}/>
                            </TooltipTrigger>
                            <TooltipContent side={'bottom'}>
                                <p>{userName}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    : <div></div>
                }
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    {invoice.items.length} item(s)
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'secondary'}>
                    {truncateNumberByLength(totalTaxAmount, 8)} {tokenSymbol}{" "}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    {due} {tokenSymbol}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'secondary'}>
                    {timestampToDate(new Date(invoice.createdAt ?? '').getTime() / 1000, 'FULL')}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    {getInvoiceStatus(invoice.status)}
                </Badge>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger className={'mr-3 px-2'}>
                        {(isLoadingPdf && selectedInvoice?._id === invoice._id)
                            ? <Loader isShow={true} className={''}/>
                            : <EllipsisVerticalIcon/>
                        }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={'end'}>
                        <DropdownMenuItem disabled={!allowPay}
                                          className={'flex gap-1 justify-start items-center align-middle'}
                                          onClick={onOpenPayModal(invoice)}>
                            <DollarSign size={15}/> Pay
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={!allowReject}
                                          className={'flex gap-1 justify-start items-center align-middle'}
                                          onClick={onOpenRejectModal(invoice)}>
                            <XIcon size={15}/> Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem className={'flex items-center align-middle gap-2'}
                                          disabled={isLoadingPdf}
                                          onClick={onOpenDetailsModal(invoice)}
                        >
                            <FileTextIcon size={15}/>
                            Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={'flex gap-1 justify-start items-center align-middle'}
                            onClick={onDownloadPdf(invoice)}
                            disabled={isLoadingPdf}
                        >
                            <DownloadIcon size={15}/> Download
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
})

export default InvoicesTableRowReceiver;