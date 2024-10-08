import {createAsyncThunk} from "@reduxjs/toolkit";
import {withdrawFromBalance} from "@/utils/contract";

import {AppState} from "../store";

export const withdrawBalanceThunk = createAsyncThunk(
    "balance/withdraw",
    async (account: string | null, {getState, dispatch}) => {
        const state = getState() as AppState;
        if (account)
            await withdrawFromBalance(
                account,
                state.balance.withdrawToken,
                state.balance.withdrawAmount as number,
            );
    },
);
