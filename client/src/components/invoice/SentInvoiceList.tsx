import {SettingsIcon} from "@chakra-ui/icons";
import {
    Avatar,
    Badge,
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
import {getSentInvoicesThunk} from "@/stores/invoice/getSentInvoicesThunk";
import {
    Invoice,
    InvoiceItem,
    setCurrentItems,
    setIsShowItems,
    setSelectedInvoice,
    setShowStatusModal,
    setStatusTo,
} from "@/stores/invoice/invoiceSlice";
import {useAddress} from "@/hooks/useAddress";
import {useInvoice} from "@/hooks/useInvoice";
import {useStatus} from "@/hooks/useStatus";
import {truncateNumberByLength} from "@/utils/functions";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const SentInvoiceList = () => {
    const dispatch = useAppDispatch();
    const {getShortAddress} = useAddress();
    const {getInvoiceAmount, checkInvoiceActionable} = useInvoice();
    const {getInvoiceStatus} = useStatus();
    const {sentInvoices, isLoadingSentInvoices} = useAppSelector((state) => state.invoice);
    const {account, chainId} = useMetaMask()

    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, []);

    useEffect(() => {
        if (account)
            dispatch(getSentInvoicesThunk(account));
    }, [account]);

    const handleUpdateInvoiceStatus = useCallback(
        (selectedInvoice: Invoice, status: number) => {
            dispatch(setShowStatusModal(true));
            dispatch(setSelectedInvoice(selectedInvoice));
            dispatch(setStatusTo(status));
        },
        [],
    );

    return (
        <Card boxShadow='md'>
            <CardHeader fontWeight={700}>Sent Invoices</CardHeader>
            <CardBody px={0}>
                {isLoadingSentInvoices
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Spinner/>
                    </Flex>
                    : !isLoadingSentInvoices && sentInvoices.length === 0
                        ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Text textAlign={'center'}>
                                No sent invoices available!
                            </Text>
                        </Flex>
                        : <TableContainer>
                            <Table variant="striped">
                                <Thead>
                                    <Tr>
                                        <Th>Token</Th>
                                        <Th>Client</Th>
                                        <Th>Items</Th>
                                        <Th>Tax</Th>
                                        <Th>Due</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {chainId && sentInvoices.map((invoice, index) => {
                                        const shortAddress = (
                                            <a
                                                href={chains[chainId].explorer
                                                    .concat("address/")
                                                    .concat(invoice.recipient)}
                                                target="_blank"
                                            >
                                                {getShortAddress(invoice.recipient)}
                                            </a>
                                        );
                                        const {due, totalTaxAmount} = getInvoiceAmount(invoice.items);

                                        const token = tokenAddressInfo[chainId][invoice.tokenAddress];
                                        const tokenSymbol = token.symbol;
                                        const status = getInvoiceStatus(invoice.status);
                                        const {allowPause, allowCancel, allowActive} =
                                            checkInvoiceActionable(invoice, true);
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
                                                <Td>
                                                    {truncateNumberByLength(totalTaxAmount, 8)} {tokenSymbol}{" "}
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={"blue"}>
                                                        {due} {tokenSymbol}
                                                    </Tag>
                                                </Td>
                                                <Td>
                                                    <Badge variant={'outline'}>
                                                        {status}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton icon={<SettingsIcon/>} as={IconButton}/>
                                                        <MenuList>
                                                            <MenuItem
                                                                isDisabled={!allowCancel}
                                                                onClick={() =>
                                                                    handleUpdateInvoiceStatus(invoice, 2)
                                                                }
                                                            >
                                                                Cancel
                                                            </MenuItem>
                                                            <MenuItem
                                                                isDisabled={!allowPause}
                                                                onClick={() =>
                                                                    handleUpdateInvoiceStatus(invoice, 3)
                                                                }
                                                            >
                                                                Pause
                                                            </MenuItem>
                                                            <MenuItem
                                                                isDisabled={!allowActive}
                                                                onClick={() =>
                                                                    handleUpdateInvoiceStatus(invoice, 1)
                                                                }
                                                            >
                                                                Active
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

export default SentInvoiceList