import type { Account, BigNumberish } from "starknet"

export type DeployAccountResp = {
    account: Account,
    address: BigNumberish,
    classH: BigNumberish,
    privateK: BigNumberish,
    publicK: BigNumberish,
}


