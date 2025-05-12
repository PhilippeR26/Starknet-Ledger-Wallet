"use client";
import { Box, Button, Center, Radio, RadioGroup, Spinner, Stack, Text, useToast } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../globalContext";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import { NB_ACCOUNTS, addrETH, myFrontendProviders, tokenAddr } from "@/utils/constants";
import { CalcAccountsAddress, createSignerList, createTransport } from "./calcAccount";
import { formatAddress, formatBalance, formatBalanceShort } from "@/utils/utils";
import type { DeployAccountResp } from "@/type/types";
import { deployAccountOpenzeppelin14 } from "./deployOZ";
import GetBalance from "../Contract/GetBalance";
import { erc20Abi } from "@/app/(site)/contracts/abis/ERC20abi";
import { Contract, validateAndParseAddress, type LedgerSigner231 } from "starknet";
import GetBalanceSimple from "../Contract/GetBalanceSimple";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import type Transport from "@ledgerhq/hw-transport";




export default function DisplayAccounts() {
  const defaultAppVersion = "---";
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
  const setCurrentAccountID = useGlobalContext(state => state.setCurrentAccountID);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isDeployed, setIsDeployed] = useState<boolean[]>(new Array(5).fill(false));
  const [isDeployProcessing, SetIsDeployProcessing] = useState<number>(1000);
  const currentFrontendNetworkIndex = useGlobalContext(state => state.currentFrontendNetworkIndex);
  const [deployInProgress, setDeployInProgress] = useState<number>(0);
  const toast = useToast();
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const ledgerSigners = useGlobalContext(state => state.ledgerSigners);
  const setLedgerSigners = useGlobalContext(state => state.setLedgerSigners);
  const setTransport = useGlobalContext(state => state.setTransport);


  async function appConnected() {
    try {
      setSeek(true);
      const myTransport: Transport = await createTransport();
      setTransport(myTransport);
      console.log("transport initialized", myTransport);
      console.log("try init signers");
      const mySignersList: LedgerSigner231<any>[] = await createSignerList(myTransport);
      setLedgerSigners(mySignersList);
      console.log("signers initialized");
      console.log("try read version");
      const resp = await myTransport.send(Number("0x5a"), 0, 0, 0);
      const appVersion = resp[0] + "." + resp[1] + "." + resp[2];
      console.log("version=", appVersion);
      setAppVersion(appVersion);
      setIsAPPconnectedLocal(true);
      let pkList: string[] = [];
      for (let id: number = 0; id < NB_ACCOUNTS; id++) {
        pkList[id] = await mySignersList[id].getPubKey();
        console.log("pubK", id, "=", pkList[id]);
      }
      setStarknetPublicKey(pkList);
      const addresses = CalcAccountsAddress(pkList);
      setStarknetAddresses(addresses);
      setSeek(false);
      await AreDeployed(addresses);
    } catch (err: any) {
      console.log("checkAppConnected :", err.message);
      setSeek(false);
      setIsAPPconnectedLocal(false);
    }


  }

  async function AreDeployed(addresses: string[]) {
    const res = await Promise.all(
      addresses.map(async (addr: string, idx: number): Promise<boolean> => {
        try {
          await myFrontendProviders[currentNetworkID].getClassAt(addr);
          console.log("isDeployed", idx, "true", addr);
          return true;
        } catch {
          console.log("isDeployed", idx, "false", addr);
          return false
        }
      }
      )
    );
    console.log("are deployed", res);
    setIsDeployed(res);

  }

  async function go() {
    setGo(true);
    await appConnected();
  }

  async function deployAccount(id: number) {
    if (currentFrontendNetworkIndex == 2) {
      console.log("deploy start=", id);
      SetIsDeployProcessing(id);
      setDeployInProgress(1);
      const myProvider = myFrontendProviders[2];
      const addr = starknetAddresses[id!];
      const resp: DeployAccountResp = await deployAccountOpenzeppelin14(myProvider, ledgerSigners![id]);
      setIsDeployed(isDeployed.map(
        (val: boolean, idx: number) => {
          if (idx == id) { return true } else { return val }
        }
      ));
      console.log("deploy account ended.");
      setDeployInProgress(2);
      SetIsDeployProcessing(1000);
    }
  }

  useEffect(() => {
    if (selectedAccount !== "") setCurrentAccountID(Number(selectedAccount));
  }
    , [selectedAccount]
  );

  useEffect(() => {
    if (deployInProgress == 1) {
      toast({
        title: "Deployment in progress...",
        description: "Sign on Ledger and wait.",
        duration: 15_000,
        isClosable: true,
        position: "bottom-right"
      })
    }
    else if (deployInProgress == 2) {
      toast({
        title: "Account deployed...",
        duration: 10_000,
        isClosable: true,
        position: "bottom-right"
      })
    }
  }, [deployInProgress]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  },
    [seekInProgress])

  return (
    <Box
      mt={2}
      ref={scrollRef}
    >
      <Center>
        <Button bg={"blue.200"}
          onClick={() => { go() }}
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

        <Center>
          <RadioGroup
            mt={1}
            borderColor={"black"}
            borderWidth={2}
            borderRadius={6}
            defaultValue='1'
            p={2}
            onChange={(id: string) => { if (isDeployed[Number(id)]) setSelectedAccount(id) }}
            value={selectedAccount}>
            <Stack
              spacing={1}
              direction="column"
            >
              {starknetAddresses.map((addr: string, idx: number) => {
                return (<Radio
                  colorScheme='pink'
                  value={idx.toString()}
                  key={"listAcc" + idx.toString()}
                  disabled={isDeployed[idx] ? false : true}
                >
                  Account {idx} : {formatAddress(addr)}<ExternalLinkIcon
                    mx='2px'
                    onClick={() => { navigator.clipboard.writeText(validateAndParseAddress(addr)) }}
                  ></ExternalLinkIcon>{" "}
                  {!isDeployed[idx] ? (
                    <>
                      <Button
                        colorScheme='blue'
                        onClick={() => { deployAccount(idx) }}
                      >Deploy</Button>
                      {isDeployProcessing == idx && (
                        <>
                          <Spinner color="blue" size="sm" ></Spinner>
                          Sign on Ledger
                        </>)}
                    </>
                  ) : (
                    <>
                      <GetBalanceSimple
                        token={tokenAddr.ETH}
                        accountAddr={starknetAddresses[idx]}>
                      </GetBalanceSimple> {" "}
                      <GetBalanceSimple
                        token={tokenAddr.STRK}
                        accountAddr={starknetAddresses[idx]}>
                      </GetBalanceSimple>

                    </>
                  )
                  }
                  <br></br>
                </Radio>)
              })}
            </Stack>
          </RadioGroup>
        </Center>
      </>)}
    </Box>
  )
}