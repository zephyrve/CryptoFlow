import {HamburgerIcon, SettingsIcon} from "@chakra-ui/icons";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {AiOutlineTags} from "react-icons/ai";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {createInvoiceThunk} from "@/stores/invoice/createInvoiceThunk";
import {changeGeneralSetting} from "@/stores/invoice/invoiceSlice";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import AddressField from "../address-book/AddressField";
import TokenSelector from "@/components/shared/TokenSelector";
import InvoiceItems from "./InvoiceItems";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const InvoiceForm = () => {
    const dispatch = useAppDispatch();
    const {createInvoice} = useAppSelector((state) => state.process);
    const {account} = useMetaMask()

    const handleUpdate = useCallback((att: any, value: any) => {
        dispatch(changeGeneralSetting({att, value}));
    }, []);

    const handleSave = useCallback(() => {
        dispatch(
            updateProcessStatus({
                actionName: actionNames.createInvoice,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(createInvoiceThunk(account));
    }, [account]);

    return (
        <Card>
            <CardHeader fontWeight={700}>New Invoice</CardHeader>
            <CardBody>
                <VStack>
                    <AddressField
                        label={"Client"}
                        att="recipient"
                        placeHolder="Client"
                        handleChange={handleUpdate}
                    />
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Token</FormLabel>
                            <TokenSelector handleOnChange={handleUpdate}/>
                        </FormControl>
                    </HStack>
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Invoice Category</FormLabel>
                            <InputGroup size={'md'}>
                                <InputLeftAddon pointerEvents="none">
                                    <HamburgerIcon color={useColorModeValue('gray', 'gray')}/>
                                </InputLeftAddon>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => handleUpdate("category", e.target.value)}
                                    placeholder="Category"
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Invoice Tags</FormLabel>
                            <InputGroup size={'md'}>
                                <InputLeftAddon pointerEvents="none">
                                    <AiOutlineTags color={useColorModeValue('gray', 'gray')}/>
                                </InputLeftAddon>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => handleUpdate("tags", e.target.value)}
                                    placeholder="Tags"
                                />
                            </InputGroup>
                        </FormControl>
                    </HStack>
                    <InvoiceItems/>
                </VStack>
            </CardBody>
            <CardFooter justifyContent={"center"}>
                <Button
                    onClick={handleSave}
                    isLoading={createInvoice.processing}
                    leftIcon={<SettingsIcon/>}
                    variant={"outline"}
                    colorScheme={"blue"}
                >
                    Save
                </Button>
            </CardFooter>
        </Card>
    );
}

export default InvoiceForm