'use client'

import React, {useCallback} from "react";
import {useGroupsStore} from "@/stores/useGroupsStore";
import {Button} from "@/components/ui/button";
import {PencilIcon, TrashIcon} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {GroupType} from "@/app/(privates)/groups/api-groups";
import {Badge} from "@/components/ui/badge";
import Loader from "@/components/share/Loader";

export function GroupTable() {
    const {setSelectedGroup, setIsOpenEditModal, setIsOpenDeleteModal, groups, isLoadingGroups} = useGroupsStore()

    const onOpenDeleteGroupModal = useCallback((group: GroupType) => {
        return () => {
            setIsOpenDeleteModal(true);
            setSelectedGroup(group);
        };
    }, []);

    const onOpenEditGroupModal = useCallback((group: GroupType) => {
        return () => {
            setIsOpenEditModal(true);
            setSelectedGroup(group);
        };
    }, []);

    return (
        <>
            <Loader className={'flex justify-center mt-4'} isShow={isLoadingGroups && groups?.length === 0}/>

            {!isLoadingGroups && groups?.length === 0 &&
                <Alert className={'mt-4'}>
                    <AlertDescription>No address groups have been saved</AlertDescription>
                </Alert>
            }

            {groups?.length > 0 &&
                <div className={'grid-cols-1 sm:grid-cols-2 grid gap-2'}>
                    {groups.map(group =>
                        <Alert key={group.createdAt}>
                            <AlertTitle
                                className={'font-semibold flex-row items-center justify-between align-middle flex gap-2'}
                            >
                                <Badge style={{margin: 0}} className={'w-min mt-0'}>
                                    Name:
                                </Badge>
                                <div style={{margin: 0}} className={'mt-0 break-all'}>
                                    {group.name}
                                </div>
                                <div className={'flex ms-auto gap-1'}>
                                    <Button
                                        variant={'ghost'}
                                        className={'ms-auto'}
                                        size={'icon'}
                                        onClick={onOpenDeleteGroupModal(group)}
                                    >
                                        <TrashIcon size={18}/>
                                    </Button>
                                    <Button
                                        variant={'ghost'}
                                        className={'ms-auto'}
                                        size={'icon'}
                                        onClick={onOpenEditGroupModal(group)}
                                    >
                                        <PencilIcon size={18}/>
                                    </Button>
                                </div>
                            </AlertTitle>
                            <AlertDescription className={'break-words'}>
                                {group.description}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            }
        </>
    )
}
