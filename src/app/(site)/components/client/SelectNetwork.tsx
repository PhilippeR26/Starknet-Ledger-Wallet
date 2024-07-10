"use client";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Center, Link, Select } from "@chakra-ui/react"
import { constants, types, type types as ert } from "starknet";
import { useGlobalContext } from "./globalContext";
import { useState } from "react";


export default function SelectNetwork() {
    const currentNetworkID = useGlobalContext(state => state.currentFrontendNetworkIndex);
    const setCurrentNetworkID = useGlobalContext(state => state.setCurrentFrontendNetworkIndex);
    const [selectedOption, setSelectedOption] = useState<string>("1"); //Sepolia


    const handleSelectChange = (event: any) => {
        const selectedValue = event.target.value;
        console.log("network Id =", selectedValue);
        if (selectedValue !== "") {
            setSelectedOption(selectedValue);
            setCurrentNetworkID(Number(selectedValue));
        }
    };

    return (
        <Center>
            <Select
                onChange={handleSelectChange}
                value={selectedOption}
                w={170}
                mt={3}
                mb={2}
                bg={"dodgerblue"}
            >
                <option value='0'>Mainnet</option>
                <option value='1'>Sepolia testnet</option>
                <option value='2'>Devnet-rs</option>
            </Select>
        </Center>
    )
}