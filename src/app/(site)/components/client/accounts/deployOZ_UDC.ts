// Deploy an OpenZeppelin 0.14.0 account in devnet.
// Coded with Starknet.js v6.11.0 & devnet-rs v0.1.1 & starknet-devnet.js v0.0.4

import { RpcProvider, Account, Contract, ec, json, RawArgs, stark, num, uint256, Calldata, CallData, shortString, constants, hash, type BigNumberish, types, cairo, CairoCustomEnum, CairoOption, CairoOptionVariant, type Call, events, provider, type InvokeFunctionResponse, type InvokeTransactionReceiptResponse, type SuccessfulTransactionReceiptResponse, LedgerSigner211 } from "starknet";
import { DevnetProvider } from "starknet-devnet";
//import { OutsideExecution, OutsideExecutionOptions } from 'starknet';
import accountSierra from "../../../contracts/openzeppelin_AccountUpgradeable.sierra.json";
import * as dotenv from "dotenv";
import { accountClass } from "@/utils/constants";
import type { DeployAccountResp } from "@/type/types";
dotenv.config();

export async function deployAccountOpenzeppelin14(myProvider: RpcProvider,signer:LedgerSigner211<any>):Promise<DeployAccountResp> {
  const devnetProvider = new DevnetProvider();
  const accounts=await devnetProvider.getPredeployedAccounts();
  const account0=new Account(myProvider,accounts[0].address,accounts[0].private_key);
  //
  // *********** Deploy OpenZeppelin 0.14.0 account *************
  //

    // Generate public and private key pair.
    
    const starkKeyPub = await signer.getPubKey();
    console.log('publicKey=', starkKeyPub);
    const contractClassHash=accountClass;
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
        const { transaction_hash: txHDepl }: InvokeFunctionResponse = await account0.execute([myCall]); // you can add other txs here
    
        console.log("TxH =", txHDepl);
        const txR = await myProvider.waitForTransaction(txHDepl);
        let accountAddr: string = "";
        txR.match({
            success: (txR: SuccessfulTransactionReceiptResponse) => {
                console.log('Success =', txR, "\n", txR.events);
                const resDeploy = events.parseUDCEvent(txR as InvokeTransactionReceiptResponse);
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
  console.log('✅ OpenZeppelin 0.14.0 account deployed at',accountAddr
  );
  const OZaccount=new Account(myProvider,accountAddr,signer);

  const result: DeployAccountResp = {
    account: OZaccount,
    address: accountAddr,
    classH: accountClass,
    privateK: "",
    publicK: starkKeyPub,
  }
  return result
}