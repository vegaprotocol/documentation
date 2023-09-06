---
title: Submit and change liquidity commitment
sidebar_position: 3
hide_title: false
description: Commit liquidity onto a market and manage that commitment
---

import NetworkParameter from '@site/src/components/NetworkParameter';

In this tutorial, you'll find:
* Resources about how liquidity works on Vega
* How to prepare and submit a liquidity commitment to express your desire to provide liquidity on a live market created with Vega
* High-level tactics for placing orders to meet your commitment
* How to change your commitment amount by amending and/or cancelling

At the end of the tutorial, find troubleshooting tips as well as more resources for understanding the mechanics of liquidity provision on Vega.

:::caution
Providing liquidity is a significant and active commitment to providing orders on a Vega market. Failure to meet the commitment may result in penalties up to losing your entire bonded amount.

[Read about the risks below.](#what-can-go-wrong-when-providing-liquidity?)
:::

## Rewarding liquidity providers
Participants who provide enough liquidity to meet the [liquidity SLA](../concepts/liquidity/rewards-penalties.md#liquidity-sla) earn from liquidity fees, which are paid by the *price takers* on each trade. The SLA requires that you provide a specified amount of liquidity for a specified amount of time in order to receive any liquidity fee revenue.

The percentage charged to each price taker is determined by sorting all the proposed fee factors. In your liquidity commitment submission, you need to propose a *fee factor*, as a decimalised number that is converted to percentage. 

Your proposed fee factor is used, with other proposed fee factors, to determine the market's liquidity fee. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower, and whether you propose a higher (or lower) factor, you are still a liquidity provider. The proposed fees are used to calculate the actual fee each participant will pay on a trade in that market.

:::note Read more 
[Proposing liquidity fee](../concepts/liquidity/rewards-penalties.md#determining-the-liquidity-fee-percentage)
[Liquidity rewards](../concepts/liquidity/rewards-penalties.md)
:::

#### List available markets [WIP]
You'll need to identify which market you want to supply liquidity to, and add the market ID to the submission transaction. 

API LINK
```bash
```

## Creating a liquidity commitment
This tutorial describes how to create, amend or cancel, and send a liquidity commitment submission.

**The liquidity commitment submission must include**:
* The **market’s unique ID**, denoted as `marketId` - Confirm that the market is in a state to accept liquidity commitment, and is not a rejected market, has not had trading terminated, or has not been settled 
* **Liquidity commitment amount**: The amount of funds that you want to allocate to providing liquidity. The amount will be moved into a bond account for the duration of your liquidity commitment, denoted as `commitmentAmount`
* **Proposed liquidity fee**: The scaling factor for the fee you are bidding to receive when your order is matched, on a scale between 0 and the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.maximumLiquidityFeeFactorLevel" />. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Note: Your proposed fee is used along with other proposed fees and commitments to determine the actual fee percentage for the market. [Learn how all proposed fee levels influence the market's fees]). Denoted as `fee` Denoted as `fee`

**To submit the liquidity commitment message, you'll also need**: 

* Public key: The public key being used to place the liquidity commitment
* Propagate: Is true or false. Propagate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected

Note: The **commitment amount** is interpreted by the asset decimal place, and expressed in an integer. In the example below, if the asset has a decimal precision of 2, the commitment amount would be 100.


```python
submission = {
    "liquidityProvisionSubmission": 
    {
        "marketId": marketID,
        "commitmentAmount": "10000",              
        "fee": "0.01",
       },
    "pubKey": pubkey,
    "propagate": True
}
```
## Methods for providing liquidity [WIP]
Providing liquidity can be done using: 
* Standard limit orders, which give you the most control over your strategy. The [batch orders transaction](../concepts/trading-on-vega/orders#batch-order) is designed to enable this efficiently
* [Iceberg orders](../concepts/trading-on-vega/orders.md#iceberg-order) allow LPs to remain competitively present on the order book without needing to supply excessive volume to a large aggressive order

Anyone that supplies limit orders is eligible to receive maker fees when volume they place on the book is hit. However, a liquidity commitment also makes an LP eligible to receive a portion of the liquidity fee from every trade in the market, on top of the maker fee.

Liquidity providers need to have enough available assets within their general and margin accounts to cover the margin for their orders and the positions that will be generated from trades. The funds within the bond account are held separate unless the combined general and margin accounts are insufficient, at which point funds from the bond account may be used. However this may come with a penalty.

Ensure your orders to provide liquidity will earn from liquidity fees by meeting those requirements. Check these parameters for the market you're targeting:
- `market.liquidity.priceRange`: Range that the liquidity orders need to be priced within
- `market.liquidity.commitmentMinTimeFraction`: How much time per epoch (as a percentage) that the liquidity needs to be supplied for to meet the SLA

:::info Read more
[Building a bot tutorial](./building-a-bot/adding-a-liquidity-commitment.md): Basics on how to incorporate liquidity orders into an automated trading setup.

[Rewards and penalties](../concepts/liquidity/rewards-penalties.md): LPs receive rewards (through fees paid by traders) when they meet the liquidity SLA. If the SLA is not met, fees are withheld and they may be further penalised for not meeting their commitment.
:::

## Amending a liquidity commitment [WIP]
When amending a liquidity commitment, the network will allow you to provide more bond for your liquidity immediately. However, if you reduce your liquidity commitment, it will only be enacted in the epoch after you submitted the amendment transaction.

If you reduce your commitment to the point where the market would drop below its required [target stake](./../concepts/liquidity/provision.md#target-stake), then you may be penalised.

### Transaction template

Template to amend a liquidity commitment: 

```
submission = {
    "liquidityProvisionAmendment": {
        "marketId": market_id,
        "commitmentAmount": "500000000000000000000",
        "fee": "0.005",
    },
    "pubKey": pubkey,
    "propagate": True
}
```

## Cancelling a liquidity commitment [WIP]
If you no longer want to keep a liquidity commitment open for a market, you can cancel your commitment using the `liquidityProvisionCancellation`. This will remove the commitment requirement from your public key, and return the bond amount back into your general account.

If cancelling a commitment would leave a market without enough liquidity, then you will be penalised.

Any open positions will not be cancelled.

### Transaction template
Template to cancel a liquidity commitment:

```
submission = {
    "liquidityProvisionCancellation": {
        "marketId": marketID
    },
    "pubKey": pubkey,
    "propagate": True
}
```

## Viewing existing liquidity provisions
You can view the list of participants supplying liquidity to a market in two ways: using the endpoint or a Vega Tool. 

**Use the endpoint**

Querying the REST endpoint for a node given the partyID (public key) and marketID:
`https://<node address>/liquidity-provisions/party/{party}/market/{market}`

**Use the Vega Tool**

Using the `vegatools` command line tool to view the liquidity providers for a given market. 

[Vega Tools repo](https://github.com/vegaprotocol/vegatools): Try the liquidity commitment tool, under the `liquiditycommitment` folder. Check the **[README.md](https://github.com/vegaprotocol/vegatools#vegatools)** file for how to set up the Vega Tools.  

To see the current liquidity commitments for a market on testnet, use this command line:

```bash
vegatools liquiditycommitment -a=n06.testnet.vega.xyz:3007
```

![Vega Tool for liquidity commitment](/img/tutorials/vegatools-liquidity-commitment.png)

## What can go wrong when providing liquidity?

If you do not have enough collateral in your margin and general accounts to maintain your position, Vega will use some (or all) of your bond to cover the margin requirements. You will get charged a penalty when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller. **You could lose all the money in your margin and general accounts as well as your bond amount if you do not actively manage your orders.**
