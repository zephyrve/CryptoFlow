import {createAsyncThunk} from "@reduxjs/toolkit";
import {depositNativeToken} from "@/utils/contract";

import {AppState} from "../store";

export const depositThunk = createAsyncThunk(
    "balance/deposit",
    async (account: string | null, {getState}) => {
        const state = getState() as AppState;
        if (account)
            await depositNativeToken(
                account,
                state.balance.depositAmount as number,
            );
    },
);
