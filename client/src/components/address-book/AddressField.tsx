import {FormControl, FormLabel, HStack, InputGroup, InputLeftAddon, Tag, useColorModeValue,} from "@chakra-ui/react";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList,} from "@choc-ui/chakra-autocomplete";
import {RiWallet2Line} from "react-icons/ri";
import {useAppSelector} from "@/stores/hooks";
import {useAddress} from "@/hooks/useAddress";

interface AddressFieldProps {
    label: string;
    att: string;
    placeHolder?: string;
    handleChange: (att: string, value: string) => void;
}

const AddressField = ({
                          label,
                          att,
                          placeHolder,
                          handleChange,
                      }: AddressFieldProps) => {
    const {addressList} = useAppSelector((state) => state.addressBook);
    const {getShortAddress} = useAddress();

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <AutoComplete openOnFocus onChange={(val) => handleChange(att, val)}>
                <InputGroup size={'md'}>
                    <InputLeftAddon pointerEvents="none">
                        <RiWallet2Line color={useColorModeValue('gray', 'gray')}/>
                    </InputLeftAddon>
                    <AutoCompleteInput
                        placeholder={placeHolder ?? ''}
                        autoComplete={'off'}
                        type="text"
                        onChange={(e) => handleChange(att, e.target.value)}
                    />
                </InputGroup>
                <AutoCompleteList ml={0} mt={1}>
                    {addressList.map((address) => (
                        <AutoCompleteItem
                            key={`option-${address._id}`}
                            value={address.walletAddress}
                            textTransform="capitalize"
                        >
                            <HStack gap={2}>
                                {address.name ? <Tag>{address.name}</Tag> : <span></span>}
                                <Tag colorScheme={"purple"}>
                                    {getShortAddress(address.walletAddress)}
                                </Tag>
                                {address.email ? (
                                    <Tag colorScheme={"blue"}>{address.email}</Tag>
                                ) : (
                                    <span></span>
                                )}
                            </HStack>
                        </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
            </AutoComplete>
        </FormControl>
    );
}

export default AddressField