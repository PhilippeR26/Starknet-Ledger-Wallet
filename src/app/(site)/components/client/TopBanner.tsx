"use client";
import { SquareArrowOutUpRight } from 'lucide-react';
import { Box, Link } from "@chakra-ui/react"
// import { constants, types, type types as ert  } from "starknet";

// const tt : ert.RPC.RPCSPEC07.ETransactionVersion2 = types.RPC.RPCSPEC07.ETransactionVersion2.F0;

export default function TopBanner() {
  return (
    <Box
      position={"fixed"}
      top="0%"
      width="100%"
      marginBottom="1"
      borderColor="black"
      borderWidth="0px"
      borderRadius="0"
      bg='grey'
      opacity="95%"
      p="2"
      textAlign={'center'}
      fontSize="16"
      fontWeight="extrabold"
      color="black"
    >
      Powered by
      <Link color="blue.700" href='https://starknetjs.com'> Starknet.js v8.5.1<SquareArrowOutUpRight margin-left="2px" /></Link>
      .
      <Link color="blue.700" href='https://github.com/PhilippeR26/Starknet-Ledger-Wallet'> Source code<SquareArrowOutUpRight margin-left="2px" /></Link>
      .
    </Box>
  )
}