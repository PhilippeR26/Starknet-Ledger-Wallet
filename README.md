# Starknet-Ledger-Wallet


<p align="center">
  <img src="./src/public/Images/LedgerTitle.png" />
</p>

<h2 style="text-align: center;"> Demo DAPP to use a Ledger Nano with Starknet</h2>
<br></br>

> [!IMPORTANT]
> **This DAPP has not been audited ; use at your own risks.**

> [!NOTE]
> **Stars are highly appreciated! Thanks in advance.**

## Launch 🚀 : 

### local
Launch a local devnet-rs : https://github.com/0xSpaceShard/starknet-devnet-rs

`npm run dev` then open http://localhost:3000/

### Deployed DAPP
https://starknet-ledger-wallet.vercel.app/

NanoX bluetooth : experimental : https://starknet-ledger-wallet-git-nanox-philipper26s-projects.vercel.app/
(do not work on linux mint)

## Browsers :

| Browser | compatible |
| --- | :---: |
| Firefox | ❌ |
| Chrome | ✅ |
| Brave (*) | ✅ |
| Safari | ❌ |
| Edge | TBD |
| IE | ❌ |

(*) = Needs to deactivate shield.

## Ledger Nano :

| Ledger | compatible |
| --- | :---: |
| Nano S | ❌ |
| Nano S+ | ✅ |
| Nano X | ✅ |

The Starknet APP has to be installed in your Ledger. If not visible in Ledger Live, set its configuration to  `experimental`.

> [!NOTE]
> This DAPP is compatible with the Ledger Starknet APP v2.1.1

This version of DAPP requests to connect the Ledger Nano to an USB connector of your computer.

# Network :

Today, the DAPP is only working with the [devnet-rs](https://github.com/0xSpaceShard/starknet-devnet-rs) network. 

Note that to handle devnet-rs, I am using this lib :  
`"starknet-devnet": "0.2.0",`

To use this lib, some code has to be added in `next.config.ts` :
```typescript
webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false,
    }
    return config;
  }
```