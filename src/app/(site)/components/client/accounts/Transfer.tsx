"use client";

import { Box, Button, Center, Field, Input, Spinner, Text, Textarea } from "@chakra-ui/react";
import { SquareArrowOutUpRight } from 'lucide-react';
import { useGlobalContext } from "../globalContext";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { CallData, num, json, Account, Contract, type Call, type GetTransactionReceiptResponse, type RevertedTransactionReceiptResponse, validateAndParseAddress, type ResourceBoundsBN } from "starknet";
import { useEffect, useRef, useState } from "react";
import { addrETH, defaultTip, myFrontendProviders } from "@/utils/constants";
import { calcHashTransaction, estimateFees } from "./calcAccount";
import { erc20Abi } from "../../../contracts//abis/ERC20abi";
import { formatAddress, wait } from "@/utils/utils";
import Declare from "./Declare";
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
  const [isBuild, setIsBuilt] = useState<boolean>(false);
  const [isTxApproved, setIsTxApproved] = useState<boolean>(false);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [hash, setHash] = useState<string>("");
  const [fees, setFees] = useState<ResourceBoundsBN>();
  const [myCall, setMyCall] = useState<Call>();
  const [txH, setTxH] = useState<string>("");
  const [txR, setTxR] = useState<GetTransactionReceiptResponse | undefined>(undefined);
  const ledgerSigners = useGlobalContext(state => state.ledgerSigners);


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>();

  // Submit transfer button
  async function onSubmitResponse(values: FormValues) {
    setDestAddress(values.targetAddress);
    setAmount(values.amount);
    setIsBuilt(true);
    console.log("calc hash inputs:", values);
    const myCall0 = await buildCall(values.targetAddress
      , values.amount
    );
    setMyCall(myCall0);
    const myAccount = new Account({
      provider: myFrontendProviders[2],
      address: starknetAddresses[currentAccountID!],
      signer: await ledgerSigners![currentAccountID!]
    });
    const myFees: ResourceBoundsBN = await estimateFees(myCall0, myAccount);
    setFees(myFees);
    const msgH = await calcHash(values.targetAddress, values.amount, myFees);
    console.log("pre-calculated tx hash=", msgH);
    setHash(msgH);

  }

  async function buildCall(addr: string, amountETH: string): Promise<Call> {
    const myAccount = new Account({
      provider: myFrontendProviders[2],
      address: starknetAddresses[currentAccountID!],
      signer: await ledgerSigners![currentAccountID!]
    });
    const ethContract = new Contract({
      abi: erc20Abi,
      address: addrETH,
      providerOrAccount: myAccount
    });

    let decimal: string = "";
    if (amountETH.includes(".")) { decimal = "." };
    if (amountETH.includes(",")) { decimal = "," };
    if (decimal == "") {
      setIsBuilt(false);
      throw new Error("Wrong format of amount.");
    }
    const decimalPos = amountETH.indexOf(decimal);
    const left = amountETH.slice(0, decimalPos); console.log({ left });
    const right = amountETH.slice(decimalPos + 1); console.log({ right });
    const posValue = right.search(/[1-9]/);; console.log({ posValue });
    let rightValue: bigint = 0n;
    if (posValue != -1) { rightValue = BigInt(right) * 10n ** (17n - BigInt(posValue)) }
    const qty = BigInt(left) * 10n ** 18n + rightValue;

    const myCall = ethContract.populate("transfer", {
      recipient: addr,
      amount: qty
    });
    console.log("Call=", myCall);
    return myCall
  }

  async function transferETH(addr: string, amountETH: string) {
    setIsTxApproved(true);
    const myProvider = myFrontendProviders[2];
    // const myCall = await buildCall(addr, amountETH);
    console.log("transfer to sign");
    const myAccount = new Account({
      provider: myFrontendProviders[2],
      address: starknetAddresses[currentAccountID!],
      signer: ledgerSigners![currentAccountID!]
    });
    const resp = await myAccount.execute(myCall!, { tip: defaultTip, resourceBounds: fees });
    console.log("transferred!");
    setTxH(resp.transaction_hash);
    const txReceipt = await myProvider.waitForTransaction(resp.transaction_hash);
    setTxR(txReceipt);
    console.log(txReceipt.value);
    await wait(8000);
    setIsTxApproved(false);
    setTxH("");
    setTxR(undefined);
    setIsBuilt(false);

  }

  function scroll() {
    console.log("scroll");
    if (scrollRef.current) {
      console.log("scroll proceed...");
      scrollRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }

  async function calcHash(addr: string, amountETH: string, myFees: ResourceBoundsBN): Promise<string> {
    const myAccount = new Account({
      provider: myFrontendProviders[2],
      address: starknetAddresses[currentAccountID!],
      signer: ledgerSigners![currentAccountID!]

    });
    return calcHashTransaction(await buildCall(addr
      , amountETH
    ), myFees, myAccount);
  }

  function recoverError(txR: GetTransactionReceiptResponse): string {
    let resp: string = "";
    txR.match({

      REVERTED: (txR: RevertedTransactionReceiptResponse) => {
        resp = txR.execution_status + " " + txR.revert_reason
      },
      _: () => { resp = "" },
    })
    return resp;
  }


  useEffect(() => {
    scroll();
  },
    [currentAccountID, isBuild, isTxApproved, txH, txR])

  useEffect(() => {
    scroll();
  },
    [])

  return (<>
    {currentAccountID != undefined && (
      <Box
        bg={"steelblue"}
        pt={2}
        pb={2}
        ref={scrollRef}
      >
        {/* <button // scroll to end of page
          onClick={() => {
            if (messageRef.current != null) { messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" }) }
          }
          }
        >
          Scroll to bottom
        </button> */}
        <Center
          fontSize={"md"}
          fontWeight={"bold"}>
          Account{currentAccountID}:
        </Center>
        <Center
          fontSize={"md"}
          fontWeight={"bold"}>
          {" " + starknetAddresses[currentAccountID] + "  "}
          <SquareArrowOutUpRight
            margin-left='2px'
            onClick={() => { navigator.clipboard.writeText(validateAndParseAddress(starknetAddresses[currentAccountID])) }}
          />
        </Center>
        <Center pb={2}>
          <QRCode
            value={starknetAddresses[currentAccountID]}
            size={150}
            level="M"
          />
        </Center >
        <Center>
          <form onSubmit={handleSubmit(onSubmitResponse)}>
            <Field.Root invalid={errors.targetAddress as any}>
              <Field.Label htmlFor="encoded"> Destination address (0x 64 characters) :</Field.Label>
              <Input w="100%" minH={50} maxH={500}
                bg="gray.800"
                color="blue.200"
                defaultValue={destAddress}
                id="encoded"
                {...register("targetAddress", {
                  required: "This is required. Ex: 0x0123..a2c", pattern: /^(0x)?[0-9a-fA-F]{64}$/
                })}
              />
              <Field.ErrorText color={"darkred"}>
                {errors.targetAddress && errors.targetAddress.message}
                {errors.targetAddress && errors.targetAddress.type == "pattern" && <span>Not a 64 char hex address</span>}
              </Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={errors.amount as any}>
              <Field.Label htmlFor="amount0" pt={3}> ETH amount :</Field.Label>
              <Input w="100%" minH={50} maxH={500}
                bg="gray.800"
                color="blue.200"
                defaultValue={amount}
                id="amount0"
                {...register("amount", {
                  required: "This is required. Ex: 0.001",
                  pattern: /^\d+[\.,]?\d*$/
                })}
              />
              <Field.ErrorText color={"darkred"}>
                {errors.amount && errors.amount.message}
                {errors.amount && errors.amount.type == "pattern" && <span>Not a number</span>}
              </Field.ErrorText>
            </Field.Root>
            <Center>
              <Button
                colorPalette="blue"
                mt={2}
                loading={isSubmitting}
                borderWidth={2}
                borderColor={isValid ? "lightblue" : "red"}
                type="submit"
              >Build transfer</Button>
            </Center>
          </form>
        </Center>
        {isBuild && (<>
          <Text
            textAlign={"center"}
            fontSize={"x-large"}
            fontWeight={900} >
            You want to transfer {amount}Eth to {formatAddress(destAddress)},
          </Text>
          <Text textAlign={"center"}>
            Expected tx hash {hash}
            <br></br>
          </Text>
          <Center>
            <Button onClick={() => { transferETH(destAddress, amount) }}
              mt={2}
              disabled={isTxApproved}
              colorPalette={isTxApproved ? "orange" : "green"}
              borderWidth={2}
              borderColor={"green.700"}
            >
              {isTxApproved ? <>In progress...</> : <>Approve in your Ledger</>}
            </Button>
          </Center>
          {isTxApproved && (<>
            <Center>
              Approve the transaction in your Ledger Nano.
            </Center>
            {!!txH && (<>
              <Box
                bg='green.300'
                color='black'
                borderWidth='1px'
                borderColor='green.800'
                borderRadius='xl'
                p={2} margin={2}>
                <Center>
                  Transaction sent. <br></br>
                </Center>
                <Center>
                  txH= {txH}
                </Center>
                {!!txR ? (<>
                  <Center>
                    Result :
                  </Center>
                  {txR.isSuccess() ? (<>
                    <Center>
                      <Box
                        bg={"green"}
                        color={"black"}
                        // borderWidth='3px'
                        borderColor='green.800'
                        borderRadius='full'
                        fontWeight={"bold"}
                        padding={2}
                      >
                        Accepted in Starknet.
                      </Box>
                    </Center>
                  </>) : (<>
                    <Center>
                      <Box
                        bg={"orange"}
                        color={"darkred"}
                        // borderWidth='4px'
                        borderColor='red'
                        borderRadius='xl'
                        fontWeight={"bold"}
                        padding={2}
                      >
                        Rejected by starknet :
                        {recoverError(txR)}
                      </Box>
                    </Center>
                  </>)}
                </>) : (<>
                  <Center>
                    <Spinner color="blue" size="sm" mr={4} />
                  </Center>
                </>)}
              </Box>
            </>)}
          </>)}
        </>
        )}
        <Center>
          <Declare></Declare>
        </Center>
      </Box >
    )
    }
  </>)
}