// import TransportSource from "@ledgerhq/hw-transport-webhid";
import TransportSource from "@ledgerhq/hw-transport-web-ble";

export async function isLedgerConnected(timeOut:number=2000):Promise<boolean>{
    let isConnected:boolean=false;
    try{
        const transport = await TransportSource.create(undefined,timeOut);
        isConnected=true;
        await transport.close();
        console.log("Ledger identified as connected.");
    } catch(err:any) {
        console.log("Err Ledger presence :",err.message);
    }
    return isConnected;
}