'use client'

import {Flex, Spinner, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr,} from "@chakra-ui/react";
import {useAppSelector} from "@/stores/hooks";
import {truncateNumberByLength} from "@/utils/functions";
import React from "react";

const BalanceTable = () => {
    const {tokenBalances, isLoadingFetchBalance} = useAppSelector((state) => state.balance);

    return (
        <>
            {isLoadingFetchBalance
                ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Spinner/>
                </Flex>
                : !isLoadingFetchBalance && tokenBalances.length === 0
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Text textAlign={'center'}>
                            No token balances available.
                        </Text>
                    </Flex>
                    : <TableContainer w={"full"}>
                        <Table variant={"striped"}>
                            <Thead>
                                <Tr>
                                    <Th>Token</Th>
                                    <Th isNumeric>Balance</Th>
                                    <Th isNumeric>Locked Amount</Th>
                                    <Th isNumeric>Available Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tokenBalances.map((token, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>
                                                <Tag colorScheme={"purple"}>{token.name}</Tag>
                                            </Td>
                                            <Td isNumeric>{token.balance}</Td>
                                            <Td isNumeric>{token.lockedAmount}</Td>
                                            <Td isNumeric>
                                                <Tag colorScheme={"blue"}>
                                                    {truncateNumberByLength(token.balance - token.lockedAmount, 10)}
                                                </Tag>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
            }
        </>
    );
}

export default BalanceTable