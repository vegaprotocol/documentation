---
title: Connect to local service
hide_title: false
sidebar_position: 5
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

The following guide walks you through connecting to the local service so that you can, for example, connect the application you're building to the Vega wallet service.

:::caution
By following this guide, your application will only be able to talk to testnets. The API used in this guide is not supported on current mainnet (0.53.0).
:::

## Introduction

The local service is an HTTP server exposed on the user's localhost. Therefore, communicating with the Vega wallet service is done through HTTP endpoints.

See the **[Open API documentation](../reference/local-service/wallet-api.info.mdx)** to list all supported HTTP endpoints.

:::caution `Origin` HTTP header required
The service requires the `Origin` (or `Referrer`) HTTP header to be specified in the request. This is usually automatically handled by the browser, so you may not have to do anything, but software, like bots and scripts, should set the `Origin` header themselves. If not set, the request will be rejected.
:::

To access the JSON-RPC API, you will have to submit the request to the HTTP endpoint `POST /api/v2/requests`. To know how to build your JSON-RPC requests, see the **[Open RPC documentation](../reference/core/openrpc.md)**.

:::note Only call client methods
On the local service, only the JSON-RPC methods from the client namespace (starting by `client.`) are callable. The method from the admin namespace (starting by `admin.`) cannot be called.
:::

:::note `Content-type` header
The HTTP endpoint `POST /api/v2/requests` returns a response with a specific `Content-Type` header: `application/json-rpc`.

This content type is used to help third-party applications differentiate the type of the response.

Note that `application/json-rpc` is not a standard HTTP content type.
:::

## Safely integrate with the service

To safely integrate with the local service, every third-party applications should start with the following connection routine:

### 1. Verify the service is running

Query the HTTP endpoint `GET /api/v2/health`:

* If it's running, you can proceed to step 2.
* If you get a 404 response, the API v2 is not available. You should recommend the user to update their Vega wallet software.
* If it's not running, you should recommend the user to verify the wallet service is running with a friendly error message.

### 2. Verify the service exposes the JSON-RPC methods your application relies on

Query the HTTP endpoint `GET /api/v2/methods`:

* If all the JSON-RPC methods you rely on are exposed, you can proceed to step 3.
* If some methods are missing, you should tell the user that some features won't be available, or that your application are missing critical functions to work.

### 3. Verify to which network the service is connected to

Query the chain ID by submitting the JSON-RPC request [`client.get_chain_id`](../reference/core/openrpc.md#clientgetchainid) to HTTP endpoint `POST /api/v2/requests`:

* If the chain ID is the same has you expect, you can safely start submitting transactions.
* If the chain ID is different from the one you expect, you should tell the user to switch network.
* You can also adapt your application dynamically to the chain ID. A good practice is to clearly display the retrieved chain ID in your application.

## Connect to user's wallet

There are two ways to initiate a connection with the user's wallet:

a. Using API tokens, best fitted for headless software like bots and scripts.
b. Using regular live sessions, best fitted for graphical and interactive applications.

### Connect using API tokens

First you will need to generate an API token. To know how to generate one, see the ["Use long-living tokens" guide](./use-long-living-tokens.md).

Once generated, the token can be used in place of a regular session token. They are interchangeable. Therefore, your application does not need to call the `client.connect_wallet`.

:::note No user interactions
When using API tokens, no interaction from the user is required. No connection approval, and no transaction review. This is the reason this connection type is best for headless software like bots and scripts.
:::

### Connect using live sessions

To get a connection token, your application has to submit a JSON-RPC request [`client.connect_wallet`](../reference/core/openrpc.md#clientconnectwallet) to HTTP endpoint `POST /api/v2/requests`.

**Each session generates a unique one.** It's not reusable across sessions.

If successful, you will receive a connection token back through the `Authorization` header. This connection token must be set to the `Authorization` header when accessing protected JSON-RPC methods.

If the connection token is not valid, the server returns a response with the HTTP code `401`, and the `WWW-Authenticate` header set to `VWT` as required by the HTTP standards.

:::note Connection has to be granted by the user
When a third-party application tries to initiate a connection with the user's wallet, the connection request has to be reviewed by the user. It cannot be skipped. The user can decide to approve or deny the connection, preventing the third-party application to access the user's keys.
:::

#### Basic connection workflow for live sessions

Here is the basic logic (as pseudo-code) behind the connection workflow.

```js
let connectionRequest = {
    "method": "POST",
    "path": "/api/v2/requests",
    "body": {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "client.connect_wallet"
    }
}

let connectionResponse = walletClient.send(connectionRequest)

let listKeysRequest = {
    "method": "POST",
    "path": "/api/v2/requests",
    "body": {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "client.list_keys"
    },
    "headers": {
        "Authorization": connectionResponse.Header("Authorization") // VWT xxxxx
    }
}

let listKeysResponse = walletClient.send(listKeysRequest)
```

### Set the `Authorization` header

The token in the HTTP header is formatted as follows: `VWT <TOKEN>`

`VWT` scheme stands for 'Vega Wallet Token' and is not a standard authorization scheme.

The `<TOKEN>` is a randomly generated string of 64 characters with numbers and letters.

