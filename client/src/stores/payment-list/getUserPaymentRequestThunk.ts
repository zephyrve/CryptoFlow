import {createAsyncThunk} from "@reduxjs/toolkit";
import {getSenderPaymentRequests} from "@/utils/contract";
import {setIsLoadingPaymentRequests, setPaymentRequests} from "@/stores/payment-list/paymentListSlice";

export const getSenderPaymentRequestsThunk = createAsyncThunk(
    "sender/get-payment-requests",
    async (account: string | null, {getState, dispatch}) => {
        if (account) {
            dispatch(setIsLoadingPaymentRequests(true));
            const list = await getSenderPaymentRequests(account);
            dispatch(setPaymentRequests(list));
        }
    },
);
