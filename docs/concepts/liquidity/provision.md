---
sidebar_position: 5
title: Providing liquidity
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega protocol allows liquidity to be priced individually for each market, a design decision that rewards liquidity providers for taking a bigger risk on markets with little liquidity competition by allowing them to earn more per trade, and drives down fees on markets where there are many participants committing liquidity.

Providing liquidity on a market can be done using a combination of two tactics: [batched limit orders](./../trading-on-vega/orders#batch-order) and automatic orders created from a [liquidity commitment](#liquidity-commitments). Supplying limit orders makes an LP eligible to receive maker fees when volume they place on the book is hit. A liquidity commitment makes an LP eligible to receive a portion of the liquidity fee from every trade on the book, regardless of if their volume that was targeted or not, and orders that are hit will trigger the maker fee. Using a liquidity provision strategy that combines both tactics means the provider is eligible to receive both fees.

Typically liquidity providers would aim to meet most of their liquidity obligation using standard limit orders, which give them the most control over their strategy. The [batch orders transaction](./../trading-on-vega/orders#batch-order) is designed to enable this efficiently.

This section focuses primarily on the other tactic, submitting and maintaining a liquidity commitment. This involves submitting one liquidity commitment that keeps a series of orders active and funded on a market. The buy and sell shapes submitted as part of the liquidity commitment can be used alongside batched limit orders to provide liquidity.

While providing liquidity through a commitment is a riskier strategy than using only batched limit orders, it does mean a provider is eligible for a larger share of the fees paid by traders.

**[Liquidity fees](rewards-penalties.md#liquidity-fees)** are defined based on the commitments and proposed fee levels chosen by the providers, not by the protocol.

:::info Read more
[Rewards and penalties](rewards-penalties.md): LPs that supply liquidity through a liquidity commitment receive rewards (through fees paid by traders) when they meet their commitment, and can be penalised for not meeting their commitment.
:::

## Liquidity commitments
Participants with sufficient collateral can provide liquidity for markets through a liquidity commitment submission.

A liquidity commitment, which is made up of a commitment amount and order shapes then informs the creation of a series of orders that sit on the order book to be filled, as well as the limit orders submitted by the provider (as long as they are within the [price range for liquidity orders](#price-range-for-liquidity-orders)).

Liquidity providers need to be able to support their liquidity commitment - their available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders created with that commitment, and positions that will be generated from trades.

### Active liquidity management
**Liquidity providers will need to actively manage their commitment.** Amending and cancelling commitments is possible, but only if the market can function without that liquidity commitment by meeting its target stake. It is not possible to cancel the individual pegged limit orders that are created from a liquidity commitment. Liquidity commitments are funded through assets in the general account and then the margin account. The [order shapes](#order-shapes), however, can be amended at any time.

Participants who want to commit liquidity to a market can enter their commitments as soon as a market proposal is submitted and accepted, even before the governance vote to create the market concludes, as well as at any time while the market is trading. Committing earlier in a market's lifecycle leads to a higher [equity-like share](rewards-penalties.md#liquidity-fees) in that market, assuming the trading volume on the market increases with time.

### Liquidity bond
When a provider commits liquidity, the amount of their commitment is set aside as bond, and the orders created by their commitment are funded by their unbonded collateral. Bond functions like an extra margin requirement to back up the provider's commitment to stay with the market, whether it's well supplied or under-supplied with liquidity. In return for that commitment, liquidity providers are rewarded with fees paid by traders that are not available to other market participants. 

The amount committed during the liquidity commitment transaction is stored in a bond account (one per party, per market). The deposits and withdrawals for the bond account are governed by the protocol and cannot be manually triggered.

When someone successfully commits liquidity, the commitment amount (in the market's settlement asset) is deposited into the bond account as part of the transaction. The bond total will remain in the bond account for as long as the liquidity provider is active. This is to act as a guarantee for the provider's liquidity obligation, to ensure that the commitment is firm and the protocol can rely on that liquidity in any market conditions, even if the provider's margin and general accounts have been depleted.

### Price range for liquidity orders
When a market is proposed, a price range is specified for the liquidity orders, based on the mid price. Only the limit orders manually placed within that range will count towards a provider's liquidity obligation. The automatically deployed orders based on the order shape will be placed in the same range. If an automatic order ends up with a price outside the range, it's adjusted so it falls on the boundary. For example: [(1 - LP price range) * mid price, (1 + LP price range) * mid price]. If it's set, for example, to 0.04, it will deploy LP orders within 4% up or down from the mid price. 

### Target stake for a market
The market's liquidity requirement, or its target stake, is the measurement of how much stake is the ideal committed to a market, relative to what is on the market at the time. 

Target stake is used by the protocol to: 
* Calculate the market's liquidity fee level from liquidity commitments 
* Potentially trigger a [liquidity monitoring auction](../trading-on-vega/market-protections#liquidity-monitoring) if there's an imbalance between target stake and total stake
  * This can depend on the value of the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.targetstake.triggering.ratio" hideValue={true} /> network parameter, which defines how sensitive the auction trigger is

The market's target stake is calculated using the maximum open interest observed over a rolling time window and a reference price, and scaled by a factor:

`target_stake = reference_price x max_oi over market.stake.target.timeWindow x max(risk_factor_short, risk_factor_long) x market.stake.target.scalingFactor`

The formula above uses the following network parameters:
* Rolling time window: <NetworkParameter frontMatter={frontMatter} param="market.stake.target.timeWindow" />
* Scaling factor: <NetworkParameter frontMatter={frontMatter} param="market.stake.target.scalingFactor" />

:::tip Query for data
[Market data](./api/../../../api/rest/data-v2/trading-data-service-get-latest-market-data.api.mdx): Use the market data REST endpoint to see a market's target stake.
:::

:::note Go deeper
[Target stake calculations](https://github.com/vegaprotocol/specs/blob/master/protocol/0041-TSTK-target_stake.md): Read the spec for details on how target stake is calculated by the protocol.
:::

## Liquidity commitment transaction
Participants can commit liquidity by submitting a liquidity submission transaction to the network. 

The buy and sell "shapes" that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation on top of the liquidity supplied by manually maintained orders. These commitments place the desired proportion of the missing liquidity commitment at a chosen offset from the reference price (best bid, best ask or mid price).

A liquidity commitment transaction must include:
* Market ID for a market that is in a state that accepts liquidity commitments
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders
 
:::caution Active liquidity management 
**[Liquidity providers will need to actively manage their commitment:](#active-liquidity-management)** Read about the necessity for active management. Markets can move quickly.
:::

### Orders created from commitment
In essence, liquidity commitment orders are sets of pegged orders grouped by order book side, with a proportion set for each order within the order 'shape'. The overall volume that Vega will imply and automatically place on the order book from this depends on the remaining liquidity obligation, the best bid / ask prices, and the LP price range set on the market. The reference price, offsets and proportion at the reference / offset can always be amended. If an order created from the commitment ends up with a price outside the [price range set in the market proposal](#price-range-for-liquidity-orders), it's adjusted so it falls on the boundary. 

A liquidity commitment order type has a specific set of features that set it apart from a standard order: 
* *Submitted as a special transaction*: A liquidity commitment order allows simultaneously specifying multiple orders in one message/transaction
* *Sits on the order book*: The orders are always priced limit orders that sit on the order book (unless the market is in auction), and do not trade on entry
* *Returns to the order book after being filled*: The order is always refreshed after it trades, based on the above requirements so that the full commitment is always supplied

:::tip Try it out
[Tutorial for committing liquidity](../../tutorials/committing-liquidity.md): Use helper scripts to set up and manage a liquidity commitment.
:::

### Order shapes
A liquidity commitment uses a special order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

The placement of orders on the book is defined by two shapes: buy shape and sell shape. The shapes are created by the liquidity provider, and they define what weight each price level will have, and the distances of the price levels at which the orders will be placed (known as 'offsets') from the chosen price level (current best bid, mid, or best offer).

Vega then calculates the size of the liquidity order placed at each price level using: the total bond amount, the current price, and the weight on each level. As the prices on the order book move, Vega will recalculate the order sizes and prices and update the orders.

The shape of the orders placed for a liquidity provision can influence how likely they are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away.

The **buy and sell order shapes** (denoted as `buys` and `sells`) include:
    * **Offset**: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more position risk. The offset is interpreted by the market decimal precision, meaning that an offset of 1, on a market with a decimal precision of 5, would be 0.00001 away from the reference price
    * **Proportion**: The proportion of your committed collateral allocated to this order, as a weight
    * **Reference price**: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
    
<details><summary>Buy and sell shape example</summary>
<p>

Below see how a buy and sell shape are constructed:

```
*Buy shape*: {
  buy-entry-1: [liquidity-proportion-1, [price-peg-reference-1, number-of-units-from-reference-1]],
  buy-entry-2: [liquidity-proportion-2, [price-peg-reference-2, number-of-units-from-reference-2]],
}
*Sell-shape*: {
  sell-entry-1: [sell-liquidity-proportion-1, [sell-price-peg-reference-1, sell-number-of-units-from-reference-1]],
  sell-entry-2: [sell-liquidity-proportion-2, [sell-price-peg-reference-2, sell-number-of-units-from-reference-2]],
}
*Buy shape* with values: {
  buy-entry-1: [2, [best-bid, 10]],
  buy-entry-2: [13, [best-bid, 11]],
}
*Sell-shape* with values: {
  sell-entry-1: [5, [best-ask, 8]],
  sell-entry-2: [5, [best-ask, 9]],
}
```
</p>
</details>

### Order volume
Once a liquidity commitment is submitted and accepted, the committed amount, shapes submitted and the party’s other limit orders on the book are used by the protocol to determine the limit order volume that will be posted on the book to ensure the party meets its obligation. Orders that are not within the LP order price range (set per market) are placed at the boundary of the range.

It is possible to meet the entire liquidity obligation with limit orders; indeed this should be the aim of most LP strategies as this gives the best control. The missing amount of the liquidity obligation is posted by the system. If the shape specifies large offset from best bid / ask then the system will place more volume on the book for the LP party. All other things being equal, higher committed stake means more volume is posted on the book.

:::note Go deeper
Explore liquidity calculations in more depth in the [liquidity mechanics spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md).
:::

#### Amending and cancelling a liquidity commitment
Liquidity providers can also, depending on the commitment and the market state, amend and cancel their commitment. 

Only one commitment for a market can exist per provider, so adding to it or changing it must be done by amending the existing commitment.

Liquidity commitments can be amended by providing a new set of liquidity provision orders in the liquidity provider transaction. 

When amending or cancelling a liquidity commitment, the network will always allow the submitter to provide more liquidity. However, reducing the liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If the submitter were to reduce their commitment to the point where the market would drop below its required stake threshold, then the amendment would not be accepted. 

:::caution
If a market doesn't have enough liquidity, or is perpetually in a liquidity monitoring auction, you may not be able to reduce or cancel your commitment, and you will need to continue to support your commitment until there is enough liquidity or the market is settled.

You can [submit a governance proposal](./../../tutorials/proposals/update-market-proposal.md) to update the market's settlement date, and vote with the weight of your equity-like share.
:::

Submitting an amendment replaces the entire set of orders with the ones in the amendment transaction. To keep any of the existing order shapes, they'll need to added into the amendment.

Cancelling a liquidity commitment, in effect, requests that the liquidity provision orders are amended to zero. Once the orders are cancelled, the bond amount is returned back into the submitter's general account.

If cancelling a commitment would leave a market without enough liquidity, then the cancellation will not be accepted. 

If there are any open positions that were created from the liquidity orders, they will not be cancelled when a liquidity commitment is cancelled.

