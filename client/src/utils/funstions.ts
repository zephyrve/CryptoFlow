import {formatUnits} from "viem";
import {client} from "@/config/wagmi";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/config/constants";

export const shortAddress = (inputString: string, maxLength = 20) => {
    if (inputString.length <= maxLength) return inputString;
    const prefixLength = Math.floor((maxLength - 3) / 2);
    const suffixLength = maxLength - prefixLength - 3;
    const prefix = inputString.substring(0, prefixLength);
    const suffix = inputString.substring(inputString.length - suffixLength);
    return `${prefix}...${suffix}`;
};

export const timestampToDate = (timestamp: number, type: 'DATE' | 'TIME' | 'FULL') => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (type === 'DATE') {
        return `${day}/${month}/${year}`
    } else if (type === 'TIME') {
        return `${hours}:${minutes}`
    } else {
        return `${day}/${month}/${year} ${hours}:${minutes}`
    }
};

export type PaymentRequest = {
    requestId: number;
    sender: string;
    tokenAddress: string;
    isNativeToken: boolean;
    startDate: number;
    paymentAmount: number;
    remainingBalance: number;
    prepaidPercentage: number;
    unlockAmountPerTime: number;
    unlockEvery: number;
    numberOfUnlocks: number;
    recipient: string;
    whoCanCancel: number;
    whoCanTransfer: number;
    status: number;
    transactionHash?: string;
};

export const convertPaymentRequest = (pr: {
    requestId: string;
    sender: string;
    tokenAddress: string;
    isNativeToken: boolean;
    startDate: string;
    paymentAmount: any;
    remainingBalance: any;
    prepaidPercentage: string;
    unlockAmountPerTime: any;
    unlockEvery: string;
    numberOfUnlocks: string;
    recipient: any;
    whoCanCancel: string;
    whoCanTransfer: string;
    status: string;
    transactionHash?: string;
}) => {
    const convertedPaymentRequest: PaymentRequest = {
        requestId: parseInt(pr.requestId),
        sender: pr.sender,
        tokenAddress: pr.tokenAddress,
        isNativeToken: pr.isNativeToken,
        startDate: parseInt(pr.startDate) * 1000,
        paymentAmount: parseFloat(formatUnits(pr.paymentAmount, 18)),
        remainingBalance: parseFloat(formatUnits(pr.remainingBalance, 18)),
        prepaidPercentage: parseInt(pr.prepaidPercentage),
        unlockAmountPerTime: parseFloat(formatUnits(pr.unlockAmountPerTime, 18)),
        unlockEvery: parseInt(pr.unlockEvery),
        numberOfUnlocks: parseInt(pr.numberOfUnlocks),
        recipient: pr.recipient,
        whoCanCancel: parseInt(pr.whoCanCancel),
        whoCanTransfer: parseInt(pr.whoCanTransfer),
        status: parseInt(pr.status),
        transactionHash: ""
    }

    return convertedPaymentRequest;
};

export const getSenderPaymentRequests = async ({address}: {address: `0x${string}`}) => {
    const senderRequests: any = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getSenderRequests',
        account: address
    })

    const requests = [];

    for (let i = 0; i < senderRequests.length; i++) {
        requests.push(convertPaymentRequest(senderRequests[i]));
    }
    return requests;
};



export const getRecipientPaymentRequests = async ({address}: {address: `0x${string}`}) => {
    const recipientRequests: any = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getRecipientRequests',
        account: address
    })

    const requests = [];
    for (let i = 0; i < recipientRequests.length; i++) {
        requests.push(convertPaymentRequest(recipientRequests[i]));
    }
    return requests;
};


export const calculateUnlockEvery = (
    Every: number,
    EveryType: number,
) => {
    let unlockSeconds = Every;
    switch (EveryType) {
        case 2:
            unlockSeconds *= 60;
            break;
        case 3:
            unlockSeconds *= 60 * 60;
            break;
        case 4:
            unlockSeconds *= 60 * 60 * 24;
            break;
        case 5:
            unlockSeconds *= 60 * 60 * 24 * 7;
            break;
        case 6:
            unlockSeconds *= 60 * 60 * 24 * 30;
            break;
        case 7:
            unlockSeconds *= 60 * 60 * 24 * 365;
            break;
    }
    return unlockSeconds;
};

export const truncateNumberByLength = (number: number, maxLength: number) => {
    const numberStr = number.toString();
    if (numberStr.length <= maxLength) {
        return number === 0 ? 0 : parseFloat(number.toFixed(4));
    }
    const truncatedStr = numberStr.slice(0, maxLength);
    const truncatedNumber = parseFloat(truncatedStr);
    return truncatedNumber === 0 ? 0 : parseFloat(truncatedNumber.toFixed(4));
};
export const getShortAddress = (address: string = '', length: number = 4) => {
    return (address)
        .slice(0, length)
        .concat("...")
        .concat(address.slice(address.length - length, address.length));
};