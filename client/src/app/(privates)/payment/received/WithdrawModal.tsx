import React, {useCallback} from 'react';
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {toast} from "sonner";
import {withdrawFromPaymentRequest} from "@/app/(privates)/payment/api-payment";
import {useAccount} from "wagmi";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";

const FormSchema = z.object({
    amount: z.string()
        .refine((value) => Number(value) > 0, {
            message: "Amount must be greater than 0",
        }),
})

const WithdrawModal = () => {
    const {
        selectedPaymentRequest,
        setIsLoadingWithdraw,
        isLoadingWithdraw,
        setIsOpenWithdrawModal,
        isOpenWithdrawModal,
        increaseWithdrew,
        updateStatusRequest
    } = usePaymentRequestsStore()

    const {address, chain, chainId} = useAccount()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: "0"
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingWithdraw(true)
            if (chainId) {
                const transaction = await withdrawFromPaymentRequest({
                    address: address!,
                    requestId: selectedPaymentRequest?.requestId!,
                    amount: data.amount.toString()
                })
                if (selectedPaymentRequest)
                    if ((selectedPaymentRequest?.remainingBalance - parseFloat(data.amount)) === 0) {
                        updateStatusRequest({
                            id: selectedPaymentRequest?.requestId,
                            status: 3,
                            isReceived: address!.toLowerCase() !== selectedPaymentRequest?.sender.toLowerCase()
                        })
                    }
                increaseWithdrew({
                    id: selectedPaymentRequest?.requestId,
                    amount: parseFloat(data.amount.toString()),
                    isReceived: address!.toLowerCase() !== selectedPaymentRequest?.sender.toLowerCase()
                })
                toast.success(
                    <div className={'flex flex-col justify-start gap-2'}>
                        <div className={'font-bold'}>Withdrawal completed successfully!</div>
                        <Link target={'_blank'} href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                            {shortAddress(transaction?.transactionHash)}
                        </Link>
                    </div>
                )
            }
            setIsOpenWithdrawModal(false)
            setIsLoadingWithdraw(false)
        } catch (e: any) {
            console.log(e);
            if (e?.shortMessage) {
                if (e?.shortMessage.includes('amount>balance'))
                    toast.error('Insufficient unlocked balance. The amount exceeds your available funds!')
                else
                    (toast.error(e?.shortMessage))
            } else toast.error(e?.message);
        } finally {
            setIsLoadingWithdraw(false)
        }
    };

    const onCloseModal = useCallback((e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpenWithdrawModal(false)
    }, [])

    return (
        <Dialog open={isOpenWithdrawModal} onOpenChange={setIsOpenWithdrawModal}>
            <DialogContent>
                <DialogHeader>
                    Withdraw
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type={'number'} placeholder="Amount" {...field}/>
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
                                isLoading={isLoadingWithdraw}
                                disabled={isLoadingWithdraw}
                            >
                                Withdraw
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawModal;