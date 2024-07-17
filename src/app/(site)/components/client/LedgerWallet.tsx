"use client";
import { Box, Text } from "@chakra-ui/react"
import SelectNetwork from "./SelectNetwork";
import DisplayAccounts from "./accounts/DisplayAccounts";
import Transfer from "./accounts/Transfer";


export default function LedgerWallet() {


  return (
    <>
      <Box bg={"steelblue"} pb={2}>
        <SelectNetwork></SelectNetwork>
        <Text align={"center"}>
          Connect your Ledger NanoX<br></br>
          with BlueTooth <br></br>
          and select the Starknet App.<br></br>
          Then click on 'Go'
        </Text>
        <DisplayAccounts></DisplayAccounts>
      </Box>
      <Transfer></Transfer>
    </>
  )
}