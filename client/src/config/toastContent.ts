import {createStandaloneToast} from "@chakra-ui/toast";
import {messages} from "./message";
import {ErrorCode} from "@ethersproject/logger";

const {toast} = createStandaloneToast();

export const requiredWalletToastContent = (walletName?: string) => {
    toast({
        description: `Please install ${walletName ? walletName : "Metamask"} wallet!`,
        status: "warning",
        duration: 5000,
        isClosable: true,
    });
};

export const errorToastContent = (e: { code: ErrorCode; message?: string }, description?: string) => {
    const message = description || messages[e.code] || `Unexpected error: ${e.code}`;

    return toast({
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
    });
};

export const newErrorToastContent = (description?: string) => {
    return toast({
        description: description,
        status: "error",
        duration: 5000,
        isClosable: true,
    });
};

export const successToastContent = (title: string, description: string) => {
    toast({
        title: title,
        description: description,
        status: "success",
        duration: 5000,
        isClosable: true,
    });
};
