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
import {useAppDispatch, useAppSelector} from "@/stores/hooks";
import {setShowWithdrawModal} from "@/stores/payment-list/paymentListSlice";
import {withdrawPaymentRequestThunk} from "@/stores/payment-list/withdrawPaymentRequestThunk";
import {actionNames, processKeys, updateProcessStatus} from "@/stores/process/processSlice";
import {BsCurrencyDollar} from "react-icons/bs";
import {newErrorToastContent} from "@/config/toastContent";
import {useMetaMask} from "@/utils/walletConnection/useMetamask";

import {DEFAULT_CHAIN} from "@/config/constants";

const WithdrawModal = () => {
    const dispatch = useAppDispatch();
    const {showWithdrawModal} = useAppSelector((state) => state.paymentList);
    const {withdrawPayment} = useAppSelector((state) => state.process);
    const [amount, setAmount] = useState<string>("");
    const {account, chainId} = useMetaMask()

    const handleClose = useCallback(() => {
        dispatch(setShowWithdrawModal(false));
    }, [dispatch]);

    const handleWithdrawPaymentRequest = useCallback(() => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return;
        }

        if (chainId !== DEFAULT_CHAIN) {
            newErrorToastContent('Switch network to BTT Testnet!')
            return
        }

        dispatch(
            updateProcessStatus({
                actionName: actionNames.withdrawPayment,
                att: processKeys.processing,
                value: true,
            }),
        );
        dispatch(withdrawPaymentRequestThunk({amount: numericAmount, account}));
    }, [amount, chainId]);

    return (
        <Modal isOpen={showWithdrawModal} onClose={handleClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Withdraw Payment Request</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <InputGroup size={'md'}>
                        <InputLeftAddon pointerEvents={"none"}>
                            <BsCurrencyDollar color={useColorModeValue('gray', 'gray')}/>
                        </InputLeftAddon>
                        <Input
                            type={"text"}
                            placeholder="Withdraw amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup gap={4}>
                        <Button
                            isLoading={withdrawPayment.processing}
                            variant="outline"
                            onClick={handleWithdrawPaymentRequest}
                            colorScheme={"purple"}
                        >
                            Withdraw
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
export default WithdrawModal
