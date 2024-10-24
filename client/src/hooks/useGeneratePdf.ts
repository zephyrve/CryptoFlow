import {useRef, useState} from 'react';
import {getInvoiceStatus} from "@/utils/paymentStatus";
import {useAccount} from "wagmi";
import {useAddressesStore} from "@/stores/useAddressesStore";
import {getInvoiceAmount, getLineItemAmount} from "@/utils/invoices";
import {truncateNumberByLength} from "@/utils/funstions";

import {tokenAddressInfo} from "@/utils/chainSettings";

export const useGeneratePdf = () => {
    const {chain} = useAccount();
    const {addresses} = useAddressesStore()
    const [isLoading, setIsLoading] = useState(false);
    const hasRetried = useRef(false);

    const generatePdf = async (selectedInvoice: any, retry = false) => {
        if (!selectedInvoice) return;

        const {totalAmount} = getInvoiceAmount(selectedInvoice.items as any);
        const recipientName = addresses.find(addr => addr.walletAddress.toLowerCase() === selectedInvoice.recipient.toLowerCase());
        const senderName = addresses.find(addr => addr.walletAddress.toLowerCase() === selectedInvoice.owner.toLowerCase());

        const data = {
            sender: selectedInvoice.owner,
            recipient: selectedInvoice.recipient,
            createdAt: selectedInvoice.createdAt,
            category: selectedInvoice.category,
            owner: selectedInvoice.owner,
            tags: selectedInvoice.tags,
            status: getInvoiceStatus(selectedInvoice.status as any),
            tokenAddress: selectedInvoice.tokenAddress,
            items: selectedInvoice.items.map((item: any) => ({
                ...item,
                totalAmount: truncateNumberByLength(getLineItemAmount(item), 6)
            })),
            totalAmount: truncateNumberByLength(totalAmount, 7),
            ownerName: senderName?.name,
            recipientName: recipientName?.name,
            tokenName: (chain && selectedInvoice.tokenAddress) ? tokenAddressInfo[chain.id][selectedInvoice.tokenAddress].name : ''
        };

        try {
            setIsLoading(true);
            const response = await fetch('/api/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 504 && !retry) {
                hasRetried.current = true;
                console.warn('Received 504, retrying the request...');
                await generatePdf(selectedInvoice, true);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, generatePdf};
};
