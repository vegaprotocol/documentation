---
sidebar_position: 5
title: Liquidity providers
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega protocol allows liquidity to be priced individually for each market, a design decision that rewards liquidity providers for taking a bigger risk on markets with little liquidity competition by allowing them to earn more per trade, and drives down fees on markets where there are many participants committing liquidity.

Providing liquidity on a market can be done using a combination of two tactics: standard [limit orders](./trading-on-vega/orders#limit-orders) and a [liquidity commitment]().

Participants who place limit orders on a market are, by default, supplying liquidity, and are rewarded by receiving a portion of the maker fee. Typically liquidity providers would aim to meet some of their liquidity obligation using standard limit orders, which give them the most control over their strategy. The [batch orders transaction](./trading-on-vega/orders#batch-orders) is designed to enable this efficiently. 

This section focuses primarily on how a liquidity commitment works. This involves submitting one liquidity commitment that keeps a series of orders active and funded on a market. The buy and sell shapes submitted as part of the liquidity commitment can be used alongside standard limit orders to provide liquidity.

**[Liquidity fees](#liquidity-fees)** are defined based on the commitments and proposed fee levels chosen by the providers, not by the protocol.

Participants who want to **[commit liquidity](#liquidity-commitment-transaction)** to a market can enter their commitments as soon as a market proposal is submitted and accepted, even before the governance vote to create the market concludes, as well as at any time while the market is trading. Committing earlier in a market's lifecycle leads to a higher equity-like share in that market, assuming the trading volume on the market increases with time.

## Liquidity commitments
Participants with sufficient collateral can provide liquidity for markets through a liquidity commitment submission.

A liquidity provision commitment is made up of a series of orders that sit on the order book to be filled. Liquidity providers need to be able to support their liquidsity commitment - their available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment. Providers will also set aside a bond to cover their liquidity commitment, which is used if their collateral cannot cover it.

**Liquidity providers will need to actively manage their commitment.** Amending and cancelling commitments is possible, but only if the market can function without that liquidity commitment by meeting its target stake. It is not possible to cancel the individual limit orders that are created from a liquidity commitment.

### Target stake for a market
The market's liquidity requirement, or its target stake, is the measurement of how much stake is the ideal committed to a market, relative to what is on the market at the time. It is derived from the maximum open interest observed over a rolling time window. 

Target stake is used by the protocol to: 
* Calculate the market's liquidity fee level from liquidity commitments 
* Trigger a liquidity monitoring auction if there's an imbalance between target stake and total stake (sum of all liquidity commitments)

### Liquidity bond
When a provider commits liquidity, the amount of their commitment is set aside as bond, and the orders created by their commitment are funded by their unbonded collateral. Bond functions like an extra margin requirement to back up the provider's commitment to stay with the market, whether it's well supplied or under-supplied with liquidity. In return for that commitment, liquidity providers are rewarded with fees that are not available to other market participants. 

The amount committed during the liquidity provision transaction is stored in a bond account (one per party, per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. 

When someone successfully commits liquidity, funds are deposited into that account as part of the transaction. They will remain in the bond account for as long as the liquidity provider is active. This is to act as a guarantee for the provider's liquidity obligation, to ensure that the commitment is firm and the protocol can rely on that liquidity in any market conditions, even if the provider's margin and general accounts have been depleted.

## Liquidity obligation
Once a liquidity commitment is submitted and accepted, it's used by the protocol to determine the provider's liquidity obligation, measured in a unit called siskas. This obligation is then what the provider needs to meet, unless they choose (and are able) to amend or cancel their commitment. It is calculated based on the volume, probability of trading and the price of orders on the market.

Standard limit orders placed by liquidity providers also contribute to meeting their obligation. 

### Calculations: Liquidity obligation [WIP]
The liquidity obligation is calculated from the liquidity commitment amount using the `stake_to_ccy_siskas` network parameter, which provides a value as:

`liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

[**Confirm**] Here, `ccy` stands for 'currency'. For the purposes of calculations across markets using the same asset, liquidity on Vega is measured in units called 'currency siskas', e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers, per each order book side, measured separately, is at least `liquidity_obligation_in_ccy_siskas`.

## Liquidity rewards
Liquidity providers receive rewards for providing liquidity, and penalties for not upholding their commitment. 

Rewards are calculated automatically from the market's fees, which are paid by price takers, and distributed to the market's liquidity providers according to their relative commitments and how early in the market’s lifecycle they committed.

Note: During an auction uncrossing, orders derived from a liquidity providers' commitments will not need to provide liquidity or enable trades. However, providers must maintain their liquidity commitment, and their liquidity orders are placed back on the order book when normal trading resumes.

## Penalties for not fulfilling liquidity commitment
**If a liquidity provider can't cover their commitment**: If the liquidity provider's margin account doesn't have enough funds to support the orders that are derived from their commitment, the protocol will search for funds in the general account for the relevant asset. 

If the general account doesn't have enough collateral to provide the margin to support the orders, then the protocol will transfer the remaining required amount from the liquidity provider's bond account, a penalty will be applied, and funds to cover the shortfall and pay the penalty will be transferred from the provider’s bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in their liquidity commitment.

Should the funds in the bond account drop to 0, the liquidity provider will be marked for closeout and their liquidity commitments will be removed from the market. If there's an imbalance between total and target stake as a result, the market will go into a liquidity monitoring auction.

If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied.

:::note Read more
[Liquidity monitoring](./../trading-on-vega/market-protections#liquidity-monitoring)
:::

### Liquidity penalty calculation
The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* `market.liquidity.bondPenaltyParameter` is a network parameter
* shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement (mark to market or product driven), or are needed to meet their margin requirements

## Liquidity commitment transaction
Participants can commit liquidity by submitting a liquidity submission transaction to the network. 

The buy and sell "shapes" that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by manually maintained orders falls short of it. These place the desired proportion of the missing liquidity commitment at a chosen offset from the reference price (best bid, best ask or mid price).

A liquidity commitment transaction must include:
* Market ID for a market that is in a state that accepts liquidity commitments
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders
 
**Liquidity providers will need to actively manage their commitment.** Reducing and cancelling commitments is possible, but only if the market can function without that liquidity commitment by meeting its target stake. It is always possible to increase the commitment or change the liquidity fee bid. It is not possible to cancel the individual limit orders that are created from a liquidity commitment but it is always possible to change the "shape" i.e. the [reference, offset, proportion] lists for each book side that form part of the liquidity provision order.

### Liquidity commitment order type
In essence, liquidity commitment orders are sets of pegged orders grouped by order book size, with a proportion set for each order within the order 'shape'. The overall volume that Vega will imply and automatically place on the order book from this depends on the remaining liquidity obligation, the best bid / ask prices, the price monitoring bounds, and the risk model parameters, but the reference, offsets and proportion at the reference / offset can always be amended.

Those orders use a special order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

A liquidity commitment order type has a specific set of features that set it apart from a standard order: 
* *Submitted as a special transaction*: A liquidity commitment order allows simultaneously specifying multiple orders in one message/transaction
* *Sits on the order book*: The orders are always priced limit orders that sit on the order book (unless the market is in auction), and do not trade on entry
* *Returns to the order book after being filled*: The order is always refreshed after it trades, based on the above requirements so that the full commitment is always supplied

### Order shapes
In essence, a liquidity commitment order is made up of sets of pegged orders grouped by order book size, with a proportion set for each order within an order 'shape'. The overall volume depends on the remaining liquidity obligation, the mid-price, and the risk model parameters, but the sizes of orders relative to each other can still be controlled.

The order uses a special order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

The placement of orders on the book is defined by two shapes: buy shape and sell shape. The shapes are created by the liquidity provider, and they define what weight each price level will have, and the distances of the price levels at which the orders will be placed from the the chosen price level (current best bid, mid, or best offer).

Vega then calculates the size of the liquidity order placed at each price level using: the total bond amount, the current price, and the weight on each level. As the prices on the order book move, Vega will recalculate the order sizes and prices and update the orders.

The shape of the orders placed for a liquidity provision can influence how likely they are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away.

### Buy and sell shape example
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

### Submit liquidity commitment
To use the liquidity commitment order type, a provider must submit a valid set of orders. That set must include a *buy shape* and a *sell shape*. 

The network will translate these shapes into order book volume by creating an order set. 

Each commitment submission must specify:
* **Public key**: The Vega public key being used to place the liquidity commitment
* The **market’s unique ID**, denoted as `marketId`: The market must be in a state to accept liquidity commitment. It cannot be a rejected market, has not had trading terminated, or has not been settled 
* **Liquidity commitment amount**: The amount of funds to allocate to providing liquidity. The amount will be moved into a [bond account](#bond-account) during the duration of the liquidity commitment, denoted as `commitmentAmount`
* **Proposed liquidity fee level**: The scaling factor for the fee the submitter is bidding to receive when the order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. [Learn how all proposed fee levels influence the market's fees](#how-the-fee-is-derived)). Denoted as `fee`
* A set of liquidity **buy and sell order shapes** (denoted as `buys` and `sells`), which include:
    * **Offset**: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more postion risk
    * **Proportion**: The proportion of your committed collateral allocated to this order, as a weight
    * **Reference price**: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
  * **Propagate**: Is true or false. Propogate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected
 
:::tip Query for data
See a full list of applicable reference price levels in the [API documentation](./../../grpc/vega/vega.proto#peggedreference), denoted as `reference`.
:::

### Amend liquidity commitment
Liquidity commitment orders can be amended by providing a new set of liquidity provision orders in the liquidity provider transaction. 

When amending a liquidity commitment, the network will always allow the submitter to provide more liquidity. However, reducing the liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If the submitter were to reduce their commitment to the point where the market would drop below its required stake threshold, then the amendment would not be accepted.

Submitting an amendment replaces the entire set of orders with the ones in the amendment transaction. To keep any of the existing order shapes, they'll need to added into the amendment.

### Cancel liquidity commitment
Cancelling a liquidity commitment, in effect, requests that the liquidity provision orders are amended to zero. Once the orders are cancelled, the bond amount is returned back into the submitter's general account.

If cancelling a commitment would leave a market without enough liquidity, then the cancellation will not be accepted. 

If there are any open positions that were created from the liquidity orders, they will not be cancelled when a liquidity commitment is cancelled.

## Liquidity fees
As part of the liquidity commitment transaction, a liquidity provider submits their desired liquidity fee factor, as a number between 0 and 1. That number is converted to a percentage, and fees are paid on each trade.
   
The proposed fees are used to calculate the actual fee each participant will pay on a trade in that market. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower.

This fee can change as the market's target stake changes, and / or as liquidity providers change their commitment or stop providing liquidity altogether. 

How much a provider receives in fees is also dependent on when they began to commit liquidity on the market, as liquidity providers who commit to a market early benefit from helping to grow the market (also known as the 'equity-like share').
 
### How the fee is derived
The liquidity orders submitted are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom. 

The market's 'winning' fee depends on the liquidity commitment of the market (target stake) and the amount committed from each bidder. Vega processes the LP orders from top to bottom, adding up the commitment amounts until it reaches a level equal to, or greater than, the target stake. When that point is reached, the fee that was provided with the last processed liquidity order is used.

Initially, before a market opens for trading, the target stake is zero, as it's not possible to have a position on a market that's not opened yet. Hence by default the market's initial liquidity fee is the lowest proposed.

Once the market opens and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated.

#### Liquidity fee example
In the example below, there are 3 liquidity providers all bidding for their chosen fee level, with the lowest fee bid at the top, and the highest at the bottom. 

* [LP 1 stake = 120 ETH, LP 1 liquidity-fee-factor = 0.5%]
* [LP 2 stake = 20 ETH, LP 2 liquidity-fee-factor = 0.75%]
* [LP 3 stake = 60 ETH, LP 3 liquidity-fee-factor = 3.75%]

* If the target stake = 119 then the needed liquidity is given by LP 1, thus market's liquidity-fee-factor is the LP 1 fee: 0.5%.
* If the target stake = 123 then the needed liquidity is given by the combination of LP 1 and LP 2, and so the market's liquidity-fee-factor is LP 2 fee: 0.75%.
* If the target stake = 240 then all the liquidity supplied above does not meet the estimated market liquidity demand, and thus the market's liquidity-fee-factor is set to the highest, LP 3's fee: 3.75%.

### How liquidity fees are split
By committing liquidity, a liquidity provider gets a share of the market's fees that depends on how trading has grown on the market. This is known as the equity-like share. Liquidity providers who get into a market early benefit from helping to grow the market by earning a larger share of the market's trading fees than their actual commitment would imply. 

The market's liquidity fee and the trading volume determine how big the liquidity fee pool is, and a provider's equity-like share of the market determines how that pool is distributed.

Because an LP who committed to a market early provided a larger proportion of the commitment earlier on, they continue to keep that larger share of fees even once other parties are also committing liquidity to the market.

:::note Go deeper
[LP equity-like share calculations](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-liquidity-provider-equity-like-share): See the variables that go into calculating a liquidity provider's share.
:::

### How liquidity fees are distributed
The liquidity fee amount is collected from traders on every trade, and held in a separate account. This account is under control of the network.

How often fees are distributed is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" hideName={false} />. Starting with the end of the market's opening auction, every time the time-step has been hit, the balance in the account is transferred to each liquidity provider's margin account for the market, depending on their share at the time.

#### Fee distribution example
A market have 4 LPs with equity-like shares:

* LP 1 share = 0.65
* LP 2 share = 0.25
* LP 3 share = 0.1

Participants trade on the market, and the `trade value for fee purposes` multiplied by the `liquidity fee factor` equals 103.5 ETH (the market's settlement asset). 

Thus, the following amounts are then transferred to each LP's margin account once the time-step elapses:

* LP 1 receives: 0.65 x 103.5 = 67.275 ETH
* LP 2 receives: 0.25 x 103.5 = 25.875 ETH
* LP 3 receives: 0.10 x 103.5 = 10.350 ETH