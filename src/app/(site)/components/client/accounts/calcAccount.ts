import { accountClass } from "@/utils/constants";
import { CallData, hash, validateAndParseAddress } from "starknet";
import { LedgerUSBnodeSigner } from "./classLedgerSigner";

const signerListTmp: LedgerUSBnodeSigner[] = [];
for (let id: number = 0; id < 5; id++) {
    signerListTmp.push(new LedgerUSBnodeSigner(id));
}
export const signerList: LedgerUSBnodeSigner[] = signerListTmp;

export function CalcAccountsAddress(pubK: string[]): string[] {
    const addresses = pubK.map((pubK: string) => {
        const constructor = CallData.compile({ pubKey: pubK });
        const addr = validateAndParseAddress(hash.calculateContractAddressFromHash(pubK, accountClass, constructor, 0));
        return addr;
    });
    return addresses;
}