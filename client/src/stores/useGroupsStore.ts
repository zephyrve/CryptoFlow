import {create} from "zustand";
import {createNewGroup, deleteGroup, getAllGroups, GroupType, updateGroup} from "@/app/(privates)/groups/api-groups";
import {AddressType, CreateGroupPayload} from "@/stores/useAddressesStore";

export const useGroupsStore = create<{
    groups: GroupType[],
    setGroups: (groups: GroupType[]) => void,
    createGroupMap: () => void,
    updateGroup: (x: {
        data: CreateGroupPayload,
        id: any
    }) => void,
    deleteOne: ({id}: {
        id: any
    }) => void,
    getGroups: ({address}: {
        address: `0x${string}`
    }) => Promise<void>,
    addGroup: ({ownerAddress, data}: {
        ownerAddress: `0x${string}`,
        data: CreateGroupPayload
    }) => Promise<AddressType>,
    setSelectedGroup: (group: GroupType | null) => void,
    isLoadingGroups: boolean,
    isLoadingAddGroup: boolean,
    isOpenEditModal: boolean,
    isLoadingUpdateGroup: boolean,
    isLoadingDeleteGroup: boolean,
    selectedGroup: GroupType | null,
    isOpenDeleteModal: boolean,
    setIsOpenEditModal: (_: boolean) => void,
    setIsOpenDeleteModal: (_: boolean) => void,
    groupMap: any
}>((set, get) => ({
    groups: [],
    groupMap: null,
    selectedGroup: null,
    isLoadingGroups: true,
    isOpenDeleteModal: false,
    isOpenEditModal: false,
    isLoadingAddGroup: false,
    isLoadingUpdateGroup: false,
    isLoadingDeleteGroup: false,
    setIsOpenDeleteModal: (isOpen) => set({isOpenDeleteModal: isOpen}),
    setIsOpenEditModal: (isOpen) => set({isOpenEditModal: isOpen}),
    setSelectedGroup: (group) => set({selectedGroup: group}),
    setGroups: (groups) => set({groups: groups}),
    updateGroup: async ({data, id}) => {
        set({isLoadingAddGroup: true})
        const newGroup = await updateGroup({data, id})
        if (newGroup) {
            set((state) => ({
                groups: state.groups.map(group => group._id === id
                    ? {...group, ...newGroup}
                    : group
                )
            }))
        }
        set({isLoadingAddGroup: false})
        return newGroup
    },
    addGroup: async ({ownerAddress, data}) => {
        set({isLoadingAddGroup: true})
        const newGroup = await createNewGroup({address: ownerAddress, data})
        if (newGroup) {
            set((state) => ({groups: [...state.groups, newGroup],}))
        }
        set({isLoadingAddGroup: false})
        return newGroup
    },
    getGroups: async ({address}) => {
        set({isLoadingGroups: true})
        const data = await getAllGroups({address})
        const groupsObj: Record<string, string> = {};
        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                groupsObj[data[i]._id as string] = data[i].name;
            }
        }
        set({groups: data, isLoadingGroups: false, groupMap: groupsObj})
    },
    createGroupMap:  () => {
        const data = get().groups
        const groupsObj: Record<string, string> = {};
        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                groupsObj[data[i]._id as string] = data[i].name;
            }
        }
        set({groupMap: groupsObj})
    },
    deleteOne: async ({id}) => {
        set({isLoadingDeleteGroup: true})
        await deleteGroup({id})
        set((state) => ({
            groups: state.groups.filter((group) => group._id !== id),
            isLoadingDeleteGroup: false,
            isOpenDeleteModal: false,
            selectedGroup: null
        }))
    }
}))