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
import {setShowPayModal} from "@/stores/invoice/invoiceSlice";
import {payInvoiceThunk} from "@/stores/invoice/payInvoiceThunk";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const PayModal = () => {
    const dispatch = useAppDispatch();
    const {isShowPayModal} = useAppSelector((state) => state.invoice,);
    const {updateInvoiceStatus} = useAppSelector((state) => state.process);
    const {account, chainId} = useMetaMask()

    const handleClose = useCallback(() => {
        dispatch(setShowPayModal(false));
    }, []);

    const handleChangeStatus = useCallback(() => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }
        dispatch(
            updateProcessStatus({
                actionName: actionNames.updateInvoiceStatus,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(payInvoiceThunk({account, chain: chainId}));
    }, [account, chainId]);

    return (
        <Modal isOpen={isShowPayModal} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text>Do you want to pay this invoice?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button
                            isLoading={updateInvoiceStatus.processing}
                            variant="outline"
                            onClick={handleChangeStatus}
                            colorScheme={"purple"}
                        >
                            Pay
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

export default PayModal