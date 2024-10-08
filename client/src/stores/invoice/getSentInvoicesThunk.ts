import {createAsyncThunk} from "@reduxjs/toolkit";
import {setIsLoadingSentInvoices, setSentInvoices} from "@/stores/invoice/invoiceSlice";

export const getSentInvoicesThunk = createAsyncThunk(
    "invoice/get-sent-invoices",
    async (account: string | null, {getState, dispatch}) => {
        dispatch(setIsLoadingSentInvoices(true));
        const request = await fetch(`/api/invoice/getSentInvoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: account,
            }),
        });
        const invoices = await request.json();
        dispatch(setSentInvoices(invoices));
    },
);