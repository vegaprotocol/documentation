---
title: Stream with websocket
sidebar_label: Websocket
---

WebSockets API offers real-time updates to changes in state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

As Vega is a blockchain time moves in dicrete blocks and so updates will appear as blocks are executed.

## Authentication

Data nodes in the Vega network are designed to have only public APIs and do not require API tokens for access. TLS is supported on all websocket end-points. As data nodes on the Vega network are decentralized, whether TLS is enabled on a particular data node is a choice made by the node operator.


## Subscribing using the WebSockets API

Below is an example of how to stream trades

<Tabs>
<TabItem value="bash" label="bash example">

```bash
curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/trades'
```

</TabItem>


<TabItem value="python" label="python example">

```python
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

</Tabs>

Subscription to a WebSocket endpoint happens when the connection is opened, unsubscription occurs when the connection is closed. It is not necessary to send a request through the websocket to initiate the subscription or to prove liviness of the connection.

## Stream Snapshots

Some of the Websocket endpoints will send a snapshot of the current state of data when a connection is first made. This allows for an application to build an initial state creating context for subsequent updates.

The snapshot data will be sent in batches after which subsequent messages will only be updates to the snapshot state.

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

the last batch of snapshot data will have `lastPage` is set to `true` after which the stream will switch to sending updates to the orderbook


``` json
{
    "result": {
        "updates": {
            "orders": [],
        }
    }
}
```


## Filtered Subscriptions

Most of the Websockets API support filtering such as by-party or by-market. The filters are set as query-parameters on the URL. 

Below is an example of how to stream trades by `partyId`

<Tabs>
<TabItem value="bash" label="bash example">

```bash
curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/trades?api.n07.testnet.vega.xyz/api/v2/stream/trades?partyId?=faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338'
```

</TabItem>


<TabItem value="python" label="python example">

```python
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

</Tabs>

Only trades where `buyer` or `seller` matches the given `partyID` will be streamed.

### Available websocket APIs

List here with links to all the available ones that are littered throughout trading-data list.
TODO:
work out how to do links