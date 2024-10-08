import {createAsyncThunk} from "@reduxjs/toolkit";
import {cancelPaymentRequest} from "@/utils/contract";
import {AppState} from "../store";

export const cancelPaymentRequestThunk = createAsyncThunk(
    "paymentRequest/cancel",
    async (account: string | null, {getState}) => {
        const state = getState() as AppState;
        if (state.paymentList.selectedPaymentRequest !== null && account)
            await cancelPaymentRequest(
                account,
                state.paymentList.selectedPaymentRequest.requestId,
            );
    },
);
