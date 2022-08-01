---
sidebar_position: 6
title: Liquidity
hide_title: false
---
## Fees and rewards [WIP]

### Fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles for a decentralised trading infrastructure.

Fees are incurred on every trade on a market in continuous trading, but it is the price taker who pays the fee. During a market's opening auction, no fees are collected.

The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) obtains part of the fee as a reward for providing liquidity.

An order may cross with more than one other order, creating multiple trades, which incur fees for each. Because of how the trade value for fee purposes is calculated (see below), the amount you'll pay for each order is the same, regardless of how many trades it takes to fill the order.

Fees are calculated and collected in the settlement currency of the market, and collected from your collateral. The fee is divided between the maker, the infrastructure provider, and the liquidity provider(s) for each market.

* Infrastructure portion of the fee, which is paid to validators as a reward for running the infrastructure of the network, is transferred to the infrastructure fee pool for that asset. It is then periodically distributed to the validators.
* Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker).
* Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market.

The trading fee is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x Trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade (This is true for futures, but may be calculated differently for other products.)

### Fees example
If you were to place an order for 100 futures at USDC50, the trade value for fee purposes is 100 x USDC50 = USDC5000.

In this example, each fee is 0.001, meaning total fee factor is 0.003.

USDC5000 x 0.003 = USDC15

The fee is the same irrespective of the number of transactions the order gets filled in, as long as they trade at the same price.

The fee factors are set through the following network parameters: `market.fee.factors.infrastructureFee`, `market.fee.factors.makerFee`, `market.fee.factors.liquidityFee`.
