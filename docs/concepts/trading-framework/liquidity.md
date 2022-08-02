---
sidebar_position: 5
title: Liquidity
hide_title: false
---
# Liquidity
The Vega protocol allows liquidity to be priced individually for each market, a design decision that allows for liquidity providers to earn more on markets with little LP competition, and drives down fees on markets where there are many participants committing liquidity. 

Liquidity fees are defined based on the commitments and proposed fee levels chosen by the providers, not by the protocol. 

When a market is proposed, the proposer, who must also be able to provide liquidity, proposes the liquidity fee for that market. Other participants who want to commit liquidity can do so by submitting liquidity provision orders to an open market. 

Participants who want to commit liquidity to a market can enter their commitments as soon as a market proposal is submitted and accepted, or at any time during the market's  lifecycle. 

## Parameters [WIP]

## Liquidity providers
Participants with sufficient collateral can provide liquidity for markets. Every market on Vega must have at least one committed liquidity provider. When a governance proposal to create a market is submitted, the proposal has to include liquidity provision commitment.

A liquidity provision commitment is made up of a series of orders that sit on the order book to be filled. Liquidity providers need to be able to support their liquidity commitment - their available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment. 

### Bond account
The amount committed during the liquidity provision transaction is stored in a bond account (one per party, per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. 

The funds are deposited as part of a successful liquidity provision transaction. They will remain in the bond account for as long as the liquidity provider is active, to act as a guarantee for the liquidity obligation taken on by the provider, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

## Liquidity rewards
Liquidity providers receive rewards for providing liquidity, and penalties for not upholding their commitment. 

Rewards are calculated automatically from the market's fees, which are paid by price takers, and distributed to the market's liquidity providers according to their relative commitments.

Note: During an auction uncrossing, liquidity providers are not required to supply any orders that offer liquidity or would cause trades. However, they must maintain their liquidity commitment, and their liquidity orders are placed back on the order book when normal trading resumes.

## Penalties for not fulfilling liquidity commitment
If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will search for funds in the general account for the relevant asset. If the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the liquidity provider's bond account, and a penalty will be applied and funds transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in liquidity commitment.

Should the funds in the bond account drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will be removed from the market. If there's an imbalance between total and target stake as a result, the market will go into liquidity auction.

If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied. 

The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* `market.liquidity.bondPenaltyParameter` is a network parameter
* shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement (mark to market or product driven), or are needed to meet their margin requirements

## Liquidity commitment transaction
Participants can commit liquidity by submitting a liquidity submission transaction to the network. 

The buy and sell orders that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by the manually maintained orders falls short of it. (??)

A liquidity commitment transaction must include:
* Market identifier for a market that is in a state that accepts liquidity commitments
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders

## Liquidity commitment order type
In essence, liquidity commitment orders are sets of pegged orders grouped by order book size, with a proportion set for each order within the order 'shape'. The overall volume depends on the remaining liquidity obligation, the mid-price, and the risk model parameters, but the sizes of orders relative to each other can still be controlled.

Those orders use a special batch order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

A liquidity commitment order type has a specific set of features that set it apart from a standard order: 
* *Submitted as a batch order*: A liquidity commitment order allows simultaneously specifying multiple orders in one message/transaction
* *Sits on the order book*: The orders are always priced limit orders that sit on the order book, and do not trade on entry
* *Returns to the order book after being filled*: The order is always refreshed after it trades, based on the above requirements so that the full commitment is always supplied

## Liquidity fee
As part of the liquidity commitment transaction, a liquidity provider submits their desired liquidity fee factor. The fee factors submitted by all those who submitted liquidity provision orders are used to calculate the actual fee each participant will pay on a trade in that market, and thus how much each liquidity provider receives.

This fee can change as the market's target stake changes, and / or as liquidity providers change their commitment or stop providing liquidity altogether. 

How much a provider receives in fees is also dependent on when they began to commit liquidity on the market, as liquidity providers who commit to a market early benefit from helping to grow the market (also known as the 'equity-like share')

Read more: 
* [Target stake](#target-stake)
* [Equity-like share for a liquidity provider](#equity-like-share-for-a-liquidity-provider)

The liquidity orders that LPs submit are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom. 

The fee level chosen for the market is derived from the liquidity commitment of the market (target stake) and the amount of stake committed from each bidder. Vega processes the LP orders from top to bottom by adding up the commitment stake as it goes, until it reaches a level equal to, or greater than, the target stake. When that point is reached, the fee factor that was provided with the last processed liquidity order is used.

Initially, before a market opens for trading, the target stake is zero, as it's not possible to have a position on a market that's not opened yet. Hence by default the market's initial liquidity-fee-factor is the lowest proposed.

Once the market opens and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated.

### Liquidity fee example
In the example below, there are 3 liquidity providers all bidding for their chosen fee level, with the lowest fee bid at the top, and the highest at the bottom. 

* [LP 1 stake = 120 ETH, LP 1 liquidity-fee-factor = 0.5%]
* [LP 2 stake = 20 ETH, LP 2 liquidity-fee-factor = 0.75%]
* [LP 3 stake = 60 ETH, LP 3 liquidity-fee-factor = 3.75%]

* If the target stake = 119 then the needed liquidity is given by LP 1, thus market's liquidity-fee-factor is the LP 1 fee: 0.5%.
* If the target stake = 123 then the needed liquidity is given by the combination of LP 1 and LP 2, and so the market's liquidity-fee-factor is LP 2 fee: 0.75%.
* If the target stake = 240 then all the liquidity supplied above does not meet the estimated market liquidity demand, and thus the market's liquidity-fee-factor is set to the highest, LP 3's fee: 3.75%.

### Target stake
The market's liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol to calculate the market's liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there's an imbalance between it and the total stake (sum of all liquidity commitments).

## Calculating market value proxy ???? [WIP]
It's calculated, with `t` denoting time now measured so that at t=0 the opening auction ended, as follows:

total_stake = sum of all LP stakes
active_time_window = [max(t-t_market_value_window_length,0), t]
active_window_length = t - max(t-t_market_value_window_length,0)

if (active_window_length > 0)
    factor =  t_market_value_window_length / active_window_length
    traded_value_over_window = total trade value for fee purposes of all trades executed on a given market during the active_time_window
    market_value_proxy = max(total_stake, factor x traded_value_over_window)
else
    market_value_proxy = total_stake

Note that trade value for fee purposes is provided by each instrument, see fees. For futures it's the notional and in the examples below are only relevant for futures.
Example

Let's say total_stake = 100. The network parameter t_market_value_window_length = 60s (though in practice a more sensible value is e.g. one week).

    Current time t = 0s i.e. the opening auction just resulted in a trade. Then active_window_length = 0 - max(0-60,0) = 0 - 0 =0 and so market_value_proxy = 100.
    Current time t = 10s i.e. the opening auction resulted in a trade and ended 10s ago. Then active_time_window = [0,t] = [0,10s] and active_window_length = 10 - max(10-60,0) = 10 - 0 = 10. Let's say the trade value for fee purposes over the time [0,t] was traded_value_over_window = 10 tUSD. We calculate factor = 60 / 10 = 6. Then market_value_proxy = max(100, 6 x 10) = 100.
    Current time t = 30s i.e. the opening auction resulted in a trade and ended 30s ago. Then active_time_window = [0,t] = [0,30s] and active_window_length = 30 - max(30-60,0) = 30 - 0 = 30. Let's say the trade value for fee purposes over the time [0,30s] was traded_value_over_window = 100 tUSD. We calculate factor = 60 / 30 = 2. Then market_value_proxy = max(100, 2 x 100) = 200.
    Current time t = 90s i.e. the opening auction resulted in a trade and ended 90s ago. Then active_time_window = [30s,90s] and active_window_length = 90 - max(90-60,0) = 90 - 30 = 60. Let's say the trade value for fee purposes over the time [30s,90s] was traded_value_over_window = 300 tUSD. We calculate factor = 60 / 60 = 1. Then market_value_proxy = max(100, 1 x 300) = 300.

Example

    The market was just proposed and one LP committed stake. No trading happened so the market_value_proxy is the stake of the committed LP.
    A LP has committed stake of 10000 ETH. The traded notional over active_time_window is 9000 ETH. So the market_value_proxy is 10000 ETH.
    A LP has committed stake of 10000 ETH. The traded notional over active_time_window is 250 000 ETH. Thus the market_value_proxy is 250 000 ETH.

## Equity-like share for a liquidity provider 
[WIP]
Liquidity providers who get into a market early benefit from helping to grow the market by earning an equity-like share of the market's trading fees.

Those liquidity providers who commit early in a market's existence will receive a larger proportion of the fees than their actual commitment would imply, because they were a larger proportion of the commitment earlier on, once other parties are also committing liquidity to the market.

By committing money for liquidity, a liquidity provider, in effect, buys a portion of the market value proxy. (?)

At any time let's say we have market_value_proxy calculated above and existing liquidity providers as below (needs more)

[LP 1 stake, LP 1 avg_entry_valuation]
[LP 2 stake, LP 2 avg_entry_valuation]
...
[LP N stake, LP N avg_entry_valuation]

These have to all be greater or equal to zero at all times. At market creation all these are set zero except at least one LP that commits stake at market creation. So the initial configuration is the LP i stake = their commitment before market proposal gets enacted and LP i avg_entry_valuation = sum of total commited before market proposal is enacted. We then update these as per the description below.

From these stored quantities we can calculate, at time step n the following:

    (LP i equity)(n) = (LP i stake)(n) x market_value_proxy(n) / (LP i avg_entry_valuation)(n)
    (LP i equity_share)(n) = (LP i equity)(n) / (sum over j from 1 to N of (LP j equity)(n)) Here market_value_proxy(n) is calculated as per Section "Calculating market value proxy".

If at time step n liquidity provider i submits an order of type Liquidity Provision that requests its stake to be changed to new_stake then update the above values as follows:

if new_stake < min_LP_stake_quantum_multiple x quantum then
    reject transaction and stop. 
fi

total_stake(n+1) = sum of all but i's stake(n) + new_stake 
if new_stake < (LP i stake) then
    check that total_stake(n+1) is sufficient for `market target stake`; if not abort updating stakes and equity like shares (all values stay the same).
fi

if (LP i stake)(n) == 0 then 
    (LP i stake)(n+1) = new_stake
    (LP i avg_entry_valuation)(n+1) = market_value_proxy(n)
elif new_stake < (LP i stake)(n) then
    (LP i stake)(n+1) = new_stake
elif new_stake > (LP i stake)(n) then
    delta = new_stake - (LP i stake)(n) // this will be > 0
    (LP i stake)(n+1) = new_stake
    (LP i avg_entry_valuation)(n+1) = [(LP i equity)(n) x (LP i avg_entry_valuation)(n) 
                            + delta x market_value_proxy(n)] / [(LP i equity)(n) + (LP i stake)(n)]
fi

Example: In this example we assume that that market_value_proxy derives purely from committed stake (no is trading happening). There is only one LP, with index i = 1. At n=0 we have the following state:

LP 1 stake = 100, LP 1 avg_entry_valuation = 100

LP 1 submits a transaction with new_stake = 200. (see Liquidity Provision order type spec). We have (LP 1 equity)(0) = (LP 1 stake)(0) x market_value_proxy(n) / (LP 1 avg_entry_valuation)(n) = 100 x 100 / 100 = 100 and clearly (LP 1 equity_share)(0) = 1. Moreover market_value_proxy(0) = 100. We will be in the case new_stake = 200 > (LP 1 stake)(0) = 100. So then delta = 100 and then (LP i avg_entry_valuation)(1) = (100 x 100 + 100 x 100) / (100 + 100) = 20000 / 200 = 100. So at n=1 we have the following state:

LP 1 stake = 200, LP 1 avg_entry_valuation = 100

Say now LP 2 wishes to enter and submits a "liquidity-provision-order-type" with new_stake=200. We have n=1 and implicitly (LP 2 stake)(1) == 0 is True and so we set (LP 2 stake)(2) = 200 and (LP 2 avg_entry_valuation)(2) = market_value_proxy(1) = 200. After the update, at n = 2 we record the state as

LP 1 stake = 200, LP 1 avg_entry_valuation = 100
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Another "liquidity-provision-order-type" type comes in saying that LP 1 wants new_stake = 300. We have market_value_proxy(2) = 400 and (LP 1 equity)(2) = (LP 1 stake)(2) x market_value_proxy(2) / (LP 1 avg_entry_valuation)(2) = 200 x 400 / 100 = 800. We will be in the case new_stake = 300 > (LP 1 stake)(2) = 200. So then delta = 100 and then (LP i avg_entry_valuation)(1) = (800 x 100 + 100 x 400) / (800 + 200) = 120000 / 1000 = 120. After the update, at n = 3 we record the state as

LP 1 stake = 300, LP 1 avg_entry_valuation = 120
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Another "liquidity-provision-order-type" type comes in saying that LP 1 wants new_stake = 1. We check that market target stake <= 201 (assume true for purposes of example) and so we proceed so that after the update, at n=4 we record the state as

LP 1 stake =   1, LP 1 avg_entry_valuation = 120
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Check the sum from over i from 1 to N of LP i equity_share is equal to 1. Warning the above will be either floating point calculations and / or there will be rounding errors arising from rounding (both stake and entry valuation can be kept with decimals) so the above checks will only be true up to a certain tolerance.
Distributing fees

The liquidity fee is collected into either a per-market "bucket" belonging to liquidity providers for that market or into an account for each liquidity provider, according to their share of that fee. This account is not accessible by liquidity providers until the fee is distributed to them according to the below mechanism.

We will create a new network parameter (which can be 0 in which case fees are transferred at the end of next block) called liquidity_providers_fee_distribition_time_step which will define how frequently fees are distributed to a liquidity provider's general account for the market.

The liquidity fees are distributed pro-rata depending on the LP i equity_share at a given time.
Example

The fee bucket contains 103.5 ETH. We have 3 LPs with equity shares: share as below

LP 1 eq share = 0.65


LP 2 eq share = 0.25
LP 3 eq share = 0.1

When the time defined by ``liquidity_providers_fee_distribution_time_step` elapses we do transfers:

0.65 x 103.5 = 67.275 ETH to LP 1's margin account
0.25 x 103.5 = 25.875 ETH to LP 2's margin account
0.10 x 103.5 = 10.350 ETH to LP 3's margin account

## Submit liquidity commitment
A liquidity provider must submit a valid set of liquidity provider orders. That set must include a *buy shape* and a *sell shape*. 

The network will translate these shapes into order book volume by creating an order set. 

Each entry must specify:
* Public key: The public key being used to place the liquidity commitment
* The market’s unique ID, denoted as `marketId` - The market must be in a state to accept liquidity commitment, and is not a rejected market, has not had trading terminated, or has not been settled 
* Liquidity commitment amount: The amount of funds to allocate to providing liquidity. The amount will be moved into a bond account during the duration of the liquidity commitment, denoted as `commitmentAmount`
* Proposed liquidity fee level: The scaling factor for the fee the submitter is bidding to receive when the order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Note: The proposed fee level is used along with other proposed fee levels to define the fees on the market. Denoted as `fee`
* A set of liquidity buy and sell order shapes (denoted as `buys` and `sells`), which include:
    * Offset: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more postion risk
    * Proportion: The proportion of your committed collateral allocated to this order, as a weight
    * Reference price: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
  * Propagate: Is true or false. Propogate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected

See a full list of applicable reference price levels in the [API documentation](https://docs.vega.xyz/protodocs/vega/vega.proto#peggedreference)), denoted as `reference`.

### Example:
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

## Amend liquidity commitment
Liquidity commitment orders can be amended by providing a new set of liquidity provision orders in the liquidity provider transaction. 

When amending a liquidity commitment, the network will always allow the submitter to provide more liquidity. However, reducing the liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If the submitter were to reduce their commitment to the point where the market would drop below its required stake threshold, then the amendment would not be accepted.

Submitting an amendment replaces the entire set of orders with the ones in the amendment transaction. To keep any of the existing order shapes, they'll need to added into the amendment.

## Cancel liquidity commitment
Cancelling a liquidity commitment, in effect, requests that the liquidity provision orders are amended to zero. Once the orders are cancelled, the bond amount is returned back into the submitter's general account.

If cancelling a commitment would leave a market without enough liquidity, then the cancellation will not be accepted. 

If there are any open positions that were created from the liquidity orders, they will not be cancelled when a liquidity commitment is cancelled. 
