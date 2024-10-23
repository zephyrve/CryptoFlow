'use client'
import React, {useCallback} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {useInvoicesStore} from "@/stores/useInvoicesStore";

const HeaderMessages = {
    1: 'Are you sure you want to activate this invoice?',
    2: 'Are you sure you want to cancel this invoice?',
    3: 'Are you sure you want to pause this invoice?',
    4: 'Are you sure you want to reject this invoice?',
    5: 'Are you sure you want to mark this invoice as paid?'
}

const UpdateInvoiceStatusModal = ({isReceived}: { isReceived: boolean }) => {
    const {
        selectedInvoice,
        updateReceivedInvoice,
        updateSentInvoice,
        selectedInvoiceStatusToUpdate,
        isLoadingUpdateInvoice,
        isOpenEditModal,
        setIsOpenEditModal,
    } = useInvoicesStore()

    const update = useCallback(() => {
        return isReceived
            ? updateReceivedInvoice({id: selectedInvoice?._id!, status: selectedInvoiceStatusToUpdate})
            : updateSentInvoice({id: selectedInvoice?._id!, status: selectedInvoiceStatusToUpdate})
    }, [selectedInvoice, selectedInvoiceStatusToUpdate])

    const onCloseModal = useCallback(() => setIsOpenEditModal(false), [])

    return (
        <Dialog open={isOpenEditModal} onOpenChange={setIsOpenEditModal}>
            <DialogContent>
                <DialogHeader>
                    {/*// @ts-ignore*/}
                    {HeaderMessages[selectedInvoiceStatusToUpdate] ?? ''}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onCloseModal}>
                        Close
                    </Button>
                    <Button
                        isLoading={isLoadingUpdateInvoice}
                        disabled={isLoadingUpdateInvoice}
                        onClick={update}
                        variant={'destructive'}
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateInvoiceStatusModal;