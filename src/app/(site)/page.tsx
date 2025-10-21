"use server";

import Image from 'next/image'
import styles from './page.module.css'
import { Center } from '@chakra-ui/react';

import ledgerNano from "@/public/Images/LedgerTitle.png";
import LedgerWallet from './components/client/LedgerWallet';
import TopBanner from './components/client/TopBanner';

export default async function Page() {

    return (
        <div>
            <TopBanner></TopBanner>
            <p className={styles.bgText}>
                <br></br>
                Use a Ledger Nano wallet with Starknet.js
            </p>
            <Center>
                <Image src={ledgerNano} alt='Ledger' priority={true} />
            </Center>
            <LedgerWallet></LedgerWallet>
        </div >
    )
}


