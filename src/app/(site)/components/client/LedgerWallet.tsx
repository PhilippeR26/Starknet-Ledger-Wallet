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
        <Center>
          Connect your Ledger NanoS+ or NanoX</Center>
        <Center>  to an USB connector</Center>
        <Center>  and select the Starknet App.</Center>
        <Center>  Then click on 'Go'</Center>
        
        <DisplayAccounts></DisplayAccounts>
      </Box>
    </>
  )
}