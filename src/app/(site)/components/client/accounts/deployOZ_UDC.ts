// Deploy an OpenZeppelin 0.14.0 account in devnet.
// Coded with Starknet.js v7.1.0 & devnet v0.4.0 & starknet-devnet.js v0.4.0

import { RpcProvider, Account, ec, stark, Calldata, CallData, constants, hash, type Call, type InvokeFunctionResponse, type InvokeTransactionReceiptResponse, type SuccessfulTransactionReceiptResponse, LedgerSigner231 } from "starknet";
import { DevnetProvider } from "starknet-devnet";
import accountSierra from "../../../contracts/openzeppelin_AccountUpgradeable.sierra.json";
import * as dotenv from "dotenv";
import { accountClass, defaultTip } from "@/utils/constants";
import type { DeployAccountResp } from "@/type/types";
dotenv.config();

export async function deployAccountOpenzeppelin14(myProvider: RpcProvider, signer: LedgerSigner231<any>): Promise<DeployAccountResp> {
    const devnetProvider = new DevnetProvider();
    const accounts = await devnetProvider.getPredeployedAccounts();
    const account0 = new Account({
        provider: myProvider,
        address: accounts[0].address,
        signer: accounts[0].private_key
    });
    //
    // *********** Deploy OpenZeppelin 0.14.0 account *************
    //

    // Generate public and private key pair.

    const starkKeyPub = await signer.getPubKey();
    console.log('publicKey=', starkKeyPub);
    const contractClassHash = accountClass;
    // Calculate future address of the account
    const myCallData = new CallData(accountSierra.abi);
    const constructor: Calldata = myCallData.compile(
        "constructor",
        {
            public_key: starkKeyPub,
        });
    const salt = stark.randomAddress();
    const addressDepl = hash.calculateContractAddressFromHash(ec.starkCurve.pedersen(account0.address, salt), contractClassHash, constructor, constants.UDC.ADDRESS);
    console.log("addressCalculated=", addressDepl);
    const myCall: Call = {

        contractAddress: constants.UDC.ADDRESS,
        entrypoint: constants.UDC.ENTRYPOINT,
        calldata: CallData.compile({
            classHash: contractClassHash,
            salt: salt,
            unique: "1",
            calldata: constructor,
        }),
    };
    console.log("constructor =", constructor);
    console.log("Deploy of account in progress...");
    // *** with account.deployContract()
    // const { transaction_hash: txHDepl, address } = await account0.deployContract({ classHash: contractClassHash, constructorCalldata: constructor });
    // console.log("Address =", address);
    // *** with account.execute()
    const { transaction_hash: txHDepl }: InvokeFunctionResponse = await account0.execute([myCall], { tip: defaultTip }); // you can add other txs here

    console.log("TxH =", txHDepl);
    const txR = await myProvider.waitForTransaction(txHDepl);
    let accountAddr: string = "";
    txR.match({
        SUCCEEDED: (txR: SuccessfulTransactionReceiptResponse) => {
            console.log('Success =', txR, "\n", txR.events);
            const resDeploy = account0.deployer.parseDeployerEvent(txR as InvokeTransactionReceiptResponse);
            console.log(resDeploy);
            accountAddr = resDeploy.address;
            console.log("Account address =", (resDeploy.address));
        },
        _: () => {
            console.log('Unsuccess');
            process.exit(5);
        },
    });
    console.log("✅ Account deployed.");
    console.log('✅ OpenZeppelin 0.14.0 account deployed at', accountAddr
    );
    const OZaccount = new Account({
        provider: myProvider,
        address: accountAddr,
        signer
    });

    const result: DeployAccountResp = {
        account: OZaccount,
        address: accountAddr,
        classH: accountClass,
        privateK: "",
        publicK: starkKeyPub,
    }
    return result
}