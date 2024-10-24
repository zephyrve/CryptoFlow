'use client'
import React, {useCallback} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useInvoicesStore} from "@/stores/useInvoicesStore";
import {toast} from "sonner";
import {useAccount} from "wagmi";
import {payInvoice} from "@/app/(privates)/invoice/api-invoices";
import Link from "next/link";
import {bttcTestnet} from "@/config/wagmi";
import {shortAddress} from "@/utils/funstions";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";

const PayInvoiceModal = () => {
    const {
        setIsLoadingPayInvoice,
        isLoadingPayInvoice,
        isOpenPayModal,
        setIsOpenPayModal,
        selectedInvoice,
        updateReceivedInvoice,
    } = useInvoicesStore()
    const {chain, address} = useAccount()

    async function onSubmit() {
        if (chain?.id !== DEFAULT_CHAIN_ID) {
            toast.error('Switch to BTTC Testnet Network')
            return
        }

        try {
            setIsLoadingPayInvoice(true)
            if (chain) {
                const transaction = await payInvoice({
                    chain: chain.id,
                    address: address,
                    invoice: selectedInvoice,
                })

                await updateReceivedInvoice({id: selectedInvoice?._id!, status: 5})

                toast.success(
                    <div className={'flex flex-col justify-start gap-2'}>
                        <div className={'font-bold'}>Payment completed successfully!</div>
                        <Link target={'_blank'} href={`${bttcTestnet.blockExplorers.default.url}tx/${transaction?.transactionHash}`}>
                            {shortAddress(transaction?.transactionHash)}
                        </Link>
                    </div>
                )
            }
            setIsLoadingPayInvoice(false)
            setIsOpenPayModal(false)
        } catch (e: any) {
            if (e?.shortMessage) {
                if (e?.shortMessage.includes('totalAmount>balance')) toast.error('Insufficient balance: total amount exceeds available funds!')
                else (toast.error(e?.shortMessage))
            }else toast.error(e?.message);
        } finally {
            setIsOpenPayModal(false)
            setIsLoadingPayInvoice(false)
        }
    }

    const onCLoseModal = useCallback(() => setIsOpenPayModal(false), [])

    return (
        <Dialog open={isOpenPayModal} onOpenChange={setIsOpenPayModal}>
            <DialogContent>
                <DialogHeader>
                    Are you sure to pay this invoice?
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onCLoseModal}>
                        Close
                    </Button>
                    <Button
                        variant={'destructive'}
                        isLoading={isLoadingPayInvoice}
                        disabled={isLoadingPayInvoice}
                        onClick={onSubmit}
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PayInvoiceModal;