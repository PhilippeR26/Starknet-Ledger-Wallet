"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link, Text } from "@chakra-ui/react"
import { constants, types, type types as ert } from "starknet";
import SelectNetwork from "./SelectNetwork";
import DisplayAccounts from "./accounts/DisplayAccounts";


export default function LedgerWallet() {


  return (
    <Box bg={"lightblue"} >
      <SelectNetwork></SelectNetwork>
      <Text align={"center"}>
      Connect your Ledger NanoS+ or NanoX<br></br>
    to an USB connector <br></br>
    and select the Starknet App
    </Text>
    <DisplayAccounts></DisplayAccounts>
    </Box>
  )
}