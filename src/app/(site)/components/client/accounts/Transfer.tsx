"use client";

import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Input, Text, Textarea } from "@chakra-ui/react";
import { useGlobalContext } from "../globalContext";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { CallData, num, json, Account, Contract } from "starknet";
import { useEffect, useState } from "react";
import { deployAccountOpenzeppelin14 } from "./deployOZ";
import type { DeployAccountResp } from "@/type/types";
import { addrETH, myFrontendProviders } from "@/utils/constants";
import { DevnetProvider } from "starknet-devnet";
import { signerList } from "./calcAccount";
import { erc20Abi } from "../../../contracts//abis/ERC20abi";
interface FormValues {
  targetAddress: string,
  amount: string
}

export default function Transfer() {
  const currentAccountID = useGlobalContext(state => state.currentAccountID);
  const starknetAddresses = useGlobalContext(state => state.starknetAddresses);
  const [destAddress, setDestAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const currentFrontendNetworkIndex = useGlobalContext(state => state.currentFrontendNetworkIndex);
  const starknetPublicKey = useGlobalContext(state => state.starknetPublicKey);
  const [listDeployed, setListDeployed] = useState<String[]>([]);


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>();

  async function onSubmitResponse(values: FormValues) {
    setDestAddress(values.targetAddress);
    setAmount(values.amount);
  }

  async function deploy0() {
    console.log("deploy0=", currentFrontendNetworkIndex);
    if (currentFrontendNetworkIndex == 2) {
      const myProvider = myFrontendProviders[2];
      const addr = starknetAddresses[currentAccountID!];
      if (!listDeployed.includes(addr)) {
        try {
          console.log("account to deploy at?", addr);
          await myProvider.getClassAt(addr);
        } catch {
          const devnetProvider = new DevnetProvider();
          const acc = await devnetProvider.getPredeployedAccounts();
          //const account0 = new Account(myProvider, acc[0].address, acc[0].private_key);
          console.log("deploy account0 in progress...");
          const resp: DeployAccountResp = await deployAccountOpenzeppelin14(myProvider, signerList[currentAccountID!]);
          setListDeployed([...listDeployed, num.toHex(resp.address)]);
          console.log("deploy account0 ended.");
        }
      }
    }
  }

  async function transferETH() {
    const myProvider = myFrontendProviders[2];
    const myAccount = new Account(myProvider, starknetAddresses[currentAccountID!], signerList[currentAccountID!]);
    const ethContract = new Contract(erc20Abi, addrETH, myAccount);
    const devnetProvider = new DevnetProvider();
    const acc = await devnetProvider.getPredeployedAccounts();
    const myCall = ethContract.populate("transfer",{
      recipient:acc[0].address, 
      amount:1n*10n**14n
    });
    console.log("transfer to sign");
    const resp=await myAccount.execute(myCall);
    console.log("transferred!");
    const txR=await myProvider.waitForTransaction( resp.transaction_hash);
    console.log(txR.value);
  }

  // useEffect(() => {
  //   deploy0()
  // }, [starknetPublicKey])

  return (<>
    {currentAccountID != undefined && (
      <Box bg={"steelblue"} pt={2} pb={2}>
        <Text align={"center"}
          fontSize={"md"}
          fontWeight={"bold"}>
          Account{currentAccountID}: <br></br> {" " + starknetAddresses[currentAccountID] + "  "}
        </Text>
        <Center pb={2}>
          <QRCode
            value={starknetAddresses[currentAccountID]}
            size={150}
            level="M"
          />
        </Center >
        <Center>
          <form onSubmit={handleSubmit(onSubmitResponse)}>
            <FormControl isInvalid={errors.targetAddress as any}>
              <FormLabel htmlFor="encoded"> Destination address :</FormLabel>
              <Input w="100%" minH={50} maxH={500}
                bg="gray.800"
                textColor="blue.200"
                defaultValue={destAddress}
                id="encoded"
                {...register("targetAddress", {
                  required: "This is required",
                })}
              />
              <FormLabel htmlFor="amount0" pt={3}> ETH amount :</FormLabel>
              <Input w="100%" minH={50} maxH={500}
                bg="gray.800"
                textColor="blue.200"
                defaultValue={destAddress}
                id="amount0"
                {...register("amount", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.targetAddress && errors.targetAddress.message}
              </FormErrorMessage>

            </FormControl>
            <Button 
            mt={4} 
            colorScheme="blue" 
            borderWidth={2}
            borderColor={"blue.600"}
            isLoading={isSubmitting} 
            type="submit"
            >
              Build transfer
            </Button>
          </form>
        </Center>
        <Text
          align={"center"}
          fontSize={"x-large"}
          fontWeight={900} >
          You want to transfer 0.0001Eth to 0x321...456,
        </Text>
        <Text align={"center"}>
          generated hash 0x1324514534564567585687456734567435634563456345634213423634574575<br></br>
        </Text>
        <Center>
          <Button onClick={() => { transferETH() }} 
          mt={2}
          colorScheme="green"
          borderWidth={2}
            borderColor={"green.700"}
            >Approve in your Ledger</Button>
        </Center>
        <Center>
          Verify the hash in your Ledger and accept it to proceed.
        </Center>
      </Box>
    )}
  </>)
}