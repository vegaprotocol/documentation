---
title: Websocket Streams
sidebar_label: Websocket Streams
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Vega's API has websocket endpoints that offer real-time updates to changes in state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

As Vega is a blockchain time moves in discrete blocks and so updates will appear as blocks are executed.

## Authentication and Ratelimiting

API tokens are not required for access as all the API are public. TLS is supported on all websocket endpoints but note that it is enabled a particular data node is a choice made by the node operator.

Websocket connections are ratelimited by a maximum allowed number of subscriptions per IP address. The default maximum is set to 250 connections but note that this value may differ between data node operators.

Subscription to a websocket endpoint happens when the connection is opened and unsubscription occurs when the connection is closed. It is not necessary to send a request through the websocket to initiate the subscription or to prove liviness of the connection.


## Subscribing using the WebSockets API

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

<TabItem value="js" label="Node">

```js
var WebSocketClient = require('websocket').client;

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/ledger/movements"

var client = new WebSocketClient();
client.on('connect', function (connection) {
    connection.on('message', function (message) {
        console.log(message.utf8Data);
    });
});
client.connect(url);
```

</TabItem>

</Tabs>

The above examples show how to use websockets to stream all ledger movements that occur on the Vega network. An example payload is show below

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

All enum values are sent as their integer value and not their string representation. This is to reduce the amount of data in each packet and help the performance.

## Snapshot Data

Some of the Websocket endpoints will send a snapshot of the current state of data when a connection is first made. This allows for an application to build an initial state creating context for subsequent updates. The snapshot data will be sent in batches after which subsequent messages will only be updates to the snapshot state.

As an example, when streaming orders the current state of the orderbook will be sent first

```json
{
    "result": {
        "snapshot": {
            "orders": [],
            "lastPage: true,
        }
    }
}
```

The last batch of snapshot data will have `lastPage` set to `true` after which the stream will switch to sending updates to the orderbook


```json
{
    "result": {
        "updates": {
            "orders": [],
        }
    }
}
```


## Adding Filters to Subscriptions

Most of the websocket endpoints support filtering such as by-party or by-market. The filters are set as query-parameters on the URL. 

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

<TabItem value="js" label="Node">

```js
var WebSocketClient = require('websocket').client;

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338"

var client = new WebSocketClient();
client.on('connect', function (connection) {
    connection.on('message', function (message) {
        console.log(message.utf8Data);
    });
});
client.connect(url);
```

</TabItem>

</Tabs>

The above examples show how to use websockets to stream trades filtering on a `partyId`. The stream will only contain trades where `buyer` or `seller` matches `faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338`.