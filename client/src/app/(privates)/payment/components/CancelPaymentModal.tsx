import React, {useCallback, useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {cancelPaymentRequest} from "@/app/(privates)/payment/api-payment";
import {useAccount} from "wagmi";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Card, CardContent} from "@/components/ui/card";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";

const CancelPaymentModal = () => {
    const {
        setIsOpenCancelPaymentModal,
        isOpenCancelPaymentModal,
        selectedPaymentRequest,
        setIsLoadingCancelPayment,
        updateStatusRequest,
        isLoadingCancelPayment,
        increaseWithdrew
    } = usePaymentRequestsStore()

    const {address, chain, chainId} = useAccount()
    const [isSendToEmitter, setIsSendToEmitter] = useState('sender')

    const onSubmit = async () => {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingCancelPayment(true)
            if (chainId) {
                const transaction = await cancelPaymentRequest({
                    address: address!,
                    requestId: selectedPaymentRequest?.requestId!,
                    isSendToEmitter: isSendToEmitter === 'sender'
                })
                updateStatusRequest({id: selectedPaymentRequest?.requestId, status: 2, isReceived: address!.toLowerCase() !== selectedPaymentRequest?.sender.toLowerCase()})
                if (selectedPaymentRequest)
                    increaseWithdrew({
                        id: selectedPaymentRequest?.requestId,
                        amount: parseFloat(selectedPaymentRequest.remainingBalance.toString()),
                        isReceived: address!.toLowerCase() !== selectedPaymentRequest?.sender.toLowerCase()
                    })
                toast.success(
                    <div className={'flex flex-col justify-start gap-2'}>
                        <div className={'font-bold'}>Cancel completed successfully!</div>
                        <Link target={'_blank'} href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                            {shortAddress(transaction?.transactionHash)}
                        </Link>
                    </div>
                )
            }
            setIsOpenCancelPaymentModal(false)
            setIsLoadingCancelPayment(false)
        } catch (e: any) {
            console.log(e);
            setIsOpenCancelPaymentModal(false)
            setIsLoadingCancelPayment(false)
            if (e?.shortMessage) toast.error(e?.shortMessage);
            else toast.error(e?.message);
        } finally {
            setIsOpenCancelPaymentModal(false)
            setIsLoadingCancelPayment(false)
        }
    };

    const onCloseModal = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpenCancelPaymentModal(false)
    }, [])


    return (
        <Dialog open={isOpenCancelPaymentModal} onOpenChange={setIsOpenCancelPaymentModal}>
            <DialogContent>
                <DialogHeader>
                    Do you want to cancel this payment request ?
                </DialogHeader>

                {selectedPaymentRequest?.sender?.toLowerCase() === address?.toLowerCase()
                    ? <Alert variant={'destructive'}>
                        <AlertTitle className={'font-medium text-[15px]'}>
                            If there is an unlocked amount remaining in this request, please note that the funds
                            will be sent to the recipient's wallet.
                        </AlertTitle>
                    </Alert>
                    : <Alert variant={'destructive'}>
                        <AlertTitle className={'font-medium text-[15px]'}>
                            If there is an unlocked amount remaining in this request,
                            where would you like the funds to be sent?
                        </AlertTitle>
                        <AlertDescription>
                            <Card className={'w-max'}>
                                <CardContent className={'p-2'}>
                                    <RadioGroup
                                        onValueChange={setIsSendToEmitter}
                                        defaultValue={isSendToEmitter}
                                        className="flex flex-col items-start align-middle space-y-3"
                                        value={isSendToEmitter}
                                    >
                                        <div className="flex items-start align-middle gap-3">
                                            <RadioGroupItem value="sender" id="sender"/>
                                            <Label htmlFor="sender" className={'cursor-pointer'}>
                                                Transfer funds back to the original sender
                                            </Label>
                                        </div>
                                        <div className="flex items-start align-middle gap-3">
                                            <RadioGroupItem value="recipient" id="recipient"/>
                                            <Label htmlFor="recipient" className={'cursor-pointer'}>Transfer funds to my
                                                wallet</Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </AlertDescription>
                    </Alert>
                }

                <div className={'w-full justify-end flex items-center gap-2'}>
                    <Button onClick={onCloseModal}>
                        Close
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoadingCancelPayment}
                        disabled={isLoadingCancelPayment}
                        onClick={onSubmit}
                        variant={'destructive'}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelPaymentModal;