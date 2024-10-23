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
import {BanIcon, DownloadIcon, EllipsisVerticalIcon, FileTextIcon, PauseIcon, PlayIcon, UserIcon} from "lucide-react";
import {checkInvoiceActionable, getInvoiceAmount} from "@/utils/invoices";
import {CONTRACT_ADDRESS} from "@/config/constants";
import {useAccount} from "wagmi";
import {InvoiceType, useInvoicesStore} from "@/stores/useInvoicesStore";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {cn} from "@/utils/styles";

const InvoicesTableRowSend = memo(({
                                   index, invoice,
                                   onCancelModal,
                                   onPauseModal,
                                   onActivateModal,
                                   onDownloadPdf,
                                   isLoadingPdf
                               }: {
    index: any, invoice: InvoiceType,
    onCancelModal: any
    onPauseModal: any
    onActivateModal: any
    onDownloadPdf: any
    isLoadingPdf: any
}) => {
    const {chainId} = useAccount()
    const {selectedInvoice, setSelectedInvoice, setIsOpenDetailsModal} = useInvoicesStore()
    const {due, totalTaxAmount} = getInvoiceAmount(invoice?.items!);
    const token = tokenAddressInfo[chainId ?? 1029][CONTRACT_ADDRESS]
    const tokenSymbol = token.symbol;
    const {allowActive, allowCancel, allowPause} = checkInvoiceActionable(
        invoice,
        true,
    );
    const dateFull = timestampToDate(new Date(invoice.createdAt ?? '').getTime() / 1000, 'FULL')
    const {addresses} = useAddressesStore()

    const onOpenDetailsModal = () => {
        setSelectedInvoice(invoice)
        setIsOpenDetailsModal(true)
    }

    let userName = useMemo(() => {
        if (invoice.recipient.length === 42) {
            return addresses.find(addr => addr.walletAddress.toLowerCase() === invoice.recipient.toLowerCase())?.name ?? ''
        }
        return ''
    }, [addresses, invoice])

    return (
        <TableRow
            className={cn({'bg-muted': index % 2 == 0})}
            key={invoice._id}
        >
            <TableCell className="font-medium">
                <Image
                    className={'bg-white rounded-full'} width={30} height={30}
                    src={token.logo} alt={''}
                />
            </TableCell>
            <TableCell className={'text-center flex justify-center align-middle items-center gap-1'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    <Link
                        target="_blank"
                        href={chains[chainId ?? 1029].explorer
                            .concat("address/")
                            .concat(invoice.recipient)}
                    >
                        {getShortAddress(invoice?.recipient, 8)}
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
                <Badge className={'font-medium text-md'} variant={'secondary'}>
                    {invoice.items.length} item(s)
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    {truncateNumberByLength(totalTaxAmount, 8)} {tokenSymbol}{" "}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'secondary'}>
                    {due} {tokenSymbol}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'outline'}>
                    {dateFull}
                </Badge>
            </TableCell>
            <TableCell className={'text-center'}>
                <Badge className={'font-medium text-md'} variant={'secondary'}>
                    {getInvoiceStatus(invoice.status)}
                </Badge>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger className={'mr-3 px-2'}>
                        {(isLoadingPdf && selectedInvoice?._id === invoice._id)
                            ? <Loader
                                isShow={true}
                                className={'flex justify-center items-center'}
                            />
                            : <EllipsisVerticalIcon/>
                        }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={'end'}>
                        {allowCancel &&
                            <DropdownMenuItem className={'flex items-center align-middle gap-2'} onClick={onCancelModal(invoice)}>
                                <BanIcon size={15}/>
                                Cancel
                            </DropdownMenuItem>
                        }
                        {allowPause &&
                            <DropdownMenuItem className={'flex items-center align-middle gap-2'} onClick={onPauseModal(invoice)}>
                                <PauseIcon  size={15}/>
                                Pause
                            </DropdownMenuItem>
                        }
                        {allowActive &&
                            <DropdownMenuItem className={'flex items-center align-middle gap-2'} onClick={onActivateModal(invoice)}>
                                <PlayIcon size={15}/>
                                Active
                            </DropdownMenuItem>
                        }
                        <DropdownMenuItem className={'flex items-center align-middle gap-2'}
                            disabled={isLoadingPdf}
                            onClick={onOpenDetailsModal}
                        >
                            <FileTextIcon size={15}/>
                            Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={'flex items-center align-middle gap-2'}
                            disabled={isLoadingPdf}
                            onClick={onDownloadPdf(invoice)}
                        >
                            <DownloadIcon size={15}/>
                            Download
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
})

export default InvoicesTableRowSend;