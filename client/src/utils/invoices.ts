import {InvoiceItem} from "@/app/(privates)/invoice/api-invoices";

const getLineItemAmount = (item: InvoiceItem) => {
    const lineItemAmountWithoutTax =
        (item.unitPrice * item.qty * (100 - item.discount)) / 100;
    const lineItemAmountWithTax = (lineItemAmountWithoutTax * item.tax) / 100;
    return lineItemAmountWithoutTax + lineItemAmountWithTax;
};

const getInvoiceAmount = (items: InvoiceItem[]) => {
    let amountWithoutTax = 0;
    let totalTaxAmount = 0;
    let totalAmount = 0;
    let due = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        amountWithoutTax +=
            (item.qty * item.unitPrice * (100 - item.discount)) / 100;
        totalTaxAmount +=
            (item.unitPrice * item.qty * (100 - item.discount) * item.tax) / 10000;
    }
    totalAmount = amountWithoutTax + totalTaxAmount;
    due = totalAmount;
    return {
        amountWithoutTax: amountWithoutTax,
        totalTaxAmount: totalTaxAmount,
        totalAmount: totalAmount,
        due: due,
    };
};

const checkInvoiceActionable = (invoice: InvoiceItem, isSender: boolean) => {
    const status = invoice.status;
    let allowCancel = false;
    let allowPause = false;
    let allowActive = false;
    let allowPay = false;
    let allowReject = false;
    if (isSender) {
        switch (status) {
            case 1:
                allowPause = true;
                allowCancel = true;
                break;
            case 2:
                break;
            case 3:
                allowActive = true;
                allowCancel = true;
                break;
            case 4:
                break;
            case 5:
                break;
            default:
                break;
        }
    } else {
        switch (status) {
            case 1:
                allowPay = true;
                allowReject = true;
                break;
            case 2:
                break;
            case 3:
                allowReject = true;
                break;
            case 4:
                break;
            case 5:
                break;
            default:
                break;
        }
    }

    return {
        allowCancel: allowCancel,
        allowPause: allowPause,
        allowActive: allowActive,
        allowPay: allowPay,
        allowReject: allowReject,
    };
};

export {getLineItemAmount, getInvoiceAmount, checkInvoiceActionable};