import {FormControl, HStack, InputGroup, InputLeftAddon, Tag, useColorModeValue,} from "@chakra-ui/react";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList,} from "@choc-ui/chakra-autocomplete";
import {RiWallet2Line} from "react-icons/ri";
import {useAppSelector} from "@/stores/hooks";
import {useAddress} from "@/hooks/useAddress";

interface AddressFieldForMultiRecipient {
    att: any,
    index: any,
    handleChange: any,
    value: any,
}

const AddressFieldForMultiRecipient = ({
                                           att,
                                           index,
                                           handleChange,
                                           value,
                                       }: AddressFieldForMultiRecipient) => {
    const {addressList} = useAppSelector((state) => state.addressBook);
    const {getShortAddress} = useAddress();

    return (
        <FormControl>
            <AutoComplete
                freeSolo={true}
                openOnFocus
                onSelectOption={(val) => handleChange(index, att, val.item.value)}
            >
                <InputGroup size={'md'}>
                    <InputLeftAddon pointerEvents="none">
                        <RiWallet2Line color={useColorModeValue('gray', 'gray')}/>
                    </InputLeftAddon>
                    <AutoCompleteInput
                        placeholder={'Wallet Address'}
                        name="hidden"
                        type="text"
                        value={value}
                        autoComplete="off"
                        onChange={(e) => handleChange(index, att, e.target.value)}
                    />
                </InputGroup>
                <AutoCompleteList zIndex={1000} mt={1} minW={350}>
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

export default AddressFieldForMultiRecipient