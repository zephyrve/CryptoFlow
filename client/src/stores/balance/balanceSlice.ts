import {createSlice, PayloadAction,} from "@reduxjs/toolkit";

import {CONTRACT_ADDRESS} from "@/config/constants";

type TokenBalance = {
    name: string;
    address?: string;
    balance: number;
    lockedAmount: number;
};

type BalanceKeys = keyof BalanceState;

export type BalanceState = {
    isLoadingFetchBalance: boolean,
    depositAmount: number | null;
    depositToken: string;
    withdrawAmount: number | null;
    withdrawToken: string;
    tokenBalances: TokenBalance[];
};

const initialState: BalanceState = {
    isLoadingFetchBalance: false,
    depositAmount: null,
    depositToken: CONTRACT_ADDRESS || "",
    withdrawAmount: null,
    withdrawToken: CONTRACT_ADDRESS || "",
    tokenBalances: [],
};

export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        updateBalanceAttribute: (
            state,
            action: PayloadAction<{ att: BalanceKeys; value: string | number | null }>,
        ) => {
            // @ts-ignore
            state[action.payload.att] = action.payload.value;
        },
        setTokenBalances: (state, action: PayloadAction<TokenBalance[]>) => {
            state.tokenBalances = action.payload;
            state.isLoadingFetchBalance = false
        },
        setIsLoadingFetchBalance: (state, action: PayloadAction<boolean>) => {
            state.isLoadingFetchBalance = action.payload
        },
    },
});

export const {
    updateBalanceAttribute,
    setTokenBalances,
    setIsLoadingFetchBalance
} = balanceSlice.actions;

export default balanceSlice.reducer;
