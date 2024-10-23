import {create} from "zustand";
import {getRecipientPaymentRequests, getSenderPaymentRequests, PaymentRequest} from "@/utils/funstions";

export const usePaymentRequestsStore = create<{
    paymentRequests: PaymentRequest[],
    recipientPayments: PaymentRequest[],
    selectedPaymentRequest: PaymentRequest | null,
    setPaymentRequests: (x: PaymentRequest[]) => void,
    setSelectedPaymentRequest: (x: PaymentRequest) => void,
    updateStatusRequest: (_: { id: any, status: any, isReceived: boolean }) => void,
    deleteReceivePaymentRequest: (_: { id: any }) => void,
    increaseWithdrew: (_: { id: any, amount: number, isReceived: boolean }) => void,
    setIsLoadingCreatePayment: (x: boolean) => void,
    setIsOpenTransferPaymentModal: (x: boolean) => void,
    setIsOpenWithdrawModal: (x: boolean) => void,
    setIsLoadingTransferPayment: (x: boolean) => void,
    setIsLoadingCancelPayment: (x: boolean) => void,
    setIsOpenCancelPaymentModal: (x: boolean) => void,
    setIsLoadingWithdraw: (x: boolean) => void,
    getSenderPaymentRequests: ({address}: { address: `0x${string}` }) => Promise<void>,
    getRecipientPaymentRequests: ({address}: { address: `0x${string}` }) => Promise<void>,
    isLoadingPaymentRequests: boolean,
    setLoading: (isLoading: boolean) => void,
    isLoadingCreatePayment: boolean,
    isLoadingCancelPayment: boolean,
    isLoadingTransferPayment: boolean,
    isOpenCancelPaymentModal: boolean,
    isLoadingWithdraw: boolean,
    isOpenWithdrawModal: boolean,
    isOpenTransferModal: boolean
}>((set, get) => ({
    paymentRequests: [],
    recipientPayments: [],
    selectedPaymentRequest: null,
    isOpenWithdrawModal: false,
    isOpenCancelPaymentModal: false,
    isOpenTransferModal: false,
    isLoadingPaymentRequests: false,
    isLoadingCreatePayment: false,
    isLoadingCancelPayment: false,
    isLoadingWithdraw: false,
    isLoadingTransferPayment: false,
    setPaymentRequests: (paymentRequests) => set({paymentRequests}),
    setLoading: (isLoading) => set({isLoadingPaymentRequests: isLoading}),
    getSenderPaymentRequests: async ({address}) => {
        set({isLoadingPaymentRequests: true});
        try {
            const requests = await getSenderPaymentRequests({address});
            set({paymentRequests: requests});
        } catch (error) {
            console.error("Error fetching payment requests:", error);
        } finally {
            set({isLoadingPaymentRequests: false});
        }
    },
    getRecipientPaymentRequests: async ({address}) => {
        set({isLoadingPaymentRequests: true});
        try {
            const requests = await getRecipientPaymentRequests({address});
            set({recipientPayments: requests});
        } catch (error) {
            console.error("Error fetching payment requests:", error);
        } finally {
            set({isLoadingPaymentRequests: false});
        }
    },
    increaseWithdrew: ({id, amount, isReceived}) => {
        if (isReceived)
            set(state => ({
                recipientPayments: state.recipientPayments.map(r => r.requestId === id
                    ? {...r, remainingBalance: r.remainingBalance - amount}
                    : r
                )
            }))
        else set(state => ({
            paymentRequests: state.paymentRequests.map(r => r.requestId === id
                ? {...r, remainingBalance: r.remainingBalance - amount}
                : r
            )
        }))
    },
    deleteReceivePaymentRequest: ({id}) => {
            set(state => ({
                recipientPayments: state.recipientPayments.filter(r => r.requestId !== id)
            }))
    },
    updateStatusRequest: ({id, status, isReceived}) => {
        if (isReceived)
            set(state => ({
                recipientPayments: state.recipientPayments.map(r => r.requestId === id
                    ? {...r, status: status}
                    : r
                )
            }))
        else set(state => ({
            paymentRequests: state.paymentRequests.map(r => r.requestId === id
                ? {...r, status: status}
                : r
            )
        }))
    },
    setSelectedPaymentRequest: (request) => set({selectedPaymentRequest: request}),
    setIsLoadingCancelPayment: (status) => set({isLoadingCancelPayment: status}),
    setIsLoadingCreatePayment: (status) => set({isLoadingCreatePayment: status}),
    setIsLoadingTransferPayment: (status) => set({isLoadingTransferPayment: status}),
    setIsLoadingWithdraw: (status) => set({isLoadingWithdraw: status}),
    setIsOpenCancelPaymentModal: (status) => set({isOpenCancelPaymentModal: status}),
    setIsOpenTransferPaymentModal: (status) => set({isOpenTransferModal: status}),
    setIsOpenWithdrawModal: (status) => set({isOpenWithdrawModal: status})
}));
