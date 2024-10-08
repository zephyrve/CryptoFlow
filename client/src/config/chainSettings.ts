import {CONTRACT_ADDRESS} from "@/config/constants";

type Chains = {
    [key: string]: {
        chainName?: string;
        chainId: number | string;
        rpcUrls?: string;
        explorer: string;
        wallet?: string;
        contractAddress?: string;
    };
};

export const chains: Chains = {
    "0x405": {
        chainName: "BTTC Testnet",
        chainId: "0x405",
        rpcUrls: "https://pre-rpc.bt.io",
        explorer: "https://testnet.bttcscan.com/",
        contractAddress: CONTRACT_ADDRESS,
        wallet: "metamask",
    },
};

export const bttcTestnet = {
    id: 1029,
    name: "BTTC Testnet",
    network: "bttcTestnet",
    nativeCurrency: {
        decimals: 18,
        name: "BTT",
        symbol: "BTT",
    },
    rpcUrls: {
        default: "https://pre-rpc.bt.io",
    },
    blockExplorers: {
        default: {name: "BTTCscan", url: "https://testnet.bttcscan.com/"},
    },
    iconUrl: "https://bttcscan.com/images/favicon.ico?v=24.4.3.0",
    iconBackground: "#fff",
};
