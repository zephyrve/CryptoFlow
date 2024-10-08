'use client'

import {ChakraProvider} from "@chakra-ui/react";
import {createStandaloneToast} from "@chakra-ui/toast";
import {Provider} from "react-redux";
import {store} from "@/stores/store";
import {theme} from "@/config/theme";
import {ReactNode} from "react";
import {MetaMaskProvider} from "@/utils/walletConnection/metamaskProvider";
const {ToastContainer} = createStandaloneToast();

type AppProvidersProps = { children: ReactNode }

const AppProviders = ({children}: AppProvidersProps) => {
    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <MetaMaskProvider>
                    {children}
                    <ToastContainer/>
                </MetaMaskProvider>
            </Provider>
        </ChakraProvider>
    );
};

export default AppProviders;