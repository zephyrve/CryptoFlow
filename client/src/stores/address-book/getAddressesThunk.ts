import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAddressList, setIsLoadingSetAddresses} from "@/stores/address-book/addressBookSlice";

export const getAddressThunk = createAsyncThunk(
    "addressBook/get-addresses",
    async (account: string | null, {getState, dispatch}) => {
        if (account) {
            dispatch(setIsLoadingSetAddresses(true));
            const request = await fetch(`/api/address/getList`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    owner: account,
                }),
            });
            const addresses = await request.json();
            dispatch(setAddressList(addresses));
        }
    },
);