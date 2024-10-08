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
    Textarea,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import {BiGroup} from "react-icons/bi";
import {setGroupAttribute} from "@/stores/address-book/addressBookSlice";
import {saveGroupThunk} from "@/stores/address-book/saveGroupThunk";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {actionNames, updateProcessStatus,} from "@/stores/process/processSlice";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const GroupForm = () => {
    const dispatch = useAppDispatch();
    const process = useAppSelector((state) => state.process);
    const {group} = useAppSelector((state) => state.addressBook);
    const {account} = useMetaMask()

    const handleSave = useCallback(() => {
        dispatch(
            updateProcessStatus({
                actionName: actionNames.saveAddressGroup,
                att: "processing",
                value: true,
            }),
        );
        dispatch(saveGroupThunk(account));
    }, [account]);

    const handleChange = useCallback((att: string, value: string | number) => {
        dispatch(setGroupAttribute({att, value}));
    }, []);

    return (
        <Card>
            <CardHeader fontWeight={700}>New Group</CardHeader>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Group Name</FormLabel>
                        <InputGroup size={'md'}>
                            <InputLeftAddon pointerEvents="none">
                                <BiGroup color={useColorModeValue('gray', 'gray')}/>
                            </InputLeftAddon>
                            <Input
                                autoComplete={'false'}
                                type="text"
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Group name"
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl height={'full'}>
                        <FormLabel>Description</FormLabel>
                        <InputGroup height={'full'} size={'md'}>
                            <Textarea
                                rows={7}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </InputGroup>
                    </FormControl>
                </VStack>
            </CardBody>
            <CardFooter>
                <Button
                    isLoading={process.saveAddressGroup.processing}
                    onClick={() => {
                        if (group.name.length <= 0) {
                            newErrorToastContent('Group name cannot be empty!')
                            return
                        } else if (group.description && (group.description.length <= 3)) {
                            newErrorToastContent('Group description must be longer than 3 characters!')
                            return
                        }
                        handleSave()
                    }}
                    leftIcon={<AiOutlineUsergroupAdd/>}
                    variant={"outline"}
                    colorScheme={"blue"}
                >
                    Save
                </Button>
            </CardFooter>
        </Card>
    );
}

export default GroupForm