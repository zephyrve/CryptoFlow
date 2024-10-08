import {createAsyncThunk} from "@reduxjs/toolkit";
import {createdBatchRecurringPayments} from "@/utils/contract";

import {AppState} from "../store";

export const createRecurringPaymentThunk = createAsyncThunk(
    "recurring/create-payments",
    async (account: string | null, {getState}) => {
        const state = getState() as AppState;
        if (account)
            await createdBatchRecurringPayments(account, state.batchRecurring);
    },
);
