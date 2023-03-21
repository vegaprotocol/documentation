---
title: Websocket Streams
sidebar_label: Websocket Streams
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Vega's API has websocket endpoints that offer real-time updates to changes in state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

As Vega is a blockchain time moves in discrete blocks and so updates will appear as blocks are executed.

## Authentication

Data nodes in the Vega network are designed to have only public APIs and do not require API tokens for access. TLS is supported on all websocket endpoints. As data nodes on the Vega network are decentralized, whether TLS is enabled on a particular data node is a choice made by the node operator.


## Subscribing using the WebSockets API

<Tabs>
<TabItem value="bash" label="Bash">

```bash
curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/trades'
```

</TabItem>


<TabItem value="py" label="Python">

```py
import rel
import json
import websocket

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/trades"

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

url = "wss://api.n07.testnet.vega.xyz/api/v2/stream/trades"

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

The above examples show how to use websockets to stream trades that are made on the Vega network.

Subscription to a websocket endpoint happens when the connection is opened and unsubscription occurs when the connection is closed. It is not necessary to send a request through the websocket to initiate the subscription or to prove liviness of the connection.

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

## Available websocket APIs

List here with links to all the available ones that are littered throughout trading-data list.