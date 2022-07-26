---
sidebar_position: 5
title: Order references
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Order references

:::danger Broken links
* REST API reference
* gRPC API reference
* GraphQL API reference
:::

## Introduction

When submitting orders to Vega, the order messages must be signed and sent to the Vega blockchain in the form of transactions. Validation checks are performed at multiple stages in the pipeline, for example, before consensus and after consensus. 

An order is assigned a unique identifier at the point it's accepted into the core matching engine, this is after consensus on the blockchain. Therefore users are required to keep track of their orders using something called the **order reference**. 

This is a **user definable field** and is recommended to be set to a globally unique value.

## How do I find my order after submission?

There are two options, query for the reference or if using gRPC or GraphQL subscribe to a stream of orders and wait for your order to arrive on the stream with the unique order identifier attached.

:::info
Vega aims to produce a block every *1 second*, which means that it may take *1+ seconds* before your order is processed by the blockchain and made available through the API.
:::

### Query for an order by reference

Connect to a Vega API server, and request for an order by *reference*. 



{{< gitpod >}}

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-by-reference/get-order-by-reference.sh#get_order_by_ref" >}}
:::

  See also wallet [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrderByReference) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-by-reference/get-order-by-reference.py#get_order_by_ref" >}}
:::

  See also wallet [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/OrderByReference) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for an order by *reference*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-by-reference/get-order-by-reference-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-by-reference/get-order-by-reference-with-Vega-API-client.py#get_order_by_ref" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.OrderByReferenceRequest) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `order` | If found, an order record matching the reference provided will be returned. If there is no matching order for reference, or the order with reference has not been processed completely by Vega, then no records will be returned. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/get-by-reference/response-examples.txt#example_get_order_by_ref_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/vega-time/).
:::



### Subscribe to a stream of orders for a party

Connect to a Vega API server, and request to *stream of orders*:  



{{< gitpod >}}

<Tabs groupId="codesamples2">
<TabItem value="shell-graphql" label="Shell (GraphQL)">
Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to subscribe to a stream of *orders for a party*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-orders-by-reference/stream-orders.sh#stream_orders_by_ref" >}}
:::

  See also [GraphQL API reference](/api/graphql/subscription.doc.html#L15) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to receive a stream of **orders for a party*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-orders-by-reference/stream-orders-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-orders-by-reference/stream-orders-with-Vega-API-client.py#stream_orders_by_ref" >}}
:::

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.OrdersSubscribeRequest) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `orders` | A stream of zero or more orders will be returned, filtering the orders stream on order reference will attempt to find an order by reference. Note: There is currently no direct order by reference filter available on streams. |

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/stream-orders-by-reference/).
:::




## What's next?

* Find out about [Markets and Market data](markets.md)
* Change or [Amend an order](amend-order.md)
