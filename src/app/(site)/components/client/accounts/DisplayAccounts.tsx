"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Link, Spinner, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { isLedgerConnected } from "./isLedgerConnected";
import { useGlobalContext } from "../globalContext";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import { LedgerUSBnodeSigner } from "./classLedgerSigner";
import { NB_ACCOUNTS } from "@/utils/constants";
import { sign } from "crypto";


const signerList: LedgerUSBnodeSigner[] = [];
for (let id: number = 0; id < 5; id++) {
  signerList.push(new LedgerUSBnodeSigner(id));
}

// type reducerConnectType={type:string,payload:string}
// const reducerConnect = async (isConnected: boolean, action: string) => {
//   switch (action) {
//     case "Try": {
//       let tryConnect:boolean=isConnected;
//       if (isConnected == false) {
//         console.log("reducerConnect before =", isConnected);
//         tryConnect = await isLedgerConnected();
//         console.log("reducerConnect after =", tryConnect);
//       }
//       return tryConnect;
//     }
//     default:
//       return isConnected;
//   }
// }


export default function DisplayAccounts() {
  const defaultAppVersion = "---";
  //const [status0, setStatus0] = useState<boolean>(false);
  const [isConnectedUSBlocal, setIsConnectedUSBlocal] = useState<boolean>(false);
  const connectedRef = useRef(isConnectedUSBlocal);
  const [isAPPconnectedLocal, setIsAPPconnectedLocal] = useState<boolean>(false);
  const appOpenedRef = useRef(isAPPconnectedLocal);
  const [appVersion, setAppVersion] = useState<string>(defaultAppVersion);
  const starknetPublicKey = useGlobalContext(state => state.starknetPublicKey);
  const setStarknetPublicKey = useGlobalContext(state => state.setStarknetPublicKey);
  const [seekInProgress,setSeek]=useState<boolean>(false);
  


  async function ledgerConnected() {
    console.log("connectedRef.current =", connectedRef.current);
    if (connectedRef.current == false) {
      // console.log("isLedgerConnectedUSB =",isLedgerConnectedUSB);
      const isConnected = await isLedgerConnected();
      console.log({ isConnected });
      //setIsConnectedUSBlocal(res);
      connectedRef.current = isConnected
      setIsConnectedUSBlocal(isConnected);
    }
  }

  async function appConnected() {
    //console.log("connectedRef.current =", connectedRef.current);
    if (appOpenedRef.current == false && connectedRef.current) {

      try {
        console.log("try read version");
        const transport = await TransportWebHid.create(undefined, 2000);
        const resp = await transport.send(Number("0x5a"), 0, 0, 0);
        const appVersion = resp[0] + "." + resp[1] + "." + resp[2];
        transport.close();
        setAppVersion(appVersion);
        setIsAPPconnectedLocal(true);
      } catch (err: any) {
        console.log("checkAppConnected :", err.message);
        setIsAPPconnectedLocal(false);
        setIsConnectedUSBlocal(false);
      }
    }
  }

  useEffect(() => {
    connectedRef.current = isConnectedUSBlocal;
    appOpenedRef.current = isAPPconnectedLocal;
  }); //updated at each refresh

  useEffect(() => {
    ledgerConnected();
    const tim = setInterval(() => {
      console.log("aaa-", connectedRef.current);
      ledgerConnected();
      console.log("timerId=", tim);
    }
      , 5000 //ms
    );
    console.log("startTimer", tim);

    return () => {
      clearInterval(tim);
      console.log("stopTimer", tim)
      setIsConnectedUSBlocal(false);
    }
  }
    , []);

  useEffect(() => {
    appConnected();
    const tim2 = setInterval(() => {
      console.log("bbb-", appOpenedRef.current);
      appConnected();
      console.log("timer2Id=", tim2);
    }
      , 5000 //ms
    );
    console.log("startTimer2", tim2);

    return () => {
      clearInterval(tim2);
      console.log("stopTimer2", tim2)
      setIsAPPconnectedLocal(false);
    }
  }
    , []);

  async function getPubK() {
    let pkList: string[] = [];
    setSeek(true);
    try {
      for (let id: number = 0; id < NB_ACCOUNTS; id++) {
        pkList[id] = await signerList[id].getPubKey();
        console.log("pk",id,"=",pkList[id]);
      }
      setStarknetPublicKey(pkList);
      setSeek(false);
    } catch (err: any) {
      console.log("Read pubK", err.message);
      setIsAPPconnectedLocal(false);
      setIsConnectedUSBlocal(false);
      setSeek(false);
    }
  }


  useEffect(() => {
    if (isAPPconnectedLocal && (starknetPublicKey[4]=="")) {
      getPubK();
    }
  }
    , [isAPPconnectedLocal])

  return (
    <Box >
      <Center>
        Ledger connected = {isConnectedUSBlocal ? "Yes" : "No"}
      </Center>
      <Center>
        Starknet APP connected = {isAPPconnectedLocal ? "Yes" : "No"}. Version = {appVersion}
      </Center>
      {seekInProgress?(<>
        <Spinner color="blue" size="sm" ></Spinner>
      </>
      ):(<>
      {starknetPublicKey.map((pk:string,idx:number)=>{return (<>
        Account {idx} : pubK = {pk} <br></br>
      </>)})}
      </>)}
    </Box>
  )
}