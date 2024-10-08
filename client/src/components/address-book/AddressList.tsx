import {DeleteIcon} from "@chakra-ui/icons";
import {
    Card,
    CardBody,
    CardHeader,
    Flex,
    IconButton,
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
import React, {useEffect} from "react";
import {chains} from "@/config/chainSettings";
import {getAddressThunk} from "@/stores/address-book/getAddressesThunk";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {useAddress} from "@/hooks/useAddress";
import {deleteAddressThunk} from "@/stores/address-book/deleteAddressThunk";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const AddressList = () => {
    const {getShortAddress} = useAddress();
    const dispatch = useAppDispatch();
    const {addressList, groupMap, isLoadingSetAddresses} = useAppSelector((state) => state.addressBook,);
    const process = useAppSelector((state) => state.process);
    const {account, chainId} = useMetaMask()

    useEffect(() => {
        dispatch(getAddressThunk(account));
    }, [process.saveAddress.processing, account]);

    return (
        <Card>
            <CardHeader fontWeight={700}>Addresses</CardHeader>
            <CardBody px={0}>
                {isLoadingSetAddresses
                    ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                        <Spinner/>
                    </Flex>
                    : !isLoadingSetAddresses && addressList.length === 0
                        ? <Flex w={'100%'} justifyContent={'center'} alignItems={'center'}>
                            <Text textAlign={'center'}>
                                No addresses saved
                            </Text>
                        </Flex>
                        : <TableContainer>
                            <Table variant="striped" colorScheme={"blackAlpha"}>
                                <Thead>
                                    <Tr>
                                        <Th>Full Name</Th>
                                        <Th>Address</Th>
                                        <Th>Email</Th>
                                        <Th>Group</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {chainId && addressList.map((address, index) => {
                                        const shortAddress = (
                                            <a
                                                href={chains[chainId].explorer
                                                    .concat("address/")
                                                    .concat(address.walletAddress)}
                                                target="_blank"
                                            >
                                                {getShortAddress(address.walletAddress)}
                                            </a>
                                        );
                                        return (
                                            <Tr key={index}>
                                                <Td>{address.name}</Td>
                                                <Td>
                                                    <Tag colorScheme={"purple"}>{shortAddress}</Tag>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={"blue"}>{address.email}</Tag>
                                                </Td>
                                                <Td>{(groupMap && address.groupId) ? groupMap[address.groupId] : ""}</Td>
                                                <Td>
                                                    <IconButton
                                                        onClick={() => dispatch(deleteAddressThunk(address._id!))}
                                                        aria-label="delete" colorScheme={'red'} icon={<DeleteIcon/>}/>
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

export default AddressList