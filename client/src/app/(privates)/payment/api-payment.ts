import {parseUnits} from "viem";
import {client, walletClient} from "@/config/wagmi";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/config/constants";
import {addUserTransaction} from "@/app/(privates)/statistics/api-settings";

type CreateOneTimePaymentsProps = {
    formData: {
        tokenAddress: string,
        isNativeToken: boolean,
        startDate: number,
        isPayNow: boolean
    },
    recipients: any[],
    address: `0x${string}`,
}

export type Recipient = {
    recipient: string;
    unlockEvery: number;
    unlockEveryType: number;
    unlockAmountPerTime: number | string;
    numberOfUnlocks: number;
    prepaidPercentage: number;
};

export type MultipleRecurringPaymentState = {
    generalSetting: {
        tokenAddress: string;
        isNativeToken: boolean;
        startDate: number;
        whoCanCancel: number;
        whoCanTransfer: number;
    };
    recipients: Recipient[];
};

export const createOneTimePayments = async ({address, recipients, formData}: CreateOneTimePaymentsProps) => {
    let settingData = [
        formData.tokenAddress,
        formData.isNativeToken,
        Math.floor(formData.startDate / 1000),
        formData.isPayNow
    ]

    let recipientsData = [];

    for (let i = 0; i < recipients.length; i++) {
        let recipient = recipients[i];
        recipientsData.push([
            recipient.recipient,
            parseUnits(recipient.amount.toString(), 18),
        ])
    }

    const {request} = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createOneTimePayment',
        args: [settingData, recipientsData],
        account: address,
    })

    const hash = await walletClient!.writeContract(request)
    return await client.waitForTransactionReceipt({hash: hash})
}

export const createRecurringPayments = async ({recurringPaymentsData, address}: {
    address: `0x${string}`,
    recurringPaymentsData: MultipleRecurringPaymentState,
}) => {
    const setting = recurringPaymentsData.generalSetting;
    const recipients = recurringPaymentsData.recipients;

    const settingData = [
        setting.tokenAddress,
        setting.isNativeToken,
        Math.floor(setting.startDate / 1000),
        setting.whoCanCancel.toString(),
        setting.whoCanTransfer.toString(),
    ];

    const recipientsData = [];

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        recipientsData.push([
            recipient.recipient,
            recipient.unlockEvery * recipient.unlockEveryType,
            parseUnits(recipient.unlockAmountPerTime.toString(), 18),
            recipient.numberOfUnlocks.toString(),
            recipient.prepaidPercentage.toString(),
        ]);
    }

    let isSuccess = false;
    let transaction = null;

    if (address) {
        const {request} = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'createRecurringPayments',
            args: [settingData, recipientsData],
            account: address,
        })

        const hash = await walletClient!.writeContract(request)
        transaction = await client.waitForTransactionReceipt({hash: hash})

        if (transaction) {
            isSuccess = true;
        }
    }

    if (transaction) {
        let totalAmount = 0
        for (let i = 0; i < recipients.length; i++) {
            const receiver = recipients[i]
            // @ts-ignore
            const numberOfUnlocks = parseInt(receiver.numberOfUnlocks, 10);
            // @ts-ignore
            const unlockAmountPerTime = parseFloat(receiver.unlockAmountPerTime);
            totalAmount += numberOfUnlocks * unlockAmountPerTime;
        }
        await addUserTransaction({
            walletAddress: address!,
            isSuccess: isSuccess,
            details: {
                amount: totalAmount,
                type: 'recurring-payment',
                timestamp: new Date().getTime(),
                transactionHash: transaction?.transactionHash,
            },
        });
    }

    return transaction
};

export const cancelPaymentRequest = async ({requestId, address, isSendToEmitter = true}: {
    address: `0x${string}`, requestId: number, isSendToEmitter: boolean
}) => {
    const {request} = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'cancelPaymentRequest',
        args: [requestId.toString(), isSendToEmitter],
        account: address,
    })

    const hash = await walletClient!.writeContract(request)
    return await client.waitForTransactionReceipt({hash: hash})
};

export const transferPaymentRequest = async ({to, requestId, address, isSendToOldRecipient}: {
    address: `0x${string}`,
    requestId: number,
    to: string,
    isSendToOldRecipient: boolean
}) => {
    const {request} = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferPaymentRequest',
        args: [requestId, to, isSendToOldRecipient],
        account: address,
    })

    const hash = await walletClient!.writeContract(request)
    return await client.waitForTransactionReceipt({hash: hash})
};

export const withdrawFromPaymentRequest = async ({requestId, address, amount}: {
    address: `0x${string}`,
    requestId: number,
    amount: string,
}) => {
    const {request} = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'withdrawFromPaymentRequest',
        args: [requestId.toString(), parseUnits(amount.toString(), 18)],
        account: address,
    })

    const hash = await walletClient!.writeContract(request)
    return await client.waitForTransactionReceipt({hash: hash})
};