import { accountClass, defaultTip, NB_ACCOUNTS } from "@/utils/constants";
import { CallData, hash, num, stark, transaction,  validateAndParseAddress, type Account, type AllowArray, type BigNumberish, type Call,  LedgerSigner231, type UniversalDetails, type ResourceBoundsBN, } from "starknet";
import { ETransactionVersion3 } from "@starknet-io/types-js";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import type Transport from "@ledgerhq/hw-transport";


export async function createTransport(): Promise<Transport> {
    const transport = await TransportWebHid.create();
    return transport;
}
export async function createSignerList(myTransport: Transport): Promise<LedgerSigner231<any>[]> {
    const signerListTmp: LedgerSigner231<any>[] = [];
    for (let id: number = 0; id < NB_ACCOUNTS; id++) {
        signerListTmp.push(new LedgerSigner231(myTransport, id));
    }
    return signerListTmp;
}

export function CalcAccountsAddress(pubK: string[]): string[] {
    const addresses = pubK.map((pubK: string) => {
        const constructor = CallData.compile({ pubKey: pubK });
        const addr = validateAndParseAddress(hash.calculateContractAddressFromHash(pubK, accountClass, constructor, 0));
        return addr;
    });
    return addresses;
}

export async function estimateFees(call: Call, account: Account): Promise<ResourceBoundsBN> {
    const estimate = await account.estimateInvokeFee(call, { tip: defaultTip });
    return estimate.resourceBounds
}

// precalculate a transaction hash, using the Call, resourceBoundsBN (from estimateInvokeFee), and using defaultTip constant.
export async function calcHashTransaction(
    calls: AllowArray<Call>,
    myFees: ResourceBoundsBN,
    account: Account
): Promise<string> {
    const transactions: Call[] = Array.isArray(calls) ? calls : [calls];
    console.log("in calcHashTransaction function...");
    // ====== from account.execute
    async function resolveDetailsWithTip(
        details: UniversalDetails
    ): Promise<UniversalDetails & { tip: BigNumberish }> {
        return {
            ...details,
            tip: details.tip ?? (await account.getEstimateTip())[account.defaultTipType],
        };
    }

    function resolveTransactionVersion(providedVersion?: BigNumberish) {
        return stark.toTransactionVersion(
            account.transactionVersion || ETransactionVersion3.V3,
            providedVersion
        );
    }

    const detailsWithTip: UniversalDetails & {
        tip: BigNumberish;
    } = await resolveDetailsWithTip({ tip: defaultTip, resourceBounds: myFees });
    const resourceBounds = myFees;

    // ======= from account.accountInvocationsFactory
    const details2 = {
        ...stark.v3Details(detailsWithTip),
        resourceBounds,
        versions: [resolveTransactionVersion()],
        nonce: undefined,
        skipValidate: false,
    };
    const { nonce, skipValidate = true } = details2;
    const safeNonce = num.toBigInt(nonce ?? (await account.getNonce()));
    const chainId = await account.getChainId();
    const versions = details2.versions.map((it) => stark.toTransactionVersion(it));
    const cairoVersion = await account.getCairoVersion();
    const signerDetails = {
        ...stark.v3Details(details2),
        walletAddress: account.address,
        nonce: safeNonce,
        chainId,
        cairoVersion,
        version: versions[0],
        skipValidate,
    };
    // ====== from account.buildInvocation
    const calldata = transaction.getExecuteCalldata(transactions, await account.getCairoVersion());
    const msgHash = hash.calculateInvokeTransactionHash({
        ...signerDetails,
        senderAddress: signerDetails.walletAddress,
        compiledCalldata: calldata,
        version: signerDetails.version,
        nonceDataAvailabilityMode: stark.intDAM(signerDetails.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: stark.intDAM(signerDetails.feeDataAvailabilityMode),
    });
    return msgHash as string;
}