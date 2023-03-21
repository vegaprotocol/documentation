---
title: Stream with websocket
sidebar_label: Websocket
---

WebSockets API offers real-time updates to changes in state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

As Vega is a blockchain time moves in dicrete blocks and so updates will as blocks are executed.

## Authentication

Data nodes in the Vega network are designed to have only public APIs and do not require API tokens for access. TLS is supported on all websocket end-points.  

As data nodes on the Vega network are decentralized, whether TLS is enabled on a particular data node is a choice made by the node operator.

## Rate limits

TODO:
I DONT BELIEVE WE HAVE RATELIMTING ON OUR WEBSOCKETS ONLY GRAPHQL. Asking in slack

## Using Subscriptions

Subscription happens when the connection is opened, and is then unsubscribed when the connection is closed. It is not required to prove liviness of the connection.

Below is an example of how to stream trades

> Topic subscription response message example

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


```json
{
  "result": {
    "trades": [
      {
        "id": "a5032864f199496b5492bacdc3d1a7570c3fd3532ddded3226fa3ffb7a6b964d",
        "marketId": "10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2",
        "price": "614459",
        "size": "38",
        "buyer": "3b4961e20a360dbeb13b31563dc2f54e325b4bf4478587e00fa8be0c16875434",
        "seller": "86ef1d66fff8493cce3a411ae52002ced577ad801f9d7b56e6f992c124034bff",
        "aggressor": "SIDE_SELL",
        "buyOrder": "1b100acf5166ddcbe1fc71752cf5fd94f363de3c60d1b886e448d08a9f1dc169",
        "sellOrder": "200df9c9c3048f2cbd96da8ea337bbb2f3924c5c3dcedbca253e5c63255d720e",
        "timestamp": "1679391310348713000",
        "type": "TYPE_DEFAULT",
        "buyerFee": {
          "makerFee": "0",
          "infrastructureFee": "0",
          "liquidityFee": "0"
        },
        "sellerFee": {
          "makerFee": "5",
          "infrastructureFee": "24",
          "liquidityFee": "24"
        },
        "buyerAuctionBatch": "0",
        "sellerAuctionBatch": "0"
      },
      {
        "id": "f8553ed58b6b42ea63c23cca06587264d8d0f51376c22e6eeceef1c674e5c30e",
        "marketId": "10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2",
        "price": "614459",
        "size": "43",
        "buyer": "739a855ede24463a1744e90b2ebf987e00990fc41adcd38d59f7201a52abe26c",
        "seller": "86ef1d66fff8493cce3a411ae52002ced577ad801f9d7b56e6f992c124034bff",
        "aggressor": "SIDE_SELL",
        "buyOrder": "c761137d9e825957744e1a85103eb3bdca8657463e54e2c9559d1e6de938dd21",
        "sellOrder": "200df9c9c3048f2cbd96da8ea337bbb2f3924c5c3dcedbca253e5c63255d720e",
        "timestamp": "1679391310348713000",
        "type": "TYPE_DEFAULT",
        "buyerFee": {
          "makerFee": "0",
          "infrastructureFee": "0",
          "liquidityFee": "0"
        },
        "sellerFee": {
          "makerFee": "6",
          "infrastructureFee": "27",
          "liquidityFee": "27"
        },
        "buyerAuctionBatch": "0",
        "sellerAuctionBatch": "0"
      }
    ]
  }
}
```

## Stream Snapshots

Some Websocket APIs support returning a snapshot of the current state of data before streaming updates.

For these API two JSON objects can be returned, snapshot and updates. When first connecting to the stream batches of snapshots will be sent after which only updates will be sent. 

For example when streaming orders the current state of the orderbook will be sent in batches as snapshots:

```json
{
    "result": {
        "snapshot": {
            "orders": [],
        }
    }
}
```

followed afterwards by updates to the orderbook going forward

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


### Available websocket APIs

List here with links to all the available ones that are littered throughout trading-data list.
TODO:
work out how to do links