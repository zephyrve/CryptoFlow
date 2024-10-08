import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import {useCallback} from "react";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {setShowStatusModal} from "@/stores/invoice/invoiceSlice";
import {updateInvoiceStatusThunk} from "@/stores/invoice/updateInvoiceStatusThunk";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";

const ChangeStatusModal = () => {
    const dispatch = useAppDispatch();
    const {isShowStatusModal, selectedInvoice} = useAppSelector((state) => state.invoice,);
    const {updateInvoiceStatus} = useAppSelector((state) => state.process);

    const handleClose = useCallback(() => {
        dispatch(setShowStatusModal(false));
    }, []);

    const handleChangeStatus = useCallback(() => {
        dispatch(
            updateProcessStatus({
                actionName: actionNames.updateInvoiceStatus,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(updateInvoiceStatusThunk());
    }, []);

    return (
        <Modal isOpen={isShowStatusModal} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text>Do you want to update this invoice's status?</Text>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button
                            isLoading={updateInvoiceStatus.processing}
                            variant="outline"
                            onClick={handleChangeStatus}
                            colorScheme={"purple"}
                        >
                            Update
                        </Button>
                        <Button
                            variant={"outline"}
                            colorScheme="blue"
                            mr={3}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ChangeStatusModal