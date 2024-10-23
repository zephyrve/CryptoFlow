import {PaymentRequest} from "@/utils/funstions";

const getStatus = (status: number) => {
    let statusString = "active"
    switch (status) {
        case 2:
            statusString = "cancelled";
            break;
        case 3:
            statusString = "completed";
            break;
        default:
            break

    }
    return statusString;
};

const checkPaymentDisabledActions = (paymentRequest: PaymentRequest, isSender: boolean) => {
    let isAllowCancel = false;
    let isAllowTransfer = false;
    let isAllowWithdraw = false;
    switch (paymentRequest.status) {
        case 1:
            isAllowCancel = true;
            isAllowTransfer = true;
            isAllowWithdraw = true;
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            break;
    }

    if (isSender) {
        switch (paymentRequest.whoCanCancel) {
            case 0:
                break;
            case 1:
                isAllowCancel = false;
                break;
            case 2:
                break;
            case 3:
                isAllowCancel = false;
            default:
                break;
        }
        switch (paymentRequest.whoCanTransfer) {
            case 0:
                break;
            case 1:
                isAllowTransfer = false;
                break;
            case 2:
                break;
            case 3:
                isAllowTransfer = false;
            default:
                break;
        }
    } else {
        switch (paymentRequest.whoCanCancel) {
            case 0:
                isAllowCancel = false;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                isAllowCancel = false;
            default:
                break;
        }
        switch (paymentRequest.whoCanTransfer) {
            case 0:
                isAllowTransfer = false;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                isAllowTransfer = false;
            default:
                break;
        }
    }
    return {
        isAllowCancel,
        isAllowTransfer,
        isAllowWithdraw
    }
}

const getInvoiceStatus = (status: number) => {
    let statusString = "active"
    switch (status) {
        case 2:
            statusString = "cancelled";
            break;
        case 3:
            statusString = "paused";
            break;
        case 4:
            statusString = "rejected";
            break;
        case 5:
            statusString = "paid";
            break;
        default:
            break

    }
    return statusString;
};

export { getStatus, getInvoiceStatus, checkPaymentDisabledActions };
