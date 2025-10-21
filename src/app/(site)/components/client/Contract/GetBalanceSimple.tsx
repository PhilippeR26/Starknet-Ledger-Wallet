"use client";

import { useEffect, useState } from 'react';
import { Contract } from "starknet";


import { Spinner, } from "@chakra-ui/react";

import { erc20Abi } from "../../../contracts/abis/ERC20abi"
import { useFrontendProvider } from '../provider/providerContext';
import { myFrontendProviders, tokenAddr } from '@/utils/constants';
import { formatBalanceShort } from '@/utils/utils';
;

type Props = { token: string, accountAddr: string };

export default function GetBalanceSimple({ token, accountAddr }: Props) {
  // only for ETH & STRK 

  // block context
  // const blockFromContext = useStoreBlock(state => state.dataBlock);
  // const accountAddress = useStoreWallet((state) => state.address);

  const [balance, setBalance] = useState<string | undefined>(undefined);
  const decimals = 18;
  const symbol = token == tokenAddr.ETH ? "Eth" : "Strk";

  const myProviderIndex = useFrontendProvider(state => state.currentFrontendProviderIndex);
  const myProvider = myFrontendProviders[myProviderIndex];
  const contract = new Contract({
    abi: erc20Abi,
    address: token,
    providerOrAccount: myProvider
  });



  useEffect(() => {
    contract.balanceOf(accountAddr)
      .then((resp: bigint) => {
        console.log("res=", resp);
        const bal = formatBalanceShort(resp, decimals, token == tokenAddr.ETH ? 5 : 2);
        setBalance(bal);
      }
      )
      .catch((e: any) => { console.log("error balanceOf=", e) });
  }
    , []);

  return (
    <>
      {
        typeof balance == "undefined" ? (
          <Spinner color="blue" size="sm" mr={4} />
        ) : (
          <>
            {balance}{symbol}
          </>
        )
      }
    </>
  )
}