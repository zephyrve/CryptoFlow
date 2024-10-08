'use client'
import {SettingsIcon} from "@chakra-ui/icons";
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
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React, {useCallback, useEffect} from "react";
import {chains} from "@/config/chainSettings";
import {tokenAddressInfo} from "@/config/whitelistTokens";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {getReceivedInvoicesThunk} from "@/stores/invoice/getReceivedInvoicesThunk";
import {
    Invoice,
    InvoiceItem,
    setCurrentItems,
    setIsShowItems,
    setSelectedInvoice,
    setShowPayModal,
    setStatusTo,
} from "@/stores/invoice/invoiceSlice";
import {useAddress} from "@/hooks/useAddress";
import {useInvoice} from "@/hooks/useInvoice";
import {useStatus} from "@/hooks/useStatus";
import {truncateNumberByLength} from "@/utils/functions";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const ReceivedInvoiceList = () => {
    const dispatch = useAppDispatch();
    const {getShortAddress} = useAddress();
    const {getInvoiceAmount, checkInvoiceActionable} = useInvoice();
    const {getInvoiceStatus} = useStatus();
    const {receivedInvoices, isLoadingReceivedInvoices} = useAppSelector((state) => state.invoice);
    const { account, chainId} = useMetaMask()

    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, []);

    useEffect(() => {
        if (account)
            dispatch(getReceivedInvoicesThunk(account));
    }, [account]);

    const handleUpdateInvoiceStatus = useCallback(
        (selectedInvoice: Invoice, status: number) => {
            dispatch(setShowPayModal(true));
            dispatch(setSelectedInvoice(selectedInvoice));
            dispatch(setStatusTo(status));
        },
        [],
    );

    return (
        <Card>
            <CardHeader fontWeight={700}>Received Invoices</CardHeader>
            <CardBody px={0}>
                {isLoadingReceivedInvoices
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Spinner/>
                    </Flex>
                    : !isLoadingReceivedInvoices && receivedInvoices.length === 0
                        ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Text textAlign={'center'}>
                                No received invoices available!
                            </Text>
                        </Flex>
                        : <TableContainer>
                            <Table variant="striped">
                                <Thead>
                                    <Tr>
                                        <Th>Token</Th>
                                        <Th>Sender</Th>
                                        <Th>Items</Th>
                                        <Th isNumeric>Tax</Th>
                                        <Th isNumeric>Due</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {chainId && receivedInvoices.map((invoice, index) => {
                                        const shortAddress = (
                                            <a
                                                href={chains[chainId].explorer
                                                    .concat("address/")
                                                    .concat(invoice.recipient)}
                                                target="_blank"
                                            >
                                                {getShortAddress(invoice.owner)}
                                            </a>
                                        );
                                        const {due, totalTaxAmount} = getInvoiceAmount(invoice.items);
                                        const token = tokenAddressInfo[chainId][invoice.tokenAddress];
                                        const tokenSymbol = token.symbol;
                                        const status = getInvoiceStatus(invoice.status);
                                        const {allowPay, allowReject} = checkInvoiceActionable(
                                            invoice,
                                            false,
                                        );
                                        return (
                                            <Tr key={index}>
                                                <Td>
                                                    <Avatar bg={'white'} src={token.logo} size={'sm'}/>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={"purple"}>{shortAddress}</Tag>
                                                </Td>
                                                <Td>
                                                    <Tag
                                                        onClick={() => handleShowCurrentItems(invoice.items)}
                                                        cursor={"pointer"}
                                                        colorScheme={"purple"}
                                                    >
                                                        {invoice.items.length} item(s)
                                                    </Tag>
                                                </Td>
                                                <Td isNumeric>
                                                    {truncateNumberByLength(totalTaxAmount, 8)} {tokenSymbol}{" "}
                                                </Td>
                                                <Td isNumeric>
                                                    <Tag colorScheme={"blue"}>
                                                        {due} {tokenSymbol}
                                                    </Tag>
                                                </Td>
                                                <Td>{status}</Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton icon={<SettingsIcon/>} as={IconButton}/>
                                                        <MenuList>
                                                            <MenuItem
                                                                isDisabled={!allowPay}
                                                                onClick={() =>
                                                                    handleUpdateInvoiceStatus(invoice, 5)
                                                                }
                                                            >
                                                                Pay
                                                            </MenuItem>
                                                            <MenuItem
                                                                isDisabled={!allowReject}
                                                                onClick={() =>
                                                                    handleUpdateInvoiceStatus(invoice, 4)
                                                                }
                                                            >
                                                                Reject
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
}

export default ReceivedInvoiceList