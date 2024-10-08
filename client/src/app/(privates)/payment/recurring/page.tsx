'use client'

import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import Recipients from "@/components/recurring-payment/Recipients";
import RecurringPaymentForm from "@/components/recurring-payment/RecurringPaymentForm";
import {getAddressThunk} from "@/stores/address-book/getAddressesThunk";
import {useAppDispatch} from "@/stores/hooks";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const RecurringPayment = () => {
    const dispatch = useAppDispatch();
    const {account} = useMetaMask()

    useEffect(() => {
        dispatch(getAddressThunk(account));
    }, [account]);

    return (
        <Box>
            <RecurringPaymentForm/>
            <Recipients/>
        </Box>
    );
};
export default RecurringPayment
