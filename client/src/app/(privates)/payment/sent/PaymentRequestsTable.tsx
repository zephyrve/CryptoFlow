'use client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {PaymentRequest, shortAddress, timestampToDate, truncateNumberByLength} from "@/utils/funstions";
import Link from "next/link";
import {chains, tokenAddressInfo} from "@/utils/chainSettings";
import {useAccount} from "wagmi";
import {ArrowRightLeft, EllipsisVerticalIcon, UserIcon, XIcon} from "lucide-react";
import React, {useCallback, useEffect} from "react";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {getUnlockSetting} from "@/utils/paymentRequest";
import {checkPaymentDisabledActions, getStatus} from "@/utils/paymentStatus";
import Image from "next/image";
import PaymentProcess from "@/components/share/PaymentProcess";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function PaymentRequestsTable() {
    const {chainId, address} = useAccount()
    const {
        setIsOpenCancelPaymentModal,
        setSelectedPaymentRequest,
        setIsOpenTransferPaymentModal,
        paymentRequests,
        getSenderPaymentRequests
    } = usePaymentRequestsStore()
    const {addresses} = useAddressesStore()

    useEffect(() => {
        if (address) getSenderPaymentRequests({address})
    }, [address]);

    const onCancel = useCallback((paymentRequest: PaymentRequest) => {
        return () => {
            setSelectedPaymentRequest(paymentRequest)
            setIsOpenCancelPaymentModal(true)
        };
    }, []);

    const onTransfer = useCallback((paymentRequest: PaymentRequest) => {
        return () => {
            setSelectedPaymentRequest(paymentRequest)
            setIsOpenTransferPaymentModal(true)
        };
    }, []);

    return (
        <>
            <div className="flex ">
                <ScrollArea type="always" className="w-1 flex-1">
                    <div className="flex gap-2">
                        <Table className={'min-w-[900px]'}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Token</TableHead>
                                    <TableHead className={'text-center'}>Recipient</TableHead>
                                    <TableHead className={'text-center'}>Start At</TableHead>
                                    <TableHead className={'text-center'}>Withdrew</TableHead>
                                    <TableHead className={'text-center'}>Unlocked</TableHead>
                                    <TableHead className={'text-center text-nowrap'}>Unlock Settings</TableHead>
                                    <TableHead className={'text-center text-nowrap'}>Prepaid (%)</TableHead>
                                    <TableHead className={'text-center'}>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chainId && paymentRequests?.map((paymentRequest, index) => {
                                    const startDate = new Date(paymentRequest.startDate).toLocaleString();
                                    const token = tokenAddressInfo[chainId][paymentRequest.tokenAddress];
                                    const {isAllowCancel, isAllowTransfer} =
                                        checkPaymentDisabledActions(paymentRequest, true);
                                    let userName = ''
                                    if (paymentRequest.recipient.length === 42) {
                                        userName = addresses.find(addr => addr.walletAddress.toLowerCase() === paymentRequest.recipient.toLowerCase())?.name ?? ''
                                    }
                                    return <TableRow
                                        className={index % 2 == 0 ? 'bg-muted' : ''}
                                        key={paymentRequest.requestId}
                                    >
                                        <TableCell className="font-medium">
                                            <Image
                                                className={'bg-white rounded-full'} width={30} height={30}
                                                src={token.logo} alt={''}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={'text-center flex justify-center align-middle items-center gap-1'}>
                                            <Badge className={'font-medium text-md'} variant={'secondary'}>
                                                <Link
                                                    target="_blank"
                                                    href={chains[chainId].explorer
                                                        .concat("address/")
                                                        .concat(paymentRequest.recipient)}
                                                >
                                                    {shortAddress(paymentRequest.recipient)}
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
                                        <TableCell>
                                            <Badge
                                                className={'font-medium text-nowrap text-md flex flex-col min-w-[140px]'}
                                                variant={'outline'}>
                                                {timestampToDate(new Date(startDate).getTime() / 1000, 'FULL')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md text-nowrap'} variant={'secondary'}>
                                                {truncateNumberByLength(paymentRequest.paymentAmount - paymentRequest.remainingBalance, 8)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md text-nowrap'} variant={'outline'}>
                                                <PaymentProcess
                                                    key={`sent-payment-${index}`}
                                                    payment={paymentRequest}
                                                />
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md w-max'} variant={'secondary'}>
                                                {getUnlockSetting(paymentRequest).unlockSettings}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md'} variant={'outline'}>
                                                {paymentRequest.prepaidPercentage}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md'} variant={'secondary'}>
                                                {getStatus(paymentRequest.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className={'mr-3 px-2'}>
                                                    <EllipsisVerticalIcon/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align={'end'}>
                                                    <DropdownMenuItem
                                                        className={'flex justify-start items-center gap-1'}
                                                        onClick={onCancel(paymentRequest)}
                                                        disabled={!isAllowCancel}
                                                    >
                                                        <XIcon size={15}/> Cancel
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className={'flex justify-start items-center gap-1'}
                                                        onClick={onTransfer(paymentRequest)}
                                                        disabled={!isAllowTransfer}
                                                    >
                                                        <ArrowRightLeft size={15}/> Transfer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        </>
    )
}
