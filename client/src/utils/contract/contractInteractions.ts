import {ethers} from "ethers";
import ABI from "@/config/abis/cryptoflow.json";
import {chains} from "@/config/chainSettings";
import {errorToastContent, newErrorToastContent, successToastContent,} from "@/config/toastContent";
import {tokenAddressInfo} from "@/config/whitelistTokens";
import {BatchPaymentState} from "@/stores/batch-payment/batchPaymentSlice";
import {MultipleRecurringPaymentState} from "@/stores/batch-recurring/multipleRecurringPaymentSlice";
import {getReceivedInvoicesThunk} from "@/stores/invoice/getReceivedInvoicesThunk";
import {setShowPayModal} from "@/stores/invoice/invoiceSlice";
import {updateInvoiceStatusThunk} from "@/stores/invoice/updateInvoiceStatusThunk";
import {getReceivedPaymentRequestsThunk} from "@/stores/payment-list/getReceivedPaymentRequestThunk";
import {getSenderPaymentRequestsThunk} from "@/stores/payment-list/getUserPaymentRequestThunk";
import {
    PaymentRequest,
    setShowCancelModal,
    setShowTransferModal,
    setShowWithdrawModal,
} from "@/stores/payment-list/paymentListSlice";
import {actionNames, processKeys, setProcessing, updateProcessStatus,} from "@/stores/process/processSlice";
import {store} from "@/stores/store";
import {DEFAULT_CHAIN} from "@/config/constants";

const chain = chains[DEFAULT_CHAIN];

const getReadContract = () => {
    const contractAddress = chain.contractAddress || "";
    const provider = ethers.providers.getDefaultProvider(
        chain.rpcUrls,
        chain.chainId,
    );
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    return contract;
};

export const getWriteContract = () => {
    const contractAddress = chain.contractAddress || "";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    return contract;
};

export const eDepositNativeToken = async (account: string, amount: number) => {
    try {
        const contract = getWriteContract();
        const deposit = await contract.deposit(
            chain.contractAddress,
            ethers.utils.parseUnits(amount.toString(), "18"),
            {
                value: ethers.utils.parseUnits(amount.toString(), "18"),
            },
        );

        const result = await deposit.wait();
        const depositEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", depositEvent.transactionHash);
        console.log("- Amount:", amount);
        console.groupEnd();
        successToastContent(`Deposit completed successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        newErrorToastContent(e.data.message);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.deposit,
                att: processKeys.processing,
                value: false,
            }),
        );
    }
};

export const eDepositERC20Token = async (
    tokenAddress: string,
    amount: number,
) => {
    try {
        const contract = getWriteContract();
        const depositERC20 = await contract.deposit(
            tokenAddress,
            ethers.utils.formatUnits(amount, "18"),
        );

        const result = await depositERC20.wait();
        const depositEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", depositEvent.transactionHash);
        console.log("- Amount:", amount);
        console.groupEnd();
        successToastContent(`Deposit completed successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.deposit,
                att: processKeys.processing,
                value: false,
            }),
        );
    }
};

