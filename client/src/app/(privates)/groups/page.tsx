'use client'
import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {GroupTable} from "@/app/(privates)/groups/components/GroupTable";
import CreateGroup from "@/app/(privates)/groups/components/CreateGroup";
import DeleteGroupModal from "@/app/(privates)/groups/components/DeleteGroupModal";
import EditGroupModal from "@/app/(privates)/groups/components/UpdateGroupModal";

const Page = () => {

    return (
        <div className={'flex flex-col gap-1'}>
            <DeleteGroupModal/>
            <EditGroupModal/>

            <Card className={'w-full overflow-hidden border-none'}>
                <CardHeader
                    className={'font-semibold text-xl bg-purple-300 py-4 text-gray-700 mb-3 dark:bg-purple-700/50 dark:text-gray-200'}
                >
                    Create Group
                </CardHeader>
                <CardContent>
                    <CreateGroup/>
                </CardContent>
            </Card>

            <GroupTable/>
        </div>
    );
};

export default Page;