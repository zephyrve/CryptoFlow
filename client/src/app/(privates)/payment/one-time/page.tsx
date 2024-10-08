'use client'

import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import OneTimePaymentForm from "@/components/onetime-payment/OneTimePaymentForm";
import Recipients from "@/components/onetime-payment/Recipients";
import {getAddressThunk} from "@/stores/address-book/getAddressesThunk";
import {useAppDispatch} from "@/stores/hooks";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const OneTimePayment = () => {
    const dispatch = useAppDispatch();
    const {account} = useMetaMask()

    useEffect(() => {
        dispatch(getAddressThunk(account));
    }, [account]);

    return (
        <Box>
            <OneTimePaymentForm/>
            <Recipients/>
        </Box>
    );
};
export default OneTimePayment
