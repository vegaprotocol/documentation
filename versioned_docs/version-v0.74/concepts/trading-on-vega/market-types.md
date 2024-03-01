---
sidebar_position: 1
title: Market types
vega_network: MAINNET
hide_title: false
description: Understand the products supported by the network.
---

Markets supported by the Vega network are cash-settled. When a market expires or a position is closed, the seller does not deliver the underlying asset, but rather transfers the associated cash amount in market's settlement asset.

All markets created using Vega software are proposed through governance, by community members. Market proposals that pass a governance vote are then enacted and can be traded on.

Currently, the network supports two types of derivatives markets: futures markets that expire, and perpetual futures markets that do not expire.

## Futures
Cash-settled futures markets allow for placing orders and taking margined positions to speculate on what the value of an underlying asset will be at a specific future date.

Because the market's prices are predicting the asset's value on a future date, the actual value of the underlying asset's spot price can be very different to the price on the futures market.  

Futures markets have a settlement asset which may not be the same as either of the assets in the future market's trading pair.

Settlement, or the process of moving collateral between accounts, happens on a futures market when a position is closed, when the mark price changes, and when the market expires and all positions are closed.

:::note Read more 
* [Concept: Settlement](./settlement.md)
* [Concept: Market lifecycle](./market-lifecycle.md)
* [Concept: Positions and margin](./margin.md)
* [Tutorial: Propose a futures market](../../tutorials/proposals/new-market-proposal.md)
:::

## Perpetual futures
Perpetual futures markets do not have a final settlement date and so traders can hold a position on a perpetuals market indefinitely. Traders exchange cashflows each time the mark price for funding changes - this process is called mark-to-market settlement.

There's also an additional settlement process for perpetual markets that ensures the perpetual price doesn't diverge too far from the underlying spot market. It's called periodic settlement and the cashflows exchanged at the end of each funding period are called funding payments. The schedule for the market's funding periods is set in its governance proposal.

Perpetual futures markets have a settlement asset that may not be the same as either of the assets in the market's trading pair.

### Funding payment
The funding payment is, in its simplest form, calculated as the difference over the funding period between the perpetual market's time-weighted average price and the external spot time-weighted average price. The perpetuals price is based on the market's mark price for funding, while the spot price comes from the data source. The method for deriving the mark price for funding is set per market.

If the perpetual price is above the spot price, the funding payment is positive and those with long positions "pay" those who with short positions. If the perpetual price is below the spot price, the funding payment is negative and traders with short positions lose money while those with long positions gain.

Any profit or loss as the result of the funding rate is only final once the position is closed, and is tracked as unrealised P&L.

Perpetuals market proposers can include additional parameters into the funding payment calculations to more closely match existing popular markets.

They include:
* Interest rate
* Clamp lower bound
* Clamp upper bound
* Scaling factor (optional)
* Rate lower bound (optional)
* Rate upper bound (optional)

:::note Go deeper
**[Spec: Funding payment calculations ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0053-PERP-product_builtin_perpetual_future.md#funding-payment-calculation)**: See how all the parameters can impact a market's funding rate and margin requirements.
:::

### Margin calculations
The margin calculations for perpetual futures markets contain an additional parameter to capture the exposure of a given position to an upcoming funding payment. The margin funding factor that determines to what degree the funding payment amount impacts a trader's maintenance margin is also defined in the market proposal. This additional term can only increase the margin requirement if a given position is expected to make a payment at the end of the current funding period, but it will never decrease the margin requirement, even if party is expecting to receive a funding payment.


:::note Read more 
* [Concept: Periodic settlement](./settlement.md#periodic-settlement-for-perpetuals)
* [Concept: Positions and margin](./margin.md)
* [Tutorial: Propose a perpetuals market](../../tutorials/proposals/new-perpetuals-market.md)
:::