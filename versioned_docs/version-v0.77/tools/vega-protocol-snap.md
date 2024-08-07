---
title: Vega Protocol snap
hide_title: false
---

A snap lets you use your existing MetaMask account to quickly set up a Vega keypair for trading, staking tokens, and sending other transactions. No Vega Wallet software required.

## Set up your Vega snap
Once you have MetaMask installed, the easiest way to set up your new Vega key with MetaMask is with [Vega Console ↗](https://console.vega.xyz) or the Vega [governance dApp ↗](https://governance.vega.xyz).

You'll be creating a new Vega key, so if you have assets or VEGA tokens on an existing key, you'll need to transfer them to the new key to use them.

1. Open the `Connect` dialog in Vega Console or the governance dApp. 
2. If you have a version of MetaMask that supports Snaps, you'll see a button labelled `Install Vega MetaMask Snap`.
3. MetaMask will open a Connection request pop-up. Click `Connect`.
4. `Install` using the MetaMask pop-up.
5. `Confirm` that you want Vega Protocol to control your account.
6. Use the Vega dApp `Connect` dialog to `Connect via MetaMask Snap`

You're now ready to deposit or transfer assets and use your new Vega keypair.

## What's Vega snap for?
If you're already a MetaMask user, you won't need to create a Vega Wallet to create and use a Vega key.

The snap lets you:
- Derive Vega cryptographic keys that can be used on the Vega network
- Receive in-depth information of transactions you've initiated in the Vega dApp 
- Approve transactions that will then be signed and sent to the network, or reject them
- Automatically connect to the Vega network you're using

## Limitations
The Vega Protocol snap cannot:
- Connect to an existing Vega Wallet or keypair, you'll need to start with a new keypair
- Cannot show your Vega assets or their balances in MetaMask
  - To see your balances, rewards, or deposit, withdraw or transfer assets between keys, you'll need to interact with Console or the governance dApp
- Rename, import, or export keys
- Show a list of previous transactions

## Help with your Vega snap

### I can't see assets I've previously deposited
If this is your first time using Snap with Vega, but you have previously deposited assets on a different Vega key, you'll need to deposit new assets, or transfer assets to the new keys created by your snap. 

You can copy your Vega snap public key from within Vega Console.

### Can I create more than one key pair with Vega snap?
You can only create one keypair derived from your MetaMask seed, though this may change in the future.

### How do I recover my Vega keys?
The Vega keypairs created with snap are derived from the MetaMask seed. Use your MetaMask recovery phrase to recover those Vega keys, and any assets added to them.

### Any other questions?
If you have any trouble with using your Vega snaps, or have questions about how it works, ask on the dedicated [Discord channel ↗](https://discord.com/channels/720571334798737489/1111311863213473843/1111313848788602981).

Share your feedback on Vega's [GitHub discussions ↗](https://github.com/vegaprotocol/feedback/discussions).

## Snaps resources
The source code for the Vega snap integration is available on [GitHub ↗](https://github.com/vegaprotocol/vega-snap).

Read more about snaps on the [MetaMask Snaps ↗](https://metamask.io/snaps/) site.

## Other ways to set up Vega keys
You could instead use the [Vega Wallet browser extension](./index.md#vega-wallet-browser-extension) for Firefox and Chrome. 

For a full list of the alternatives, check out the [Vega Wallet](./vega-wallet/index.md) intro page.