---
title: MetaMask Snap
hide_title: false
---

Snap lets you use MetaMask to quickly set up a Vega keypair for trading and to otherwise interact with the network, no Vega Wallet software required. Snaps are a MetaMask feature for connecting with non-Ethereum protocols like Vega.

## Set up a Snap for Vega
The easiest way to set up Snap is with [Vega Console](https://console.vega.xyz) or the Vega [governance dApp](https://governance.vega.xyz).

When you start using Snap, you'll be creating a new Vega key, so if you have assets or VEGA tokens on an existing key, you'll need to transfer them to the new key to use them.

1. Open the 'Connect' dialog in Vega Console or the governance dApp. 
2. If you have a version of MetaMask that supports Snaps, you'll see a button labelled `Install Vega MetaMask Snap`.
3. Snap will create a new Vega keypair, and you'll immediately be able to deposit or transfer assets and use your new key.

## Snap features
What can you do with a Snap for Vega?

If you're already a MetaMask user, you won't need to create a Vega Wallet.

With Snap, you can:
- Derive Vega cryptographic keys that can be used on the Vega network
- Receive in-depth information of transactions you've initiated in the Vega dApp 
- Approve transactions that will then be signed and sent to the network, or reject them
- Automatically connect to the Vega network you're using

## Limitations
Snap cannot:
- Connect to an existing Vega Wallet or keypair, you'll need to start with a new keypair
- Cannot show your Vega assets or their balances in MetaMask
  - To see your balances, rewards, or deposit, withdraw or transfer assets between keys, you'll need to interact with Console or the governance dApp
- Rename, import, or export keys
- Show a list of previous transactions

## Troubleshooting

### Can't see assets I've previously deposited
If this is your first time using Snap with Vega, but you have previously deposited assets on a different Vega key, you'll need to transfer your assets to the new keys created by your Snap instance, or deposit new assets. You can copy your Vega snap public key from within Vega Console.

### Recover my Snap-created Vega keys
The Vega keys created with Snap are derived from the MetaMask seed. You'll need to use your MetaMask recovery phrase to recover those Vega keys, and any assets added to them.

If you're still having issues, ask on Vega's dedicated [Snap Discord channel](https://discord.com/channels/720571334798737489/1111311863213473843/1111313848788602981).

## Report issues or share feedback
If you have any trouble with using Snap or have questions about how it works, ask on the dedicated [Discord channel](https://discord.com/channels/720571334798737489/1111311863213473843/1111313848788602981).

Share your [feedback](https://github.com/vegaprotocol/feedback/discussions) on GitHub.

## Snap source code
The source code for Vega's Snap integration is available on [GitHub](https://github.com/vegaprotocol/vega-snap).

## Alternative software
The [Vega Wallet browser extension](./index.md#vega-wallet-browser-extension) is also available for Firefox and Chrome. 

For a full list of alternatives, check out [Vega Wallets](./index.md).

