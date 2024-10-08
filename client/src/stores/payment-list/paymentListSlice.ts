import {createSlice, PayloadAction,} from "@reduxjs/toolkit";

export type PaymentRequest = {
    requestId: number;
    sender: string;
    tokenAddress: string;
    isNativeToken: boolean;
    startDate: number;
    paymentAmount: number;
    remainingBalance: number;
    prepaidPercentage: number;
    unlockAmountPerTime: number;
    unlockEvery: number;
    numberOfUnlocks: number;
    recipient: string;
    whoCanCancel: number;
    whoCanTransfer: number;
    status: number;
    transactionHash?: string;
};

type InitialState = {
    isLoadingPaymentRequests: boolean;
    isLoadingReceivedPaymentRequests: boolean;
    paymentRequests: PaymentRequest[];
    receivedPaymentRequests: PaymentRequest[];
    showCancelModal: boolean;
    showWithdrawModal: boolean;
    showTransferModal: boolean;
    selectedPaymentRequest: PaymentRequest | null;
};

const initialState: InitialState = {
    isLoadingPaymentRequests: false,
    isLoadingReceivedPaymentRequests: false,
    paymentRequests: [],
    receivedPaymentRequests: [],
    showCancelModal: false,
    showWithdrawModal: false,
    showTransferModal: false,
    selectedPaymentRequest: null,
};

export const paymentListSlice = createSlice({
    name: "paymentList",
    initialState,
    reducers: {
        setSelectedPaymentRequest: (
            state: InitialState,
            action: PayloadAction<PaymentRequest>,
        ) => {
            state.selectedPaymentRequest = action.payload;
        },
        setShowCancelModal: (
            state: InitialState,
            action: PayloadAction<boolean>,
        ) => {
            state.showCancelModal = action.payload;
        },
        setShowWithdrawModal: (
            state: InitialState,
            action: PayloadAction<boolean>,
        ) => {
            state.showWithdrawModal = action.payload;
        },
        setShowTransferModal: (
            state: InitialState,
            action: PayloadAction<boolean>,
        ) => {
            state.showTransferModal = action.payload;
        },
        setPaymentRequests: (state, action: PayloadAction<PaymentRequest[]>) => {
            state.paymentRequests = action.payload;
            state.isLoadingPaymentRequests = false;
        },
        setIsLoadingPaymentRequests: (state, action: PayloadAction<boolean>) => {
            state.isLoadingPaymentRequests = action.payload;
        },
        setIsLoadingReceivePaymentRequests: (state, action: PayloadAction<boolean>) => {
            state.isLoadingReceivedPaymentRequests = action.payload;
        },
        setReceivedPaymentRequests: (state, action: PayloadAction<PaymentRequest[]>) => {
            state.receivedPaymentRequests = action.payload;
            state.isLoadingReceivedPaymentRequests = false;
        },
    },
});

export const {
    setSelectedPaymentRequest,
    setShowCancelModal,
    setShowWithdrawModal,
    setShowTransferModal,
    setReceivedPaymentRequests,
    setPaymentRequests,
    setIsLoadingPaymentRequests,
    setIsLoadingReceivePaymentRequests
} = paymentListSlice.actions;

export default paymentListSlice.reducer;
