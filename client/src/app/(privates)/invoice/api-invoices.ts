import {toast} from "sonner";
import {getInvoiceAmount} from "@/utils/invoices";
import {createOneTimePayments} from "@/app/(privates)/payment/api-payment";
import {addUserTransaction} from "@/app/(privates)/statistics/api-settings";
import {tokenAddressInfo} from "@/utils/chainSettings";

export type InvoiceItem = {
    description: string;
    qty: number;
    unitPrice: number;
    discount: number;
    tax: number;
    status?: any
};

export const getReceivedInvoices = async ({address}: { address: string }) => {
    try {
        const request = await fetch(`/api/invoice/getReceivedInvoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient: address?.toLowerCase(),
            }),
        });

        return await request.json()
    } catch (e) {
        console.log(e)
    }
};

export const getSentInvoicesThunk = async ({address}: { address: string }) => {
    try {
        const request = await fetch(`/api/invoice/getSentInvoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                owner: address?.toLowerCase(),
            }),
        });

        return await request.json()
    } catch (e) {
        console.log(e)
    }
};

export const createInvoice = async ({address, items, settings}: { address: string, items: any, settings: any }) => {
    const invoiceData = {
        settings,
        owner: address?.toLowerCase(),
        items: items,
    };

    const response = await fetch(`/api/invoice/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to save invoice');
    }

    return await response.json()
};


export const updateInvoice = async ({id, status}: { id: string, status: number }) => {
    try {
        const response = await fetch(`/api/invoice/updateStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: id,
                status: status,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to update invoice');
        }
        return await response.json()
    } catch (e: any) {
        console.log(e)
        toast.error(e?.message)
    }
};

export const payInvoice = async ({chain, invoice, address}: { chain: any, invoice: any, address: any }) => {
    const oneTimePaymentData: any = {
        generalSetting: {
            tokenAddress: invoice.tokenAddress,
            isPayNow: true,
            startDate: new Date().getTime(),
            isNativeToken:
            tokenAddressInfo[chain][invoice.tokenAddress].isNative,
        },
        recipients: [
            {
                recipient: invoice.owner,
                amount: getInvoiceAmount(invoice.items).due,
            },
        ],
    };

    let isSuccess = false;
    let transaction = null;

    if (address) {
        transaction = await createOneTimePayments({
            address,
            recipients: oneTimePaymentData.recipients,
            formData: oneTimePaymentData.generalSetting
        });

        if (transaction) {
            isSuccess = true;
        }
    }

    if (transaction) {
        let totalAmount = getInvoiceAmount(invoice.items).due
        await addUserTransaction({
            walletAddress: address!,
            isSuccess: isSuccess,
            details: {
                amount: totalAmount,
                type: 'pay-invoice',
                timestamp: new Date().getTime(),
                transactionHash: transaction?.transactionHash
            }
        })
    }

    return transaction
};

