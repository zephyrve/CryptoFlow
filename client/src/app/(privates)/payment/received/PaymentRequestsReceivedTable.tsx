'use client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {PaymentRequest, shortAddress, timestampToDate, truncateNumberByLength} from "@/utils/funstions";
import Link from "next/link";
import {chains, tokenAddressInfo} from "@/utils/chainSettings";
import {useAccount} from "wagmi";
import {ArrowDown, ArrowRightLeft, EllipsisVerticalIcon, UserIcon, XIcon} from "lucide-react";
import React, {useCallback, useEffect} from "react";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {checkPaymentDisabledActions, getStatus} from "@/utils/paymentStatus";
import Image from "next/image";
import PaymentProcess from "@/components/share/PaymentProcess";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import CancelPaymentModal from "@/app/(privates)/payment/components/CancelPaymentModal";
import TransferPaymentModal from "@/app/(privates)/payment/components/TransferPaymentModal";
import WithdrawModal from "@/app/(privates)/payment/received/WithdrawModal";
import {getUnlockSetting} from "@/utils/paymentRequest";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {cn} from "@/utils/styles";

export function PaymentRequestsReceivedTable() {
    const {chainId, address} = useAccount()
    const {addresses} = useAddressesStore()
    const {
        recipientPayments,
        getRecipientPaymentRequests,
        setIsOpenCancelPaymentModal,
        setSelectedPaymentRequest,
        setIsOpenTransferPaymentModal,
        setIsOpenWithdrawModal
    } = usePaymentRequestsStore()

    const onWithdraw = useCallback((paymentRequest: PaymentRequest) => {
        return () => {
            setSelectedPaymentRequest(paymentRequest)
            setIsOpenWithdrawModal(true)
        };
    }, []);

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

    useEffect(() => {
        if (address) getRecipientPaymentRequests({address})
    }, [address]);

    return (
        <>
            <CancelPaymentModal/>
            <TransferPaymentModal/>
            <WithdrawModal/>
            <div className="flex ">
                <ScrollArea type="always" className="w-1 flex-1">
                    <div className="flex gap-2 pb-1">
                        <Table className={'min-w-[900px]'}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Token</TableHead>
                                    <TableHead className={'text-center'}>Sender</TableHead>
                                    <TableHead className={'text-center'}>Start At</TableHead>
                                    <TableHead className={'text-center'}>Withdrew</TableHead>
                                    <TableHead className={'text-center'}>Unlocked</TableHead>
                                    <TableHead className={'text-nowrap text-center'}>Unlock Settings</TableHead>
                                    <TableHead className={'text-nowrap text-center'}>Prepaid (%)</TableHead>
                                    <TableHead className={'text-center'}>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chainId && recipientPayments?.map((paymentRequest, index) => {
                                    const startDate = new Date(paymentRequest.startDate).toLocaleString();
                                    const token = tokenAddressInfo[chainId][paymentRequest.tokenAddress];
                                    const {unlockSettings} = getUnlockSetting(paymentRequest);
                                    const {isAllowCancel, isAllowTransfer, isAllowWithdraw} =
                                        checkPaymentDisabledActions(paymentRequest, false);
                                    let userName = ''
                                    if (paymentRequest.sender.length === 42) {
                                        userName = addresses.find(addr => addr.walletAddress.toLowerCase() === paymentRequest.sender.toLowerCase())?.name ?? ''
                                    }
                                    return <TableRow
                                        className={cn({'bg-muted': index % 2 == 0})}
                                        key={paymentRequest.requestId}
                                    >
                                        <TableCell className="font-medium">
                                            <Image
                                                className={'bg-white rounded-full'}
                                                width={30} height={30}
                                                src={token.logo} alt={''}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={'text-center flex justify-center align-middle items-center gap-1'}>
                                            <Badge className={'font-medium text-md'} variant={'outline'}>
                                                <Link
                                                    target="_blank"
                                                    href={chains[chainId].explorer
                                                        .concat("address/")
                                                        .concat(paymentRequest.sender)}
                                                >
                                                    {shortAddress(paymentRequest.sender)}
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
                                            <Badge className={'font-medium text-md w-max text-nowrap'}
                                                   variant={'secondary'}>
                                                {timestampToDate(new Date(startDate).getTime() / 1000, 'FULL')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <div className={'w-full justify-center flex'}>
                                                <Badge className={'font-medium text-md'} variant={'outline'}>
                                                    {truncateNumberByLength(paymentRequest.paymentAmount - paymentRequest.remainingBalance, 8)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <div className={'w-full justify-center flex'}>
                                                <Badge className={'font-medium text-md text-nowrap w-max'}
                                                       variant={'secondary'}>
                                                    <PaymentProcess
                                                        key={`sent-payment-${index}`}
                                                        payment={paymentRequest}
                                                    />
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md w-max text-nowrap'}
                                                   variant={'outline'}>
                                                {unlockSettings}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <div className={'w-full flex justify-center align-middle'}>
                                                <Badge className={'font-medium text-md'} variant={'secondary'}>
                                                    {paymentRequest.prepaidPercentage}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'text-center'}>
                                            <Badge className={'font-medium text-md'} variant={'outline'}>
                                                {getStatus(paymentRequest.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className={'mr-3 px-2'}>
                                                    <EllipsisVerticalIcon/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align={'end'}>
                                                    <DropdownMenuItem
                                                        className={'flex justify-start items-center gap-1'}
                                                        onClick={onWithdraw(paymentRequest)}
                                                        disabled={!isAllowWithdraw}
                                                    >
                                                        <ArrowDown size={15}/> Withdraw
                                                    </DropdownMenuItem>
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
