'use client'

import React, {useEffect} from "react";
import {BalanceTable} from "@/app/(privates)/balance/components/BalanceTable";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {DepositToken} from "@/app/(privates)/balance/components/DepositToken";
import {WithdrawToken} from "@/app/(privates)/balance/components/WithdrawToken";
import {useWalletStore} from "@/stores/useWalletStore";
import {useAccount} from "wagmi";

export default function Page() {
    const {balances, getBalances, isLoadingBalance} = useWalletStore()
    const {address} = useAccount()

    useEffect(() => {
        if (address) getBalances({address})
    }, [address]);

    return (
        <div className={'flex flex-col gap-1'}>
            <div className={'flex gap-2 justify-between flex-col md:flex-row'}>
                <Card className={'w-full overflow-hidden border-none'}>
                    <CardHeader
                        className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                    >
                        Deposit
                    </CardHeader>
                    <CardContent>
                        <DepositToken/>
                    </CardContent>
                </Card>
                <Card className={'w-full overflow-hidden border-none'}>
                    <CardHeader
                        className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                    >
                        Withdraw
                    </CardHeader>
                    <CardContent>
                        <WithdrawToken/>
                    </CardContent>
                </Card>
            </div>

            <Card className={' md:mt-4 w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Balances
                </CardHeader>
                <CardContent className={''}>
                    <Card className={'w-full'}>
                        <BalanceTable/>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
