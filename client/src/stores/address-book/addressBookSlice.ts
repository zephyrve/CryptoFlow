import {createSlice, PayloadAction,} from "@reduxjs/toolkit";

type Group = {
    _id?: string;
    owner: string;
    name: string;
    description?: string;
    status: boolean;
};

type Address = {
    _id?: string;
    owner: string;
    walletAddress: string;
    name?: string;
    email?: string;
    groupId?: string;
    status: boolean;
};

type InitialState = {
    group: Group;
    address: Address;
    groupList: Group[];
    addressList: Address[];
    groupMap: Record<string, string> | null;
    isLoadingSetAddresses: boolean
};

const initialState: InitialState = {
    group: {
        owner: "",
        name: "",
        status: true,
    },
    address: {
        owner: "",
        walletAddress: "",
        status: true,
    },
    isLoadingSetAddresses: false,
    groupList: [],
    addressList: [],
    groupMap: null,
};

export const addressBookSlice = createSlice({
    name: "addressBook",
    initialState,
    reducers: {
        setGroupAttribute: (
            state,
            action: PayloadAction<{ att: string; value: string | number }>,
        ) => {
            // @ts-ignore
            state.group[action.payload.att] = action.payload.value;
        },
        setAddressAttribute: (
            state,
            action: PayloadAction<{ att: string; value: string | number }>,
        ) => {
            // @ts-ignore
            state.address[action.payload.att] = action.payload.value;
        },
        setAddressList: (state, action: PayloadAction<Address[]>) => {
            state.addressList = action.payload;
            state.isLoadingSetAddresses = false;
        },
        removeAddress: (state, action: PayloadAction<string>) => {
            state.addressList = state.addressList.filter(
                (address) => address._id !== action.payload
            );
        },
        setGroupList: (state, action: PayloadAction<Group[]>) => {
            state.groupList = action.payload;
            const groupsObj: Record<string, string> = {};
            if (action.payload && action.payload.length) {
                for (let i = 0; i < action.payload.length; i++) {
                    groupsObj[action.payload[i]._id as string] = action.payload[i].name;
                }
                state.groupMap = groupsObj;
            }
        },
        resetFormAddress: (state) => {
            state.address = initialState.address;
        },
        resetFormGroup: (state) => {
            state.group = initialState.group;
        },
        setIsLoadingSetAddresses: (state, action: PayloadAction<boolean>) => {
            state.isLoadingSetAddresses = action.payload;
        },
    },
});

export const {
    setGroupAttribute,
    setAddressAttribute,
    setGroupList,
    setAddressList,
    removeAddress,
    resetFormAddress,
    resetFormGroup,
    setIsLoadingSetAddresses
} =
    addressBookSlice.actions;

export default addressBookSlice.reducer;
