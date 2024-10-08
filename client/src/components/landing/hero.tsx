'use client'

import {Button, Card, Container, Flex, Heading, Icon, Image, Stack, Text, useColorModeValue,} from '@chakra-ui/react'
import {MdAccountBalanceWallet} from "react-icons/md";
import {useRouter} from "next/navigation";
import React from "react";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";
import Link from "next/link";
import {DEFAULT_CHAIN, VIDEO_DEMO_URL} from "@/config/constants";

const Hero = () => {
    const router = useRouter();
    const {status, connect, switchChain} = useMetaMask()

    const connectWallet = async () => {
        await connect()
        await switchChain(DEFAULT_CHAIN)
    };

    return (
        <Container maxW={'6xl'} mt={10}>
            <Stack
                align={'center'}
                spacing={{base: 8, md: 10}}
                py={{base: 20, md: 20}}
                direction={{base: 'column', md: 'row'}}>
                <Stack flex={1} spacing={{base: 5, md: 5}}>
                    <Heading
                        lineHeight={1}
                        fontWeight={600}
                    >
                        <Flex gap={3} direction={'column'}>
                            <div>
                                <Text
                                    fontSize={{base: '5xl', sm: '6xl', lg: '7xl'}}
                                    as={'span'}
                                    position={'relative'}
                                    _after={{
                                        content: "''",
                                        width: 'full',
                                        height: '20%',
                                        position: 'absolute',
                                        bottom: 1,
                                        left: 0,
                                        bg: 'purple.400',
                                        zIndex: -1,
                                    }}>
                                    CryptoFlow
                                </Text>
                            </div>
                            <div>
                                <Text fontSize={{base: 'xl', sm: '1xl', lg: '2xl'}} style={{lineHeight: 0}} as={'span'}
                                      color={'purple.400'}>
                                    Simplifying Crypto Payments for Everyone
                                </Text>
                            </div>
                        </Flex>
                    </Heading>
                    <Card
                        boxShadow={'none'}
                        py={5}
                        align={'center'}
                    >
                        <Text color={'gray.700'}>
                            CryptoFlow revolutionizes your payment management in the digital world. Our platform
                            simplifies cryptocurrency transactions, allowing you to effortlessly send, receive, and
                            automate payments. With features for both recurring and one-time payments, you maintain full
                            control of your finances. Experience a user-friendly interface designed for easy navigation,
                            ensuring secure and transparent transactions. Join us in transforming the future of
                            financial interactions!
                        </Text>
                    </Card>
                    <Stack spacing={{base: 4, sm: 6}} direction={{base: 'column', sm: 'row'}}>
                        {status === 'unavailable' &&
                            <Button
                                as={Link}
                                href={'https://metamask.io/download/'}
                                target={'_blank'}
                                display={{base: "inline-flex", md: "inline-flex"}}
                                colorScheme="red"
                                size={'lg'}
                                px={6}
                                rounded={'full'}
                                gap={2}
                            >
                                Install wallet
                            </Button>
                        }

                        {(status === 'connected' || status === 'initializing' || status === 'connecting')
                            ? <Button
                                isLoading={status === 'initializing' || status === 'connecting'}
                                onClick={() => router.push("/account/balance")}
                                rounded={'full'}
                                size={'lg'}
                                fontWeight={'normal'}
                                px={6}
                                colorScheme={'purple'}
                            >
                                Launch app
                            </Button>
                            : status === 'notConnected' ? <Button
                                    colorScheme={'red'}
                                    onClick={connectWallet}
                                    rounded={'full'}
                                    size={'lg'}
                                    fontWeight={'normal'}
                                    px={6}
                                    leftIcon={<MdAccountBalanceWallet fontSize={"sm"}/>}>
                                    Connect Wallet
                                </Button>
                                : <></>
                        }

                        <Button
                            as={Link}
                            href={VIDEO_DEMO_URL}
                            target={'_blank'}
                            rounded={'full'}
                            size={'lg'}
                            fontWeight={'normal'}
                            px={6}
                        >
                            Video Demonstration
                        </Button>
                    </Stack>
                </Stack>
                <Flex
                    flex={1}
                    justify={'center'}
                    align={'center'}
                    position={'relative'}
                    w={'full'}>
                    <Icon
                        width={'100%'}
                        viewBox="0 0 578 440"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        w={'100%'}
                        h={'100%'}
                        position={'absolute'}
                        top={'0%'}
                        left={0}
                        zIndex={-1}
                        color={useColorModeValue('purple.50', 'purple.400')}
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
                            fill="currentColor"
                        />
                    </Icon>

                    <Image
                        alt={"image"}
                        h={{sm: 400, md: 350, lg: 430}}
                        objectFit={'cover'}
                        objectPosition={'left'}
                        src="/image1.webp"
                    />
                </Flex>
            </Stack>
        </Container>
    )
};
export default Hero
