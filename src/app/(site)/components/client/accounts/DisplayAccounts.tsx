"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { isLedgerConnected } from "./isLedgerConnected";
import { useGlobalContext } from "../globalContext";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import { LedgerUSBnodeSigner } from "./classLedgerSigner";

const signer0 = new LedgerUSBnodeSigner(0);

export default function DisplayAccounts() {
  const [isConnectedUSBlocal, setIsConnectedUSBlocal] = useState<boolean>(false);
  const [isAPPconnectedLocal, setIsAPPconnectedLocal] = useState<boolean>(false);
  const [appVersion, setAppVersion] = useState<string>("wait");
  // const isLedgerConnectedUSB = useGlobalContext(state => state.isLedgerConnectedUSB);
  // const setIsLedgerConnectedUSB = useGlobalContext(state => state.setIsLedgerConnectedUSB);
  const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined);


  async function LedgerConnected(isConn:boolean) {
     console.log("isConnectedUSBlocal =",isConnectedUSBlocal, isConn);
    if (isConn == false) {
      // console.log("isLedgerConnectedUSB =",isLedgerConnectedUSB);
      const isConnected = await isLedgerConnected();
      console.log({ isConnected });
      //setIsConnectedUSBlocal(res);
      setIsConnectedUSBlocal(isConnected);
      
    } else{
        try {
          const resAppVersion = await signer0.getAppVersion();
          console.log("version =",{ resAppVersion });
          setAppVersion(resAppVersion);
          setIsAPPconnectedLocal(true);
        } catch (err: any) {
          console.log("isAppOpen :", err.message);
          setIsAPPconnectedLocal(false);
          setIsConnectedUSBlocal(false);
          setAppVersion("TBD")
        }
      
    }

  }

  useEffect(() => {
    LedgerConnected(isConnectedUSBlocal);
    const tim = setInterval(() => {
      console.log("aaa-",{isConnectedUSBlocal});
      LedgerConnected(isConnectedUSBlocal);
      console.log("timerId=", tim);
    }
      , 8000 //ms
    );
    setTimerId(() => tim);

    console.log("startTimer", tim);

    return () => {
      clearInterval(tim);
      console.log("stopTimer", tim)
      setIsConnectedUSBlocal(false);
    }
  }
    , []);

  return (
    <Box >
      <Center>
        Ledger connected = {isConnectedUSBlocal ? "Yes" : "No"}
      </Center>
      <Center>
        Starknet APP connected = {isAPPconnectedLocal ? "Yes" : "No"}. Version = {appVersion}
      </Center>
    </Box>
  )
}