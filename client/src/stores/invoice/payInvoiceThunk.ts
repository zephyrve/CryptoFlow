import {createAsyncThunk} from "@reduxjs/toolkit";
import {tokenAddressInfo} from "@/config/whitelistTokens";
import {createOneTimePayments} from "@/utils/contract";
import {useInvoice} from "@/hooks/useInvoice";
import {BatchPaymentState} from "../batch-payment/batchPaymentSlice";
import {AppState} from "../store";

export const payInvoiceThunk = createAsyncThunk(
    "invoice/pay-now",
    async ({account, chain}: { chain: string | null, account: string | null }, {getState}) => {
        const {getInvoiceAmount} = useInvoice();
        const state = getState() as AppState;
        const selectedInvoice = state.invoice.selectedInvoice;
        if (selectedInvoice !== null && chain && account)
            try {
                const oneTimePaymentData: BatchPaymentState = {
                    generalSetting: {
                        tokenAddress: selectedInvoice.tokenAddress,
                        isPayNow: true,
                        startDate: new Date().getTime(),
                        isNativeToken:
                        tokenAddressInfo[chain][selectedInvoice.tokenAddress].isNative,
                    },
                    recipients: [
                        {
                            recipient: selectedInvoice.owner,
                            amount: getInvoiceAmount(selectedInvoice.items).due,
                        },
                    ],
                };
                createOneTimePayments(account, oneTimePaymentData, true);
                return true;
            } catch (e) {
                return false;
            }
    },
);
