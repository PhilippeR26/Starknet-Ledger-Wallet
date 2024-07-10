"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { isLedgerConnected } from "./isLedgerConnected";
import { useGlobalContext } from "../globalContext";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";


export default function DisplayAccounts() {
  const isLedgerConnectedUSB = useGlobalContext(state => state.isLedgerConnectedUSB);
  const setIsLedgerConnectedUSB = useGlobalContext(state => state.setIsLedgerConnectedUSB);
  const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined);

   async function isLedgerConnected():Promise<boolean>{
    let isConnected:boolean=false;
    try{
        const transport = await TransportWebHid.create();
        isConnected=true;
        transport.close();
        console.log("Ledger identified as connected.");
    } catch(err:any) {
        console.log("Ledger presence :",err.message);
    }
    return isConnected;
}

  async function LedgerConnected() {
    if (!isLedgerConnectedUSB){
    setIsLedgerConnectedUSB(await isLedgerConnected());
    }
  }

  useEffect( () => {
    LedgerConnected();
    const tim = setInterval(() => {
      LedgerConnected();
      console.log("timerId=", tim);
    }
      , 3000 //ms
    );
    setTimerId(() => tim);

    console.log("startTimer", tim);

    return () => {
      clearInterval(tim);
      console.log("stopTimer", tim)
      setIsLedgerConnectedUSB(false);
    }
  }
    , []);

  return (
    <Box >
      Ledger connected = {isLedgerConnectedUSB?"Yes":"No"}
    </Box>
  )
}