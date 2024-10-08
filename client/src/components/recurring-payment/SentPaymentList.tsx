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
} from "@/stores/payment-list/paymentListSlice";
import {useAddress} from "@/hooks/useAddress";
import {usePaymentRequest} from "@/hooks/usePaymentRequest";
import {useStatus} from "@/hooks/useStatus";
import PaymentProcess from "./PaymentProcess";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const SentPaymentList = () => {
    const dispatch = useAppDispatch();
    const {getShortAddress} = useAddress();
    const {getUnlockSetting} = usePaymentRequest();
    const {getStatus, checkPaymentDisabledActions} = useStatus();
    const {paymentRequests, isLoadingPaymentRequests} = useAppSelector((state) => state.paymentList);
    const {chainId} = useMetaMask()

    const handleCancel = useCallback((item: PaymentRequest) => {
        dispatch(setShowCancelModal(true));
        dispatch(setSelectedPaymentRequest(item));
    }, []);

    const handleTransfer = useCallback((item: PaymentRequest) => {
        dispatch(setShowTransferModal(true));
        dispatch(setSelectedPaymentRequest(item));
    }, []);

    return (
        <Card>
            <CardHeader fontWeight={700}>Sent Payments</CardHeader>
            <CardBody px={0}>
                {isLoadingPaymentRequests
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Spinner/>
                    </Flex>
                    : !isLoadingPaymentRequests && paymentRequests.length === 0
                        ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Text textAlign={'center'}>
                                No sent payments available!
                            </Text>
                        </Flex>
                        : <TableContainer>
                            <Table variant="striped" colorScheme={"blackAlpha"}>
                                <Thead>
                                    <Tr>
                                        <Th>Token</Th>
                                        <Th>Recipient</Th>
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
                                    {chainId && paymentRequests.map((p: PaymentRequest, index) => {
                                        const startDate = new Date(p.startDate).toLocaleString();
                                        const token = tokenAddressInfo[chainId][p.tokenAddress];
                                        const {unlockSettings} = getUnlockSetting(p);
                                        const status = getStatus(p.status);
                                        const shortAddress = (
                                            <a
                                                href={chains[chainId].explorer
                                                    .concat("address/")
                                                    .concat(p.recipient)}
                                                target="_blank"
                                            >
                                                {getShortAddress(p.recipient)}
                                            </a>
                                        );
                                        const {isAllowCancel, isAllowTransfer} =
                                            checkPaymentDisabledActions(p, true);
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
                                                                key={`sent-payment-${index}`}
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
                                                <Td textAlign={'end'}>
                                                    <Menu>
                                                        <MenuButton icon={<SettingsIcon/>} as={IconButton}/>
                                                        <MenuList>
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
export default SentPaymentList
