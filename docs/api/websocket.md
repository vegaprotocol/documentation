---
title: Stream with websocket
sidebar_label: Websocket
---

## Authentication
Public endpoints do not require authentication. If you are looking to connect to a private data server, you'll need to find out authentication details from the provider.

When creating any scripts or software to interact with Vega, you'll need a wallet authentication token. See the [Wallet API guide to get started](./vega-wallet/how-to/integrate-with-bots).

## Rate limits
* Do not frequently connect and disconnect the connection. (IS THIS TRUE FOR US)
* [insert relevant limits here]

:::caution IS THIS NEEDED?
Your stream may get disconnected at any time. Please follow the instructions below to ensure that you receive WebSocket messages on time:
1. Keep connection alive by ...
2. Reconnect as soon as possible if disconnected
:::

## How to send heartbeat packet (DO WE HAVE SUCH A THING?)

> How to Send

```javascript
// annotation note about required info
ws.send(JSON.stringify({"req_id": "100001", "op": "beebop"}));
```


```json
{
    "success": true,
    "ret_msg": "bee",
    "conn_id": "sample",
    "op": "bop"
}
```

:::caution DO WE NEED THIS
To avoid network issues, we recommend that you send the <code>ping</code> heartbeat packet every <b>XXXXXX</b> seconds to maintain the WebSocket connection.
:::

## How to subscribe to topics (TOPICS?)
### Understanding WebSocket Filters

How to subscribe with a filter

```json
// Subscribing to something (SAMPLE TEXT)
{
    "id": "test", // optional
    "sample": "sample",
    "sample": [
        "sample"
    ]
}
```

Subscribing with multiple symbols and topics is supported.

```json
{
    "id": "test", // optional
    "op": "sample",
    "args": [
        "sample",
        "sample",
        "sample"
    ]
}
```

### Understanding WebSocket filters: Unsubscribing

You can dynamically subscribe and unsubscribe from topics without unsubscribing from the WebSocket like so:

```json
{
    "sample": "sample",
    "sample": [
        "sample"
    ],
    "id": "sample"
}
```

## Understanding the subscription response
> Topic subscription response message example

<Tabs>
<TabItem value="sample" label="EXAMPLE OF TABBED AREA">

Will - the below result came from: `curl -L -X GET 'https://api.n07.testnet.vega.xyz/api/v2/stream/orders?marketId=10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2'``

```json
{
  "result": {
    "updates": {
      "orders": [
        {
          "id": "88ba7b4460950ff7db3df5fbdd6b3c9eecee37036fe7feb69dfbf93713f9d2c2",
          "marketId": "10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2",
          "partyId": "faf83ce0533a2321ba2c0570844c631d4d888f6cc0e549e5222c1964ed764338",
          "side": "SIDE_BUY",
          "price": "587046",
          "size": "95",
          "remaining": "95",
          "timeInForce": "TIME_IN_FORCE_GTT",
          "type": "TYPE_LIMIT",
          "createdAt": "1678972419510212000",
          "status": "STATUS_EXPIRED",
          "expiresAt": "1678972479146387000",
          "reference": "traderbot",
          "updatedAt": "1678972479803082000",
          "version": "1",
          "batchId": "12",
          "peggedOrder": null,
          "liquidityProvisionId": ""
        }
      ]
    }
  }
}
```
</TabItem>

<TabItem value="sample-2" label="EXAMPLE OF TABBED AREA2">

```json
{
    "success": true,
    "ret_msg": "subscribe",
    "conn_id": "sample",
    "req_id": "sample",
    "op": "subscribe"
}
```
</TabItem>


<TabItem value="sample-3" label="EXAMPLE OF TABBED AREA3">

```json
{
    "success": true,
    "conn_id": "sample",
    "data": {
    "failTopics": [],
    "successTopics": [
        "stuff"
    ]
},
    "type": "TYPE"
}
```

</TabItem>
</Tabs>

## Available websocket APIs
List here with links to all the available ones that we provide.