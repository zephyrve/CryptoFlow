import {createAsyncThunk} from "@reduxjs/toolkit";
import {transferPaymentRequest} from "@/utils/contract";

import {AppState} from "../store";

export const transferPaymentRequestThunk = createAsyncThunk(
    "paymentRequest/transfer",
    async ({to, account}: { to: string, account: string | null }, {getState}) => {
        const state = getState() as AppState;
        if (state.paymentList.selectedPaymentRequest !== null && account)
            await transferPaymentRequest(
                account,
                state.paymentList.selectedPaymentRequest.requestId,
                to,
            );
    },
);
