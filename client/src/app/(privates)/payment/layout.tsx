'use client'
import React, {ReactNode} from 'react';
import {DEFAULT_CHAIN_ID} from "@/utils/chainSettings";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useAccount} from "wagmi";

const Layout = ({children}: { children: ReactNode }) => {
    const {chainId} = useAccount()
    
    return (
        <>
            {chainId !== DEFAULT_CHAIN_ID
                ? <Card className={'w-full overflow-hidden border-none'}>
                    <CardHeader
                        className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                    >
                        Sent Payments
                    </CardHeader>
                    <CardContent className={''}>
                        <Alert variant={'destructive'} className={'w-max'}>
                            <AlertDescription>Switch to BTTC Testnet Network</AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
                : <>
                    {children}
                </>
            }
        </>
    );
};

export default Layout;