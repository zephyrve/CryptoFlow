'use client';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const actionNames = {
    deposit: "deposit",
    withdrawBalance: "withdrawBalance",
    withdrawPayment: "withdrawPayment",
    cancel: "cancel",
    transfer: "transfer",
    createBatchPayments: "createBatchPayments",
    createOneTimePayments: "createOneTimePayments",
    saveAddressGroup: "saveAddressGroup",
    saveAddress: "saveAddress",
    createInvoice: "createInvoice",
    deleteAddress: "deleteAddress",
    updateInvoiceStatus: "updateInvoiceStatus",
} as const;

interface Process {
    processing: boolean;
}

type Processes = {
    [key in keyof typeof actionNames]: Process;
};

export const processKeys = {
    processing: "processing",
} as const;

const initialState: Processes = {
    deposit: {processing: false},
    withdrawBalance: {processing: false},
    withdrawPayment: {processing: false},
    cancel: {processing: false},
    transfer: {processing: false},
    createBatchPayments: {processing: false},
    createOneTimePayments: {processing: false},
    saveAddressGroup: {processing: false},
    saveAddress: {processing: false},
    deleteAddress: {processing: false},
    createInvoice: {processing: false},
    updateInvoiceStatus: {processing: false},
};

export const processesSlice = createSlice({
    name: "process",
    initialState,
    reducers: {
        updateProcessStatus: (
            state,
            action: PayloadAction<{
                actionName: keyof typeof actionNames;
                att: keyof Process;
                value: boolean;
            }>
        ) => {
            state[action.payload.actionName][action.payload.att] = action.payload.value;
        },
        setProcessing: (
            state,
            action: PayloadAction<{ actionName: keyof typeof actionNames; value: boolean }>
        ) => {
            state[action.payload.actionName].processing = action.payload.value;
        },
    },
});

export const {updateProcessStatus, setProcessing} = processesSlice.actions;

export default processesSlice.reducer;
