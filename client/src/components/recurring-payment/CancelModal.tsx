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
import {cancelPaymentRequestThunk} from "@/stores/payment-list/cancelPaymentRequestThunk";
import {setShowCancelModal} from "@/stores/payment-list/paymentListSlice";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const CancelModal = () => {
    const dispatch = useAppDispatch();
    const {showCancelModal} = useAppSelector((state) => state.paymentList);
    const {cancel} = useAppSelector((state) => state.process);
    const {account, chainId} = useMetaMask()

    const handleClose = useCallback(() => {
        dispatch(setShowCancelModal(false));
    }, []);

    const handleCancelPaymentRequest = useCallback(() => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }
        dispatch(
            updateProcessStatus({
                actionName: actionNames.cancel,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(cancelPaymentRequestThunk(account));
    }, [account]);

    return (
        <Modal isOpen={showCancelModal} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text>Do you want to cancel this payment request ?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button
                            isLoading={cancel.processing}
                            variant="outline"
                            onClick={handleCancelPaymentRequest}
                            colorScheme={"purple"}
                        >
                            Cancel
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

export default CancelModal