import { accountClass } from "@/utils/constants";
import { CallData, constants, hash, num, stark, transaction, TransactionType, validateAndParseAddress, type Account, type AllowArray, type BigNumberish, type Call, type EstimateFeeAction, type InvocationsSignerDetails, type UniversalDetails, type V2InvocationsSignerDetails, type V3InvocationsSignerDetails, LedgerSigner } from "starknet";
import { ETransactionVersion, ETransactionVersion2, ETransactionVersion3, type ResourceBounds } from "@starknet-io/types-js";
import TransportWebHid from "@ledgerhq/hw-transport-webhid";
import TransportWebBluetooth from "@ledgerhq/hw-transport-web-ble";
import type Transport from "@ledgerhq/hw-transport";


export async function createTransport(): Promise<Transport> {
    const transport = await TransportWebHid.create();
    return transport;
}
export async function createSignerList(myTransport: Transport): Promise<LedgerSigner[]> {
    const signerListTmp: LedgerSigner[] = [];
    for (let id: number = 0; id < 5; id++) {
        signerListTmp.push(new LedgerSigner(myTransport, id));
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


export async function calcHashTransaction(
    transactions: AllowArray<Call>,
    account: Account
): Promise<string> {
    function getPreferredVersion(type12: ETransactionVersion, type3: ETransactionVersion) {
        if (account.transactionVersion === ETransactionVersion.V3) return type3;
        if (account.transactionVersion === ETransactionVersion.V2) return type12;

        return ETransactionVersion.V3;
    }

    async function getUniversalSuggestedFee(
        version: ETransactionVersion,
        { type, payload }: EstimateFeeAction,
        details: UniversalDetails
    ) {
        let maxFee: BigNumberish = 0;
        let resourceBounds: ResourceBounds = stark.estimateFeeToBounds(constants.ZERO);
        if (version === ETransactionVersion.V3) {
            resourceBounds =
                details.resourceBounds ??
                (await account.getSuggestedFee({ type, payload } as any, details)).resourceBounds;
        } else {
            maxFee =
                details.maxFee ??
                (await account.getSuggestedFee({ type, payload } as any, details)).suggestedMaxFee;
        }

        return {
            maxFee,
            resourceBounds,
        };
    }

    const details: UniversalDetails = {};
    const calls = Array.isArray(transactions) ? transactions : [transactions];
    const nonce = num.toBigInt((await account.getNonce()));
    const version = stark.toTransactionVersion(
        getPreferredVersion(ETransactionVersion.V1, ETransactionVersion.V3), // TODO: does this depend on cairo version ?
        details.version
    );

    const estimate = await getUniversalSuggestedFee(
        version,
        { type: TransactionType.INVOKE, payload: transactions },
        {
            ...details,
            version,
        }
    );

    const chainId = await account.getChainId();

    const signerDetails: InvocationsSignerDetails = {
        ...stark.v3Details(details),
        resourceBounds: estimate.resourceBounds,
        walletAddress: account.address,
        nonce,
        maxFee: estimate.maxFee,
        version,
        chainId,
        cairoVersion: await account.getCairoVersion(),
    };



    const compiledCalldata = transaction.getExecuteCalldata(calls, signerDetails.cairoVersion);
    let msgHash;

    // TODO: How to do generic union discriminator for all like this
    if (Object.values(ETransactionVersion2).includes(signerDetails.version as any)) {
        const det = signerDetails as V2InvocationsSignerDetails;
        msgHash = hash.calculateInvokeTransactionHash({
            ...det,
            senderAddress: det.walletAddress,
            compiledCalldata,
            version: det.version,
        });
    } else if (Object.values(ETransactionVersion3).includes(signerDetails.version as any)) {
        const det = details as V3InvocationsSignerDetails;
        msgHash = hash.calculateInvokeTransactionHash({
            ...det,
            senderAddress: det.walletAddress,
            compiledCalldata,
            version: det.version,
            nonceDataAvailabilityMode: stark.intDAM(det.nonceDataAvailabilityMode),
            feeDataAvailabilityMode: stark.intDAM(det.feeDataAvailabilityMode),
        });
    } else {
        throw Error('unsupported signTransaction version');
    }

    return msgHash as string;
}