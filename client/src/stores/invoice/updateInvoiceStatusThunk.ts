import {createAsyncThunk} from "@reduxjs/toolkit";
import {errorToastContent, successToastContent,} from "@/config/toastContent";
import {AppState} from "../store";
import {setProcessing} from "@/stores/process/processSlice";

export const updateInvoiceStatusThunk = createAsyncThunk(
    "invoice/update-status",
    async (_, { getState, dispatch }) => {
        const state = getState() as AppState;
        if (state.invoice.selectedInvoice !== null) {
            try {
                await fetch(`/api/invoice/updateStatus`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: state.invoice.selectedInvoice._id,
                        status: state.invoice.changeStatusTo,
                    }),
                });
                dispatch(setProcessing({ actionName: "updateInvoiceStatus", value: false }));
                successToastContent(`Invoice status updated successfully!`, ``);
                return true;
            } catch (e: any) {
                dispatch(setProcessing({ actionName: "updateInvoiceStatus", value: false }));
                errorToastContent(e);
                return false;
            }
        }
    },
);
