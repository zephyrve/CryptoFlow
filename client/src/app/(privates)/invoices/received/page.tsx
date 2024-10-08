'use client'

import ChangeStatusModal from "@/components/invoice/ChangeStatusModal";
import ItemsModal from "@/components/invoice/ItemsModal";
import PayModal from "@/components/invoice/PayModal";
import ReceivedInvoiceList from "@/components/invoice/ReceivedInvoiceList";
import ActionBarInvoices from "@/components/recurring-payment/ActiveBarInvoices";

const ReceivedInvoice = () => {
    return <>
        <ActionBarInvoices/>
        <ReceivedInvoiceList/>
        <ItemsModal/>
        <ChangeStatusModal/>
        <PayModal/>
    </>
}
export default ReceivedInvoice
