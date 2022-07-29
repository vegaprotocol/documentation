---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Amending orders

## Introduction

Amending an order is a common practice for many trading workflows. While you can cancel an open order and submit a new one, amending an order may be a preferred option. There are several fields that can be amended directly in one operation on Vega. These include:

* **SIZE**  
Amending the size of an order uses the notion of `sizeDelta`, meaning the user should specify a difference (either positive or negative) to the current size for the order. For example, an existing active order with size 100 could be amended with a size delta of -70 to give a new size after amendment of 30. If the size delta was 45 then the new size after amendment would be 145.

* **PRICE**  
Amending the price of an order uses `price` with a nested `value`. Specifying a non-zero value will attempt to amend the order to that price. For example, an existing active order with price 10000 can be amended with a non-negative price `value`, such as 5000. After the amendment the order should have a price of 5000. Any part of an order filled at a previous price will remain, only the unfilled portion can be amended. 

* **TIME IN FORCE (TIF)**  
Amending the time in force for an active order can be done for `TIME_IN_FORCE_GTC` or `TIME_IN_FORCE_GTT`. `TIME_IN_FORCE_FOK` or `TIME_IN_FORCE_IOC` cannot be amended. Any attempt to amend to another time in force value will be rejected. A `TIME_IN_FORCE_GTT` order must have an `expiresAt` value but a `TIME_IN_FORCE_GTC` must not have one. Any attempt to amend to or from the values `TIME_IN_FORCE_GFA` and `TIME_IN_FORCE_GFN` will also result in a rejected amendment.

* **EXPIRY**  
It is possible to change the expiry time for an order, similar to amending the `price`, the `expiresAt` field has a nested `value`. Specifying a valid non-zero `value` will attempt to amend the order to that expiry timestamp. See the section on [Vega Time](time.md) for more detail on how to retrieve the current time from the blockchain.

* **PEGGED ORDER**  
A pegged order can be amended in a similar way to a regular limit order. Their `reference`, `offset` and `TIF` values can all be amended. If amending an order cannot be performed in-place, the order will lose time priority in the order book (but will keep its priority in the list of pegged orders). Amends must be done to the pegged order itself, not any limit orders derived from pegged orders. It is **not possible** to amend a regular limit order to be a pegged order, and similarly it is also **not possible** to amend a pegged order to be a regular limit/market order. Please use the `peggedReference` field to amend the pegged order reference and the `peggedOffset` field to amend the pegged order offset distance, both can be amended independently. Sample scripts for submitting and amending a pegged order are available on [GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-amend-pegged-order). 

## How do I amend an order?

If an order is active and was placed with a party for which you have a public/private key pair, you can amend it. Connect to a Vega API server, and *amend an order*:

### 1. Log in to wallet and get public key

See the section on the [Wallet service](wallet.md) to learn how to log in, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/) repo.
:::

### 2. Compose an order amendment message

<GitPod />

When sending an order amendment request, order, market and party identifiers are required. One of price, size delta, time in force or expiry values should be sent.

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L152-L164
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L177-L190
```

</TabItem>
</Tabs>

### 3. Sign and send the transaction

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.sh#L170-L180
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/submit-amend-cancel-orders.py#L196-L200
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A **signed** transaction message containing the amendment data. Because `propagate` is set to true, the signed data will be automatically forwarded by the wallet server to a node. If you wish to manually submit the transaction you can do so with the data in `signature` (`tx`) and set `propagate` to false. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/response-examples.txt#L18-L29
```
    
:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-cancel-orders/).
:::

</details>

## What's next?

* Made a mistake? [Cancel an order](cancel-order.md)
* Retrieve a list of collateral [Balances and positions](positions-balances.md)
howtos