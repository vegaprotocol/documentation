---
weight: 70
title: Listing orders and trades
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Orders and Trades

:::danger broken links
* REST API reference
* gRPC API reference
* [Market and trading info](https://docs.fairground.vega.xyz/docs/trading-questions/#what-are-the-fees-for-trading-on-the-vega-testnet-and-who-gets-the-fees)
:::

## Introduction

In order to track your orders and trades on Vega there are several APIs available. An order may have zero or more related trades and a trade will have exactly one related *buy* order and one related *sell* order.

The following examples show how easy it is to retrieve orders and trades on Vega, as well as answers to common questions.

## Listing orders on a market

Connect to a Vega API server, and request *orders on a market*:  

:::info
See the how-to guide for [Market information](markets.md) to learn how to get a list of market identifiers on Vega.
:::



{{< gitpod >}}

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">


:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market.sh#get_orders_for_market" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrdersByMarket) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market.py#get_orders_for_market" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrdersByMarket) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">


Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of orders on a market*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market-with-Vega-API-client.py#get_orders_for_market" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.OrdersByMarketResponse) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `orders` | A list of zero or more orders for the market specified. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/response-examples.txt#example_get_orders_for_market_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/).
:::



## Listing orders for a party (public key)

Connect to a Vega API server, and request *orders for a party*:  



{{< gitpod >}}

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-party.sh#get_orders_for_party" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrdersByParty) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-party.py#get_orders_for_party" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrdersByParty) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of orders for a party*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-party-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-party-with-Vega-API-client.py#get_orders_for_party" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.OrdersByPartyResponse) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `orders` | A list of zero or more orders for the party specified. A party is normally represented by a public key. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/response-examples.txt#example_get_orders_for_party_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/).
:::



## Listing trades for an order

Connect to a Vega API server, and request *trades for an order*:  



{{< gitpod >}}

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-trades-for-order.sh#get_trades_for_order" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/TradesByOrder) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-trades-for-order.py#get_trades_for_order" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/TradesByOrder) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of trades for an order*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-trades-for-order-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-trades-for-order-with-Vega-API-client.py#get_trades_for_order" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.TradesByOrderResponse) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `trades` | A list of zero or more trades for the party specified. A party is normally represented by a public key. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/response-examples.txt#example_get_trades_for_order_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/).
:::



## Listing trades on a market

Connect to a Vega API server, and request *trades on a market*:  

:::info
See the how-to guide for [Market information](markets.md) to learn how to get a list of market identifiers on Vega.
:::



{{< gitpod >}}

<Tabs groupId="codesamples4">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market.sh#get_trades_for_market" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/TradesByMarket) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market.py#get_trades_for_market" >}}
:::

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/TradesByMarket) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">


Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of trades on a market*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/get-orders-and-trades-for-market-with-Vega-API-client.py#get_trades_for_market" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.TradesByMarketResponse) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `trades` | A list of zero or more trades for the market specified. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/response-examples.txt#example_get_trades_for_market_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-orders-and-trades/).
:::



## Where do I find the fees charged for a trade?

Any fees charged on Vega are shown on [individual trades](#listing-trades-for-an-order) returned by the API. For example, on each trade there are the following fields:

| Field          |  Description  |
| :----------------- | :------------- |
| `buyerFee` | Any fees for the party on **buy** side of the trade, also known as the `buyer`. |
| `sellerFee` | Any fees for the party on **sell** side of the trade, also known as the `seller`. |

```
  "buyerFee": {                                  "sellerFee": {
     "infrastructureFee": "37963",                  "infrastructureFee": "0",
     "liquidityFee": "75926",                       "liquidityFee": "0",
     "makerFee": "18982"                            "makerFee": "0"
  }                                              }
```

:::info
**Fee values** are in the settlement currency with decimal precision (DP) for the market the trade occurred on.
:::

Contained inside each of the buyer and seller fee structures are the fees charged:

| Field          |  Description  |
| :----------------- | :------------- |
| `infrastructureFee` | Fees paid to validators as a reward for running the infrastructure of the network. |
| `liquidityFee` | Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market. |
| `makerFee` | Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker). |

Fees are incurred on every trade on Vega, but it is the price taker who pays the fee. The price taker only sees one fee. The price taker is the party that traded using a market order, or placed a limit order that traded immediately. See the explainer section on [Market and trading info](../trading-questions.md#what-are-the-fees-for-trading-on-the-vega-testnet-and-who-gets-the-fees) to learn more on how fees are calculated, and who gets the fees.


## What's next?

 * [Market creation](create-market.md) using governance
 * Learn about [Streaming events](event-stream.md)
