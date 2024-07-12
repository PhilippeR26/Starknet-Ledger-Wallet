"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { isLedgerConnected } from "./isLedgerConnected";
import { useGlobalContext } from "../globalContext";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import { LedgerUSBnodeSigner } from "./classLedgerSigner";
import { NB_ACCOUNTS } from "@/utils/constants";
import { sign } from "crypto";
import { CalcAccountsAddress, signerList } from "./calcAccount";
import { formatAddress, formatBalance, formatBalanceShort } from "@/utils/utils";


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
  //const [hasConnectionFailed, setConnectionFailed] = useState<boolean>(false);
  //const connectedRef = useRef(hasConnectionFailed);
  const [isAPPconnectedLocal, setIsAPPconnectedLocal] = useState<boolean>(false);
  const appOpenedRef = useRef(isAPPconnectedLocal);
  const [appVersion, setAppVersion] = useState<string>(defaultAppVersion);
  const starknetPublicKey = useGlobalContext(state => state.starknetPublicKey);
  const setStarknetPublicKey = useGlobalContext(state => state.setStarknetPublicKey);
  const [isGo, setGo] = useState<boolean>(false);
  const [seekInProgress, setSeek] = useState<boolean>(false);
  const currentNetworkID = useGlobalContext(state => state.currentFrontendNetworkIndex);
  const starknetAddresses = useGlobalContext(state => state.starknetAddresses);
  const setStarknetAddresses = useGlobalContext(state => state.setStarknetAddresses);



  // async function ledgerConnected() {
  //   console.log("connectedRef.current =", connectedRef.current);
  //   if (connectedRef.current == false) {
  //     // console.log("isLedgerConnectedUSB =",isLedgerConnectedUSB);
  //     const isConnected = await isLedgerConnected();
  //     console.log({ isConnected });
  //     //setIsConnectedUSBlocal(res);
  //     connectedRef.current = isConnected
  //     setConnectionFailed(isConnected);
  //   }
  // }

  async function appConnected() {
    try {
      setSeek(true);
      console.log("try read version");
      const transport = await TransportWebHid.create(undefined, 30_000); // 30s timeout
      const resp = await transport.send(Number("0x5a"), 0, 0, 0);
      const appVersion = resp[0] + "." + resp[1] + "." + resp[2];
      transport.close();
      console.log("version=", appVersion);
      setAppVersion(appVersion);
      setIsAPPconnectedLocal(true);
    } catch (err: any) {
      console.log("checkAppConnected :", err.message);
      setSeek(false);
      setIsAPPconnectedLocal(false);
    }
  }
  // }

  // useEffect(() => {
  //   connectedRef.current = isConnectedUSBlocal;
  //   appOpenedRef.current = isAPPconnectedLocal;
  // }); //updated at each refresh

  // useEffect(() => {
  //   ledgerConnected();
  //   const tim = setInterval(() => {
  //     console.log("aaa-", connectedRef.current);
  //     ledgerConnected();
  //     console.log("timerId=", tim);
  //   }
  //     , 5000 //ms
  //   );
  //   console.log("startTimer", tim);

  //   return () => {
  //     clearInterval(tim);
  //     console.log("stopTimer", tim)
  //     setIsConnectedUSBlocal(false);
  //   }
  // }
  //   , []);

  // useEffect(() => {
  //   appConnected();
  // }
  //   , []);

  async function getPubK() {
    let pkList: string[] = [];
    setSeek(true);
    try {
      for (let id: number = 0; id < NB_ACCOUNTS; id++) {
        pkList[id] = await signerList[id].getPubKey();
        console.log("pk", id, "=", pkList[id]);
      }
      setStarknetPublicKey(pkList);
      setStarknetAddresses(CalcAccountsAddress(pkList));
      setSeek(false);
    } catch (err: any) {
      console.log("Error read pubK", err.message);
      setIsAPPconnectedLocal(false);
      //setConnectionFailed(false);
      setSeek(false);
    }
  }

  async function go(){
    setGo(true); 
    await appConnected(); 
    await getPubK()
  }

  // useEffect(() => {
  //   if (isAPPconnectedLocal && (starknetPublicKey[4] == "")) {
  //     getPubK();
  //   }
  // }, [isAPPconnectedLocal]);


  return (
    <Box mt={2}>
      {/* <Center>
        Ledger connected = {hasConnectionFailed ? "Yes" : "No"}
      </Center> */}
      <Center>
        <Button bg={"deepskyblue"} 
        onClick={() => {go()  }}
        mb={2}
        >Go!</Button>
      </Center>

      <Center>
        {isGo && isAPPconnectedLocal && (<>
          Starknet APP connected = {isAPPconnectedLocal ? "Yes" : "No"}. <br></br>
          Starknet embedded APP version = {appVersion}
        </>)}
        {isGo && !seekInProgress && !isAPPconnectedLocal && (<>
          Connection failed! Refresh page & retry...
        </>)}
      </Center>

      {seekInProgress && isGo && (<Center>
        <Spinner color="blue" size="sm" ></Spinner>
      </Center>
      )}
      {isGo && !seekInProgress && isAPPconnectedLocal && (<>
        <Center>
          path : m/2645'/starknet'/LedgerW'/0'/n'/0 <br></br>
        </Center>
        {/* {starknetPublicKey.map((pk: string, idx: number) => {
          return (<>
            Account {idx} : pubK = {pk} <br></br>
          </>)
        })} */}
        <Stack
          spacing={5}
          direction="column"
          mt={4}>
          {starknetAddresses.map((addr: string, idx: number) => {
            return (<Center key={"listAddr" + idx.toString()}>
              Account {idx} : addr = {formatAddress(addr)}{" "}
              {formatBalanceShort(1234567890123456789n, 18, 4)}Eth  {" "}
              {formatBalanceShort(1234567890123456789012n, 18, 2)}Strk
              <br></br>
            </Center>)
          })}
        </Stack>
      </>)}
    </Box>
  )
}