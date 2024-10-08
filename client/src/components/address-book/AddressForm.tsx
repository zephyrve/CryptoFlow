import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useCallback, useEffect} from "react";
import {AiOutlineMail} from "react-icons/ai";
import {BiGroup} from "react-icons/bi";
import {BsPerson, BsPersonPlus} from "react-icons/bs";
import {RiWallet2Line} from "react-icons/ri";
import {setAddressAttribute} from "@/stores/address-book/addressBookSlice";
import {getGroupsThunk} from "@/stores/address-book/getGroupsThunk";
import {saveAddressThunk} from "@/stores/address-book/saveAddressThunk";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import {newErrorToastContent} from "@/config/toastContent";
import {ethers} from "ethers";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const AddressForm = () => {
    const dispatch = useAppDispatch();
    const {groupList, address} = useAppSelector((state) => state.addressBook);
    const process = useAppSelector((state) => state.process);
    const {account} = useMetaMask()

    useEffect(() => {
        dispatch(getGroupsThunk(account));
    }, [process.saveAddressGroup.processing]);

    const handleChange = useCallback((att: string, value: string | number) => {
        dispatch(
            setAddressAttribute({
                att: att,
                value: value,
            }),
        );
    }, []);

    const handleSave = useCallback(() => {
        dispatch(
            updateProcessStatus({
                actionName: actionNames.saveAddress,
                att: processKeys.processing,
                value: true,
            }),
        );

        dispatch(saveAddressThunk(account));
    }, [account]);

    return (
        <Card>
            <CardHeader fontWeight={700}>New Address</CardHeader>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Wallet Address</FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <RiWallet2Line color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Input
                                autoComplete={'false'}
                                onChange={(e) =>
                                    handleChange("walletAddress", e.target.value?.toLowerCase())
                                }
                                type="text"
                                placeholder="Wallet address"
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <BsPerson color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Input
                                onChange={(e) => handleChange("name", e.target.value)}
                                type="text"
                                autoComplete={'false'}
                                placeholder="Name"
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <AiOutlineMail color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Input
                                onChange={(e) => handleChange("email", e.target.value)}
                                type="email"
                                placeholder="Email"
                                autoComplete={'false'}
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Group</FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <BiGroup color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Select
                                onChange={(e) => handleChange("groupId", e.target.value)}
                                placeholder="Select a group"
                            >
                                {groupList?.map((group, index) => {
                                    return (
                                        <option key={`group-${index}`} value={group._id}>
                                            {group.name}
                                        </option>
                                    );
                                })}
                            </Select>
                        </InputGroup>
                    </FormControl>
                </VStack>
            </CardBody>
            <CardFooter>
                <Button
                    onClick={() => {
                        if (!ethers.utils.isAddress(address.walletAddress)) {
                            newErrorToastContent('Invalid wallet address!')
                            return
                        }
                        handleSave()
                    }}
                    isLoading={process.saveAddress.processing}
                    leftIcon={<BsPersonPlus/>}
                    variant={"outline"}
                    colorScheme={"blue"}
                >
                    Save
                </Button>
            </CardFooter>
        </Card>
    );
}

export default AddressForm