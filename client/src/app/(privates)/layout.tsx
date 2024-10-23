'use client'
import Link from "next/link"
import {Button} from "@/components/ui/button"
import React, {ReactNode, useCallback, useEffect} from "react";
import {usePathname} from "next/navigation";
import {useWalletStore} from "@/stores/useWalletStore";
import {useAccount, useConnect} from "wagmi";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {useGroupsStore} from "@/stores/useGroupsStore";
import useMetaMaskInstalled from "@/hooks/useMetaMaskInstalled";
import WalletButton from "@/components/share/WalletButton";
import Sidebar from "@/components/share/Sidebar";
import MobileMenu from "@/components/share/MobileMenu";
import useUserStatisticsStore from "@/stores/userStatisticsStore";


export function Dashboard({children}: { children: ReactNode }) {
    const pathname = usePathname()
    const {getAddresses} = useAddressesStore()
    const {getGroups} = useGroupsStore()
    const {getBalances} = useWalletStore()
    const {status, address} = useAccount()
    const {isMetaMaskInstalled, isLoading} = useMetaMaskInstalled()
    const {connectors, connect} = useConnect()
    const {fetchUserStatistics} = useUserStatisticsStore()

    useEffect(() => {
        if (address) {
            getGroups({address})
            getAddresses({address})
            getBalances({address})
            fetchUserStatistics({address})
        }
    }, [address]);

    const handleConnect = useCallback(async () => {
        connect({connector: connectors[0]});
    }, [])

    return (
        <div
            className="private-layout grid gap-2 min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr] p-4">
            <Sidebar/>
            <div className="flex flex-col lg:px-6">
                <header
                    className="rounded-xl flex h-14 items-center gap-1 bg-secondary-foreground dark:bg-transparent/70 dark:border-white/30 dark:border-[1px] px-3 lg:h-[60px] lg:px-4"
                >
                    <MobileMenu/>
                    <WalletButton/>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-0 pt-4 lg:gap-6 lg:py-6">
                    {status === 'connected'
                        ? children
                        : <div className={'h-full w-full flex justify-center items-center'}>
                            {isMetaMaskInstalled ? (
                                    <Button
                                        size={'lg'}
                                        variant={'destructive'}
                                        isLoading={status === 'connecting' || status === 'reconnecting' || isLoading}
                                        disabled={status === 'connecting' || status === 'reconnecting' || isLoading}
                                        onClick={handleConnect}
                                    >
                                        Connect Wallet
                                    </Button>)
                                : !isMetaMaskInstalled && (
                                <Button
                                    asChild
                                    variant={'destructive'}
                                >
                                    <Link target={'_blank'} href={'https://metamask.io/download.html'}>
                                        Install MetaMask
                                    </Link>
                                </Button>
                            )}
                        </div>}
                </main>
            </div>
        </div>
    )
}

export default Dashboard