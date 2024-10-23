'use client'

import React, {useEffect} from 'react';
import {PaymentRequestsReceivedTable} from "@/app/(privates)/payment/received/PaymentRequestsReceivedTable";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {usePaymentRequestsStore} from "@/stores/usePaymentRequestsStore";
import {useAccount} from "wagmi";
import Loader from "@/components/share/Loader";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";

const Page = () => {
    const {
        isLoadingPaymentRequests,
        recipientPayments,
        getRecipientPaymentRequests
    } = usePaymentRequestsStore()
    const {chainId, address} = useAccount()

    useEffect(() => {
        if (address)
            getRecipientPaymentRequests({address})
    }, [address]);

    return (
        <Card className={'w-full overflow-hidden border-none'}>
            <CardHeader
                className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
            >
                Received Payments
            </CardHeader>
            <CardContent>
                <Loader
                    className={'flex justify-center'}
                    isShow={isLoadingPaymentRequests && recipientPayments?.length === 0}
                />

                {!isLoadingPaymentRequests && recipientPayments?.length === 0 && chainId === DEFAULT_CHAIN_ID &&
                    <Alert>
                        <AlertDescription>No payment requests available</AlertDescription>
                    </Alert>
                }

                {chainId !== DEFAULT_CHAIN_ID &&
                    <Alert variant={'destructive'} className={'w-max'}>
                        <AlertDescription>Switch to BTTC Testnet Network</AlertDescription>
                    </Alert>
                }

                {recipientPayments?.length > 0 && chainId === DEFAULT_CHAIN_ID &&
                    <Card>
                        <PaymentRequestsReceivedTable/>
                    </Card>
                }
            </CardContent>
        </Card>
    );
};

export default Page;