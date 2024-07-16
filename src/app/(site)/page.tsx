"use server";

import Image from 'next/image'
 import styles from './page.module.css'
import { Center } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'

import ledgerNano from "@/public/Images/LedgerTitle.png";
import LowerBanner from './components/client/LowerBanner';
import LedgerWallet from './components/client/LedgerWallet';
import TestClock from './components/client/accounts/TestClock';
import TopBanner from './components/client/TopBanner';

export default async function Page() {

    return (
        <ChakraProvider>
            <div>
                <p className={styles.bgText}>
                    <br></br>
                    Use a Ledger Nano wallet with Starknet.js
                </p>
                <Center>
                    <Image src={ledgerNano } alt='Ledger' priority={true} />
                </Center>
                <div>
                    {/* <DisplayConnected></DisplayConnected> */}

                </div>
                <LedgerWallet></LedgerWallet>
                {/* <TestClock></TestClock> */}
                <TopBanner></TopBanner>
            </div >
        </ChakraProvider>
    )
}


