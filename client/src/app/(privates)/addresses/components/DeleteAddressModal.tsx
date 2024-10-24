'use client'
import React, {useCallback} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useAddressesStore} from "@/stores/useAddressesStore";

const DeleteAddressModal = () => {
    const {selectedAddress, deleteOne, setIsOpenDeleteModal, isLoadingDeleteAddress, isOpenDeleteModal} = useAddressesStore()
    const onCloseModal = useCallback(() => setIsOpenDeleteModal(false), [])
    const onDeleteAddress = useCallback(() => deleteOne({id: selectedAddress?._id}), [selectedAddress])

    return (
        <Dialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    Are you sure you want to delete this address?
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onCloseModal}>
                        Close
                    </Button>
                    <Button
                        isLoading={isLoadingDeleteAddress}
                        disabled={isLoadingDeleteAddress}
                        onClick={onDeleteAddress}
                        variant={'destructive'}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAddressModal;