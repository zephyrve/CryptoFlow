import {toast} from "sonner";

export async function getAllGroups({address}: {address: string}) {
    try {
        const response = await fetch(`/api/statistics?address=${address}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user statistics');
        }
        return await response.json()
    } catch (e: any) {
        console.log(e);
        if (e?.shortMessage) toast.error(e?.shortMessage);
        else toast.error(e?.message);
    }
}


export const addUserTransaction = async ({
                                       walletAddress,
                                       isSuccess,
                                       details
                                   }: {
    walletAddress: string,
    isSuccess: boolean,
    details: {
        amount: number,
        type: string,
        timestamp: any,
        transactionHash: string
    }
}) => {
    const {
        amount,
        type,
        timestamp,
        transactionHash
    } = details

    const response = await fetch(`/api/statistics/transactions/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            walletAddress,
            success: isSuccess,
            details: {
                amount,
                type,
                timestamp,
                transactionHash
            }
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user statistics');
    }
    const data = await response.json();
    return data
};
