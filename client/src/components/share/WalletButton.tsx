'use client'

import React from 'react';
import {useAccount, useDisconnect, useSwitchChain} from "wagmi";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/share/ModeToggle";
import {shortAddress} from "@/utils/funstions";
import {useCopyToClipboard} from "@/hooks/useCopyToClipboard";
import {CopyIcon, LogOutIcon, RefreshCcw} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const WalletButton = () => {
    const {status, chain, address} = useAccount()
    const {disconnect} = useDisconnect();
    const targetChainId = 1029;
    const {switchChain} = useSwitchChain()
    const {copyToClipboard} = useCopyToClipboard()

    const handleDisconnect = () => {
        disconnect();
    };

    const handleSwitchNetwork = () => {
        if (switchChain) {
            switchChain({chainId: targetChainId});
        }
    };

    return (
        <div className={'flex justify-between items-center w-full gap-3'}>
            <div className={'hidden sm:flex'}>
                <ModeToggle/>
            </div>

            {address &&
                <>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <div className={'flex  ml-auto align-middle justify-center items-center'}>
                                    <Button variant={'outline'} onClick={() => copyToClipboard(address)}>
                                        <div className={'hidden md:flex text-[15px]  font-[600] text-gray-600 dark:text-gray-300'}>
                                            {shortAddress(address, 40)}
                                        </div>
                                        <div className={'flex md:hidden text-[15px]  font-[600] text-gray-600 dark:text-gray-300'}>
                                            {shortAddress(address)}
                                        </div>
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side={'bottom'}>
                                <p>Copy</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </>
            }
            {status === 'connected' && chain?.id !== targetChainId ? (
                    <Button variant={'destructive'} onClick={handleSwitchNetwork}>
                        <div className={'hidden md:flex'}>Switch to BTTC Testnet</div>
                        <div className={'flex md:hidden'}><RefreshCcw/></div>
                    </Button>)
                : <></>
            }

            {/*{status === 'connected' && chain?.id === targetChainId &&*/}
            {/*    <Button className={''} variant={'destructive'} onClick={handleDisconnect}>*/}
            {/*        <LogOutIcon/>*/}
            {/*    </Button>*/}
            {/*}*/}
        </div>
    );
};

export default WalletButton;