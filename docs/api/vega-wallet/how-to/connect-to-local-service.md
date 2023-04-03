---
title: Connect to local service
hide_title: false
sidebar_position: 2
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

The following guide walks you through connecting to the local service so that you can, for example, connect the application you're building to the Vega wallet service.

:::caution
By following this guide, your application will only be able to talk to networks on 0.67 or newer. The API used in this guide is not supported on the current mainnet version 0.53.
:::

## Introduction

The local service is an HTTP server exposed on the user's localhost. Therefore, communicating with the Vega wallet service is done through HTTP endpoints.

See the **[HTTP API documentation](../reference/local-service/wallet-api.info.mdx)** to list all supported HTTP endpoints.

:::caution `Origin` HTTP header required
The service requires the `Origin` (or `Referrer`) HTTP header to be specified in the request. This is usually automatically handled by the browser, so you may not have to do anything, but software, like bots and scripts, should set the `Origin` header themselves. If not set, the request will be rejected.
:::

To access the JSON-RPC API, you will have to submit the request to the HTTP endpoint `POST /api/v2/requests`. To know how to build your JSON-RPC requests, see the **[JSON-RPC API documentation](../reference/core/json-rpc.md)**.

On the local service, only the JSON-RPC methods from the client namespace (starting by `client.`) are callable. The method from the admin namespace (starting by `admin.`) cannot be called.

:::note `Content-type` header
The HTTP endpoint `POST /api/v2/requests` returns a response with a specific `Content-Type` header: `application/json-rpc`.

This content type is used to help third-party applications differentiate the type of the response.

Note that `application/json-rpc` is not a standard HTTP content type.
:::

## Safely integrate with the service
To safely integrate with the local service, every third-party applications should start with the following connection routine.

### 1. Verify service is running
Query the HTTP endpoint `GET /api/v2/health`:

* If it's running, you can proceed to step 2.
* If you get a 404 response, the API v2 is not available. You should recommend the user to update their Vega wallet software.
* If it's not running, you should recommend the user to verify the wallet service is running with a friendly error message.

### 2. Verify service exposes JSON-RPC methods your app relies on
Query the HTTP endpoint `GET /api/v2/methods`:

* If all the JSON-RPC methods you rely on are exposed, you can proceed to step 3.
* If some methods are missing, your app should tell the user that some features won't be available, or that your application is missing critical functions.

### 3. Verify which network the service is connected to
Query the chain ID by submitting the JSON-RPC request [`client.get_chain_id`](../reference/core/json-rpc.md#clientgetchainid) to HTTP endpoint `POST /api/v2/requests`:

* If the chain ID is the one you expected, the app can safely start submitting transactions.
* If the chain ID is different from what you expected, tell the user to switch networks.
* You can also adapt the content of your application dynamically based on the chain ID. A good practice is to clearly display the retrieved chain ID in your application.

## Connect to user's wallet

To connect to a wallet, you first need to get a connection, and then set the token in the HTTP header of your requests.

### 1. Get a connection token

There are two options for initiating a connection with the user's wallet:
* Using API tokens, best suited for headless software like bots and scripts. 
* Using regular live sessions, best suited for graphical and interactive applications.

The `<TOKEN>` is a randomly generated string of 64 characters using numbers and letters.

#### Option A: Get an API token
First you will need to generate an API token. See the ["Use long-living tokens" guide](./use-long-living-tokens.md).

Once generated, the token can be used in place of a regular session token, as they are interchangeable. Therefore, your application does not need to call the `client.connect_wallet`.

:::note No user interaction required
When using API tokens, no interaction from the user is required. That means no connection approval, and no transaction review. This automatic approval is the reason this connection type is best for headless software like bots and scripts.
:::

#### Option B: Get a live session token
To get a connection token, your application has to submit a JSON-RPC request [`client.connect_wallet`](../reference/core/json-rpc.md#clientconnectwallet) to the HTTP endpoint `POST /api/v2/requests`.

**Each session generates a unique connection.** It's not reusable across sessions.

If successful, you will receive a connection token back set on the `Authorization` header of the HTTP response. The value of the `Authorization` header is formatted as follows:

```
VWT <TOKEN>
```

The placeholder `<TOKEN>` represents the live session token. That's the token to set in the `Authorization` header of your next HTTP request.  

:::note Connection has to be granted by the user
When a third-party application tries to initiate a connection with the user's wallet, the connection request has to be reviewed by the user. It cannot be skipped. The user can decide to approve or deny the connection. Denying prevents the third-party application access to the user's keys.
:::

### 2. Set the `Authorization` header
Once you have a connection token, it needs to be set in the `Authorization` header using the following format:

```
VWT <TOKEN>
```

If the connection token is not valid, the server returns a response with the HTTP code `401`, and the `WWW-Authenticate` header set to `VWT` as required by the HTTP standards. `VWT` stands for 'Vega Wallet Token' and is not a standard authorization scheme.

#### Example
Below, using pseudo JavaScript code, is an example to connect to a wallet.

```js
// 1. Get a live session token.
//    Jump direction to step 2 if you are using a long-living token.
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

// 2. Set the connection token in the `Authorization` header.
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
