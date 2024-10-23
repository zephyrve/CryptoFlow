import {create} from "zustand";
import {
    createNewAddress,
    deleteAddress,
    getAllAddresses,
    updateNewAddress
} from "@/app/(privates)/addresses/api-addresses";

import {GroupType} from "@/app/(privates)/groups/api-groups";

export const useAddressesStore = create<{
    addresses: AddressType[],
    setAddresses: (addresses: AddressType[]) => void,
    deleteOne: ({id}: { id: any }) => void,
    getAddresses: ({address}: { address: `0x${string}` }) => Promise<void>,
    addAddress: ({ownerAddress, data}: { ownerAddress: `0x${string}`, data: CreateAddressPayload }) => Promise<AddressType>,
    updateAddress: ({data, id}: { id: string, data: CreateAddressPayload }) => Promise<AddressType>,
    setSelectedAddress: (address: AddressType | null) => void,
    isLoadingAddresses: boolean,
    isLoadingAddAddresses: boolean,
    isLoadingEditAddresses: boolean,
    isLoadingDeleteAddress: boolean,
    selectedAddress: AddressType | null,
    isOpenDeleteModal: boolean,
    isOpenEditModal: boolean,
    setIsOpenDeleteModal: (_: boolean) => void
    setIsOpenEditModal: (_: boolean) => void
}>((set, get) => ({
    addresses: [],
    selectedAddress: null,
    isLoadingAddresses: true,
    isLoadingAddAddresses: false,
    isLoadingEditAddresses: false,
    isOpenDeleteModal: false,
    isOpenEditModal: false,
    isLoadingDeleteAddress: false,
    setIsOpenDeleteModal: (isOpen) => set({isOpenDeleteModal: isOpen}),
    setIsOpenEditModal: (isOpen) => set({isOpenEditModal: isOpen}),
    setSelectedAddress: (address) => set({selectedAddress: address}),
    setAddresses: (addresses) => set({addresses}),
    addAddress: async ({ownerAddress, data}) => {
        set({isLoadingAddAddresses: true})
        const newAddress = await createNewAddress({address: ownerAddress, data})
        if (newAddress) {
            set((state) => ({addresses: [...state.addresses, newAddress],}))
        }
        set({isLoadingAddAddresses: false})
        return newAddress
    },
    updateAddress: async ({data, id}) => {
        set({isLoadingAddAddresses: true})
        const newAddress = await updateNewAddress({data, id})
        if (newAddress) {
            set((state) => ({
                addresses: state.addresses.map(addr => addr._id === id
                    ? {...addr, ...newAddress}
                    : addr
                )
            }))
        }
        set({isLoadingAddAddresses: false, isOpenEditModal: false, selectedAddress: null})
        return newAddress
    },
    getAddresses: async ({address}) => {
        set({isLoadingAddresses: true})
        const data = await getAllAddresses({address})
        set({addresses: data, isLoadingAddresses: false})
    },
    deleteOne: async ({id}) => {
        set({isLoadingDeleteAddress: true})
        await deleteAddress({id})
        set((state) => ({
            addresses: state.addresses.filter((address) => address._id !== id),
            isLoadingDeleteAddress: false,
            isOpenDeleteModal: false,
            selectedAddress: null
        }))
    }
}));

export type AddressType = {
    createdAt: string;
    email: string;
    groupId: string;
    name: string;
    owner: string;
    status: boolean;
    walletAddress: string;
    _id: string;
};

export type CreateAddressPayload = Omit<AddressType, '_id' | 'status' | 'createdAt' | 'owner'>;
export type CreateGroupPayload = Omit<GroupType, 'createdAt' | 'owner' | '_id'>;


