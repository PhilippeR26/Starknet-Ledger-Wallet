"use client";

import { useStoreWallet } from './walletContext';
import { Button } from "@chakra-ui/react";
import SelectWallet from './SelectWallet';

export default function ConnectWallet() {
    const setSelectWalletUI = useStoreWallet(state => state.setSelectWalletUI);
    const displaySelectWalletUI = useStoreWallet(state => state.displaySelectWalletUI);

    return (
        <>
            <Button
                ml="4"
                textDecoration="none !important"
                outline="none !important"
                boxShadow="none !important"
                onClick={() => setSelectWalletUI(true)}
            >
                Connect Wallet
            </Button>
            {displaySelectWalletUI && <SelectWallet></SelectWallet>}
        </>
    )
}
