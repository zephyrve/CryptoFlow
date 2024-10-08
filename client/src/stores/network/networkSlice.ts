import {createSlice, PayloadAction} from "@reduxjs/toolkit";

import {DEFAULT_CHAIN} from "@/config/constants";

interface NetworkState {
    networkId: number;
    chain: string | undefined;
    currentChain: string | undefined;
    account: string;
    isConnected: boolean;
    contract: any;
}

const initialState: NetworkState = {
    networkId: 201022,
    chain: DEFAULT_CHAIN,
    currentChain: DEFAULT_CHAIN,
    account: "",
    isConnected: false,
    contract: null,
};

export const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setContract: (state, action: PayloadAction<any>) => {
            state.contract = action.payload;
        },
    },
});

export const {setContract} = networkSlice.actions;

export default networkSlice.reducer;
