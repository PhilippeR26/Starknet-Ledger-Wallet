import { accountClass } from "@/utils/constants";
import { CallData, hash, validateAndParseAddress } from "starknet";

export function CalcAccountsAddress(pubK: string[]): string[] {
    const addresses = pubK.map((pubK: string) => {
        const constructor = CallData.compile({ pubKey: pubK });
        const addr = validateAndParseAddress(hash.calculateContractAddressFromHash(pubK, accountClass, constructor, 0));
        return addr;
    });
    return addresses;
}