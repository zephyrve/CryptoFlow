import {createSlice, PayloadAction,} from "@reduxjs/toolkit";

import {CONTRACT_ADDRESS} from "@/config/constants";

type GeneralSetting = {
    recipient: string;
    tokenAddress: string;
    category: string;
    tags: string;
};

export type InvoiceItem = {
    description: string;
    qty: number;
    unitPrice: number;
    discount: number;
    tax: number;
};

export type Invoice = {
    _id?: string;
    owner: string;
    recipient: string;
    tokenAddress: string;
    category: string;
    tags: string;
    createdAt?: string;
    items: InvoiceItem[];
    status: number;
};

type InvoiceState = {
    generalSetting: GeneralSetting;
    items: InvoiceItem[];
    sentInvoices: Invoice[];
    receivedInvoices: Invoice[];
    isShowItems: boolean;
    currentItems: InvoiceItem[];
    isShowStatusModal: boolean;
    isShowPayModal: boolean;
    isLoadingSentInvoices: boolean;
    isLoadingReceivedInvoices: boolean;
    changeStatusTo: number;
    selectedInvoice: Invoice | null;
};

const initialState: InvoiceState = {
    generalSetting: {
        recipient: "",
        tokenAddress: CONTRACT_ADDRESS || "",
        category: "",
        tags: "",
    },
    items: [
        {
            description: "",
            qty: 1,
            unitPrice: 1,
            discount: 0,
            tax: 0,
        },
    ],
    isLoadingSentInvoices: false,
    isLoadingReceivedInvoices: false,
    sentInvoices: [],
    receivedInvoices: [],
    isShowItems: false,
    currentItems: [],
    isShowPayModal: false,
    isShowStatusModal: false,
    changeStatusTo: 1,
    selectedInvoice: null,
};

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        changeGeneralSetting: (
            state,
            action: PayloadAction<{ att: keyof GeneralSetting; value: string }>,
        ) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewItem: (state) => {
            state.items.push({
                description: "",
                qty: 1,
                unitPrice: 1,
                discount: 0,
                tax: 0,
            });
        },
        removeItem: (
            state,
            action: PayloadAction<{ index: number }>,
        ) => {
            state.items.splice(action.payload.index, 1);
        },
        changeItem: (
            state,
            action: PayloadAction<{ index: number; att: keyof InvoiceItem; value: number | string }>,
        ) => {
            // @ts-ignore
            state.items[action.payload.index][action.payload.att] =
                action.payload.value;
        },
        setIsShowItems: (state, action: PayloadAction<boolean>) => {
            state.isShowItems = action.payload;
        },
        setCurrentItems: (
            state,
            action: PayloadAction<InvoiceItem[]>,
        ) => {
            state.currentItems = action.payload;
        },
        setShowStatusModal: (
            state,
            action: PayloadAction<boolean>,
        ) => {
            state.isShowStatusModal = action.payload;
        },
        setShowPayModal: (state, action: PayloadAction<boolean>) => {
            state.isShowPayModal = action.payload;
        },
        setSelectedInvoice: (
            state,
            action: PayloadAction<Invoice | null>,
        ) => {
            state.selectedInvoice = action.payload;
        },
        setStatusTo: (state, action: PayloadAction<number>) => {
            state.changeStatusTo = action.payload;
        },
        setSentInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.sentInvoices = action.payload;
            state.isLoadingSentInvoices = false;
        },
        setReceivedInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.receivedInvoices = action.payload;
            state.isLoadingReceivedInvoices = false;
        },
        setIsLoadingSentInvoices: (state, action: PayloadAction<boolean>) => {
            state.isLoadingSentInvoices = action.payload;
        },
        setIsLoadingReceiveInvoices: (state, action: PayloadAction<boolean>) => {
            state.isLoadingReceivedInvoices = action.payload;
        },
    },
});

export const {
    changeGeneralSetting,
    changeItem,
    addNewItem,
    removeItem,
    setIsShowItems,
    setCurrentItems,
    setShowStatusModal,
    setShowPayModal,
    setSelectedInvoice,
    setStatusTo,
    setSentInvoices,
    setReceivedInvoices,
    setIsLoadingSentInvoices,
    setIsLoadingReceiveInvoices,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
