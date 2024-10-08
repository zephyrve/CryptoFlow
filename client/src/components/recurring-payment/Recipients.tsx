import {DeleteIcon, SettingsIcon} from "@chakra-ui/icons";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {BsPersonPlus} from "react-icons/bs";
import {createRecurringPaymentThunk} from "@/stores/batch-recurring/createRecurringPaymentThunk";
import {
    addNewRecipient,
    changeRecipient,
    Recipient,
    removeRecipient,
} from "@/stores/batch-recurring/multipleRecurringPaymentSlice";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import AddressFieldForMultiRecipient from "../address-book/AddressFieldMultiRecipient";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const Recipients = () => {
    const dispatch = useAppDispatch();
    const {recipients} = useAppSelector((state) => state.batchRecurring);
    const {createBatchPayments} = useAppSelector((state) => state.process);
    const {account, chainId} = useMetaMask()

    const handleChangeRecipient = useCallback(
        (index: number, att: keyof Recipient, value: any) => {
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

    const handleSave = async () => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }
        dispatch(
            updateProcessStatus({
                actionName: actionNames.createBatchPayments,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(createRecurringPaymentThunk(account));
    }

    return (
        <Card>
            <CardBody p={0}>
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
                                    variant={"outline"}
                                    isLoading={createBatchPayments.processing}
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
                                <Th>Number of Unlocks</Th>
                                <Th>Unlock Amount</Th>
                                <Th>Unlock Every</Th>
                                <Th>Prepaid</Th>
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
                                            <NumberInput size={'md'} value={recipient.numberOfUnlocks}>
                                                <NumberInputField
                                                    onChange={(e) =>
                                                        handleChangeRecipient(
                                                            index,
                                                            "numberOfUnlocks",
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
                                            <NumberInput size={'md'} value={recipient.unlockAmountPerTime}>
                                                <NumberInputField
                                                    onChange={(e) =>
                                                        handleChangeRecipient(
                                                            index,
                                                            "unlockAmountPerTime",
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
                                            <InputGroup size={'md'}>
                                                <Input
                                                    type={"number"}
                                                    value={recipient.unlockEvery}
                                                    onChange={(e) =>
                                                        handleChangeRecipient(
                                                            index,
                                                            "unlockEvery",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputRightAddon p={0}>
                                                    <Select
                                                        size={'md'}
                                                        variant={"outline"}
                                                        value={recipient.unlockEveryType}
                                                        onChange={(e) =>
                                                            handleChangeRecipient(
                                                                index,
                                                                "unlockEveryType",
                                                                e.target.value,
                                                            )
                                                        }
                                                        fontSize={"14px"}
                                                    >
                                                        <option value={1}>Second</option>
                                                        <option value={60}>Minute</option>
                                                        <option value={3600}>Hour</option>
                                                        <option value={86400}>Day</option>
                                                        <option value={604800}>Week</option>
                                                        <option value={2592000}>Month</option>
                                                        <option value={31536000}>Year</option>
                                                    </Select>
                                                </InputRightAddon>
                                            </InputGroup>
                                        </Td>
                                        <Td>
                                            <InputGroup size={'md'}>
                                                <Input
                                                    type={"number"}
                                                    value={recipient.prepaidPercentage}
                                                    onChange={(e) =>
                                                        handleChangeRecipient(
                                                            index,
                                                            "prepaidPercentage",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputRightAddon>
                                                    <>%</>
                                                </InputRightAddon>
                                            </InputGroup>
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
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    );
};
export default Recipients
