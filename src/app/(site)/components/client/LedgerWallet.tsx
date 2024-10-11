"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link, Text } from "@chakra-ui/react"
import { constants, types, type types as ert, type LedgerSigner211 } from "starknet";
import SelectNetwork from "./SelectNetwork";
import DisplayAccounts from "./accounts/DisplayAccounts";
import Transfer from "./accounts/Transfer";
import { useEffect } from "react";
import { useGlobalContext } from "./globalContext";
import { createSignerList, createTransport } from "./accounts/calcAccount";
import type Transport from "@ledgerhq/hw-transport";



export default function LedgerWallet() {
  
  return (
    <>
      <Box bg={"steelblue"} pb={2}>
        <SelectNetwork></SelectNetwork>
        <Text align={"center"}>
          Connect your Ledger NanoS+ or NanoX<br></br>
          to an USB connector <br></br>
          and select the Starknet App.<br></br>
          Then click on 'Go'
        </Text>
        <DisplayAccounts></DisplayAccounts>
      </Box>
      <Transfer></Transfer>
    </>
  )
}