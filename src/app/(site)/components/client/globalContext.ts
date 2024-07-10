import { create } from "zustand";

// 0 = Mainnet
// 1 = Sepolia
// 2 = devnet-rs

interface FrontEndState {
    currentFrontendNetworkIndex: number,
    setCurrentFrontendNetworkIndex: (currentFrontendNetworkIndex: number) => void,
    currentAccountID: number|undefined,
    setCurrentAccountID: (currentAccountID: number) => void,
    isLedgerConnectedUSB: boolean,
    setIsLedgerConnectedUSB: (isLedgerConnectedUSB: boolean) => void,
    starknetPublicKey:string[],
    setStarknetPublicKey: (starknetPublicKey: string[]) => void,

}

export const useGlobalContext = create<FrontEndState>()(set => ({
    currentFrontendNetworkIndex: 1,
    setCurrentFrontendNetworkIndex: (currentFrontendNetworkIndex: number) => { set(state => ({ currentFrontendNetworkIndex })) },
    currentAccountID: undefined,
    setCurrentAccountID: (currentAccountID: number) => { set(state => ({ currentAccountID })) },
    isLedgerConnectedUSB: false,
    setIsLedgerConnectedUSB: (isLedgerConnectedUSB: boolean) => { set(state => ({ isLedgerConnectedUSB })) },
    starknetPublicKey: [],
    setStarknetPublicKey: (starknetPublicKey: string[]) => { set(state => ({ starknetPublicKey })) },
}));
