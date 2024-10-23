import {createConfig, http} from 'wagmi'
import {injected} from 'wagmi/connectors'
import {createPublicClient, createWalletClient, custom} from 'viem'

export const bttcTestnet: any & { iconUrl: any, iconBackground: any, } = {
    id: 1029,
    name: 'BTTC Testnet',
    network: 'bttcTestnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BTT',
        symbol: 'BTT',
    },
    rpcUrls: {
        default: 'https://pre-rpc.bt.io',
    },
    blockExplorers: {
        default: {name: 'BTTCscan', url: 'https://testnet.bttcscan.com/'},
    },
    iconUrl: 'https://bttcscan.com/images/favicon.ico?v=24.4.3.0',
    iconBackground: '#fff',
}

export const config = createConfig({
    chains: [bttcTestnet],
    ssr: true,
    connectors: [
        injected(),
    ],
    transports: {
        [bttcTestnet.id]: http("https://pre-rpc.bt.io"),
    },
})


export const client = createPublicClient({
    chain: bttcTestnet,
    transport: http("https://pre-rpc.bt.io")
})

export const walletClient = createWalletClient({
    chain: bttcTestnet,
    transport: typeof window !== 'undefined' && window.ethereum
        ? custom(window.ethereum)
        : http("https://pre-rpc.bt.io"),
})
