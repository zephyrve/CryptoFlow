import {create} from "zustand";
import {
    createInvoice,
    getReceivedInvoices,
    getSentInvoicesThunk,
    updateInvoice,
} from "@/app/(privates)/invoice/api-invoices";

export type InvoiceType = {
    description: string;
    qty: number;
    unitPrice: number;
    discount: number;
    tax: number;
    status?: any;
    recipient?: any;
    owner?: any;
    createdAt?: string;
    items: {
        qty: any, tax: any, description: any, discount: any, unitPrice: any
    }[];
    _id: string;
};

export const useInvoicesStore = create<{
    receivedInvoices: InvoiceType[],
    setReceivedInvoices: (_: InvoiceType[]) => void,
    getReceivedInvoices: (_: { address: `0x${string}` }) => Promise<void>,
    updateReceivedInvoice: (_: { status: number, id: string }) => Promise<InvoiceType | undefined>,
    isLoadingReceivedInvoices: boolean,
    isLoadingUpdateInvoice: boolean,
    isOpenPayModal: boolean,
    isLoadingDeleteInvoice: boolean,
    setSelectedInvoice: (_: InvoiceType | null) => void,
    selectedInvoice: InvoiceType | null,
    isOpenDeleteModal: boolean,
    setIsOpenPayModal: (_: boolean) => void,
    setIsOpenDeleteModal: (_: boolean) => void,
    setIsLoadingPayInvoice: (_: boolean) => void,
    setIsOpenDetailsModal: (_: boolean) => void,
    setSelectedInvoiceStatusToUpdate: (_: number) => void,
    sentInvoices: InvoiceType[],
    setSentInvoices: (_: InvoiceType[]) => void,
    updateSentInvoice: (_: { status: number, id: any }) => Promise<InvoiceType | undefined>,
    getSentInvoices: (_: { address: `0x${string}` }) => Promise<void>,
    createInvoice: (_: { address: `0x${string}`, settings: any, items: any }) => Promise<InvoiceType | undefined>,
    isLoadingSentInvoices: boolean,
    selectedInvoiceStatusToUpdate: number,
    isLoadingAddInvoice: boolean,
    isLoadingPayInvoice: boolean,
    isOpenEditModal: boolean,
    isOpenDetailsModal: boolean,
    setIsOpenEditModal: (_: boolean) => void,
}>((set, get) => ({
    receivedInvoices: [],
    isLoadingReceivedInvoices: true,
    isLoadingUpdateInvoice: false,
    isLoadingDeleteInvoice: false,
    isLoadingPayInvoice: false,
    selectedInvoice: null,
    isOpenDetailsModal: false,
    selectedInvoiceStatusToUpdate: 1,
    isOpenPayModal: false,
    isOpenEditModal: false,
    isOpenDeleteModal: false,
    setSelectedInvoice: (invoice) => set({selectedInvoice: invoice}),
    setIsOpenDetailsModal: (status) => set({isOpenDetailsModal: status}),
    setReceivedInvoices: (invoices) => set({receivedInvoices: invoices}),
    setSelectedInvoiceStatusToUpdate: (x) => set({selectedInvoiceStatusToUpdate: x}),
    getReceivedInvoices: async ({address}) => {
        set({isLoadingReceivedInvoices: true});
        const data = await getReceivedInvoices({address});
        set({receivedInvoices: data, isLoadingReceivedInvoices: false});
    },
    updateReceivedInvoice: async ({status, id}) => {
        set({isLoadingUpdateInvoice: true});
        const updatedInvoice = await updateInvoice({status, id});
        if (updatedInvoice) {
            set((state) => ({
                receivedInvoices: state.receivedInvoices.map((invoice) =>
                    invoice._id === id ? {...invoice, ...updatedInvoice} : invoice
                ),
            }));
        }
        set({isLoadingUpdateInvoice: false, isOpenEditModal: false});
        return updatedInvoice;
    },
    setIsOpenPayModal: (isOpen) => set({isOpenPayModal: isOpen}),
    setIsOpenEditModal: (isOpen) => set({isOpenEditModal: isOpen}),
    setIsOpenDeleteModal: (isOpen) => set({isOpenDeleteModal: isOpen}),
    setIsLoadingPayInvoice: (isLoading) => set({isLoadingPayInvoice: isLoading}),
    sentInvoices: [],
    isLoadingSentInvoices: true,
    isLoadingAddInvoice: false,
    setSentInvoices: (invoices) => set({sentInvoices: invoices}),
    updateSentInvoice: async ({status, id}) => {
        set({isLoadingUpdateInvoice: true});
        const updatedInvoice = await updateInvoice({status, id});
        if (updatedInvoice) {
            set((state) => ({
                sentInvoices: state.sentInvoices.map((invoice) =>
                    invoice._id === id ? {...invoice, ...updatedInvoice} : invoice
                ),
            }));
        }
        set({isLoadingUpdateInvoice: false, isOpenEditModal: false});
        return updatedInvoice;
    },
    createInvoice: async ({address, settings, items}) => {
        set({isLoadingAddInvoice: true});
        const newInvoice = await createInvoice({address, settings, items});
        if (newInvoice) {
            set((state) => ({sentInvoices: [...state.sentInvoices, newInvoice]}));
        }
        set({isLoadingAddInvoice: false});
        return newInvoice;
    },
    getSentInvoices: async ({address}) => {
        set({isLoadingSentInvoices: true});
        const data = await getSentInvoicesThunk({address});
        set({sentInvoices: data, isLoadingSentInvoices: false});
    },
}));
