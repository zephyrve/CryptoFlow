import {create} from 'zustand';
import {getAllGroups} from "@/app/(privates)/statistics/api-settings";

interface TransactionHistory {
    transactionId: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'payment';
    status: 'success' | 'failed';
    timestamp: string;
}

interface UserStatisticsState {
    transactionsCount: number;
    walletAddress: string;
    successfulTransactions: number;
    totalAmountTransacted: number;
    lastTransactionDate: string | null;
    transactionHistory: TransactionHistory[];
}

interface UserStatisticsStore {
    data: UserStatisticsState;
    isLoading: boolean;
    error: string | null;
    setIsLoading: (isLoading: boolean) => void;
    fetchUserStatisticsSuccess: (data: UserStatisticsState) => void;
    fetchUserStatistics: ({address}: { address: any }) => Promise<void>;
    fetchUserStatisticsFailure: (error: string) => void;
    resetUserStatistics: () => void;
    updateField: (field: keyof UserStatisticsStore, value: any) => void;
}

const initialState: UserStatisticsState = {
    transactionsCount: 0,
    walletAddress: '',
    successfulTransactions: 0,
    totalAmountTransacted: 0.0,
    lastTransactionDate: null,
    transactionHistory: [],
};

const useUserStatisticsStore = create<UserStatisticsStore>((set) => ({
    data: initialState,
    isLoading: false,
    error: null,
    setIsLoading: (isLoading) => set({isLoading}),
    fetchUserStatisticsSuccess: (data) =>
        set({
            data,
            isLoading: false,
            error: null,
        }),
    fetchUserStatistics: async ({address}) => {
        set({isLoading: true, error: null})
        const data = await getAllGroups({address})
        set({data, isLoading: false, error: null,})
    },
    fetchUserStatisticsFailure: (error) =>
        set({
            error,
            isLoading: false,
        }),
    resetUserStatistics: () =>
        set({
            data: initialState,
            isLoading: false,
            error: null,
        }),
    updateField: (field, value) =>
        set((state) => ({
            ...state,
            [field]: value,
        })),
}));

export default useUserStatisticsStore;
