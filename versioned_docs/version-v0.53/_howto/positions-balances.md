---
sidebar_position: 10
title: Positions and balances
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Positions and balances

## Introduction

Using Vega's APIs, you can track collateral balances (also known as collateral accounts in Vega queries), as well as view information about your positions, such as the profit and loss on trades.

There are several different types of accounts on Vega, each specific to how the collateral is accessed and managed:

* **INSURANCE**  
Insurance accounts are available and show the total amount of collateral currently held in the insurance pool.
* **MARGIN**  
Margin accounts are available when a position is open on a market for a party.
* **GENERAL**  
General accounts are where undeployed collateral is held, ready to be deployed on a market by trading or used for governance.
* **SETTLEMENT**  
Accounts used during the settlement process only.

There are two types of scope for accounts, market or party based, where market scope is related to balances for a specific market, and party scope is related to balances for a specific party (public key).

In order to track your account balances and positions on Vega there are several APIs available:

## Listing collateral accounts for a party (public key)

Connect to a Vega API server, and request *accounts for a party*:  

:::info
Note: account balances of any party for which a public key is known can be publicly listed on Vega.  
:::

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.sh#L85-L90
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.py#L105-L110
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `accounts` | A list of zero or more accounts for the party specified. Balances use decimal place values specified by the asset, e.g. 5 decimal places. A party will have one GENERAL account and MARGIN account for each market where they have an open position. Governance assets will also be listed in the GENERAL account, e.g. tVEGA. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/response-examples.txt#L54-L90
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/).
:::

This request has additional (optional) request filter parameters for *market identifier*, *type* and *asset*. Specifying a market will return only accounts related to a particular market and an empty list if the market is not found. Specifying the type will return only accounts related to a particular type e.g. INSURANCE, and specifying an asset will return accounts relating to a particular asset.


## Listing collateral accounts for a market

Connect to a Vega API server, and request *accounts for a market*:  

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.sh#L72-L77
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.py#L91-L97
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `accounts` | A list of zero or more accounts for the market specified. Balances use decimal place values specified by the asset, e.g. 5 decimal places. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/response-examples.txt#L30-L50
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/).
:::

Similar to querying for accounts for a party, this request has an additional (optional) request filter parameter for *asset*. Specifying an asset will return only accounts related to a particular asset and an empty list if the market is not found.


## Listing positions for a party (public key)

Positions requests return key information such as realised and unrealised profit and loss (PNL), current open volume, etc.

Connect to a Vega API server, and request *positions for a party*:  

<GitPod />

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.sh#L98-L103
```

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-accounts.py#L118-L123
```

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `positions` | A list of zero or more positions for the party specified. Each position will include a reference to the related market and the timestamp for when the values were last updated. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/response-examples.txt#L94-L108
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/).
:::

## What's next?

 * Listing [Orders and trades](list-orders-trades.md) data
 * [Market creation](create-market.md) using governance
