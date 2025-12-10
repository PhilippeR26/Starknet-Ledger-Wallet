"use client";
import { SquareArrowOutUpRight } from 'lucide-react';
import { Box, Link } from "@chakra-ui/react"

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
      <Link color="blue.700" href='https://starknetjs.com'> Starknet.js v9.1.0<SquareArrowOutUpRight margin-left="2px" /></Link>
      .
      <Link color="blue.700" href='https://github.com/PhilippeR26/Starknet-Ledger-Wallet'> Source code<SquareArrowOutUpRight margin-left="2px" /></Link>
      .
    </Box>
  )
}