---
title: Build with the browser extension
hide_title: false
vega_network: TESTNET
sidebar_position: 2
---
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## Introduction

The Vega browser extension exposes a `vega` object on the global context,
ie. `window`.

### `await vega.connectWallet()`

- Returns: `Promise<void>` Fulfills with `undefined` upon success

To start using subsequent methods, a dApp or website first needs to initiate
a connection, which requires user approval. The promise rejects if the user
denies the connection attempt. Explicit user approval is only required on the
first connection from a given origin. Subsequent connection attempts resolve
automatically. Any errors thrown will be of [`?`](#?)

### `await vega.disconnectWallet()`

- Returns: `Promise<void>` Fulfills with `undefined`

This closes any open connection from the dApp to the wallet

### `const keys = await vega.listKeys()`

- Returns: `Promise<{ name: string, publicKey: string }[]>` Fulfills with a list of:
    * User chosen `name` for the key pair
    * Hex encoded `publicKey`

After successfully connecting, users will select which keys and wallets they
will allow to be seen and used by the connecting dApp. Only keys contained in
the list are available for other operations such as `vega.sendTransaction`.
Any errors thrown will be of [`?`](#?)

```js
const keys = await vega.listKeys()

for(const key of keys) {
  console.log(key.name, key.publicKey)
}
```

### `const { chainID } = await vega.getChainId()`

- Returns `Promise<{ chainID: string }` Fulfills with the chain ID of the current network

Fetches the current `chainID` of the network the user is connected to. This
can be used to decide if the user is connected to the expected network,
and prompt the user to switch if not.
Note that `chainID` is not an indefinite constant for a given network but may 
change with network restarts. However it can assumed to constant during a session,
for a given network. The user can however choose to switch network
configuration in their wallet at any point in time.
Any errors thrown will be of [`?`](#?)

### `const res = await vega.sendTransaction({ sendingMode, publicKey, transaction })`

- `sendingMode` `TYPE_ASYNC` | `TYPE_SYNC` | `TYPE_COMMIT`
- `publicKey` `string`
- `transaction` `Object`
- Returns: `Promise<Object>`


