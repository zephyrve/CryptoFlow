'use client'

import React, {useEffect} from 'react';
import {PaymentRequestsTable} from "@/app/(privates)/payment/sent/PaymentRequestsTable";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import Loader from "@/components/share/Loader";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useAccount} from "wagmi";
import CancelPaymentModal from "@/app/(privates)/payment/components/CancelPaymentModal";
import TransferPaymentModal from "@/app/(privates)/payment/components/TransferPaymentModal";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";

const Page = () => {
    const {
        isLoadingPaymentRequests,
        paymentRequests,
        getSenderPaymentRequests
    } = usePaymentRequestsStore()
    const {address, chainId} = useAccount()

    useEffect(() => {
        if (address)
            getSenderPaymentRequests({address})
    }, [address]);

    return (
        <>
            <CancelPaymentModal/>
            <TransferPaymentModal/>
            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Sent Payments
                </CardHeader>
                <CardContent className={''}>
                    <Loader
                        className={'flex justify-center'}
                        isShow={isLoadingPaymentRequests && paymentRequests?.length === 0}
                    />

                    {!isLoadingPaymentRequests && paymentRequests?.length === 0 && chainId === DEFAULT_CHAIN_ID &&
                        <Alert>
                            <AlertDescription>No payment requests available</AlertDescription>
                        </Alert>
                    }

                    {chainId !== DEFAULT_CHAIN_ID &&
                        <Alert variant={'destructive'} className={'w-max'}>
                            <AlertDescription>Switch to BTTC Testnet Network</AlertDescription>
                        </Alert>
                    }

                    {paymentRequests?.length > 0 && chainId === DEFAULT_CHAIN_ID &&
                        <Card className={' overflow-hidden'}>
                            <PaymentRequestsTable/>
                        </Card>
                    }
                </CardContent>
            </Card>
        </>
    );
};

export default Page;