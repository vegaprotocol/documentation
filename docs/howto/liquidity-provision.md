---
sidebar_position: 16
title: Liquidity provision
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Liquidity provision

## Introduction

Liquidity Provision (LP) on Vega is designed to incentivise participants to place orders on the market that maintain liquidity on the order book.

## How do I provide a liquidity commitment?

Connect to a Vega API server, and *provide a liquidity commitment*:

### 1. Log in to wallet and get public key

See the section on the [Wallet service](wallet.md) to learn how to log in, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-create-liquidity-provision/) repo.
:::

### 2. Choose a market and ensure account/asset balance

In order to provide liquidity on a [target market](markets#listing-markets-on-a-vega-network), the [account balance](positions-balances/#listing-collateral-accounts-for-a-party-public-key) for the settlement asset on the related public key (party) should be positive and sufficient to cover the commitment. 

For more information on how to deposit an asset into Vega the guide in the [Vega Bridge GitHub repo](https://github.com/vegaprotocol/Public_Test_Bridge_Tools).

### 3. List all liquidity provisions for the market

Connect to a Vega API server, and request *all liquidity provisions* for the specified market:

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.sh#L82-L87
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.py#L111-L118
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `liquidityProvisions` | A collection of liquidity provision data for the specified market. See below more information on each value. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/response-examples.txt#L20-L98
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-create-liquidity-provision).
:::

| Field information |
| :----------------- |
| **Id** -- A unique identifier for the liquidity provision. <hr/> **Party Id** -- The unique identifier of the party which submitted the liquidity provision. <hr/> **Created At** -- A timestamp for when the liquidity provision was created at, in nanoseconds since the Unix epoch. <hr/> **Updated At** -- A timestamp for when the liquidity provision was updated at, in nanoseconds since the Unix epoch. <hr/>  **Market Id** -- The unique market identifier for the data returned. <hr/>  **Commitment Amount** -- Specified as a unitless number that represents the amount of settlement asset of the market. <hr/>  **Fee** -- Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per setting fees and rewarding liquidity providers. <hr/>  **Sells** -- A set of liquidity sell orders which may get deployed automatically to assure the liquidity provision obligation is always met. <hr/>  **Buys** -- A set of liquidity buy orders which may get deployed automatically to assure the liquidity provision obligation is always met. <hr/>  **Version** -- Version of the liquidity commitment transaction (incremented with every re-submission). <hr/>  **Status** -- Status of the liquidity commitment transaction. <hr/>  **Reference** -- A reference shared between this liquidity provision and all its orders. |

### 4. Compose a liquidity commitment submission message

When submitting a liquidity commitment message, the following fields must be specified:
- market identifier,
- commitment amount,
- proposed liquidity fee,
- a set of liquidity buy and sell shapes 

Please note that the request will be rejected if the message is invalid. This could be because of the market state, the message is formatted incorrectly, or the requested liquidity commitment cannot be supported with your current balance in the market settlement asset.

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.sh#L97-L132
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.py#L129-L167
```

</TabItem>
</Tabs>

### 5. Compose a liquidity commitment amendment message

If the liquidity commitment message has already been submitted successfully, submitting an amend message will serve to amend the liquidity provision.
To amend, keep `liquidityCommitment` positive (unchanged to leave as is) and modify any fields which should be amended.

Please note that the request will be rejected if the message is invalid, and the liquidity commitment will stay as is. This could be because of the market state, the message is formatted incorrectly, or the requested liquidity commitment cannot be supported with your current balance in the market settlement asset.

<GitPod />

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.sh#L165-L189
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.py#L123-L148
```

</TabItem>
</Tabs>

### 6. Compose a liquidity commitment cancellation message

If the liquidity commitment message has already been submitted successfully, submitting a cancel message will serve to cancel the liquidity provision.

Please note that the cancellation message will be rejected if the message is invalid, and the liquidity commitment will stay as is. This could be because of the market state, the message is formatted incorrectly, or the requested liquidity commitment cannot be supported with your current balance in the market settlement asset.

<GitPod />

<Tabs groupId="codesamples4">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.sh#L94-L103
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.py#L125-L135
```

</TabItem>
</Tabs>

### 7. Sign and send the transaction

<GitPod />

<Tabs groupId="codesamples5">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.sh#L140-L150
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/submit-create-liquidity-provision-order.py#L173-L177
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A **signed** transaction message containing the liquidity commitment submission data. Because `propagate` is set to true, the signed data will be automatically forwarded by the wallet server to a node. If you wish to manually submit the transaction you can do so with the data in `signature` (`tx`) and set `propagate` to false. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/submit-create-liquidity-provision/response-examples.txt#L2-L15
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-create-liquidity-provision).
:::



## What's next?

 * What's the [Vega Time](time)?
 * Try the [Vega block explorer](https://explorer.fairground.wtf/)
