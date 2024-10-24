import {toast} from "sonner";
import {CreateAddressPayload} from "@/stores/useAddressesStore";

export async function getAllAddresses({address}: { address: string }) {
    try {
        const response = await fetch(`/api/address/getList`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: address,
            }),
        });

        const data = await response.json()
        return data
    } catch (e) {
        console.log(e)
    }
}

export async function createNewAddress({address, data}: { address: string, data: CreateAddressPayload }) {
    try {
        const response = await fetch(`/api/address/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({owner: address, status: true, groupId: data.groupId, email: data.email, name: data.name, walletAddress: data.walletAddress}),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to save address');
        }
        const d = await response.json()
        return d
    } catch (e: any) {
        console.log(e)
        toast.error(e?.message)
    }
}

export const deleteAddress = async ({id}: { id: any }) => {
    try {
        await fetch(`/api/address/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id}),
        });
    } catch (e: any) {
        console.log(e)
    }
}

export async function updateNewAddress({id, data}: { id: string, data: CreateAddressPayload }) {
    try {
        const response = await fetch(`/api/address/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: true,
                groupId: data.groupId,
                email: data.email,
                name: data.name,
                walletAddress: data.walletAddress,
                id: id
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to save address');
        }
        return await response.json()
    } catch (e: any) {
        console.log(e)
        toast.error(e?.message)
    }
}