import {ErrorCode} from "@ethersproject/logger";

type Messages = {
    [key in ErrorCode]: string;
};

export const messages: Messages = {
    UNKNOWN_ERROR: "An unknown error has occurred.",
    NOT_IMPLEMENTED: "This feature is not implemented yet.",
    UNSUPPORTED_OPERATION: "This operation is not supported.",
    NETWORK_ERROR: "There was a network error. Please check your connection.",
    SERVER_ERROR: "Server encountered an error. Please try again later.",
    TIMEOUT: "The request timed out. Please try again.",
    BUFFER_OVERRUN: "Buffer overrun occurred. Please check your inputs.",
    NUMERIC_FAULT: "A numeric fault occurred. Please check your values.",
    MISSING_NEW: "Missing 'new' keyword in the constructor call.",
    INVALID_ARGUMENT: "Invalid argument provided.",
    MISSING_ARGUMENT: "A required argument is missing.",
    UNEXPECTED_ARGUMENT: "An unexpected argument was provided.",
    CALL_EXCEPTION: "Call exception occurred. Please try again.",
    INSUFFICIENT_FUNDS: "Insufficient funds for the transaction.",
    NONCE_EXPIRED: "The transaction nonce has expired.",
    REPLACEMENT_UNDERPRICED: "Replacement transaction underpriced.",
    UNPREDICTABLE_GAS_LIMIT: "Transaction failed due to uncertain gas. Check your balance and transaction details.",
    TRANSACTION_REPLACED: "Transaction has been replaced.",
    ACTION_REJECTED: "Action was rejected by the user. Please try again if necessary.",
};
