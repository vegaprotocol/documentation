import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cancelling orders

:::danger Broken links
* three instances of [Wallet API](https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction)
:::

## Introduction

Cancelling orders for a party on Vega can be done in three ways:

* Cancel a **single order** on a market.
* Cancel **all orders** on a **single market**.
* Cancel **all orders** on **all markets**.

In a similar way to submitting an order, all cancellations must be prepared and signed before submitting to the Vega network. Orders can only be cancelled if they have a status which is `active`, not `expired` and not fully filled. 

:::info
See the [API reference](/api/grpc/#vega.Order.Status) to learn more about **order status** codes on Vega.
:::

## How do I cancel orders?

It is only possible to cancel orders for a party for which you have a public/private key pair.

Connect to a Vega API server, and *cancel an order*:

### 1. Log in to wallet and get public key

See the section on the [Wallet service](wallet.md) to learn how to log in, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/) repo.
:::

### 2. Compose an order cancellation message

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

<details><summary>Cancel a single order</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#prepare_cancel_order_req1" on >}}
:::
</details>
<details><summary>Cancel all orders on a market </summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#prepare_cancel_order_req2" on >}}
:::
</details>
<details><summary>Cancel all orders on all markets </summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#prepare_cancel_order_req3" on >}}
:::
</details>
</TabItem>
<TabItem value="python-rest" label="Python (REST)">
<details><summary>Cancel a single order</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#prepare_cancel_order_req1" on >}}
:::
</details >
<details><summary>Cancel all orders on a market</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#prepare_cancel_order_req2" on >}}
:::
</details >
<details><summary>Cancel all orders on all markets</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#prepare_cancel_order_req3" on >}}
:::
</details >
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

<details><summary>Cancel a single order</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders-with-Vega-API-client.py#prepare_cancel_order_req1" on >}}
:::
</details >

<details><summary>Cancel all orders on a market</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders-with-Vega-API-client.py#prepare_cancel_order_req2" on >}}
:::
</details >

<details><summary>Cancel all orders on all markets</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders-with-Vega-API-client.py#prepare_cancel_order_req3" on >}}
:::
</details >

</TabItem>
</Tabs>


### 3. Sign and send the transaction

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#sign_tx_cancel" >}}
:::

See also [Wallet API](/wallet-api/#sign-a-transaction) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#sign_tx_cancel" >}}
:::

See also [Wallet API](/wallet-api/#sign-a-transaction) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders-with-Vega-API-client.py#sign_tx_cancel" >}}
:::

 See also [Wallet API](/wallet-api/#sign-a-transaction) for further query detail.
</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A **signed** transaction message containing the cancellation data. Because `propagate` is set to true, the signed data will be automatically forwarded by the wallet server to a node. If you wish to manually submit the transaction you can do so with the data in `signature` (`tx`) and set `propagate` to false. |

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/response-examples.txt#example_sign_tx_cancel_response" on >}}
:::
  
:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/).
:::
</details>



## What's next?

 * Retrieve collateral [Positions and balances](positions-balances.md)
 * Listing [Orders and trades](list-orders-trades.md) data
