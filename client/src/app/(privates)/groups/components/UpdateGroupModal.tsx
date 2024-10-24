'use client'
import React from 'react';
import {Dialog, DialogContent, DialogHeader,} from "@/components/ui/dialog"
import {useGroupsStore} from "@/stores/useGroupsStore";
import {GroupForm} from "@/app/(privates)/groups/components/GroupForm";

const UpdateGroupModal = () => {
    const {isOpenEditModal, setIsOpenEditModal, updateGroup} = useGroupsStore()

    return (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
            <DialogContent >
                <DialogHeader>
                    Update Group
                </DialogHeader>
                <GroupForm submitForm={updateGroup} isEditForm={true}/>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateGroupModal;