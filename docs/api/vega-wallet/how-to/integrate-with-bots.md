---
title: Integrate bots with wallet
hide_title: false
sidebar_position: 4
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

The following guide describes how to integrate the wallet service headless software like bots and scripts.

### Generate a long-living token
First, you need to create a long-living API token. Follow the ["Use long-living tokens" guide](./use-long-living-tokens.md) to find out how.

### Connect to the local service
Once you generated the token, you'll need to bootstrap the local service, if not already done. See the ["Bootstrap wallet service" guide](./bootstrap-local-service.md).

Then, you will have to connect to the local service. Follow the ["Connect to local service" guide](./connect-to-local-service.md).

As you are using a long-living token, there is no need to support live sessions.

### List the public keys
On the HTTP endpoint `POST /api/v2/requests`, use the JSON-RPC method below to get the public keys you have access to:

```json
{
  "jsonrpc": "2.0",
  "method": "client.list_keys",
  "id": "request_1"
}
```

More detail at [`client.list_keys`](../reference/core/openrpc.md#clientlistkeys).

### Send a transaction
Once you have access to the key list, you can send a transaction.

Note, the transaction field is an example, you will have to define your own.

```json
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

See more detail at the [`client.send_transaction`](../reference/core/json-rpc.md#clientsendtransaction) API reference documentation.
