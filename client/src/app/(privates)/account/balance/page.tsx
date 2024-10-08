'use client'

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
} from "@chakra-ui/react";
import {ethers} from "ethers";
import {useCallback, useEffect, useMemo, useState} from "react";
import BalanceTable from "@/components/balance/BalanceTable";
import {whiteListTokenOfChain} from "@/config/whitelistTokens";
import {BalanceState, updateBalanceAttribute} from "@/stores/balance/balanceSlice";
import {depositThunk} from "@/stores/balance/depositThunk";
import {withdrawBalanceThunk} from "@/stores/balance/withdrawBalanceThunk";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {getBalanceThunk} from "@/stores/balance/getBalanceThunk";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";
import {messages} from "@/config/message";
import {DEFAULT_CHAIN} from "@/config/constants";

const Balance = () => {
    const dispatch = useAppDispatch();
    const {deposit, withdrawBalance} = useAppSelector((state) => state.process);
    const {tokenBalances, depositToken, depositAmount, withdrawAmount} = useAppSelector((state) => state.balance);
    const [walletBalance, setWalletBalance] = useState<number>(0)
    const {account, chainId} = useMetaMask()

    const handleUpdate = useCallback((att: keyof BalanceState, value: any) => {
        dispatch(updateBalanceAttribute({att: att, value: value}));
    }, []);

    const doWithdraw = useCallback(() => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }

        dispatch(
            updateProcessStatus({
                actionName: actionNames.withdrawBalance,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(withdrawBalanceThunk(account));
    }, [chainId, account]);

    const doDeposit = useCallback(async () => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }

        dispatch(
            updateProcessStatus({
                actionName: actionNames.deposit,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(depositThunk(account));
    }, [chainId, account, walletBalance]);


    const fetchData = async () => {
        await dispatch(getBalanceThunk(account));
    };

    useEffect(() => {
        fetchData();
    }, [deposit.processing, withdrawBalance.processing]);

    const maxWithdrawToken = useMemo(() => {
        const x = tokenBalances.find(token => token.address === depositToken)
        return x !== undefined ? x.balance - x.lockedAmount : 1000
    }, [tokenBalances, depositToken])

    const getBalance = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({method: "eth_requestAccounts"});
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);
                const walletBalance = ethers.utils.formatEther(balance);
                console.log(`Address: ${address}`);
                console.log(`Balance: ${walletBalance}`);
                setWalletBalance(parseFloat(walletBalance))
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            console.log("MetaMask not detected");
        }
    };

    useEffect(() => {
        getBalance();
    }, []);

    return (
        <>
            <Card>
                <CardHeader>
                    <Text as={'p'} fontWeight={700}>Account Balance</Text>
                    <Text color={"gray.500"} textTransform="none" fontSize={"14px"}>
                        Available balance in the CryptoFlow smart contract
                    </Text>
                </CardHeader>
                <CardBody marginBottom={5}>
                    <Flex direction={{base: 'column', xl: 'row'}} rowGap={0} columnGap={20}>
                        <FormControl>
                            <FormLabel>Deposit Amount</FormLabel>
                            <InputGroup size={'md'}>
                                <NumberInput w={'100%'} size={'md'} min={0} max={walletBalance}>
                                    <NumberInputField
                                        placeholder={'Amount'}
                                        onChange={(e) =>
                                            handleUpdate("depositAmount", e.target.value)
                                        }
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <InputRightAddon p={"0"}>
                                    {chainId &&
                                        <Select size={'md'}
                                                onChange={(e) => handleUpdate("depositToken", e.target.value)}>
                                            {whiteListTokenOfChain[chainId].map((token, index) => {
                                                return (
                                                    <option
                                                        key={`deposit-token-${token.symbol}`}
                                                        value={token.address}
                                                    >
                                                        {token.name}
                                                    </option>
                                                );
                                            })}
                                        </Select>
                                    }
                                </InputRightAddon>

                                <Button
                                    colorScheme={"purple"}
                                    isLoading={deposit.processing}
                                    size="md"
                                    ml={2}
                                    w={80}
                                    onClick={() => {
                                        if (depositAmount === null || depositAmount === undefined) {
                                            newErrorToastContent('Invalid amount value!')
                                            return
                                        }
                                        if (parseFloat(depositAmount as any) > walletBalance) {
                                            newErrorToastContent(messages.INSUFFICIENT_FUNDS)
                                            return
                                        }
                                        doDeposit()
                                    }}
                                >
                                    Deposit
                                </Button>
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Withdraw Amount</FormLabel>
                            <InputGroup size={'md'}>
                                <NumberInput w={'100%'} size={'md'} min={0} max={maxWithdrawToken}>
                                    <NumberInputField
                                        placeholder={'Amount'}
                                        onChange={(e) =>
                                            handleUpdate("withdrawAmount", e.target.value)
                                        }
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <InputRightAddon p="0">
                                    {chainId &&
                                        <Select
                                            size={'md'}
                                            onChange={(e) =>
                                                handleUpdate("withdrawToken", e.target.value)
                                            }
                                        >
                                            {whiteListTokenOfChain[chainId].map((token, index) => (
                                                <option
                                                    key={`withdraw-token-${token.symbol}`}
                                                    value={token.address}
                                                >
                                                    {token.name}
                                                </option>
                                            ))}
                                        </Select>
                                    }
                                </InputRightAddon>
                                <Button
                                    colorScheme={"blue"}
                                    isLoading={withdrawBalance.processing}
                                    ml={2}
                                    w={80}
                                    size="md"
                                    onClick={() => {
                                        if (withdrawAmount === null || withdrawAmount === undefined) {
                                            newErrorToastContent('Invalid amount value!')
                                            return
                                        }
                                        doWithdraw()
                                    }}
                                >
                                    Withdraw
                                </Button>
                            </InputGroup>
                        </FormControl>
                    </Flex>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <Text as={'p'} fontWeight={700}>Token Balances</Text>
                    <Text color={"gray.500"} textTransform="none" fontSize={"14px"}>
                        Available and locked token balances, including funds for future payments.
                    </Text>
                </CardHeader>
                <CardBody mt={5} marginBottom={5} p={0}>
                    <BalanceTable/>
                </CardBody>
            </Card>
        </>
    );
};
export default Balance
