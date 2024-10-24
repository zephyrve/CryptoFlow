import {CreateGroupPayload} from "@/stores/useAddressesStore";
import {toast} from "sonner";

export type GroupType = {
    createdAt: string,
    description: string,
    name: string,
    owner: string,
    status: boolean,
    _id: any
}

export async function getAllGroups({address}: {address: string}) {
    try {
        const response = await fetch(`/api/address-group/getList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: address,
            }),
        });

        return await response.json()
    } catch (e: any) {
        console.log(e);
        if (e?.shortMessage) toast.error(e?.shortMessage);
        else toast.error(e?.message);
    }
}

export  const deleteGroup = async ({id}: {id: any}) => {
    try {
        await fetch(`/api/address-group/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: id}),
        });
    } catch (e: any) {
        console.log(e);
        if (e?.shortMessage) toast.error(e?.shortMessage);
        else toast.error(e?.message);
    }
}

export async function createNewGroup({address, data}: { address: string, data: CreateGroupPayload }) {
    try {
        const response = await fetch(`/api/address-group/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: address,
                name: data.name,
                description: data.description,
                status: data.status,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to save address');
        }
        return await response.json()
    } catch (e: any) {
        console.log(e);
        if (e?.shortMessage) toast.error(e?.shortMessage);
        else toast.error(e?.message);
    }
}

export async function updateGroup({id, data}: { id: number, data: CreateGroupPayload}) {
    try {
        const response = await fetch(`/api/address-group/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                id
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to save address');
        }
        const d = await response.json()
        return d
    } catch (e: any) {
        console.log(e);
        if (e?.shortMessage) toast.error(e?.shortMessage);
        else toast.error(e?.message);
    }
}

