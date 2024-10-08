import {DeleteIcon, SettingsIcon} from "@chakra-ui/icons";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {BsPersonPlus} from "react-icons/bs";
import {addNewRecipient, changeRecipient, removeRecipient,} from "@/stores/batch-payment/batchPaymentSlice";
import {createBatchPaymentThunk} from "@/stores/batch-payment/createBatchPaymentThunk";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";

import AddressFieldForMultiRecipient from "../address-book/AddressFieldMultiRecipient";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const Recipients = () => {
    const dispatch = useAppDispatch();
    const {recipients} = useAppSelector((state) => state.batchPayment);
    const {createOneTimePayments: createOneTimePaymentsProcess} = useAppSelector((state) => state.process);
    const {account, chainId} = useMetaMask()

    const handleChangeRecipient = useCallback(
        (index: number, att: string, value: any) => {
            dispatch(changeRecipient({index, att, value}));
        },
        [],
    );

    const handleAddRecipient = useCallback(() => {
        dispatch(addNewRecipient());
    }, []);

    const handleRemoveRecipient = useCallback((index: number) => {
        dispatch(removeRecipient({index}));
    }, []);

    const handleSave = useCallback(() => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }
        dispatch(
            updateProcessStatus({
                actionName: actionNames.createOneTimePayments,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(createBatchPaymentThunk(account));
    }, [account]);

    return (
        <Card>
            <CardBody p={0} h={'max-content'}>
                <TableContainer h={'min-content'} overflowY={'unset'} overflowX={'unset'}>
                    <Table variant="simple">
                        <TableCaption>
                            <ButtonGroup>
                                <Button
                                    variant={"outline"}
                                    leftIcon={<BsPersonPlus/>}
                                    colorScheme={"purple"}
                                    onClick={handleAddRecipient}
                                >
                                    New recipient
                                </Button>
                                <Button
                                    isLoading={createOneTimePaymentsProcess.processing}
                                    variant={"outline"}
                                    leftIcon={<SettingsIcon/>}
                                    colorScheme="blue"
                                    onClick={handleSave}
                                >
                                    Submit
                                </Button>
                            </ButtonGroup>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Recipient</Th>
                                <Th isNumeric>Amount</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {recipients.map((recipient, index) => {
                                return (
                                    <Tr key={`recipient-${index}`}>
                                        <Td>
                                            <AddressFieldForMultiRecipient
                                                att="recipient"
                                                index={index}
                                                value={recipient.recipient}
                                                handleChange={handleChangeRecipient}
                                            />
                                        </Td>
                                        <Td>
                                            <NumberInput size={'md'} min={0}>
                                                <NumberInputField
                                                    placeholder={'Amount'}
                                                    value={recipient.amount}
                                                    onChange={(e) =>
                                                        handleChangeRecipient(
                                                            index,
                                                            "amount",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper/>
                                                    <NumberDecrementStepper/>
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>

                                        <Td>
                                            <ButtonGroup>
                                                <IconButton
                                                    colorScheme={'red'}
                                                    onClick={() => handleRemoveRecipient(index)}
                                                    aria-label="Remove Recipient"
                                                    icon={<DeleteIcon/>}
                                                />
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                        <Tfoot></Tfoot>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
}

export default Recipients