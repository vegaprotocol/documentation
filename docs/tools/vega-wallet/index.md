---
title: Vega Wallet
hide_title: false
---

A Vega Wallet apps allow you to manage wallets and key pairs, deposit and withdraw assets, stake and sign transactions.

## Embedded wallet
The embedded wallet software can be used to create a wallet for a single browser session, derived from a user's existing Ethereum address.

Embedded wallet functionality must be enabled in a user interface that runs the Vega protocol software to be usable. Users don't need to download any additional software to transact using the embedded wallet.

The embedded wallet doesn't require storing a Vega wallet recovery phrase, as connection depends on the Ethereum address that the wallet is derived from. However, the recovery phrase can be exported to be used with other Vega wallet software.

## Browser extension
The Vega Wallet browser extension is an early stage implementation of the Vega Wallet, available for Chrome and Firefox. The extensions linked are only for use with the Fairground network.

**[Chrome extension ↗](https://chrome.google.com/webstore/detail/vega-wallet-fairground/nmmjkiafpmphlikhefgjbblebfgclikn)**

**[Firefox extension ↗](https://addons.mozilla.org/en-GB/firefox/addon/vega-wallet-beta/)**

The browser extension lets you connect to a Vega Wallet right in your browser, rather than having to install a separate app. It allows you to:
* Create a new wallet and public keys
* Import an existing wallet and its keys
* Approve or reject transactions

## CLI app
Use the **[command line app](./cli-wallet/index.md)** to do everything you can do with the desktop app, plus:
* Customise key details 
* Isolate keys
* Build and send transactions

## Wallet API
Integrate with the [Vega Wallet API](../category/api/wallet-api) to build UIs or create other headless applications like bots or scripts.

## What is a wallet?
**[Wallet concepts](../../concepts/wallet.md)**: Read about how the Vega Wallet works and what the terms like 'wallet name' and 'recovery phrase' mean.
