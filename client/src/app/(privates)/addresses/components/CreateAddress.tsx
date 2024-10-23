import React from 'react';
import {AddressForm} from "@/app/(privates)/addresses/components/AddressForm";
import {useAddressesStore} from "@/stores/useAddressesStore";

const CreateAddress = () => {
    const {addAddress} = useAddressesStore()
    return (
        <AddressForm submitForm={addAddress}/>
    );
};

export default CreateAddress;