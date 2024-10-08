import {createAsyncThunk} from "@reduxjs/toolkit";
import {withdrawFromPaymentRequest} from "@/utils/contract";

import {AppState} from "../store";

export const withdrawPaymentRequestThunk = createAsyncThunk(
    "paymentRequest/withdraw",
    async ({account, amount}: { amount: number, account: string | null }, {getState}) => {
        const state = getState() as AppState;
        if (account && state.paymentList.selectedPaymentRequest !== null)
            await withdrawFromPaymentRequest(
                account,
                state.paymentList.selectedPaymentRequest.requestId,
                amount,
            );
    },
);
