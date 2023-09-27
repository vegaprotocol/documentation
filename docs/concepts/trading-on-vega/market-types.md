---
sidebar_position: 1
title: Market types
hide_title: false
description: Understand the products supported by the network.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Markets supported by the Vega network are cash-settled. When a market expires or a position is closed, the seller does not deliver the underlying asset, but rather transfers the associated cash position, which is determined by the market's settlement asset.

All markets created using Vega software are proposed through governance, by community members. Market proposals that pass a governance vote are then enacted and can be traded on.

Currently, the network supports two types of derivatives markets: futures markets that expire, and perpetual futures markets that do not expire.

## Futures
Cash-settled futures markets allow for placing margined trades to speculate on what the value of an underlying asset will be at a specific future date. 

Because the market's prices are predicting the asset's value on a future date, the actual value of the underlying asset's spot price can be very different to the price on the futures market.  

Futures markets have a settlement asset which may not be the same as either of the assets in the future market's trading pair.

Settlement, or the process of moving collateral between accounts, happens on a futures market when a position is closed, when the mark price changes, and when the market expires and all positions are closed.

:::note Read more 
* [Settlement](./settlement.md)
* [Market lifecycle](./market-lifecycle.md)
* [Positions and margin](./positions-margin.md)
:::

## Perpetual futures
Perpetual futures markets do not have a final settlement date and so traders can hold a position on a perpetuals market indefinitely. They periodically pay out profits to long or short traders by comparing the perpetual price to the underlying spot price.

There's an extra settlement process for perpetual markets that ensures the perpetual price doesn't diverge too far from the spot prices of the trading pair. This is called a funding period, or periodic settlement. The schedule for the market's funding periods is set in its governance proposal.

This scheduled settlement is in addition to mark to market settlement when the mark price changes.

Perpetual futures markets have a settlement asset that may not be the same as either of the assets in the market's trading pair.

### Funding rate
Each market has a funding rate, which represents the difference between the mark price of the perpetuals market and the spot market price of the underlying asset. 

If the perpetual price is above the spot price, the funding rate is positive and those with long positions "pay" those who with short positions. If the perpetual price is below the spot price, the funding rate is negative and traders with short positions lose money while those with long positions gain.

Any profit or loss as the result of the funding rate is only final once the position is closed, and is tracked as unrealised P&L.

The funding rate formula is as follows:

`funding rate = funding payment / spot time-weighted average price (TWAP)`

Read more on the funding payment below.

:::tip Query for data
See a market's historical funding rates using the [REST API](../../api/rest/data-v2/trading-data-service-list-funding-period-data-points.api.mdx).
:::

### Funding payment
The funding payment is, in its simplest form, calculated as the difference beween the perpetual market's current time-weighted average price and the external spot time-weighted average price. The perpetuals price is based on the mark price on the market, while the spot price comes from the data source.

Perpetuals market proposers can include additional parameters into the funding payment calculations to more closely match existing popular markets.

They include:
* Interest rate
* Clamp lower bound
* Clamp upper bound

:::note Go deeper
**[Funding payment calculations ↗](https://github.com/vegaprotocol/specs/blob/cosmicelevator/protocol/0053-PERP-product_builtin_perpetual_future.md#funding-payment-calculation)**: See how all the parameters can impact a market's funding rate and margin requirements.
:::

### Margin calculations
The margin calculations for perpetual futures markets contain an additional parameter to capture the exposure of a given position to an upcoming funding payment. The margin funding factor that determines to what degree the funding payment amount impacts a trader's maintenance margin is also defined in the market proposal.