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
    1029: {
        chainName: "BTTC Testnet",
        chainId: 1029,
        rpcUrls: "https://pre-rpc.bt.io",
        explorer: "https://testnet.bttcscan.com/",
        contractAddress: CONTRACT_ADDRESS,
        wallet: "metamask",
    },
};

export const DEFAULT_CHAIN_ID = 1029
export const DEFAULT_CHAIN = chains[DEFAULT_CHAIN_ID];
export type Token = {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logo: string;
    isNative: boolean;
};
type WhiteListTokenOfChain = {
    [key: string]: Token[];
};
export const whiteListTokenOfChain: WhiteListTokenOfChain = {
    1029: [
        {
            name: "BTT",
            symbol: "BTT",
            address: CONTRACT_ADDRESS,
            decimals: 18,
            logo: "/bttc.svg",
            isNative: true,
        },
    ],
};
export const DEFAUL_TOKENS: Token[] = [
    {
        name: "BTT",
        symbol: "BTT",
        address: CONTRACT_ADDRESS,
        decimals: 18,
        logo: "/bttc.svg",
        isNative: true,
    },
]

interface TokenAddressInfo {
    [chain: string]: {
        [address: string]: Token;
    };
}

export const tokenAddressInfo: TokenAddressInfo = {
    1029: {
        ...(CONTRACT_ADDRESS
                ? {
                    [CONTRACT_ADDRESS.toString()]: {
                        name: "BTT",
                        symbol: "BTT",
                        address: "NATIVE_ADDRESS",
                        decimals: 18,
                        logo: "/bttc.svg",
                        isNative: true,
                    },
                }
                : {}
        )
    },
};