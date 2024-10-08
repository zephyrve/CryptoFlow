import {createAsyncThunk} from "@reduxjs/toolkit";
import {errorToastContent, successToastContent,} from "@/config/toastContent";

import {AppState} from "../store";
import {setProcessing} from "@/stores/process/processSlice";

export const createInvoiceThunk = createAsyncThunk(
    "invoice/save",
    async (account: string | null, {getState, dispatch}) => {
        const state = getState() as AppState;

        try {
            const invoiceData = {
                ...state.invoice.generalSetting,
                owner: account,
                items: state.invoice.items,
            };
            await fetch(`/api/invoice/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(invoiceData),
            });
            dispatch(setProcessing({actionName: "createInvoice", value: false}));
            successToastContent(`New invoice created successfully!`, ``);
            return true;
        } catch (e: any) {
            dispatch(setProcessing({actionName: "createInvoice", value: false}));
            errorToastContent(e);
            return false;
        }
    },
);
