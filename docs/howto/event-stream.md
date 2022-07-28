---
sidebar_position: 14
title: Streaming events
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Streaming events from Vega

:::danger Broken links
Almost all of them!
:::

## Introduction

There are several streaming data APIs available on Vega. These include, but are not limited to: streaming trades, orders, positions, market data and **events**. 

An event is an action or a side-effect that is triggered by a Vega node in response to a state change, for instance, starting of an auction or blockchain time updating. Events are streamed from something we refer to as an *Event Bus*.

Streaming **events** from the event bus APIs can provide rich real-time information to your client applications.

## Events

Below is a table of all the event bus types that can be returned from a Vega Node:

| Event type/code                    | Description                                                                            |
:----------------------------------- | :------------------------------------------------------------------------------------- |
| `BUS_EVENT_TYPE_ALL`                 | Receive events by ALL event types, used when filtering stream from event bus. <br/> **NOTE: GraphQL API does not currently support subscribing to ALL events.**<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.BusEventType). |
| `BUS_EVENT_TYPE_TIME_UPDATE` (gRPC) <br/> `TimeUpdate` (GraphQL) | Event for blockchain time updates.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.TimeUpdate) or [GraphQL](/api/graphql/data-node/timeupdate.doc.html).  |
| `BUS_EVENT_TYPE_TRANSFER_RESPONSES` (gRPC) <br/> `TransferResponses` (GraphQL) | Event for when a transfer happens internally, contains the transfer information.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.TransferResponses) or [GraphQL](/api/graphql/data-node/transferresponse.doc.html).  |
| `BUS_EVENT_TYPE_POSITION_RESOLUTION` (gRPC) <br/> `PositionResolution` (GraphQL) | Event indicating position resolution has occurred.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.PositionResolution) or [GraphQL](/api/graphql/data-node/positionresolution.doc.html). |
| `BUS_EVENT_TYPE_ORDER` (gRPC) <br/> `Order` (GraphQL)  | Event for order updates, both new and existing orders.<br/>See API reference for [gRPC](/api/grpc/#vega.Order) or [GraphQL](/api/graphql/data-node/order.doc.html). |
| `BUS_EVENT_TYPE_ACCOUNT` (gRPC) <br/> `Account` (GraphQL)  | Event for account updates.<br/>See API reference for [gRPC](/api/grpc/#vega.Account) or [GraphQL](/api/graphql/data-node/account.doc.html). |
| `BUS_EVENT_TYPE_PARTY`  (gRPC) <br/> `Party` (GraphQL)  | Event for party updates.<br/>See API reference for [gRPC](/api/grpc/#vega.Party) or [GraphQL](/api/graphql/data-node/party.doc.html). |
| `BUS_EVENT_TYPE_TRADE` (gRPC) <br/> `Trade` (GraphQL) | Event indicating a new trade has occurred.<br/>See API reference for [gRPC](/api/grpc/#vega.Trade) or [GraphQL](/api/graphql/data-node/trade.doc.html). |
| `BUS_EVENT_TYPE_MARGIN_LEVELS` (gRPC) <br/> `MarginLevels` (GraphQL) | Event indicating margin levels have changed for a party.<br/>See API reference for [gRPC](/api/grpc/#vega.MarginLevels) or [GraphQL](/api/graphql/data-node/marginlevels.doc.html). |
| `BUS_EVENT_TYPE_PROPOSAL` (gRPC) <br/> `Proposal` (GraphQL) | Event for proposal updates (for governance).<br/>See API reference for [gRPC](/api/grpc/#vega.Proposal) or [GraphQL](/api/graphql/data-node/proposal.doc.html). |
| `BUS_EVENT_TYPE_VOTE`  (gRPC) <br/> `Vote` (GraphQL) | Event indicating a new vote has occurred (for governance).<br/>See API reference for [gRPC](/api/grpc/#vega.Vote) or [GraphQL](/api/graphql/data-node/vote.doc.html).  |
| `BUS_EVENT_TYPE_MARKET_DATA` (gRPC) <br/> `MarketData` (GraphQL) | Event for when market data updates.<br/>See API reference for [gRPC](/api/grpc/#vega.MarketData) or [GraphQL](/api/graphql/data-node/marketdata.doc.html).  |
| `BUS_EVENT_TYPE_NODE_SIGNATURE` (gRPC) <br/> `NodeSignature` (GraphQL) | Event for a new signature for a Vega node.<br/>See API reference for [gRPC](/api/grpc/#vega.commands.v1.NodeSignature) or [GraphQL](/api/graphql/data-node/nodesignature.doc.html).  |
| `BUS_EVENT_TYPE_LOSS_SOCIALIZATION` (gRPC) <br/> `LossSocialization` (GraphQL) | Event indicating loss socialisation occurred for a party.<br/>See API reference for [gRPC](/api/grpc//#vega.events.v1.LossSocialization) or [GraphQL](/api/graphql/data-node/losssocialization.doc.html). |
| `BUS_EVENT_TYPE_SETTLE_POSITION` (gRPC) <br/> `SettlePosition` (GraphQL) | Event for when a position is being settled.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.SettlePosition) or [GraphQL](/api/graphql/data-node/settleposition.doc.html). |
| `BUS_EVENT_TYPE_SETTLE_DISTRESSED` (gRPC) <br/> `SettleDistressed` (GraphQL) | Event for when a position is distressed.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.SettleDistressed) or [GraphQL](/api/graphql/data-node/settledistressed.doc.html). |
| `BUS_EVENT_TYPE_MARKET_CREATED` (gRPC) <br/> `MarketCreated` (GraphQL) | Event indicating a new market was created.<br/>See API reference for [gRPC](/api/grpc/#vega.Market) or [GraphQL](/api/graphql/data-node/market.doc.html). |
| `BUS_EVENT_TYPE_ASSET` (gRPC) <br/> `Asset` (GraphQL)  | Event for when an asset is added to Vega.<br/>See API reference for [gRPC](/api/grpc/#vega.Asset) or [GraphQL](/api/graphql/data-node/asset.doc.html). |
| `BUS_EVENT_TYPE_MARKET_TICK` (gRPC) <br/> `MarketTick` (GraphQL) | Event indicating a market tick event.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.MarketTick) or [GraphQL](/api/graphql/data-node/markettick.doc.html). |
| `BUS_EVENT_TYPE_WITHDRAWAL` (gRPC) <br/> `Withdrawal` (GraphQL)  | Event for when a withdrawal occurs.<br/>See API reference for [gRPC](/api/grpc/#vega.Withdrawal) or [GraphQL](/api/graphql/data-node/withdrawal.doc.html). |
| `BUS_EVENT_TYPE_DEPOSIT` (gRPC) <br/> `Deposit` (GraphQL)  | Event for when a deposit occurs.<br/>See API reference for [gRPC](/api/grpc/#vega.Deposit) or [GraphQL](/api/graphql/data-node/deposit.doc.html). |
| `BUS_EVENT_TYPE_AUCTION` (gRPC) <br/> `Auction` (GraphQL)  | Event indicating a change in auction state, for example starting or ending an auction.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.AuctionEvent) or [GraphQL](/api/graphql/data-node/auctionevent.doc.html). |
| `BUS_EVENT_TYPE_RISK_FACTOR` (gRPC) <br/> `RiskFactor` (GraphQL) | Event indicating a risk factor has been updated.<br/>See API reference for [gRPC](/api/grpc/#vega.RiskFactor) or [GraphQL](/api/graphql/data-node/riskfactor.doc.html). |
| `BUS_EVENT_TYPE_NETWORK_PARAMETER` (gRPC) | Event indicating a [network parameter](https://lb.testnet.vega.xyz/network/parameters) has been added or updated. |
| `BUS_EVENT_TYPE_LIQUIDITY_PROVISION` (gRPC) <br/> `LiquidityProvision` (GraphQL) | Event indicating a liquidity provision commitment has been created or updated. |
| `BUS_EVENT_TYPE_MARKET` (gRPC) <br/> `Market` (GraphQL) | Event indicating a market related event, for example when a market opens.<br/>See API reference for [gRPC](/api/grpc/#vega.events.v1.MarketEvent) or [GraphQL](/api/graphql/data-node/marketevent.doc.html). |

## Streaming from the event bus

The following example describes how to subscribe to and receive a stream of events using Vega's APIs. Streaming is only supported on gRPC and GraphQL.

There are three request parameters that control the output on the stream from the Vega API:

| Field          |  Description  |
| :----------------- | :------------- |
| `type` |  **Required field**. An event type code (from table above), for example, to receive a stream with no filtering, specify `BUS_EVENT_TYPE_ALL` for gRPC (Note: ALL events not supported on GraphQL). <br/><br/> To receive *only* blockchain time updates, specify `BUS_EVENT_TYPE_TIME_UPDATE` for gRPC or `TimeUpdate` on GraphQL. <br/><br/> The event types are named differently to fit in with GraphQL conventions, please see the table above or the [schema documentation](/api/graphql/data-node/subscription.doc.html#L92) for the full list. |
| `batchSize` | **Required field**. The total number of events to batch up on the server before sending to the client. The default value is `0` which will send any and all events when they are available. If the client is not ready for the next data-set, data may be dropped a number of times, and eventually the stream will be closed. <br/><br/> For high traffic event types, it is advised to fine tune your client for receiving events, a good starting point is `5000` and then adjust this figure up or down based on real world results.|
| `marketId` | **Optional field**. Specify a valid market identifier to receive events for this market *only*. |
| `partyId` | **Optional field**. Specify a valid party identifier to receive events for this party *only*. |

Connect to a Vega API server, and request to *stream from the event bus*:  

<Tabs groupId="codesamples1">
<TabItem value="shell-graphql" label="Shell (GraphQL)">

Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to subscribe to *ALL events for a particular market*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-events/stream-events.sh#L34-L69
```

See also [GraphQL API reference](/api/graphql/data-node/subscription.doc.html#L75) for further query detail.
</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `events` | A list of zero or more events. If the `BUS_EVENT_TYPE_ALL` types filter is specified the `type` field returned in each event will give the event type code (see above), a unique identifier for the event in an `id` field and a payload which can be one of the data records associated with the type, for example, an `Account` for `BUS_EVENT_TYPE_ACCOUNT` or an `AuctionEvent` for `BUS_EVENT_TYPE_AUCTION` (see above). See example response (below) which shows different payloads for bus event types returned. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-events/response-examples.txt#L2-L44
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-events/).
::::

## Are there any limitations to this API?

If you are looking to access streams of single data records such as orders, trades, positions etc. then please refer to the API reference documentation to stream the individual data source. [Sample scripts for streaming orders and trades](https://github.com/vegaprotocol/sample-api-scripts/tree/master/stream-orders-and-trades) are available on GitHub. 

As mentioned earlier, the GraphQL API does not currently support streaming `BUS_EVENT_TYPE_ALL` events, however this is fully supported by the gRPC API. 

## What's next?

 * What's the [Vega Time](time.md)?
 * Try the [Vega block explorer](https://explorer.fairground.wtf/)
