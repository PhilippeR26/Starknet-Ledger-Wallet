import { Button, Center, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import contractSierra from "../../../contracts/counter.sierra.json";
import contractCasm from "../../../contracts/counter.casm.json";
import { useGlobalContext } from "../globalContext";
import { myFrontendProviders } from "@/utils/constants";
import { Account, hash } from "starknet";

export default function Declare() {
    const [declareStatus, setDeclareStatus] = useState<boolean>(false);
    const currentAccountID = useGlobalContext(state => state.currentAccountID);
    const starknetAddresses = useGlobalContext(state => state.starknetAddresses);
    const currentFrontendNetworkIndex = useGlobalContext(state => state.currentFrontendNetworkIndex);
    const toast = useToast();
    const scrollRef = useRef<null | HTMLDivElement>(null);
    const ledgerSigners = useGlobalContext(state => state.ledgerSigners);



    async function declareClass() {
        const myProvider = myFrontendProviders[currentFrontendNetworkIndex];
        const myAccount = new Account({ 
            provider: myFrontendProviders[2], 
            address: starknetAddresses[currentAccountID!], 
            signer: ledgerSigners![currentAccountID!] 
        });
        const contractHash = hash.computeContractClassHash(contractSierra); console.log({ contractHash });

        try {
            await myProvider.getClassByHash(contractHash);
            console.log("already declared");

            toast({
                title: "Error.",
                description: "Already declared.",
                duration: 10_000,
                isClosable: true,
                position: "bottom-right"
            });
        } catch {
            toast({
                title: "Declare in progress...",
                description: "Approve in the Ledger and wait",
                duration: 10_000,
                isClosable: true,
                position: "bottom-right"
            });
            console.log("try declare");
            const respDecl = await myAccount.declareIfNot({ contract: contractSierra, casm: contractCasm });
            if (respDecl.transaction_hash) {
                await myProvider.waitForTransaction(respDecl.transaction_hash);
                console.log("contract class declared in devnet at :", respDecl.class_hash)
            }
            toast({
                title: "Declare ended...",
                description: "Success",
                duration: 10_000,
                isClosable: true,
                position: "bottom-right"
            });
            setDeclareStatus(true);
        }
    }

    function scroll() {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                })
        }
    }

    useEffect(() => {
        scroll();
    },
        [declareStatus])

    return (
        <div ref={scrollRef}>
            <Center>
                <Button
                    mt={5}
                    colorScheme="orange"
                    onClick={() => { declareClass() }}
                >
                    Test Declare
                </Button>
            </Center>
            {declareStatus && (<>
                <Center
                    mt={1}
                    color="lightgreen"
                    fontSize={20}
                    fontWeight={"bold"}
                >
                    Declare performed.
                </Center>
            </>)}
        </div>
    )
}