---
sidebar_position: 6
title: Market information
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Markets and Market Data

:::danger Broken links
* REST API reference
* [auction mode](https://docs.fairground.vega.xyz/docs/trading-questions/#auction-trading-mode)
:::

## Introduction

Markets on Vega are defined by the **Market framework** (see [Vega Whitepaper](https://vega.xyz/papers/vega-protocol-whitepaper.pdf) for explanation), it is one of the core features of the protocol and central to a design for flexibility. Markets can be proposed on a network and can be voted in using governance. Derivatives markets on a network are composed from a set of parameters and include a risk model. 

Both market information and market data are queryable, the following guides show how to use the APIs:

## Listing markets on a Vega network

Connect to a Vega API server, and request *all markets*:  

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/get-markets-and-marketdata.sh#L25-L30
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/Markets) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/get-markets-and-marketdata.py#L33-L38
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/Markets) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `markets` | A list of zero or more markets available on a Vega network. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/response-examples.txt#L2-L84
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/).
:::

## Requesting market data

Connect to a Vega API server, and request the *market data for a market*:  

<GitPod />

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/get-markets-and-marketdata.sh#L36-L41
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/MarketsData) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/get-markets-and-marketdata.py#L45-L50
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/MarketsData) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `marketData` | A collection of market data for the specified market. See below more information on each value. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/response-examples.txt#L88-L126
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-markets-and-market-data/).
:::

| Field information |
| :----------------- |
| **Mark Price** -- A concept derived from traditional markets. It is a calculated value for the 'current market price' on a market. <hr/> **Market** -- The unique market identifier for the data returned. <hr/> **Best Bid Price** -- The highest price level on an order book for buy orders on the market. <hr/> **Best Bid Volume** -- The aggregated volume being bid at the best bid price on the market. <hr/> **Best Offer Price** -- The lowest price level on an order book for offer orders on the market. <hr/> **Best Offer Volume** -- The aggregated volume being offered at the best offer price on the market. <hr/> **Mid Price** -- The arithmetic average of the best bid price and best offer price on the market. <hr/> **Static Mid Price** -- The arithmetic average of the best static bid price and best static offer price on the market. <hr/> **Best Static Bid Price** -- The highest price level on the order book for non dynamic buy orders on the market. <hr/> **Best Static Bid Volume** -- The aggregated volume being bid at the best static bid price on the market. <hr/> **Best Static Offer Price** -- The lowest price level on an order book for non dynamic offer orders on the market. <hr/> **Best Static Offer Volume** -- The aggregated volume being bid at the best static offer price on the market. <hr/> **Auction Start** -- The auction starting timestamp (when in [auction mode](../trading-questions.md#auction-trading-mode). <hr/> **Auction End** -- The auction ending timestamp (when in [auction mode](../trading-questions.md#auction-trading-mode). <hr/> **Indicative Price** -- The price at which all trades would occur if the auction was uncrossed now (when in [auction mode](../trading-questions.md#auction-trading-mode). <hr/> **Indicative Volume** -- The volume at which all trades would occur if the auction was uncrossed now (when in [auction mode](../trading-questions.md#auction-trading-mode). <hr/> **Market Trading Mode** -- Continuous trading or [auction mode](../trading-questions.md#auction-trading-mode. <hr/> **Trigger** -- Price monitoring trigger (if available). A price monitoring trigger is constructed using a fixed horizon and probability level. <hr/> **Target Stake** -- Target amount of stake committed relative to what is happening on the market. Currently based on open interest, which is the volume of all open positions. <hr/> **Supplied Stake** -- The current stake supplied on the market. <hr/> **Open Interest** -- The volume of all open positions in a given market (the sum of the size of all positions greater than 0). <hr/> **Price Monitoring Bounds** -- The current bounds used for price monitoring, includes the price monitoring settings (trigger). The market will go into a price monitoring [auction](../trading-questions.md#auction-trading-mode if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model and the market’s price monitoring settings. See the section on [Market Monitoring](../trading-questions.md#market-monitoring for more detail. |



## What's the difference between Market and Market Data?

**Market information** is the current static information/configuration of the markets available on a Vega network, where as **Market Data** is the latest data available from trading within the market itself. Information such as the *settlement date* of a future or the *risk model* will be found by querying for a Market. Data such as *best bid price* or *open interest* will be found in Market Data.

## What's next?

 * Change or [Amend an order](amend-order.md)
 * Made a mistake? [Cancel an order](cancel-order.md)
