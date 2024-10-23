'use client'
import React from 'react';
import {Dialog, DialogContent, DialogHeader,} from "@/components/ui/dialog"
import {useAddressesStore} from "@/stores/useAddressesStore";
import {AddressForm} from "@/app/(privates)/addresses/components/AddressForm";

const EditAddressModal = () => {
    const {updateAddress, isOpenEditModal, setIsOpenEditModal} = useAddressesStore()

    return (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
            <DialogContent>
                <DialogHeader>
                    Update Address
                </DialogHeader>
                <AddressForm isEdit={true} submitForm={updateAddress}/>
            </DialogContent>
        </Dialog>
    );
};

export default EditAddressModal;