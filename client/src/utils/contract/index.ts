import {BatchPaymentState} from "@/stores/batch-payment/batchPaymentSlice";
import {MultipleRecurringPaymentState} from "@/stores/batch-recurring/multipleRecurringPaymentSlice";

import {
    eCancelPaymentRequest,
    eCreateOneTimePayments,
    eCreateRecurringPayments,
    eDepositERC20Token,
    eDepositNativeToken,
    eGetRecipientPaymentRequests,
    eGetSenderPaymentRequests,
    eGetUserTokensBalance,
    eTransferPaymentRequest,
    eWithdrawFromBalance,
    eWithdrawFromPaymentRequest,
} from "@/utils/contract/contractInteractions";

const depositNativeToken = async (account: string, amount: number) => {
    await eDepositNativeToken(account, amount);
};

const createdBatchRecurringPayments = async (
    account: string,
    recurringPaymentsData: MultipleRecurringPaymentState,
) => {
    await eCreateRecurringPayments(account, recurringPaymentsData);
};

const createOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState, isPayInvoice?: boolean) => {
    await eCreateOneTimePayments(account, oneTimePaymentsData, isPayInvoice)
}

const depositIRC2Token = async (tokenAddress: string, amount: number) => {
    await eDepositERC20Token(tokenAddress, amount);
};

const withdrawFromPaymentRequest = async (
    account: string,
    requestId: number,
    amount: number,
) => {
    await eWithdrawFromPaymentRequest(account, requestId, amount);
};

const cancelPaymentRequest = async (account: string, requestId: number) => {
    await eCancelPaymentRequest(account, requestId);
};

const transferPaymentRequest = async (
    account: string,
    requestId: number,
    to: string,
) => {
    await eTransferPaymentRequest(account, requestId, to);
};

const withdrawFromBalance = async (
    account: string,
    tokenAddress: string,
    amount: number,
) => {
    await eWithdrawFromBalance(account, tokenAddress, amount);
};

const getUserTokensBalance = async (account: string) => {
    const tokensBalance = await eGetUserTokensBalance(account);
    return tokensBalance;
};

const getSenderPaymentRequests = async (address: string) => {
    let result = [];
    result = await eGetSenderPaymentRequests(address);
    return result;
};

const getRecipientPaymentRequests = async (address: string) => {
    let result = [];
    result = await eGetRecipientPaymentRequests(address);
    return result;
};

export {
    cancelPaymentRequest,
    createdBatchRecurringPayments,
    createOneTimePayments,
    depositIRC2Token,
    depositNativeToken,
    getRecipientPaymentRequests,
    getSenderPaymentRequests,
    getUserTokensBalance,
    transferPaymentRequest,
    withdrawFromBalance,
    withdrawFromPaymentRequest,
};
