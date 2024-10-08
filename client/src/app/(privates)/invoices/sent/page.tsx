'use client'

import ChangeStatusModal from "@/components/invoice/ChangeStatusModal";
import ItemsModal from "@/components/invoice/ItemsModal";
import SentInvoiceList from "@/components/invoice/SentInvoiceList";
import ActionBarInvoices from "@/components/recurring-payment/ActiveBarInvoices";

const SentInvoice = () => {
    return <>
        <ActionBarInvoices/>
        <SentInvoiceList/>
        <ItemsModal/>
        <ChangeStatusModal/>
    </>
}
export default SentInvoice
