import { NB_ACCOUNTS } from "@/utils/constants";
import type { LedgerSigner211 } from "starknet";
import { create } from "zustand";
import type Transport from "@ledgerhq/hw-transport";
// 0 = Mainnet
// 1 = Sepolia
// 2 = devnet-rs

interface FrontEndState {
    currentFrontendNetworkIndex: number,
    setCurrentFrontendNetworkIndex: (currentFrontendNetworkIndex: number) => void,
    currentAccountID: number | undefined,
    setCurrentAccountID: (currentAccountID: number) => void,
    isStarknetAppOpen: boolean,
    setIsStarknetAppOpen: (isStarknetAppOpen: boolean) => void,
    starknetPublicKey: string[],
    setStarknetPublicKey: (starknetPublicKey: string[]) => void,
    starknetAddresses: string[],
    setStarknetAddresses: (starknetAddresses: string[]) => void,
    ledgerSigners: LedgerSigner211<any>[] | undefined,
    setLedgerSigners: (ledgerSigner: LedgerSigner211<any>[]) => void,
    transport: Transport | undefined,
    setTransport: (transport: Transport) => void,
}

export const useGlobalContext = create<FrontEndState>()(set => ({
    currentFrontendNetworkIndex: 1,
    setCurrentFrontendNetworkIndex: (currentFrontendNetworkIndex: number) => { set(state => ({ currentFrontendNetworkIndex })) },
    currentAccountID: undefined,
    setCurrentAccountID: (currentAccountID: number) => { set(state => ({ currentAccountID })) },
    isStarknetAppOpen: false,
    setIsStarknetAppOpen: (isStarknetAppOpen: boolean) => { set(state => ({ isStarknetAppOpen })) },
    starknetPublicKey: new Array(NB_ACCOUNTS).fill(""),
    setStarknetPublicKey: (starknetPublicKey: string[]) => { set(state => ({ starknetPublicKey })) },
    starknetAddresses: new Array(NB_ACCOUNTS).fill(""),
    setStarknetAddresses: (starknetAddresses: string[]) => { set(state => ({ starknetAddresses })) },
    ledgerSigners: undefined,
    setLedgerSigners: (ledgerSigners: LedgerSigner211<any>[]) => { set(state => ({ ledgerSigners })) },
    transport: undefined,
    setTransport: (transport: Transport) => { set(state => ({ transport })) },
}));
