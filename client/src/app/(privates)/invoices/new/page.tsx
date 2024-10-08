'use client'

import {useEffect} from "react";
import {getAddressThunk} from "@/stores/address-book/getAddressesThunk";
import {useAppDispatch} from "@/stores/hooks";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

const NewInvoice = () => {
    const dispatch = useAppDispatch();
    const {account} = useMetaMask()

    useEffect(() => {
        dispatch(getAddressThunk(account));
    }, [account]);

    return <InvoiceForm/>;
};
export default NewInvoice