export const eCreateRecurringPayments = async (
    account: string,
    recurringPaymentsData: MultipleRecurringPaymentState,
) => {
    try {
        const setting = recurringPaymentsData.generalSetting;
        const recipients = recurringPaymentsData.recipients;

        const settingData = [
            setting.tokenAddress,
            setting.isNativeToken,
            Math.floor(setting.startDate / 1000),
            setting.whoCanCancel,
            setting.whoCanTransfer,
        ];

        const recipientsData = [];

        for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i];
            recipientsData.push([
                recipient.recipient,
                recipient.unlockEvery * recipient.unlockEveryType,
                ethers.utils.parseUnits(recipient.unlockAmountPerTime.toString(), 18),
                recipient.numberOfUnlocks,
                recipient.prepaidPercentage,
            ]);
        }

        const contract = getWriteContract();

        const createPaymentRequest = await contract.createRecurringPayments(
            settingData,
            recipientsData,
        );

        const result = await createPaymentRequest.wait();
        const createPaymentEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", createPaymentEvent.transactionHash);
        console.log("- Account:", account);
        console.groupEnd();
        successToastContent(`Recurring payment created successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.createBatchPayments,
                att: processKeys.processing,
                value: false,
            }),
        );
    }
};

export const eCreateOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState, isPayInvoice?: boolean) => {
    try {
        let setting = oneTimePaymentsData.generalSetting;
        let recipients = oneTimePaymentsData.recipients;
        let settingData = [
            setting.tokenAddress,
            setting.isNativeToken,
            Math.floor(setting.startDate / 1000),
            setting.isPayNow
        ]
        let recipientsData = [];

        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];
            recipientsData.push([
                recipient.recipient,
                ethers.utils.parseUnits(recipient.amount.toString(), 18),
            ])
        }

        let contract = getWriteContract();
        const createPaymentRequest = await contract.createOneTimePayment(
            settingData,
            recipientsData
        )

        let result = await createPaymentRequest.wait();
        let createPaymentEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', createPaymentEvent.transactionHash);
        console.log('- Account:', account);
        console.groupEnd();
        if (isPayInvoice) {
            store.dispatch(updateInvoiceStatusThunk());
            store.dispatch(setShowPayModal(false));
            store.dispatch(getReceivedInvoicesThunk(account));
        }
        successToastContent(`One-time payment created successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    }
    if (isPayInvoice) {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.updateInvoiceStatus,
            att: processKeys.processing,
            value: false
        }))
    } else {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createOneTimePayments,
            att: processKeys.processing,
            value: false
        }))
    }
}

export const eWithdrawFromPaymentRequest = async (
    account: string,
    requestId: number,
    amount: number,
) => {
    try {
        const contract = getWriteContract();

        const withdrawRequest = await contract.withdrawFromPaymentRequest(
            requestId,
            ethers.utils.parseUnits(amount.toString(), 18),
        );

        const result = await withdrawRequest.wait();
        const withdrawEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", withdrawEvent.transactionHash);
        console.log("- Account:", account);
        console.groupEnd();
        successToastContent(`Withdrawal completed successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.withdrawPayment,
                att: processKeys.processing,
                value: false,
            }),
        );
        store.dispatch(getReceivedPaymentRequestsThunk(account));
        store.dispatch(setShowWithdrawModal(false));
    }
};

export const eCancelPaymentRequest = async (account: string, requestId: number,) => {
    try {
        const contract = getWriteContract();
        const cancelRequest = await contract.cancelPaymentRequest(requestId);

        const result = await cancelRequest.wait();
        const cancelEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", cancelEvent.transactionHash);
        console.log("- RequestId:", requestId);
        console.groupEnd();
        successToastContent(`Request canceled successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.cancel,
                att: processKeys.processing,
                value: false,
            }),
        );
        store.dispatch(getReceivedPaymentRequestsThunk(account));
        store.dispatch(getSenderPaymentRequestsThunk(account));
        store.dispatch(setShowCancelModal(false));
    }
};

export const eTransferPaymentRequest = async (
    account: string,
    requestId: number,
    to: string,
) => {
    try {
        const contract = getWriteContract();
        const transferRequest = await contract.transferPaymentRequest(
            requestId,
            to,
        );

        const result = await transferRequest.wait();
        const transferEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", transferEvent.transactionHash);
        console.log("- RequestId:", requestId);
        console.groupEnd();
        successToastContent(`Transfer request completed successfully!`, ``);
    } catch (e: any) {
        console.log(e);
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.transfer,
                att: processKeys.processing,
                value: false,
            }),
        );
        store.dispatch(getReceivedPaymentRequestsThunk(account));
        store.dispatch(getSenderPaymentRequestsThunk(account));
        store.dispatch(setShowTransferModal(false));
    }
};

