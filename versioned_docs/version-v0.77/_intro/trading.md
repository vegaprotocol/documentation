---
sidebar_position: 8
title: Trading
vega_network: MAINNET
hide_title: false
---

## Markets
Vega supports markets for trading cash-settled futures, prediction markets and perpetuals, as well as spot/swaps.

[See a full list of available markets on Console. ↗](https://console.vega.xyz)

Markets on Vega are proposed by members of the community and voted in through governance. 

## Trading modes

Markets can be in one of two trading modes: continuous trading or auction. 

Continuous trading uses a continuous limit order book, and traders can place limit or market orders, and use other more complex market instructions such as stop orders, pegged orders, and iceberg orders. 

Markets enter into auctions when a market first opens, if block times are particularly slow, or if price monitoring bounds are breached because of large price moves. When an auction ends, the orders are sorted, and a price range at which the highest total quantity of trades can occur is derived. The mid-price of that range is used for uncrossing. 

:::note Dive deeper
[Concepts: Order types](../concepts/trading-framework/orders.md)
[Concepts: Auctions](../concepts/trading-framework/trading-modes.md#auctions)
:::

## Market protections

As Vega is a decentralised network with pseudonymous participants, there is no central party overseeing markets. There are market protections to manage situations like extreme price swings and closeouts. 

Protections are enabled to: 
* Detect extreme price swings and enter the market into a price-seeking auction
* Attempt to save distressed traders from being closed out, if possible
* Dispose of positions from traders that have been closed out in a way that doesn't distort the market
* Enact loss socialisation when a trader cannot support their owed amounts and the insurance pool doesn't have enough to cover the losses the 'winning' traders would have gained

:::note Dive deeper
[Concepts: Market protections](../concepts/trading-framework/market-protections.md)
:::