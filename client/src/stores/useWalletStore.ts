import {create} from "zustand";
import {BalanceType, getBalance} from "@/app/(privates)/balance/api-balance";

export const useWalletStore = create<{
    balances: BalanceType[],
    setBalances: (b: any[]) => void,
    incrementBalance: ({amount, tokenAddress}: {
        amount: number,
        tokenAddress: string
    }) => void,
    decrementBalance: ({amount, tokenAddress}: {
        amount: number,
        tokenAddress: string
    }) => void,
    getBalances: ({address}: {
        address: `0x${string}`
    }) => Promise<void>,
    isLoadingBalance: boolean
}>((set) => ({
    balances: [],
    isLoadingBalance: false,
    setBalances: (balances) => set({balances: balances}),
    getBalances: async ({address}) => {
        set({isLoadingBalance: true})
        const b = await getBalance({address})
        set({isLoadingBalance: false, balances: b})
    },
    incrementBalance: ({amount, tokenAddress}) => set((state) => ({
        balances: state.balances.map(token => token.address === tokenAddress
            ? {...token, balance: token.balance + amount}
            : token
        )
    })),
    decrementBalance: ({amount, tokenAddress}) => set((state) => ({
        balances: state.balances.map(token => token.address === tokenAddress
            ? {...token, balance: token.balance - amount}
            : token
        )
    })),
}));
