---
sidebar_position: 17
title: Vega Time
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Vega Time 

:::danger Broken links
* REST API reference
* gRPC API reference
:::

## Why do we need the concept of Vega Time? 

As Vega runs on a custom blockchain optimised for trading (with a consensus layer currently built on top of Tendermint) the protocol requires participants to trade using commands submitted to the blockchain as transactions. 

The deterministic ordering of transactions is coordinated by validators on the blockchain. Importantly, they also provide the notion of the current timestamp for a block of transactions. We refer to this timestamp as *Vega Time*. 

In some of the most popular cryptocurrency blockchains there is only a concept of block number with no internal reference to a 'real world' date and time. 

For Vega's use case, a time reference is particularly useful for financial trading infrastructure. For example, a futures market might need a settlement date and time reference related to a real world oracle event like the Bitcoin price at midnight on December 31st 2023. The blockchain time is always expressed in Coordinated Universal Time (UTC) and the time provided by the network is the single source of truth.

When users of a Vega network require a timestamp, such as for setting the expiry time of a GTT order, they should first query the latest blockchain time and then use this as their base rather than their local atomic machine clock to ensure that their expiry time will be accurate.

For more information on how UTC timestamps are provided under the hood, please see the following article on  [BFT time](https://docs.tendermint.com/master/spec/consensus/bft-time.html) which is created and maintained by the Tendermint team.

## Requesting the latest blockchain time on Vega

Connect to a Vega API server, and request the latest *Vega Time*:

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/get-time.sh#L25-L30
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetVegaTime) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/get-time.py#L32-L39
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetVegaTime) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `timestamp` | The timestamp for the current Vega Time, formatted as a numeric value of the number of nanoseconds since the UNIX epoch (January 1, 1970 00:00 UTC). In other words, it's a 64-bit UNIX timestamp with nanosecond precision. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/response-examples.txt#L2-L5
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/).
:::



## Uses of Vega Time

 * Vega Time reference is used in the [Submit an order](submit-order.md) how-to guide and several others
 * When working with candlestick chart data, market open/closing times and amending orders
