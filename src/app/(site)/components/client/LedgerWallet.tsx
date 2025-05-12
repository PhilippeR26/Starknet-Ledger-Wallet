"use client";
import { Box, Center, Link, Text } from "@chakra-ui/react"
import SelectNetwork from "./SelectNetwork";
import DisplayAccounts from "./accounts/DisplayAccounts";
import Transfer from "./accounts/Transfer";



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