import { ProviderInterface, RpcProvider, constants as SNconstants } from "starknet";

export const addrETH = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const addrSTRK = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export const enum tokenAddr{
    ETH=addrETH,
    STRK=addrSTRK
}
export const myFrontendProviders: RpcProvider[] = [
    new RpcProvider({ nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_7" }),
    // new RpcProvider({ nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7"}),
    new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" }),
    new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" }),
];



// OpenZeppelin 0.14.0. Exists in Mainnet & Sepolia
export const accountClass = "0x4343194a4a6082192502e132d9e7834b5d9bfc7a0c1dd990e95b66f85a66d46";

export const NB_ACCOUNTS = 5;
