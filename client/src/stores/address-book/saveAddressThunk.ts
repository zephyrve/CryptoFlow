import {createAsyncThunk} from "@reduxjs/toolkit";
import {newErrorToastContent, successToastContent} from "@/config/toastContent";
import {AppState} from "../store";
import {setProcessing} from "@/stores/process/processSlice";

export const saveAddressThunk = createAsyncThunk(
    "addressBook/save-address",
    async (account: string | null, {getState, dispatch}) => {
        const state = getState() as AppState;
        try {
            const address = state.addressBook.address;
            const response = await fetch(`/api/address/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...address, owner: account}),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to save address');
            }

            dispatch(setProcessing({actionName: "saveAddress", value: false}));
            successToastContent(`New address created successfully!`, ``);
            return true;
        } catch (e: any) {
            dispatch(setProcessing({actionName: "saveAddress", value: false}));
            newErrorToastContent(e.message);
            return false;
        }
    },
);
