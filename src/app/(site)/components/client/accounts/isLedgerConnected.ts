import TransportWebHid from "@ledgerhq/hw-transport-webhid";

export async function isLedgerConnected():Promise<boolean>{
    let isConnected:boolean=false;
    try{
        const transport = await TransportWebHid.create();
        isConnected=true;
        await transport.close();
        console.log("Ledger identified as connected.");
    } catch(err:any) {
        console.log("Ledger presence :",err.message);
    }
    return isConnected;
}