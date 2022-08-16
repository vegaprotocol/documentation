---
sidebar_position: 1
title: Trading framework
hide_title: false
---

# Trading framework
The Vega protocol software is built to provide a framework for creating markets for trading financial instruments that are based on the values of their underlying assets. All markets created using the Vega protocol have been initiated and voted on by tokeholders.

Participants that interact with a futures market created using Vega software can submit market, limit, pegged and liquidity commitment orders.

The trading framework section cover the concepts of:
* [Trading modes](./trading-modes.md)
* [Order types and times in force](./orders.md)
* [Market protections](./market-protections.md)
* [Trading fees and rewards](./fees-rewards.md)

<!--## Pre-trade and trade [WIP]

### Positions and netting [WIP]

## Market data [WIP]-->

<!-- ## Decimal places
Decimal places come up in lots of situations on Vega. They're used for proposing assets, using those assets for a market, and deciding how large or small an order size can be.

They can be configured in the asset's original governance proposal, and then refined even further in a market governance proposal.

### Market decimal places
It is possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying, within a market proposal, a different (smaller) number of decimal places than the market's settlement asset supports. Consider a market that settles in GBP. This market can be configured to have 0 decimal places so that the price levels on the order book will be separated by at least £1, rather than the default £0.01 that the asset would support.

### Asset decimal places [WIP]
In effect, the number of decimal places tell you how divisible a token or asset is. To start, the number of decimal places of an asset used on Vega is defined in the asset governance proposal that introduces the asset to the network. An asset should the same number of decimal places that its native token contract has.

When an asset is chosen to be a market's settlement asset, it can have its decimal places limited further for that market specifically. (Why? Can it? Settlement decimals field actually takes from the data source so what's going on here?) -->