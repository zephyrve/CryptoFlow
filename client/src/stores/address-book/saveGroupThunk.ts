import {createAsyncThunk} from "@reduxjs/toolkit";
import {errorToastContent, successToastContent,} from "@/config/toastContent";

import {AppState} from "../store";
import {setProcessing} from "@/stores/process/processSlice";

export const saveGroupThunk = createAsyncThunk(
    "addressBook/save-group",
    async (account: string | null, {getState, dispatch}) => {
        const state = getState() as AppState;
        try {
            const groupData = state.addressBook.group;
            await fetch(`/api/address-group/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account,
                    name: groupData.name,
                    description: groupData.description,
                    status: groupData.status,
                }),
            });
            dispatch(setProcessing({actionName: "saveAddressGroup", value: false}));
            successToastContent(`New group created successfully!`, ``);
            return true;
        } catch (e: any) {
            dispatch(setProcessing({actionName: "saveAddressGroup", value: false}));
            errorToastContent(e);
            return false;
        }
    },
);
