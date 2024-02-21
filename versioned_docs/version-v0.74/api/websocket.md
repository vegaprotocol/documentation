---
title: WebSocket streams
sidebar_label: WebSocket streams
hide_title: false
description: Learn how to use the available WebSocket APIs.
vega_network: MAINNET
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vega's API contains WebSocket endpoints that offer real-time updates to changes in the state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

As Vega relies on a blockchain, time moves in discrete blocks and so updates will appear as blocks are executed.

:::note Network endpoints
The examples below use Vega testnet endpoints. If you want to try any of the examples below on mainnet, you will need to connect to a mainnet endpoint that provides WebSocket.
:::

## Authentication and rate limiting

API tokens are not required to access the API as they are all public. TLS is supported on all WebSocket endpoints but note that whether it is enabled on a particular data node is a choice made by the data node's operator.

WebSocket connections are rate limited by a maximum allowed number of subscriptions per IP address. The default maximum is set to 250 connections, but note that this value may differ between data node operators.

Subscription to a WebSocket endpoint happens when the connection is opened and unsubscription occurs when the connection is closed. It is not necessary to send a request through the WebSocket to initiate the subscription or to prove the liveliness of the connection.

## Subscribing using the WebSocket API

The tabs below show how to stream all ledger movements that occur on the Vega Fairground network using Bash, Python, and NodeJS. If you want to try this on mainnet, you'll need to connect to a mainnet endpoint that provides WebSocket.

<Tabs>
<TabItem value="bash" label="Bash">

```bash
curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/ledger/movements'
```

</TabItem>


<TabItem value="py" label="Python">

```py
import rel
import json
import websocket

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/ledger/movements"

def on_message(ws, message):
    print(json.loads(message))


ws = websocket.WebSocketApp(
    url=url,
    on_message=on_message,
)

ws.run_forever(dispatcher=rel, reconnect=5)
rel.signal(2, rel.abort)
rel.dispatch()
```

</TabItem>

<TabItem value="njs" label="Node">

```javascript
// https://www.npmjs.com/package/ws
import { WebSocket } from 'ws';
const url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/ledger/movements";
const client = new WebSocket(url);

client.on('message', message => {
  console.log(message.toString());
});
```

</TabItem>

<TabItem value="js" label="Browser">

```javascript
const client = new WebSocket("wss://api.n07.testnet.vega.xyz/api/v2/stream/ledger/movements");

client.onmessage = console.dir;
```

</TabItem>
</Tabs>

The above examples show how to use WebSockets to stream all ledger movements that occur on the Vega Fairground network. An example payload is shown below:

```json
{
  "result": {
    "ledgerMovement": {
      "entries": [
        {
          "fromAccount": {
            "assetId": "fBTC",
            "type": 7,
            "marketId": "0570e3ba31dda99bcaa78cf7c32fe97f3ec93c7a87ae6efd41fc524defa1bef2"
          },
          "toAccount": {
            "assetId": "fBTC",
            "type": 4,
            "owner": "ee023a39d8c76b7c32b235f4620fb50cae2af3068368979c41eaeb519ce8d3fd"
          },
          "amount": "30",
          "type": 10,
          "timestamp": "1679568591503926199",
          "fromAccountBalance": "31",
          "toAccountBalance": "3999823695"
        }
      ],
      "balances": [
        {
          "account": {
            "assetId": "fBTC",
            "type": 4,
            "owner": "ee023a39d8c76b7c32b235f4620fb50cae2af3068368979c41eaeb519ce8d3fd"
          },
          "balance": "30"
        }
      ]
    }
  }
}
```

All enum values are sent as their integer values and not their string representation. This is to reduce the amount of data in each packet and for speedy performance.

## Snapshots of data

Some of the WebSocket endpoints will send a snapshot of the current state of data when a connection is first made. This allows for an application to build an initial state, creating context for subsequent updates. The snapshot data will be sent in batches after which subsequent messages will only be updates to the snapshot state.

As an example, when streaming orders the current state of the order book will be sent first:

```json
{
    "result": {
        "snapshot": {
            "orders": [],
            "lastPage": true
        }
    }
}
```

The last batch of snapshot data will have `lastPage` set to `true` after which the stream will switch to sending updates of the order book:


```json
{
    "result": {
        "updates": {
            "orders": []
        }
    }
}
```


## Adding filters to subscriptions

Most of the WebSocket endpoints support filtering such as by-party or by-market. The filters are set as query parameters on the URL. 

<Tabs>
<TabItem value="bash" label="Bash">

```bash
curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/trades?api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338'
```

</TabItem>


<TabItem value="py" label="Python">

```py
import rel
import json
import websocket

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338"

def on_message(ws, message):
    print(json.loads(message))


ws = websocket.WebSocketApp(
    url=url,
    on_message=on_message,
)

ws.run_forever(dispatcher=rel, reconnect=5)
rel.signal(2, rel.abort)
rel.dispatch()
```

</TabItem>

<TabItem value="njs" label="Node">

```js
import { WebSocket } from 'ws';
const url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338";
const client = new WebSocket(url);

client.on('message', message => {
  console.log(message.toString());
});
```

</TabItem>
<TabItem value="js" label="Browser">

```javascript
const client = new WebSocket("wss://api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338");

client.onmessage = console.dir;
```

</TabItem>

</Tabs>

The above examples show how to use WebSockets to stream trades filtering on a `partyId`. The stream will only contain trades where `buyer` or `seller` matches `faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338`.


## All WebSocket APIs

The available WebSocket APIs are listed below.

| Description | Documentation | Call |
| ----------- | ----------- | ----------- |
| Stream account details | [Accounts](./rest/data-v2/trading-data-service-observe-accounts.api.mdx)| `/api/v2/stream/accounts`
| Stream candles data | [Candles](./rest/data-v2/trading-data-service-observe-candle-data.api.mdx) | `/api/v2/stream/candles/data`
| Stream liquidity provisions for a given market and party | [Liquidity provisions](./rest/data-v2/trading-data-service-observe-liquidity-provisions.api.mdx) | `/api/v2/stream/liquidity-provisions`
| Stream margin levels for a given party (and optionally market) | [Margin levels](./rest/data-v2/trading-data-service-observe-margin-levels.api.mdx) | `/api/v2/stream/margin/levels`
| Stream data for given markets | [Markets depth](./rest/data-v2/trading-data-service-observe-markets-depth.api.mdx) | `/api/v2/stream/markets/depth`
| Stream updates of market depth for given markets | [Markets depth updates](./rest/data-v2/trading-data-service-observe-markets-depth-updates.api.mdx) | `/api/v2/stream/markets/depth/updates`
| Stream data about given markets | [Markets data](./rest/data-v2/trading-data-service-observe-markets-data.api.mdx) | `/api/v2/stream/markets/data`
| Stream all orders, or optionally for a given market and party | [Orders](./rest/data-v2/trading-data-service-observe-orders.api.mdx) | `/api/v2/stream/orders`
| Stream all positions, or optionally for a given market and party | [Positions](./rest/data-v2/trading-data-service-observe-positions.api.mdx) | `/api/v2/stream/positions`
| Stream all trades, or optionally for a given market and party | [Trades](./rest/data-v2/trading-data-service-observe-trades.api.mdx) | `/api/v2/stream/trades`
| Stream governance proposals | [Governance proposals](./rest/data-v2/trading-data-service-observe-governance.api.mdx) | `/api/v2/stream/governance`
| Stream governance votes for a party | [Governance votes](./rest/data-v2/trading-data-service-observe-votes.api.mdx) | `/api/v2/stream/votes`
