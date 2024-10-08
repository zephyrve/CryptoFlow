import {createAsyncThunk} from "@reduxjs/toolkit";
import {getRecipientPaymentRequests} from "@/utils/contract";
import {AppState} from "../store";
import {setIsLoadingReceivePaymentRequests, setReceivedPaymentRequests} from "@/stores/payment-list/paymentListSlice";

export const getReceivedPaymentRequestsThunk = createAsyncThunk(
    "recipient/get-payment-requests",
    async (account: string | null, {getState, dispatch}) => {
        if (account) {
            const state = getState() as AppState;
            if (state.paymentList.receivedPaymentRequests.length === 0)
                dispatch(setIsLoadingReceivePaymentRequests(true));
            const list = await getRecipientPaymentRequests(account);
            dispatch(setReceivedPaymentRequests(list));
        }
    },
);