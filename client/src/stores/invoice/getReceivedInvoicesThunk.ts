import {createAsyncThunk} from "@reduxjs/toolkit";
import {setIsLoadingReceiveInvoices, setReceivedInvoices} from "@/stores/invoice/invoiceSlice";

export const getReceivedInvoicesThunk = createAsyncThunk(
    "invoice/get-received-invoices",
    async (account: string | null, {getState, dispatch}) => {
        dispatch(setIsLoadingReceiveInvoices(true));
        const request = await fetch(`/api/invoice/getReceivedInvoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient: account,
            }),
        });
        const invoices = await request.json();
        dispatch(setReceivedInvoices(invoices));
    },
);
