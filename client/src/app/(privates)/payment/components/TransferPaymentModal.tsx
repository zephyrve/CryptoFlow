import React, {useCallback, useState} from 'react';
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {transferPaymentRequest} from "@/app/(privates)/payment/api-payment";
import {useAccount} from "wagmi";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Card, CardContent} from "@/components/ui/card";
import {isAddress} from "viem";
import {getUnlockSetting} from "@/utils/paymentRequest";

const FormSchema = z.object({
    walletAddress: z.string()
})

const TransferPaymentModal = () => {
    const {
        isOpenTransferModal,
        selectedPaymentRequest,
        setIsOpenTransferPaymentModal,
        setIsLoadingTransferPayment,
        isLoadingTransferPayment,
        deleteReceivePaymentRequest
    } = usePaymentRequestsStore()
    const {address, chainId} = useAccount()
    const [isSendToOldRecipient, setIsSendToOldRecipient] = useState('old-recipient')

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            walletAddress: ""
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!isAddress(data.walletAddress)) {
            form.setError('walletAddress', {message: 'Invalid address!'})
            return
        }

        try {
            setIsLoadingTransferPayment(true)
            if (chainId) {
                const transaction = await transferPaymentRequest({
                    address: address!,
                    requestId: selectedPaymentRequest?.requestId!,
                    to: data.walletAddress,
                    isSendToOldRecipient: isSendToOldRecipient === 'old-recipient'
                })

                if(selectedPaymentRequest) deleteReceivePaymentRequest({id: selectedPaymentRequest?.requestId!})

                toast.success(
                    <div className={'flex flex-col justify-start gap-2'}>
                        <div className={'font-bold'}>Transfer completed successfully!</div>
                        <Link target={'_blank'} href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                            {shortAddress(transaction?.transactionHash)}
                        </Link>
                    </div>
                )
            }
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) toast.error(e?.shortMessage);
            else toast.error(e?.message);
        } finally {
            setIsOpenTransferPaymentModal(false)
            setIsLoadingTransferPayment(false)
        }
    };

    const onCloseModal = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpenTransferPaymentModal(false)
    }, [])

    return (
        <Dialog open={isOpenTransferModal} onOpenChange={setIsOpenTransferPaymentModal}>
            <DialogContent>
                <DialogHeader>
                    Transfer Payment Request
                </DialogHeader>

                {selectedPaymentRequest?.sender?.toLowerCase() === address?.toLowerCase()
                    ? <Alert variant={'destructive'}>
                        <AlertTitle className={'font-medium text-[15px]'}>
                            If there is an unlocked amount remaining in this request, please note that the funds
                            will be sent to the original recipient's wallet.
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
                                        onValueChange={setIsSendToOldRecipient}
                                        defaultValue={isSendToOldRecipient}
                                        className="flex flex-col items-start align-middle space-y-3"
                                        value={isSendToOldRecipient}
                                    >
                                        <div className="flex items-start align-middle gap-3">
                                            <RadioGroupItem value="old-recipient" id="old-recipient"/>
                                            <Label htmlFor="old-recipient" className={'cursor-pointer'}>
                                                Transfer funds to my wallet
                                            </Label>
                                        </div>
                                        <div className="flex items-start align-middle gap-3">
                                            <RadioGroupItem value="new-recipient" id="new-recipient"/>
                                            <Label htmlFor="new-recipient" className={'cursor-pointer'}>
                                                Transfer funds to the new wallet
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </AlertDescription>
                    </Alert>
                }

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <FormField
                            control={form.control}
                            name="walletAddress"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Wallet address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Wallet address" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className={'w-full justify-end flex items-center gap-2'}>
                            <Button onClick={onCloseModal}>
                                Close
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoadingTransferPayment}
                                disabled={isLoadingTransferPayment}
                                variant={'destructive'}
                            >
                                Transfer
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default TransferPaymentModal;