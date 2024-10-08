import {
    Button,
    ButtonGroup,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useColorModeValue,
} from "@chakra-ui/react";
import {useCallback, useState} from "react";
import {RiWallet2Line} from "react-icons/ri";
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {setShowTransferModal} from "@/stores/payment-list/paymentListSlice";
import {transferPaymentRequestThunk} from "@/stores/payment-list/transferPaymnentRequestThunk";
import {actionNames, processKeys, updateProcessStatus,} from "@/stores/process/processSlice";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const TransferModal = () => {
    const dispatch = useAppDispatch();
    const {showTransferModal} = useAppSelector(
        (state) => state.paymentList,
    );
    const {transfer} = useAppSelector((state) => state.process);
    const [to, setTo] = useState("");
    const {account, chainId} = useMetaMask()

    const handleClose = useCallback(() => {
        dispatch(setShowTransferModal(false));
    }, []);

    const handleTransferPaymentRequest = useCallback((to: string) => {
        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }
        dispatch(
            updateProcessStatus({
                actionName: actionNames.transfer,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(transferPaymentRequestThunk({to, account}));
    }, [account]);

    return (
        <Modal isOpen={showTransferModal} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Transfer Payment Request</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <InputGroup size={'md'}>
                        <InputLeftAddon pointerEvents={"none"}>
                            <RiWallet2Line color={useColorModeValue('gray', 'gray')}/>
                        </InputLeftAddon>
                        <Input
                            type={"text"}
                            placeholder="New recipient address"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button
                            isLoading={transfer.processing}
                            variant="outline"
                            onClick={() => handleTransferPaymentRequest(to)}
                            colorScheme={"purple"}
                        >
                            Transfer
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
};
export default TransferModal
