'use client'

import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import ActionBar from "@/components/recurring-payment/ActionBar";
import CancelModal from "@/components/recurring-payment/CancelModal";
import SentPaymentList from "@/components/recurring-payment/SentPaymentList";
import TransferModal from "@/components/recurring-payment/TransferModal";
import {useAppDispatch} from "@/stores/hooks";
import {getSenderPaymentRequestsThunk} from "@/stores/payment-list/getUserPaymentRequestThunk";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const SentPayment = () => {
    const dispatch = useAppDispatch();
    const {account} = useMetaMask()

    const fetchData = async () => {
        await dispatch(getSenderPaymentRequestsThunk(account));
    };

    useEffect(() => {
        fetchData();
    }, [account]);

    return (
        <Box>
            <ActionBar/>
            <SentPaymentList/>
            <CancelModal/>
            <TransferModal/>
        </Box>
    );
};
export default SentPayment
