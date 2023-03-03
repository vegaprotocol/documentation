---
title: Connect to local service
hide_title: false
sidebar_position: 5
---
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## Verify the service
1. Verify the service is running with `GET /api/v2/health`
2. If it is running, verify the service exposes the JSON-RPC methods using `GET /api/v2/methods`
       * If you get a 404 response, `v2` API is not available. Update your wallet to use the `v2` API, unless you're running a network using software older than 0.54.

See the full set of methods that you can use in the **[Open RPC documentation](../reference/core/openrpc.md)**.

## Retrieve token
You can retrieve a long-living token using the command-line, see instructions below. 

For sessions (the `client.connect_wallet` workflow below), the token is returned through the Authorization HTTP header in the client.connect_wallet response. This allows you to use to following technique:

```
response = send_requests("client.connect_wallet")

token = response.Header("Authorization")

send_requests("client.list_keys", header("Authorization", token))
```

## Issue request to the service

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

## Generate a long-living token

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
