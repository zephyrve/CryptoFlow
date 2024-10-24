'use client'
import React, {useEffect} from 'react';
import Stats from "@/app/(privates)/statistics/components/Charts";
import useUserStatisticsStore from "@/stores/userStatisticsStore";
import {useAccount} from "wagmi";
import Loader from "@/components/share/Loader";
import {Alert, AlertDescription} from "@/components/ui/alert";

const Page = () => {
    const {data, fetchUserStatistics, isLoading} = useUserStatisticsStore();
    const {address} = useAccount()

    useEffect(() => {
        if (address) {
            fetchUserStatistics({address})
        }
    }, [address]);

    return (
        <>
            <Loader className={'flex justify-center'} isShow={isLoading && data?.transactionHistory.length === 0}/>

            {!isLoading && data?.transactionHistory.length === 0 &&
                <Alert>
                    <AlertDescription>
                        Start using the app to view your activity stats!
                    </AlertDescription>
                </Alert>
            }

            {data?.transactionHistory.length > 0 &&
                <Stats/>
            }
        </>
    );
};

export default Page;