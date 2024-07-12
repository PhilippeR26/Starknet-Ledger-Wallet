export function formatAddress(addr:string):string{
    const res:string=addr.slice(0, 7)+"..."+addr.slice(-4);
    return res;
}

export function formatBalance(qty: bigint, decimals: number): string {
    const balance = String("0").repeat(decimals) + qty.toString();
    const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, '$1');
    const leftCleaned = BigInt(balance.slice(0, balance.length - decimals)).toString();
    return leftCleaned + "." + rightCleaned;
}

export function formatBalanceShort(qty: bigint, decimals: number,decimalVisible:number): string {
    const balance = String("0").repeat(decimals) + qty.toString();
    console.log({balance});
    const rightCleaned = balance.slice(-decimals).slice(0,decimalVisible);
    const leftCleaned = BigInt(balance.slice(0, balance.length - decimals)).toString();
    return leftCleaned + "." + rightCleaned;
}