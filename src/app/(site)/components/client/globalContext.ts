import { NB_ACCOUNTS } from "@/utils/constants";
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
    isStarknetAppOpen: boolean,
    setIsStarknetAppOpen: (isStarknetAppOpen: boolean) => void,
    starknetPublicKey:string[],
    setStarknetPublicKey: (starknetPublicKey: string[]) => void,
    starknetAddresses:string[],
    setStarknetAddresses: (starknetAddresses: string[]) => void,

}

export const useGlobalContext = create<FrontEndState>()(set => ({
    currentFrontendNetworkIndex: 1,
    setCurrentFrontendNetworkIndex: (currentFrontendNetworkIndex: number) => { set(state => ({ currentFrontendNetworkIndex })) },
    currentAccountID: undefined,
    setCurrentAccountID: (currentAccountID: number) => { set(state => ({ currentAccountID })) },
    isLedgerConnectedUSB: false,
    setIsLedgerConnectedUSB: (isLedgerConnectedUSB: boolean) => { set(state => ({ isLedgerConnectedUSB })) },
    isStarknetAppOpen: false,
    setIsStarknetAppOpen: (isStarknetAppOpen: boolean) => { set(state => ({ isStarknetAppOpen })) },
    starknetPublicKey: new Array(NB_ACCOUNTS).fill(""),
    setStarknetPublicKey: (starknetPublicKey: string[]) => { set(state => ({ starknetPublicKey })) },
    starknetAddresses: new Array(NB_ACCOUNTS).fill(""),
    setStarknetAddresses: (starknetAddresses: string[]) => { set(state => ({ starknetAddresses })) },
}));
