import React from 'react';
import {GroupForm} from "@/app/(privates)/groups/components/GroupForm";
import {useGroupsStore} from "@/stores/useGroupsStore";

const CreateGroup = () => {
    const {addGroup} = useGroupsStore()
    return (
        <GroupForm  submitForm={addGroup}/>
    );
};

export default CreateGroup;