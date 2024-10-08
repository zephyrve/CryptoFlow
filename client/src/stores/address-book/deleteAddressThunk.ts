import {createAsyncThunk} from "@reduxjs/toolkit";
import {errorToastContent, successToastContent} from "@/config/toastContent";
import {setProcessing} from "@/stores/process/processSlice";
import {removeAddress} from "@/stores/address-book/addressBookSlice";

export const deleteAddressThunk = createAsyncThunk(
    "addressBook/delete-address",
    async (id: string, {dispatch}) => {
        try {
            await fetch(`/api/address/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id}),
            });

            dispatch(removeAddress(id));

            dispatch(setProcessing({actionName: "deleteAddress", value: false}));
            successToastContent(`Address has been successfully deleted!`, ``);
            return true;
        } catch (e: any) {
            dispatch(setProcessing({actionName: "deleteAddress", value: false}));
            errorToastContent(e.message);
            return false;
        }
    }
);

