import {RepeatIcon, SettingsIcon} from "@chakra-ui/icons";
import {
    Avatar,
    Card,
    CardBody,
    CardHeader,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Table,
    TableContainer,
    Tag,
    TagLabel,
    TagRightIcon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, {useCallback} from "react";
import {chains} from "@/config/chainSettings";
import {tokenAddressInfo} from "@/config/whitelistTokens";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {
    PaymentRequest,
    setSelectedPaymentRequest,
    setShowCancelModal,
    setShowTransferModal,
    setShowWithdrawModal,
} from "@/stores/payment-list/paymentListSlice";
import {useAddress} from "@/hooks/useAddress";
import {usePaymentRequest} from "@/hooks/usePaymentRequest";
import {useStatus} from "@/hooks/useStatus";

import PaymentProcess from "./PaymentProcess";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const ReceivedPaymentList = () => {
    const dispatch = useAppDispatch();
    const {getShortAddress} = useAddress();
    const {getUnlockSetting} = usePaymentRequest();
    const {getStatus, checkPaymentDisabledActions} = useStatus();
    const {receivedPaymentRequests, isLoadingReceivedPaymentRequests} = useAppSelector((state) => state.paymentList,);
    const {chainId} = useMetaMask()

    const handleCancel = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowCancelModal(true));
    }, []);

    const handleTransfer = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowTransferModal(true));
    }, []);

    const handleWithdraw = useCallback((item: PaymentRequest) => {
        dispatch(setSelectedPaymentRequest(item));
        dispatch(setShowWithdrawModal(true));
    }, []);

    return (
        <Card>
            <CardHeader fontWeight={700}>Received Payments</CardHeader>
            <CardBody px={0}>
                {isLoadingReceivedPaymentRequests
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Spinner/>
                    </Flex>
                    : !isLoadingReceivedPaymentRequests && receivedPaymentRequests.length === 0
                        ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Text textAlign={'center'}>
                                No received payments available!
                            </Text>
                        </Flex>
                        : <TableContainer>
                            <Table variant="striped" colorScheme={"blackAlpha"}>
                                <Thead>
                                    <Tr>
                                        <Th>Token</Th>
                                        <Th>Sender</Th>
                                        <Th>Start At</Th>
                                        <Th isNumeric>Withdrew</Th>
                                        <Th isNumeric>Unlocked</Th>
                                        <Th>Unlock Settings</Th>
                                        <Th isNumeric>Prepaid (%)</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {chainId && receivedPaymentRequests.map((p: PaymentRequest, index) => {
                                        const startDate = new Date(p.startDate).toLocaleString();
                                        const token = tokenAddressInfo[chainId][p.tokenAddress];
                                        const {unlockSettings, unlockedAmount, withdrewAmount} = getUnlockSetting(p);
                                        console.log(unlockedAmount)
                                        const status = getStatus(p.status);
                                        const shortAddress = (
                                            <a
                                                href={chains[chainId].explorer
                                                    .concat("address/")
                                                    .concat(p.sender)}
                                                target="_blank"
                                            >
                                                {getShortAddress(p.sender)}
                                            </a>
                                        );
                                        const {isAllowCancel, isAllowTransfer, isAllowWithdraw} =
                                            checkPaymentDisabledActions(p, false);
                                        return (
                                            <Tr key={`received-payment-${p.requestId}`}>
                                                <Td>
                                                    <Avatar bg={'white'} src={token.logo} size={'sm'}/>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={"purple"}>{shortAddress}</Tag>
                                                </Td>
                                                <Td fontSize={"sm"}>{startDate}</Td>
                                                <Td isNumeric>
                                                    <Tag colorScheme={"pink"}>
                                                        <TagLabel>
                                                            {p.paymentAmount - p.remainingBalance}
                                                        </TagLabel>
                                                    </Tag>
                                                </Td>
                                                <Td isNumeric>
                                                    <Tag colorScheme={"purple"}>
                                                        <TagLabel>
                                                            <PaymentProcess
                                                                key={`received-payment-${index}`}
                                                                payment={p}
                                                            />
                                                        </TagLabel>
                                                    </Tag>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={"blue"}>
                                                        <TagLabel>{unlockSettings}</TagLabel>
                                                        <TagRightIcon as={RepeatIcon}/>
                                                    </Tag>
                                                </Td>
                                                <Td isNumeric>{p.prepaidPercentage}</Td>
                                                <Td fontSize={"sm"}>{status}</Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton icon={<SettingsIcon/>} as={IconButton}/>
                                                        <MenuList>
                                                            <MenuItem
                                                                onClick={() => handleWithdraw(p)}
                                                                isDisabled={!isAllowWithdraw}
                                                            >
                                                                Withdraw
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => handleCancel(p)}
                                                                isDisabled={!isAllowCancel}
                                                            >
                                                                Cancel
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => handleTransfer(p)}
                                                                isDisabled={!isAllowTransfer}
                                                            >
                                                                Transfer
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                }
            </CardBody>
        </Card>
    );
};
export default ReceivedPaymentList
