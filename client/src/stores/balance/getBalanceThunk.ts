import {createAsyncThunk} from "@reduxjs/toolkit";
import {getUserTokensBalance} from "@/utils/contract";

import {AppState} from "../store";
import {setIsLoadingFetchBalance, setTokenBalances} from "@/stores/balance/balanceSlice";

export const getBalanceThunk = createAsyncThunk(
    "balance/get-token-balances",
    async (account: string | null, {getState, dispatch}) => {
        if (account) {
            const state = getState() as AppState
            if (state.balance.tokenBalances.length === 0)
                dispatch(setIsLoadingFetchBalance(true));
            const balances = await getUserTokensBalance(account) as any;
            dispatch(setTokenBalances(balances));
        }
    },
);
