"use client";
import { Box, Center, Link, Select, useToast } from "@chakra-ui/react"
import { Account, constants, RpcProvider, types, type CairoAssembly, type CompiledSierra } from "starknet";
import { useGlobalContext } from "./globalContext";
import { useEffect, useState } from "react";
import { accountClass, myFrontendProviders } from "@/utils/constants";
import { DevnetProvider } from "starknet-devnet";
import accountSierra from "../../contracts/openzeppelin_AccountUpgradeable.sierra.json";
import accountCasm from "../../contracts/openzeppelin_AccountUpgradeable.casm.json";

export default function SelectNetwork() {
    const currentNetworkID = useGlobalContext(state => state.currentFrontendNetworkIndex);
    const setCurrentNetworkID = useGlobalContext(state => state.setCurrentFrontendNetworkIndex);
    const [selectedOption, setSelectedOption] = useState<string>("2");
    const toast = useToast();
    const [isDeclare, setIsDeclare] = useState<number>(0);

    const handleSelectChange = (event: any) => {
        const selectedValue = event.target.value;
        console.log("network Id =", selectedValue);
        if (selectedValue !== "") {
            setSelectedOption(selectedValue);
            setCurrentNetworkID(Number(selectedValue));
        }
    };

    async function declareAccount() {
        //const resp= await myFrontendProviders[2].getClassByHash(accountClass);
        console.log("Declare account class in devnet-rs");
        const devnetProvider = new DevnetProvider();
        const myProvider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" });
        const acc = await devnetProvider.getPredeployedAccounts();
        const account0 = new Account(myProvider, acc[0].address, acc[0].private_key);
        const contractSierra = accountSierra as CompiledSierra;
        const contractCasm = accountCasm as CairoAssembly;
        let isDeclared: boolean = false;
        try {
            await myProvider.getClassByHash(accountClass);
            isDeclared = true;
        } catch { }
        if (!isDeclared) {
            setIsDeclare(1);
            const respDecl = await account0.declareIfNot({ contract: contractSierra, casm: contractCasm });
            if (respDecl.transaction_hash) {
                await myProvider.waitForTransaction(respDecl.transaction_hash);
                console.log("Account class declared in devnet-rs at :", respDecl.class_hash)
            }
            setIsDeclare(2);
        }
    }

    useEffect(() => {
        if (currentNetworkID == 2) {

            declareAccount();
        }
    }
        , [currentNetworkID]);

        // only if devnet-rs only :
     useEffect(() => {
        setCurrentNetworkID(2);
            declareAccount();
    }
        , []);

    useEffect(() => {
        if (isDeclare == 1) {
            toast({
                title: "Declare in progress...",
                description: "Do not click Go now.",
                duration: 15_000,
                isClosable: true,
                position: "bottom-right"
            })
        }
        else if (isDeclare == 2) {
            toast({
                title: "Account class declared.",
                description: "You can click on Go when Ledger APP active",
                duration: 10_000,
                isClosable: true,
                position: "bottom-right"
            })
        }
    }, [isDeclare]);

    return (
        <>
            <Center fontSize={"x-large"} mt={2}>
                Select a Starknet network
            </Center>
            <Center>
                <Select
                    colorScheme="blue"
                    onChange={handleSelectChange}
                    value={selectedOption}
                    w={170}
                    mt={1}
                    mb={2}
                    bg={"dodgerblue"}
                >
                    <option value='0' disabled={true}>Mainnet</option>
                    <option value='1' disabled={true}>Sepolia testnet</option>
                    <option value='2'>Devnet-rs</option>
                </Select>
            </Center>

        </>
    )
}