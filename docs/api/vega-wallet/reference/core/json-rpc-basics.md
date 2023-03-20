---
title: JSON-RPC basics
hide_title: false
description: What you need to know about JSON-RPC for the wallet.
sidebar_position: 1
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## JSON-RPC API Introduction

All Vega Wallet software supports a JSON-RPC API to manage the wallets and their keys, and sign and send transactions. It's the core of the wallet backend and is consistent across implementations.

:::note New to JSON-RPC?
Read the [JSON-RPC specification ↗](https://www.jsonrpc.org/specification) for the standards and conventions.
:::

:::caution Don't forget to set the `id` property
Be sure to specify the `id`, in the JSON-RPC request, if you are interested in the response.

If the `id` property is not set, no response will be returned, even on error.

See [the JSON-RPC notification documentation](https://www.jsonrpc.org/specification#notification) for more details.
:::

## Namespaces

The methods of this JSON-RPC API are scoped in two namespaces: admin - methods starting with `admin.`; and client - methods starting with `client.`.

### Admin namespace

The admin namespace exposes methods to administrate the wallets, the keys within them and their permissions, and the networks. It can also sign and send transactions. These methods are primarily meant to be consumed by wallet frontends only.

**Third-party applications cannot access this namespace.** The admin namespace is not accessible from the communication layer (the top level API) of the Vega Wallet software. Issuing the request targeting a method of the admin namespace from a third-party application will result in a rejection.

Therefore, as an example, if you want to programmatically create a wallet, you have 3 options:
1. Use the command line (`vega wallet create`), if you have the Vega software available. We recommend using the `json` output flag in scripts.
2. Write your own software in Golang and use Vega code as a library.
3. Reimplement the wallet creation from scratch using the technology of you choice.

### Client namespace

The client namespace exposes methods that primarily support third-party connections and transaction signing and sending.

This is the only namespace that is fully accessible by third-party applications.

:::note Privacy oriented
The client namespace is made to reduce the amount of information given to third-party applications down to a minimum, **on purpose**.

Everything is done to prevent unmasking the user. As a result, the third-party application can only:
- List the public keys the users explicitly gave access to
- Get the chain ID of the network the user is connected to
- Request the sending, signing and checking of a transaction
:::

## Basic workflow

This example shows how a third-party application should use the JSON-RPC API.

1. The app has to connect to the wallet using the method [`client.connect_wallet`](./openrpc.md#clientconnectwallet). The connection must be reviewed and approved by the user to succeed. Depending on the software you send this request to, you may have to go through extra steps, like retrieving a connection token from the response.

```json
{
  "jsonrpc": "2.0",
  "method": "client.connect_wallet",
  "id": "request_1"
}
```

2. Once connected, list the keys the user selected for your application, using the method [`client.list_keys`](./openrpc.md#clientlistkeys). That's an important step because sending a transaction requires the third-party application to specify the public key to use. This method relies on a permission system. As a result, the user has to grant your app access to their keys. The permission access is requested only once per third-party application.

```json
{
  "jsonrpc": "2.0",
  "method": "client.list_keys",
  "id": "request_3"
}
```

3. Once access to the keys has been granted, you can send a transaction using the method [`client.send_transaction`](./openrpc.md#clientsendtransaction). Once again the user will have to review and approve the transaction. Once approved, it can take some time for the wallet to bundle the transaction, sign, and send it. The transaction field below is set as an example.

```json
{
  "jsonrpc": "2.0",
  "method": "client.send_transaction",
  "params": {
    "publicKey": "ONE_OF_THE_PUBLIC_KEY_FROM_THE_LIST_KEY_CALL",
    "sendingMode": "TYPE_SYNC",
    "transaction": {
      "voteSubmission": {
        "proposalId": "SOME_PROPOSAL_ID",
        "value": "VALUE_YES"
      }
    }
  },
  "id": "request_3"
}
```

4. *Optional but highly recommended* - Your application should expose a button to disconnect the wallet, calling the method [`client.disconnect_wallet`](./openrpc.md#clientdisconnectwallet):

```json
{
  "jsonrpc": "2.0",
  "method": "client.disconnect_wallet",
  "id": "request_4"
}
```
