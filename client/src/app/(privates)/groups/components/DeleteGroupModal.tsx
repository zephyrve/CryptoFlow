'use client'
import React, {useCallback} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useGroupsStore} from "@/stores/useGroupsStore";

const DeleteGroupModal = () => {
    const {selectedGroup, deleteOne, setIsOpenDeleteModal, isLoadingDeleteGroup, isOpenDeleteModal} = useGroupsStore()
    const onCloseDeleteGroupModal = useCallback(() => setIsOpenDeleteModal(false), [])
    const onDeleteGroup = useCallback(() => deleteOne({id: selectedGroup?._id}), [selectedGroup])

    return (
        <Dialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    Are you sure you want to delete this group ?
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onCloseDeleteGroupModal}>
                        Close
                    </Button>
                    <Button
                        isLoading={isLoadingDeleteGroup}
                        disabled={isLoadingDeleteGroup}
                        onClick={onDeleteGroup}
                        variant={'destructive'}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGroupModal;