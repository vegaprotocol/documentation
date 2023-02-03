---
title: Get started with API v2
hide_title: false
sidebar_position: 1 
---
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

Vega Wallet supports a JSON-RPC API for integrating interfaces with the Vega Wallet service, to read keys, get transaction approval, and more.

:::note Admin access
The HTTP service doesn't provide access to the `admin` endpoints, for security reasons. Actions such as creating a wallet cannot be done programmatically using the API.

See the [Create a Wallet guide](../../../tools/vega-wallet/cli-wallet/latest/create-wallet.md) to set up the Vega Wallet for command line. Then connect using the info below.
:::

The **JSON-RPC API** and its endpoint **`/api/v2/requests`** is in the alpha phase, and will be replacing the v1 REST API. If you discover any issues, please raise them on the [feedback board ↗](https://github.com/vegaprotocol/feedback/discussions).

* 🧩 **[Connect with a dApp](#connect-with-dapps)**: Connect your dApp to the Vega Wallet service
* 🤖 **[Connect with a bot](#connect-with-bots)**: Connect your bots, or other headless software, to the Vega Wallet service
* 📚 **[API documentation](./openrpc)**: See the full JSON-RPC documentation to build your integration with the Vega Wallet
* 🛝 **[API playground](./openrpc-api-playground)**: Try it out and explore the potential results and errors

## Software compatibility
Vega Wallet API (v2)'s latest version was released in Vega software `v.0.67`. If you're interacting with a network on `v0.67` or newer, you'll need to have a wallet that supports the new API.

:::note New to JSON-RPC?
Read the [JSON-RPC specification ↗](https://www.jsonrpc.org/specification) for the standards and conventions.
:::

## Connect with dApps

### Verify the service
1. Verify the service is running with `GET /api/v2/health`
2. If it is running, verify the service exposes the JSON-RPC methods using `GET /api/v2/methods`
       * If you get a 404 response, `v2` API is not available. Update your wallet to use the `v2` API, unless you're running a network using software older than 0.54.

See the full set of methods that you can use in the **[Open RPC documentation](./openrpc)**.

### Retrieve token
You can retrieve a [long-living token](#generate-a-long-living-token) using the command-line, see instructions below. 

For sessions (the `client.connect_wallet` workflow below), the token is returned through the Authorization HTTP header in the client.connect_wallet response. This allows you to use to following technique:

```
response = send_requests("client.connect_wallet")

token = response.Header("Authorization")

send_requests("client.list_keys", header("Authorization", token))
```

### Issue request to the service

:::caution Origin header required 
The service requires the Origin (or Referrer) HTTP header to be specified in the request. This is usually handled by the browser, so you may not have to do anything, but for software that does not use one of those headers, the request will be rejected.
:::

Use `POST /api/v2/requests` to communicate with the wallet. The request body is a JSON-RPC 2.0 payload. 

If you want to use a token, you'll need to specify it in the `Authorization` HTTP header with the scheme `VWT`. Example: `Authorization: VWT <TOKEN>`

1. Get the ID for the chain the service is connected to. This allows your app to display the information related to the network that the service is connected to:

```
    {
      "jsonrpc": "2.0",
      "method": "client.get_chain_id",
      "id": "request_1"
    }
```

2. Once your app displays the right data, connect to the wallet. You’ll get a token back as a response, if the connection is successful and user permission is granted. If the user permission hasn't already been provided, then the wallet will prompt the user to approve the connection.

```
    {
      "jsonrpc": "2.0",
      "method": "client.connect_wallet",
      "id": "request_2"
    }
```

3. Wait for user approval. Once it's successful, you will get a token back. **This token is required to query protected methods. It is unique and randomly generated for every connection.**

4. Once connected, use the list keys method, as you'll need to know the public keys you have access to:

```
    {
      "jsonrpc": "2.0",
      "method": "client.list_keys",
      "id": "request_3"
    }
```

4. Once you have access to the key list, you can send a transaction. Wait for the user to approve the transaction. Note, The transaction field is an example.

```
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
      "id": "request_4"
    }
```

1. *Optional* (but recommended) - Expose a disconnect button:

```
    {
      "jsonrpc": "2.0",
      "method": "client.disconnect_wallet",
      "id": "request_5"
    }
```

## Connect with bots
The following guide describes how to use the wallet service with bots and other headless software by creating a long-living API token. Long-living tokens are highly privileged tokens that bypass user review and the approval process. 

If using this process, be sure you are comfortable with allowing that level of access to your keys.

### Generate a long-living token

1. Enable support for long-living tokens for the wallet service, using the command below. This is only needed once, for the first time you are using long-living tokens.

```
vegawallet api-token init
```

2. Generate a token, and linked it to the wallet of your choice:

```
vegawallet api-token generate --wallet-name "WALLET_NAME" --description "for my trading bot"
```

3. Start the service with long-living token support. If you forget the `--load-tokens` flag, sessions with long-living tokens are not created.

```
vegawallet service run --load-tokens --network testnet1
```
   
### Verify the service
1. Verify the service is running with `GET /api/v2/health`
2. If it is running, verify the service exposes the JSON-RPC methods using `GET /api/v2/methods`
3. If it does expose the methods, you can start issuing requests to the wallet software with `POST /api/v2/requests`
   a. Get the chain ID of the network the wallet is connected to, to show data from the same network using `client.get_chain_id`.

### Issue a request to the service

:::caution Origin header required 
The service requires the Origin (or Referrer) HTTP header to be specified in the request. This is usually handled by the browser, so you may not have to do anything, but for software that does not use one of those headers, the request will be rejected.
:::

Use `POST /api/v2/requests` to communicate with the wallet. The request body is a JSON-RPC 2.0 payload.

1. You don't need to connect. You can use the pre-generated, long-living token in place of the regular token. The token should be specified in the `Authorization` HTTP header with the scheme `VWT`. Example: `Authorization: VWT <TOKEN>`

Use the method below to get the public keys you have access to:

```
    {
      "jsonrpc": "2.0",
      "method": "client.list_keys",
      "id": "request_1"
    }
```

2. Once you have access to the key list, you can send a transaction. You will not need to get approval.

   Note, The transaction field is an example.

```
    {
      "jsonrpc": "2.0",
      "method": "client.send_transaction",
      "params": {
         "publicKey": "ONE_OF_THE_PUBLIC_KEY_FROM_THE_LIST_KEY_CALL",
         "sendingMode": "TYPE_SYNC",
         "transaction": {
             "voteSubmission": {
                 "proposalId": "eb2d3902fdda9c3eb6e369f2235689b871c7322cf3ab284dde3e9dfc13863a17",
                 "value": "VALUE_YES"
             }
         }
      },
      "id": "request_4"
    }
```
