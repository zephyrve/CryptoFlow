'use client'
import React, {ReactNode} from 'react';
import {config} from "@/config/wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {WagmiProvider} from "wagmi";
import {Toaster} from "sonner";

const queryClient = new QueryClient()

const Providers = ({children}: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster richColors/>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;