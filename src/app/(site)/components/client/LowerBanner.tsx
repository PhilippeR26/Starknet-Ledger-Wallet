"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Link } from "@chakra-ui/react"
// import { constants, types, type types as ert  } from "starknet";

// const tt : ert.RPC.RPCSPEC07.ETransactionVersion2 = types.RPC.RPCSPEC07.ETransactionVersion2.F0;

export default function LowerBanner() {
    return(
        <Box
            position={"fixed"}
            bottom="0%"
            width="100%"
            marginTop="1"
            borderColor="black"
            borderWidth="0px"
            borderRadius="0"
            bg='grey'
            opacity="95%"
            p="2"
            textAlign={'center'}
            fontSize="16"
            fontWeight="extrabold"
            color="grey.800"
            textColor="black"
          >
            Powered by
            <Link color="blue.700" href='https://starknetjs.com' isExternal> Starknet.js v7.2.0<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
            .
            <Link color="blue.700" href='https://github.com/PhilippeR26/Starknet-Ledger-Wallet' isExternal> Source code<ExternalLinkIcon mx='2px'></ExternalLinkIcon></Link>
            .
          </Box>
    )
}