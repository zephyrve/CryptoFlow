export {};

declare global {
    interface Window {
        hanaWallet: any;
        location: any;
        ethereum: any;
        web3;
    }
}
