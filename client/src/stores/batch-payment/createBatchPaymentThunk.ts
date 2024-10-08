import {createAsyncThunk} from "@reduxjs/toolkit";
import {createOneTimePayments} from "@/utils/contract";
import {AppState} from "../store";

export const createBatchPaymentThunk = createAsyncThunk(
    "batchpay/create-payments",
    async (account: string | null, {getState}) => {
        // @ts-ignore
        let state: AppState = getState();
        if (account)
            await createOneTimePayments(account, state.batchPayment, false);
    },
);
