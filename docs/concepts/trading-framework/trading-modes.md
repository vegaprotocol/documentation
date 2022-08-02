---
sidebar_position: 3
title: Trading modes
hide_title: false
---
# Trading modes 
A market's trading mode denotes the types of trading that can be done on it while the market is in that mode. A market can only have one trading mode at a time.

The Vega software currently supports two trading modes: continuous trading (using a limit order book) and auctions. 

## Continuous trading
On a market with continuous trading, the Vega network tries to execute an order as soon as it is received. 

A continuous trading market uses a limit order book as the default price determination method.

## Auctions
Auctions are a trading mode that collect orders during a set period, called an *auction call period*. 

The end of an auction call period is determined by the condition that the auction aims to meet. Auctions that are based on market conditions are triggered automatically.

Market conditions that could trigger an auction:
* A market has opened for trading, which means it needs a defined price to start trading from 
* Not enough liquidity on a market
* Price swing on a market is perceived, based on risk models, to be extreme and unrealistic 

### Auction call period
During the auction call period, no trades are created, but all orders are queued. 

At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

### Auction types
The Vega protocol supports several types of auctions:

* **Opening auctions**: Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery
* **Price monitoring auctions**: A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction, the length of which is defined by price monitoring settings (chosen during the market proposal)
* **Liquidity monitoring auctions**: A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if the best bid and/or best ask price implied by limit orders from market participants are not available
* **Frequent batch auctions**: A trading mode set for a market in its inception, that has trading occur only through repeated auctions, as opposed to continuous trading (Not yet available)