export const eWithdrawFromBalance = async (
    account: string,
    tokenAddress: string,
    amount: number,
) => {
    try {
        const contract = getWriteContract();
        const withdrawRequest = await contract.withdrawBalance(
            tokenAddress,
            ethers.utils.parseUnits(amount.toString(), 18),
        );

        const result = await withdrawRequest.wait();
        const withdrawEvent = result.events[0];
        console.group();
        console.log("- Event Name:", "Deposit");
        console.log("- Transaction hash:", withdrawEvent.transactionHash);
        console.log("- tokenAddress:", tokenAddress);
        console.groupEnd();
        successToastContent(`Withdrawal completed successfully!`, ``);
        store.dispatch(setProcessing({actionName: "withdrawBalance", value: false}));
    } catch (e: any) {
        console.log(e);
        store.dispatch(setProcessing({actionName: "withdrawBalance", value: false}));
        errorToastContent(e);
    } finally {
        store.dispatch(
            updateProcessStatus({
                actionName: actionNames.withdrawBalance,
                att: processKeys.processing,
                value: false,
            }),
        );
    }
};

export const eGetSenderPaymentRequests = async (address: string) => {
    const contract = getReadContract();
    const senderRequests = await contract.getSenderRequests({from: address});
    const requests = [];

    for (let i = 0; i < senderRequests.length; i++) {
        requests.push(convertPaymentRequest(senderRequests[i]));
    }
    return requests;
};

export const eGetRecipientPaymentRequests = async (address: string) => {
    const contract = getReadContract();
    const recipientRequests = await contract.getRecipientRequests({
        from: address,
    });
    const requests = [];
    for (let i = 0; i < recipientRequests.length; i++) {
        requests.push(convertPaymentRequest(recipientRequests[i]));
    }
    return requests;
};

export const eGetUserTokensBalance = async (account: string) => {
    const balances: { name: string; address: string; balance: string; lockedAmount: string }[] = [];
    if (!account) {
        return balances;
    }
    try {
        const contract = getReadContract();
        const tokensBalance = await contract.getUserTokensBalance({
            from: account,
        });
        for (let i = 0; i < tokensBalance.length; i++) {
            balances.push({
                name: tokenAddressInfo[DEFAULT_CHAIN][tokensBalance[i].tokenAddress]
                    .name,
                address: tokensBalance[i].tokenAddress,
                balance: ethers.utils.formatUnits(tokensBalance[i].balance._hex, 18),
                lockedAmount: ethers.utils.formatUnits(
                    tokensBalance[i].lockedAmount._hex,
                    18,
                ),
            });
        }
    } catch (e: any) {
        console.log(e);
    }

    return balances;
};

const convertPaymentRequest = (pr: {
    requestId: string;
    sender: string;
    tokenAddress: string;
    isNativeToken: boolean;
    startDate: { _hex: string };
    paymentAmount: { _hex: string };
    remainingBalance: { _hex: string };
    prepaidPercentage: string;
    unlockAmountPerTime: { _hex: string };
    unlockEvery: { _hex: string };
    numberOfUnlocks: { _hex: string };
    recipient: string;
    whoCanCancel: string;
    whoCanTransfer: string;
    status: string;
    transactionHash?: string;
}) => {
    const convertedPaymentRequest: PaymentRequest = {
        requestId: parseInt(pr.requestId, 16),
        sender: pr.sender,
        tokenAddress: pr.tokenAddress,
        isNativeToken: pr.isNativeToken,
        startDate: parseInt(pr.startDate._hex) * 1000,
        paymentAmount: parseFloat(
            ethers.utils.formatUnits(pr.paymentAmount._hex, 18),
        ),
        remainingBalance: parseFloat(
            ethers.utils.formatUnits(pr.remainingBalance._hex, 18),
        ),
        prepaidPercentage: parseInt(pr.prepaidPercentage),
        unlockAmountPerTime: parseFloat(
            ethers.utils.formatUnits(pr.unlockAmountPerTime._hex, 18),
        ),
        unlockEvery: parseInt(pr.unlockEvery._hex, 16),
        numberOfUnlocks: parseInt(pr.numberOfUnlocks._hex, 16),
        recipient: pr.recipient,
        whoCanCancel: parseInt(pr.whoCanCancel),
        whoCanTransfer: parseInt(pr.whoCanTransfer),
        status: parseInt(pr.status),
        transactionHash: "",
    };

    return convertedPaymentRequest;
};
