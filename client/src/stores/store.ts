import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import addressBookReducer from "@/stores/address-book/addressBookSlice";
import balanceReducer from "@/stores/balance/balanceSlice";
import batchPaymentReducer from "@/stores/batch-payment/batchPaymentSlice";
import multipleRecurringReducer from "@/stores/batch-recurring/multipleRecurringPaymentSlice";
import paymentListReducer from "@/stores/payment-list/paymentListSlice";
import processReducer from "@/stores/process/processSlice";
import invoiceReducer from "./invoice/invoiceSlice";
import networkReducer from "./network/networkSlice";

export const makeStore = () => configureStore({
    reducer: {
        network: networkReducer,
        batchRecurring: multipleRecurringReducer,
        paymentList: paymentListReducer,
        addressBook: addressBookReducer,
        process: processReducer,
        balance: balanceReducer,
        batchPayment: batchPaymentReducer,
        invoice: invoiceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>
