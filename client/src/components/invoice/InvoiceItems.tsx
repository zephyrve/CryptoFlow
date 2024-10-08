import {DeleteIcon, MinusIcon, SmallAddIcon} from "@chakra-ui/icons";
import {
    Button,
    ButtonGroup,
    FormControl,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {addNewItem, changeItem, removeItem,} from "@/stores/invoice/invoiceSlice";
import {useInvoice} from "@/hooks/useInvoice";

const InvoiceItems = () => {
    const {getLineItemAmount, getInvoiceAmount} = useInvoice();
    const dispatch = useAppDispatch();
    const {items} = useAppSelector((state) => state.invoice);

    const handleChangeItem = useCallback(
        (index: number, att: any, value: any) => {
            dispatch(changeItem({index, att, value}));
        },
        [],
    );

    const handleAddItem = useCallback(() => {
        dispatch(addNewItem());
    }, []);

    const handleRemoveItem = useCallback((index: number) => {
        dispatch(removeItem({index}));
    }, []);

    return (
        <TableContainer w={"full"}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Description</Th>
                        <Th>Qty</Th>
                        <Th>Unit Price</Th>
                        <Th>Discount</Th>
                        <Th>Tax</Th>
                        <Th isNumeric>Amount</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item: any, index: any) => {
                        const lineItemAmount = getLineItemAmount(item);
                        return (
                            <Tr key={index}>
                                <Td>
                                    <FormControl>
                                        <InputGroup size={'md'}>
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                placeholder={'Description'}
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleChangeItem(index, "description", e.target.value)
                                                }
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </Td>
                                <Td>
                                    <FormControl>
                                        <InputGroup size={'md'}>
                                            <NumberInput size={'md'} value={item.qty} min={0}>
                                                <NumberInputField
                                                    onChange={(e) =>
                                                        handleChangeItem(index, "qty", e.target.value)
                                                    }
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper/>
                                                    <NumberDecrementStepper/>
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </InputGroup>
                                    </FormControl>
                                </Td>
                                <Td>
                                    <FormControl>
                                        <InputGroup size={'md'}>
                                            <NumberInput size={'md'} value={item.unitPrice} min={0}>
                                                <NumberInputField
                                                    onChange={(e) =>
                                                        handleChangeItem(index, "unitPrice", e.target.value)
                                                    }
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper/>
                                                    <NumberDecrementStepper/>
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </InputGroup>
                                    </FormControl>
                                </Td>
                                <Td>
                                    <FormControl>
                                        <InputGroup size={'md'}>
                                            <InputLeftElement pointerEvents={"none"}>
                                                <MinusIcon fontSize={"xs"}/>
                                            </InputLeftElement>
                                            <Input
                                                type={"number"}
                                                value={item.discount}
                                                onChange={(e) =>
                                                    handleChangeItem(index, "discount", e.target.value)
                                                }
                                            />

                                            <InputRightAddon
                                                color={useColorModeValue('gray', 'gray')}
                                                pointerEvents={"none"}>
                                                <>%</>
                                            </InputRightAddon>
                                        </InputGroup>
                                    </FormControl>
                                </Td>
                                <Td>
                                    <FormControl>
                                        <InputGroup size={'md'}>
                                            <InputLeftElement pointerEvents={"none"}>
                                                <SmallAddIcon/>
                                            </InputLeftElement>
                                            <Input
                                                type="number"
                                                value={item.tax}
                                                onChange={(e) =>
                                                    handleChangeItem(index, "tax", e.target.value)
                                                }
                                            />
                                            <InputRightAddon pointerEvents={"none"}>
                                                <>%</>
                                            </InputRightAddon>
                                        </InputGroup>
                                    </FormControl>
                                </Td>
                                <Td isNumeric>{lineItemAmount.toFixed(7)}</Td>
                                <Td>
                                    <ButtonGroup>
                                        <IconButton
                                            colorScheme={'red'}
                                            onClick={() => handleRemoveItem(index)}
                                            aria-label="Remove Recipient"
                                            icon={<DeleteIcon/>}
                                        />
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
                {[1].map((_, index) => {
                    const {amountWithoutTax, totalTaxAmount, totalAmount, due} =
                        getInvoiceAmount(items);
                    return (
                        <Tfoot key={index}>
                            <Tr>
                                <Td>
                                    <Button
                                        onClick={handleAddItem}
                                        leftIcon={<SmallAddIcon/>}
                                        colorScheme="purple"
                                        variant={"ghost"}
                                    >
                                        New Item
                                    </Button>
                                </Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td>
                                    <Text fontWeight={600}>
                                        Amount Without Tax:
                                    </Text>
                                </Td>
                                <Td isNumeric>{amountWithoutTax.toFixed(3)}</Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td>
                                    <Text fontWeight={600}>
                                        Total Tax Amount:
                                    </Text>
                                </Td>
                                <Td isNumeric>{totalTaxAmount.toFixed(3)}</Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td>
                                    <Text fontWeight={600}>
                                        Total Amount:
                                    </Text>
                                </Td>
                                <Td isNumeric>{totalAmount.toFixed(3)}</Td>
                            </Tr>
                            <Tr>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td>
                                    <Text fontWeight={600}>
                                        Due:
                                    </Text>
                                </Td>
                                <Td isNumeric>{due.toFixed(3)}</Td>
                            </Tr>
                        </Tfoot>
                    );
                })}
            </Table>
        </TableContainer>
    );
}

export default InvoiceItems