---
sidebar_position: 8
title: Trading
vega_network: TESTNET
hide_title: false
---

Vega supports markets for trading cash-settled futures and perpetuals. 

[See a full list of available markets on Console. ↗](https://console.vega.xyz)

Markets on Vega are proposed by members of the community and voted in through the [governance process](../concepts/governance/index.md).

Markets can be in one of two trading modes: continuous trading or auction. 

Continuous trading uses a continuous limit order book, and traders can place limit or market orders, and use other more complex market instructions such as stop orders, pegged orders, and iceberg orders. [Get details about the accepted order types.](../concepts/trading-on-vega/orders.md)

Markets can enter into auctions when a market first opens, or if price monitoring bounds are breached because of large price moves. When an auction ends, the orders are sorted, and a price range at which the highest total quantity of trades can occur is derived. The mid-price of that range is used for uncrossing. [Learn more about auctions.](../concepts/trading-on-vega/trading-modes.md#auctions)

As Vega is a decentralised network with pseudonymous participants, there is no central party overseeing markets. There are market protections to manage situations like extreme price swings and closeouts. 

Protections are enabled to: 
* Detect extreme price swings and enter the market into a price-seeking auction
* Attempt to save distressed traders from being closed out, if possible
* Dispose of positions from traders that have been closed out in a way that doesn't distort the market
* Enact loss socialisation when a trader cannot support their owed amounts and the insurance pool doesn't have enough to cover the losses the 'winning' traders would have gained

[Read more about these market protections.](../concepts/trading-on-vega/market-protections.md)