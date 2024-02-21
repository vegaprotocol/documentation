---
sidebar_position: 5
title: Providing liquidity
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Each market has its own liquidity. Liquidity providers earn fee revenue from participants trading on the market they're providing liquidity to. LPs receive a cut of the liquidity fee paid by traders on the market. In addition, they can receive [rewards funded by members of the community](./rewards-penalties.md#community-funded-lp-rewards).

LPs who take a bigger risk on newer markets with less liquidity are rewarded for taking a bigger risk because you can earn more per trade. Markets where there are many participants committing liquidity benefit from lower fees for traders, because there is more competition for the fee percentage paid by traders.

**[Liquidity fees](rewards-penalties.md#earning-liquidity-fees)** are determined based on the commitments and proposed fee levels chosen by the providers, not by the protocol.

To be eligible to receive any liquidity fee revenue, you will need to submit a [liquidity commitment transaction](#liquidity-commitments), and then place orders to support that commitment.

Once you commit to a market, to receive fee revenue, you need to have a certain percentage of your commitment amount on the order book for a minimum amount of time in each [epoch](../vega-chain/network.md#epochs). 

These minimums are known as the [liquidity SLA](./rewards-penalties.md#liquidity-sla). The better your performance is against the SLA, the more fee revenue you'll receive. Not meeting the SLA will result in fee payments being withheld for that epoch, and it will have an impact on [future fee revenue earnings](./rewards-penalties.md#penalties-for-not-meeting-sla). 

## Tactics for providing liquidity
Providing liquidity can be done using: 
* Standard limit orders, which give you the most control over your strategy. The [batch orders transaction](./../trading-on-vega/orders#batch-order) is designed to enable this efficiently
* [Iceberg orders](../trading-on-vega/orders.md#iceberg-order) allow LPs to remain competitively present on the order book without needing to supply excessive volume to a large aggressive order

Anyone that supplies limit orders is eligible to receive maker fees when volume you place on the book is hit. However, a liquidity commitment also makes an LP eligible to receive a portion of the liquidity fee from every trade in the market, on top of the maker fee.

:::info Read more
**[Concept: Rewards and penalties](rewards-penalties.md)**: LPs receive rewards (through fees paid by traders) when they meet their commitment. Fees are withheld, and they can be further penalised for not meeting their commitment.
:::

You need to have enough available assets to cover the margin for your orders and the positions that will be generated from trades.

## Liquidity commitments
If you want to provide liquidity and receive a portion of liquidity fees paid, you need to submit a [liquidity commitment transaction](../../tutorials/committing-liquidity.md). The commitment is the amount of stake an LP places as bond on the market, to earn rewards.

You will need enough of the settlement asset to set aside as bond and then to fulfill the orders to meet your commitment. 

**Liquidity providers will need to actively manage their commitment.** 

The commitment transaction needs to contain:
* Market ID
* Commitment amount, to be held as [bond](#liquidity-bond)
* [Liquidity fee factor](../liquidity/rewards-penalties.md#determining-the-liquidity-fee-percentage)

### Required amount of liquidity
The amount an LP will actually need to have available on the order book is called the **liquidity obligation**.

That is calculated by:

`Commitment * market.liquidity.stakeToCcyVolume`, measured in `price level x volume`, i.e. settlement currency of the market.

Currently <NetworkParameter frontMatter={frontMatter} param="market.liquidity.stakeToCcyVolume" />

Once you commit to a market, you need to meet the minimum set by the **[liquidity SLA](./rewards-penalties.md#liquidity-sla)**. The percentage of your commitment amount and minimum time are set for each individual market. Exceeding the minimum leads to more fee revenue. Not meeting the minimum means fee revenue is withheld, plus extra penalties.

## When to commit liquidity
You can commit liquidity to a market at any time in the [market's lifecycle](../trading-on-vega/market-lifecycle.md) when it is accepting orders.

**When a market is in opening auction**: It's possible to submit the liquidity commit transaction and start putting orders on the book as soon as a market’s governance proposal is submitted and accepted. That means it can be done even before the governance voting period concludes, as well as at any time while the market is trading. Doing so will give you a higher equity-like share on the market, which can lead to a higher share of fee revenue. 

You'll need to submit your orders from the end of the opening auction.

**When a market is in normal trading**: If you commit once a market is already open for trading, you'll need to submit your orders by the start of the next epoch. SLA performance will be measured from the epoch after the one in which you submitted your liquidity commitment transaction.

### Equity-like share
By committing liquidity, a liquidity provider gets a share of the market's fees. Liquidity providers who get into a market early benefit from helping to grow the market. Their share of the market, called the equity-like share, allows them to earn a larger share of the market's trading fees than their actual commitment would imply, assuming the trading volume on the market increases with time. This is called an LP’s equity-like share, and it is used to divide fee revenue between LPs.

A liquidity provider's equity-like share is then carried over to the market’s successor, if a successor market comes to exist. The LP will then need to provide liquidity on the successor market while it's [pending](../trading-on-vega/market-lifecycle.md#market-status-pending) to keep that equity-like share active. The equity-like share on a successor market is calculated using the difference between the physical stake present on the parent market and the stake committed to the successor market.

:::tip Try it out
**[Tutorial: Committing liquidity](../../tutorials/building-a-bot/adding-a-liquidity-commitment.md)**: See sample bot code for setting up and managing a liquidity commitment.
:::

### Liquidity bond
When committing liquidity, the commitment amount is set aside as bond, and the orders created for commitment are funded by assets in the LP’s general account. 

Bond functions like an extra margin requirement to back up the LP’s commitment to stay with the market. In return for that commitment, liquidity providers get access to proceeds from liquidity fees, which are not available to other market participants.

The bond total will remain in the bond account for as long as the LP chooses to commit to the market. This is a guarantee for the provider's liquidity obligation, to ensure that the commitment is firm and the market can rely on that liquidity in any market conditions, even if the provider's margin and general accounts have been depleted.

The bond committed during the liquidity commitment transaction is stored in a bond account (one per party, per market). Deposits and withdrawals for the bond account are governed by the protocol and cannot be manually triggered.

### Price range for liquidity orders
A market’s governance proposal includes a liquidity provision price range. That range determines which orders count towards the LP meeting their commitment to the market. The range determines the furthest away from the mid-price the orders can be. Anything outside of that range won’t count towards an LP’s commitment, and thus doesn’t count towards meeting the SLA.

When in an auction, the price range is calculated slightly differently, instead of utilising the mid price for both sides:
- The maximum price is defined by max(last trade price, indicative auction uncrossing price) * (1 + price range).
- The minimum price is defined by min(last trade price, indicative auction uncrossing price) * (1 - price range).

### Target stake for a market
How much a market aims to have in liquidity is called the target stake. It depends on market conditions and how much is already committed.

Target stake is used by the protocol to:
* Calculate the market's liquidity fee level from the liquidity commitments
* Determine the maximum amount an LP can reduce their commitment before being penalised for providing too little liquidity

:::tip Query for data
[API: Target stake](./api/../../../api/rest/data-v2/trading-data-service-get-latest-market-data.api.mdx)
:::

#### Target stake calculation
The market's target stake is calculated using the maximum open interest observed over a rolling time window and a reference price, and then scaled:

`target_stake = reference_price x max_oi over market.stake.target.timeWindow x max(risk_factor_short, risk_factor_long) x market.stake.target.scalingFactor`

The formula above uses these network parameters:
* Rolling time window: <NetworkParameter frontMatter={frontMatter} param="market.stake.target.timeWindow" />
* Scaling factor: <NetworkParameter frontMatter={frontMatter} param="market.stake.target.scalingFactor" />

:::note Go deeper
* [Spec: How target stake is calculated ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0041-TSTK-target_stake.md)
* [Spec: Liquidity mechanics ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md)
:::

#### Amending and cancelling a liquidity commitment 
You can also amend or cancel a liquidity commitment. 

You can submit the transaction at any time, but the change is only enacted at the start of the following epoch. If you increase your commitment, the extra assets are moved into your bond account immediately.

Decreasing or cancelling your liquidity commitment will lead to penalties if the market needs that liquidity to stay at its target stake. 

How much of your bond is forfeited is determined by the **early exit penalty**, set per each market. You can [query a market details](../../api/rest/data-v2/trading-data-service-get-market.api.mdx) or review a market's [governance proposal](../../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) to see the early exit penalty.

Your equity-like share is also reduced in line with a liquidity commitment decrease. 

If there are any open positions that were created from your orders, they will not be closed when your liquidity commitment is cancelled.

The transaction to amend a liquidity commitment includes the same fields as submitting a commitment, just modify the fields you want to be amended with your new values. The cancel transaction only requires the market ID for the market that you want stop committing on.