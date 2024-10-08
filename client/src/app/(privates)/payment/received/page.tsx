'use client'

import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import ActionBar from "@/components/recurring-payment/ActionBar";
import CancelModal from "@/components/recurring-payment/CancelModal";
import ReceivedPaymentList from "@/components/recurring-payment/ReceivedPaymentList";
import TransferModal from "@/components/recurring-payment/TransferModal";
import WithdrawModal from "@/components/recurring-payment/WithdrawModal";
import {useAppDispatch} from "@/stores/hooks";
import {getReceivedPaymentRequestsThunk} from "@/stores/payment-list/getReceivedPaymentRequestThunk";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const ReceivedPayment = () => {
    const dispatch = useAppDispatch();
    const {account} = useMetaMask()

    const fetchData = () => {
        dispatch(getReceivedPaymentRequestsThunk(account));
    };

    useEffect(() => {
        fetchData();
    }, [account]);

    return (
        <Box>
            <ActionBar/>
            <ReceivedPaymentList/>
            <CancelModal/>
            <TransferModal/>
            <WithdrawModal/>
        </Box>
    );
};
export default ReceivedPayment
