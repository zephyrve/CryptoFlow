import {CONTRACT_ADDRESS} from "@/config/constants";

export type Token = {
    name: string;
    symbol: string;
    address?: string;
    decimals: number;
    logo: string;
    isNative: boolean;
};

type WhiteListTokenOfChain = {
    [key: string]: Token[];
};

export const whiteListTokenOfChain: WhiteListTokenOfChain = {
    "0x405": [
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

interface TokenAddressInfo {
    [chain: string]: {
        [address: string]: Token;
    };
}

export const tokenAddressInfo: TokenAddressInfo = {
    "0x405": {
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


export const tokenLogos = {
    btt:  "/bttc.svg"
}