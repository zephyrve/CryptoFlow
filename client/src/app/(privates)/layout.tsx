'use client'
import {Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Container, Flex, Spinner} from "@chakra-ui/react";
import SidebarWithHeader from "@/components/layout/SideBar";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";
import Link from "next/link";
import React, {useEffect} from "react";
import {getWriteContract} from "@/utils/contract/contractInteractions";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {setContract} from "@/stores/network/networkSlice";
import {DEFAULT_CHAIN} from "@/config/constants";

type RootLayoutProps = { children: React.ReactNode }

const RootLayout = ({children}: Readonly<RootLayoutProps>) => {
    const {account, chainId, status, connect, switchChain} = useMetaMask()
    const dispatch = useAppDispatch();
    const {contract} = useAppSelector((state) => state.network);

    const connectWallet = async () => {
        await connect()
        await switchChain(DEFAULT_CHAIN)
    };

    useEffect(() => {
        if (contract === null)
            dispatch(setContract(getWriteContract()))
    }, [account, contract])

    return (
        <Box>
            <Container maxW={"container.3xl"} p={0}>
                <SidebarWithHeader>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                        {status === 'initializing' &&
                            <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner/>
                            </Flex>
                        }
                        {status === 'connected' && chainId !== DEFAULT_CHAIN &&
                            <Alert mb={5} justifyContent={'space-between'} borderRadius={10} status='error'>
                                <AlertIcon/>
                                <AlertTitle>Switch network to BTT Testnet</AlertTitle>
                                <AlertDescription ml={'auto'}>
                                    <Button
                                        onClick={() => switchChain(DEFAULT_CHAIN)}
                                        display={{base: "inline-flex", md: "inline-flex"}}
                                        colorScheme="red"
                                        gap={2}
                                    >
                                        Switch to BTT Testnet
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        }

                        {(status === 'notConnected' || status === 'connecting') &&
                            <Alert mb={5} justifyContent={'space-between'} borderRadius={10} status='error'>
                                <AlertIcon/>
                                <AlertTitle>Connect Wallet</AlertTitle>
                                <AlertDescription ml={'auto'}>
                                    <Button
                                        isLoading={status === 'connecting'}
                                        onClick={connectWallet}
                                        display={{base: "inline-flex", md: "inline-flex"}}
                                        colorScheme="red"
                                        gap={2}
                                    >
                                        Connect
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        }

                        {status === 'unavailable'
                            && <Alert mb={5} borderRadius={10} status='error'>
                                <AlertIcon/>
                                <AlertTitle>MetaMask not detected</AlertTitle>
                                <AlertDescription ml={'auto'}>
                                    <Button
                                        as={Link}
                                        href={'https://metamask.io/download/'}
                                        target={'_blank'}
                                        display={{base: "inline-flex", md: "inline-flex"}}
                                        colorScheme="red"
                                        gap={2}
                                    >
                                        Install wallet
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        }
                    </Flex>

                    {account && chainId === DEFAULT_CHAIN &&
                        <Box margin="auto">
                            {children}
                        </Box>
                    }
                </SidebarWithHeader>
            </Container>
        </Box>
    );
};

export default RootLayout
