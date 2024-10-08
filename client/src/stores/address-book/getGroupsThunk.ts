import {createAsyncThunk} from "@reduxjs/toolkit";
import {setGroupList} from "@/stores/address-book/addressBookSlice";

export const getGroupsThunk = createAsyncThunk(
    "addressBook/get-groups",
    async (account: string | null, {getState, dispatch}) => {
        const request = await fetch(`/api/address-group/getList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: account,
            }),
        });
        const groups = await request.json();
        dispatch(setGroupList(groups));
    },
);
