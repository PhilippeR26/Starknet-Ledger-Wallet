"use client";
import { Center, Portal, Select, createListCollection } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import { Account, RpcProvider, type CairoAssembly, type CompiledSierra } from "starknet";
import { useGlobalContext } from "./globalContext";
import { useEffect, useState } from "react";
import { accountClass, defaultTip } from "@/utils/constants";
import { DevnetProvider } from "starknet-devnet";
import accountSierra from "../../contracts/openzeppelin_AccountUpgradeable.sierra.json";
import accountCasm from "../../contracts/openzeppelin_AccountUpgradeable.casm.json";

export default function SelectNetwork() {
    const currentNetworkID = useGlobalContext(state => state.currentFrontendNetworkIndex);
    const setCurrentNetworkID = useGlobalContext(state => state.setCurrentFrontendNetworkIndex);
    const [selectedOption, setSelectedOption] = useState<string[]>(["2"]);
    // const toast = useToast();
    const [isDeclare, setIsDeclare] = useState<number>(0);

    const handleSelectChange = (event: any) => {
        const selectedValue = event.target.value;
        console.log("network Id =", selectedValue);
        if (selectedValue !== "") {
            setSelectedOption(selectedValue);
            setCurrentNetworkID(Number(selectedValue));
        }
    };

    const networkList = createListCollection({
        items: [
            { value: '0', label: 'Mainnet' },
            { value: '1', label: 'Sepolia testnet' },
            { value: '2', label: 'Devnet 0.6+' },
        ]
    })

    async function declareAccount() {
        //const resp= await myFrontendProviders[2].getClassByHash(accountClass);
        console.log("Declare account class in devnet");
        const devnetProvider = new DevnetProvider();
        const myProvider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" });
        const acc = await devnetProvider.getPredeployedAccounts();
        const account0 = new Account({ provider: myProvider, address: acc[0].address, signer: acc[0].private_key });
        const contractSierra = accountSierra as CompiledSierra;
        const contractCasm = accountCasm as CairoAssembly;
        let isDeclared: boolean = false;
        try {
            await myProvider.getClassByHash(accountClass);
            isDeclared = true;
            console.log("already declared");
        } catch { }
        if (!isDeclared) {
            setIsDeclare(1);
            console.log("try declare");
            const respDecl = await account0.declareIfNot({
                contract: contractSierra,
                casm: contractCasm
            }, { tip: defaultTip }
            );
            if (respDecl.transaction_hash) {
                await myProvider.waitForTransaction(respDecl.transaction_hash);
                console.log("Account class declared in devnet at :", respDecl.class_hash)
            } else {
                console.log("Not declared");
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

    // only if devnet only :
    useEffect(() => {
        setCurrentNetworkID(2);
        declareAccount();
    }
        , []);

    useEffect(() => {
        if (isDeclare == 1) {
            toaster.create({
                title: "Declare in progress...",
                description: "Do not click Go now.",
                duration: 15_000,
                closable: true,
            })
        }
        else if (isDeclare == 2) {
            toaster.create({
                title: "Account class declared.",
                description: "You can click on Go when Ledger APP active",
                duration: 10_000,
                closable: true,
            })
        }
    }, [isDeclare]);

    return (
        <>
            <Toaster />
            <Center fontSize={"x-large"} mt={2}>
                Select a Starknet network
            </Center>
            <Center>
                <Select.Root
                    collection={networkList}
                    onValueChange={handleSelectChange}
                    value={selectedOption}
                    w={170}
                    mt={1}
                    mb={2}
                    size={"lg"}
                    bg={"dodgerblue"}
                    borderStyle={"unset"}
                    borderWidth={4}
                    borderColor={"dodgerblue"}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select framework" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {networkList.items.map((network) => (
                                    <Select.Item
                                        aria-disabled={network.value == "2" ? false : true}
                                        item={network}
                                        key={network.value}
                                    >
                                        {network.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Center>

        </>
    )
}