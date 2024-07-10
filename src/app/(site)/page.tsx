"use server";

import Image from 'next/image'
 import styles from './page.module.css'
import { Center } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'

import ledgerNano from "@/public/Images/LedgerTitle.png";
import { DisplayConnected } from './components/client/DisplayConnected';
import LowerBanner from './components/client/LowerBanner';
import LedgerWallet from './components/client/LedgerWallet';

export default async function Page() {

    return (
        <ChakraProvider>
            <div>
                <p className={styles.bgText}>
                    Use a Ledger Nano wallet with Starknet
                </p>
                <Center>
                    <Image src={ledgerNano } alt='Ledger'  />
                </Center>
                <p  className={styles.bgText}>
                    Select a Starknet network
                </p>
                <div>
                    {/* <DisplayConnected></DisplayConnected> */}

                </div>
                <LedgerWallet></LedgerWallet>
            </div >
        </ChakraProvider>
    )
}


