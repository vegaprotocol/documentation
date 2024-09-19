---
sidebar_position: 7
title: Settlement
hide_title: false
description: The automated settlement process is facilitated by the protocol.
---

The Vega protocol is built to support creating cash-settled derivatives markets - futures as well as perpetual futures - meaning they are margined and settled in a single asset, as opposed to being settled in the actual (physical) underlying asset.

Settlement is the process of moving collateral between accounts when:
* a position is fully or partially closed, with settlement occurring for the closed volume
* the market's mark price changes and the protocol runs mark to market settlement
* if relevant, a perpetual market's periodic settlement schedule is triggered
* if relevant, a futures market expires, at which point all open positions in the market are closed and settled
* if relevant, a governance proposal to terminate a market is enacted

A network running the Vega software will operate as a decentralised counterparty that facilitates settlement between participants.

## Parameters defined through governance
Market proposals define the fundamental details about a market, including its settlement asset and how it can terminate and be settled.

### Settlement asset
Settlement occurs in the settlement asset of the market. That is defined in the governance proposal that led to the market's creation. The settlement asset **does not** need to be the same asset as the ‘quote unit’ (i.e. ETH on a BTC/ETH market).

### Data for settlement triggers
In addition to the settlement asset, a market's proposal also specifies the data sources that determine settlement triggers. 

The data sources defined, and the filters applied to them, must be able to provide the market's expiry date/time and its final price/value at expiry, or a schedule for when periodic settlement should be carried out.

For a futures market, when a market arrives at its specified expiry, trading terminates and then the data sources provide the final settlement value. The protocol settles all open positions on the market using the price provided by the data source.

:::note Read more
[Concept: Data sources](./data-sources.md)
:::
 
## Settlement at market expiry
After a futures market reaches its maturity date and time, a final settlement is carried out. That settlement is dependent on the pre-defined data source publishing data that triggers the market’s expiry.

The trigger will cause the market to enter into a 'trading terminated' state. Markets in this state no longer accept trading, but retain the positions and margin balances that were in place after processing the market’s maturity trigger. Termination occurs just prior to settlement, so that no trading can occur after the settlement result can be known by participants.

As positions are regularly mark to market settled, the final settlement is, in effect, a final mark to market settlement using the data source quote.

Once a market settles:
* All open positions in that market are closed based on the final price
* Open orders are cancelled
* Collateral held in the market is released back to participants

After all positions are closed when the market expires, they are ‘forgotten’ by the protocol. However, data nodes will keep the information, thus making it possible to see the historical information even after the market can't be traded on.

### Expiry example
A cash-settled futures market reaches its expiry date and time. If the last mark price before settlement is 100, but the oracle price feed emits data that the price is 115, then a trader with a position of 1 long is paid 15. Another trader that has a position of 1 short, pays 15.

:::note Read more
[Concept: Data sources](./data-sources.md)
:::

## Mark to market settlement
When the mark price on a market changes, the protocol calculates settlement cash flows for each party with an open position. This means that each time the mark price for a given market changes, all the open positions are marked to market. Interim partial payments are calculated by the protocol, and those payments go directly to the relevant trader's margin account. 

:::note Read more
[Concept: Mark to market](./margin.md#mark-to-market)
:::

## Periodic settlement for perpetuals 
Perpetual futures markets are settled periodically using spot prices from an external data source. This is in addition to mark to market settlement, which happens when the mark price for funding changes. 

These periodic settlements are known as the funding periods.

The data source for spot prices and how often the market is scheduled to use that data to settle positions are defined in the market's parameters.

When a settlement schedule time is reached, the protocol calculates how much should be transferred between the parties for each open position. This is based on the provided price data for the underlying asset. The difference between the mark price for funding and the spot price of the underlying asset is used to determine how much is moved between the two sides of each open position.

If the perpetual price is above the spot price, the funding payment is positive and those with long positions "pay" those who are short in a position.  If the perpetual price is below the spot price, the funding payment is negative and traders with short positions lose money while those with long positions gain.

The amount depends on how far apart the spot price is from the perpetual price on the market.

When executing the settlement for each funding period, first cashflows are collected from the parties making the payment, and then those funds are distributed to those receiving it. Any profit or loss as the result of the funding rate is only final once the position is closed, and is tracked as unrealised P&L until then.

If there's a shortfall, the market's [insurance pool](./market-protections.md#insurance-pools) is used to make up the difference. If that's not possible, the protocol will trigger [loss socialisation](./market-protections.md#loss-socialisation).

:::note Read more
[Concept: Perpetual futures markets](../trading-framework/market-types.md#perpetual-futures)
:::

## Settlement execution
The protocol executes settlement using a two step process: Collection and distribution.

### Collection
Assets are collected from the margin accounts of those who, according to the settlement formula and the traders' positions, are liable to pay. If any of the required collateral is not available from the margin account, it is collected from the general account, and if there is any still uncollected, it is collected from the market's insurance pool. 
 
If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation occurs.
 
When collateral is collected, ledger entries that adhere to double-entry accounting are created to record the actual transfers. The destination is the settlement account for the market, which will have a 0 balance before the settlement process begins, and again after it completes.
 
### Distribution
If all the requested amounts are successfully transferred to the settlement account, then the amount collected will match the amount to be distributed. The participants whose moves were positive will have their margin accounts credit with what they're owed. 

:::note Read more 
* [Concept: Insurance pools](../trading-framework/market-protections.md#insurance-pools)
* [Concept: Loss socialisation](../trading-framework/market-protections.md#loss-socialisation)
* [Concept: Settlement account](../assets/accounts.md#settlement-accounts)
:::
