// Deploy an OpenZeppelin 0.14.0 account in devnet.
// Coded with Starknet.js v7.2.0 & devnet v0.4.0 & starknet-devnet.js v0.4.0

import { RpcProvider, Account,  CallData, hash, LedgerSigner231 } from "starknet";
import { DevnetProvider } from "starknet-devnet";
import * as dotenv from "dotenv";
import { accountClass } from "@/utils/constants";
import type { DeployAccountResp } from "@/type/types";
dotenv.config();

export async function deployAccountOpenzeppelin14(
  myProvider: RpcProvider,
  signer: LedgerSigner231<any>
): Promise<DeployAccountResp> {
  const l2DevnetProvider = new DevnetProvider({ timeout: 40_000 });

  //
  // *********** Deploy OpenZeppelin 0.14.0 account *************
  //

  // Generate public and private key pair.

  const starkKeyPub = await signer.getPubKey();
  console.log('publicKey=', starkKeyPub);
  // Calculate future address of the account
  const OZaccountConstructorCallData = CallData.compile({ publicKey: starkKeyPub });
  const OZcontractAddress = hash.calculateContractAddressFromHash(starkKeyPub, accountClass, OZaccountConstructorCallData, 0);
  console.log('Precalculated account address=', OZcontractAddress);

  // fund account address before account creation
  await l2DevnetProvider.mint(OZcontractAddress, 10n * 10n ** 18n, "WEI");
  await l2DevnetProvider.mint(OZcontractAddress, 10n * 10n ** 18n, "FRI");
  // deploy account
  const OZaccount = new Account(myProvider, OZcontractAddress, signer);
  console.log("deploy account in progress...");
  const { transaction_hash, contract_address } = await OZaccount.deployAccount({
    classHash: accountClass,
    constructorCalldata: OZaccountConstructorCallData,
    addressSalt: starkKeyPub,
    contractAddress: OZcontractAddress
  });
  await myProvider.waitForTransaction(transaction_hash);
  console.log('✅ OpenZeppelin 0.14.0 account deployed at', contract_address);

  const result: DeployAccountResp = {
    account: OZaccount,
    address: OZcontractAddress,
    classH: accountClass,
    privateK: "",
    publicK: starkKeyPub,
  }
  return result
}