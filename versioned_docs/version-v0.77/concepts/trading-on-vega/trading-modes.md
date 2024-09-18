---
sidebar_position: 2
title: Auctions & continuous trading
hide_title: false
description: Find out what trading modes the protocol supports.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

# Trading modes 
A market's trading mode denotes the types of trading that can be done on it while the market is in that mode. A market can only have one trading mode at a time.  

The Vega software provides support for two trading modes: continuous trading (using a limit order book) and auctions.

## Continuous trading
On a market with continuous trading, orders are executed as soon as they are received, if possible. 

A continuous trading market uses a limit order book as the default price determination method.

Most, but not all, order types and times in force are accepted during continuous trading. 

### Orders accepted during continuous trading

| Order type  | GTT | GTC | IOC | FOK | GFA | GFN |
| -------------- |:---:|:---:|:---:|:---:|:---:|:---:|
| Limit          |  ✅ | ✅  | ☑️  | ☑️  | ❌   | ✅   |
| Pegged         |  ✅ | ✅  | 🛑   | 🛑 | ❌   | ✅   |
| Market         | ❌  | ❌  | ✅   | ✅   | ❌   | ❌   |
| Stop           | ✅  | ✅  | ✅   | ✅   | ❌   | ✅   |

☑️ - IOC/FOK LIMIT orders never rest on the book, if they do not match immediately they are cancelled/stopped.<br/>
🛑 - IOC/FOK PEGGED orders are not currently supported as they will always result in the cancelled/stopped state. This may change in the future if pegged orders are allowed to have negative offsets that can result in an immediate match.

:::note Read more
[Concept: Order types and times in force](./orders.md)**
:::

## Auctions
Auctions are a trading mode that collect orders during a set period, called an [auction call period](#auction-call-period). The end of an auction call period is determined by the condition that the auction aims to meet.

Currently, all auctions are triggered automatically based on market conditions. Market conditions that could trigger an auction:
* A market has opened for trading, which means it needs a defined price to start trading from 
* Price swing on a market is perceived, based on risk models, to be extreme and unrealistic
* Not enough liquidity on a market

### Auction type: Opening
Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery by determining a fair mid-price to start off continuous trading.

While a market is in opening auction, liquidity commitments can be submitted to it. Those who start committing earlier will receive a greater [equity-like share](../liquidity/rewards-penalties.md#how-the-fee-is-derived) in the market, which influences the amount of fee revenue they receive.

In the case of a [successor market](../governance/market.md#propose-a-successor-market), any liquidity provider can submit liquidity commitments to it but those that had been providing liquidity to the parent market will have their equity-like share, and thus its benefits, carried over.

#### Entry into an opening auction 
A new market’s opening auction begins at the proposal’s closing date.

#### Exit from an opening auction
A market’s opening auction ends at the market enactment time, unless an opening price can't be determined because no orders would uncross. In that case, the auction is extended. The extension time is set by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.auction.minimumDuration" />. At the end of each extension time, the system looks for orders that would uncross.

When a market leaves its opening auction, it will use the mid-price within the range of auction bids that would result in the highest trade volume for its normal trading mode. For example, if the volume maximising range is 98-102, the market would price all trades in the uncrossing at 100. The order book would then be uncrossed at that price and the trades follow the normal flow.

When a [successor market](../governance/market.md#propose-a-successor-market) leaves its opening auction, the insurance pool fraction (multiplied by the parent market's insurance pool balance) that was defined in its market proposal is transferred to the successor market's insurance pool.

### Auction type: Protective
Sometimes low liquidity and/or a large quantity of order volume can cause a market's price to diverge from the true price. The protocol is designed to assume that relatively small moves are 'real' and that larger moves might not be. The market's risk model and price monitoring settings are used to determine what the boundaries are between small, acceptable moves and large, unrealistic ones.

If a price move breaches the price monitoring bounds, a market will go into a price monitoring auction.

#### Entry into protective auction 
A market will go into a protective auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction.

#### Exit from protective auction 
A protective auction's exit depends on how large the price move was, and relies on the market's risk model. For a relatively (contextually) small price move, it would be as long as the value of the nework parameter <NetworkParameter frontMatter={frontMatter} param="market.auction.minimumDuration" />. The market's risk model informs how many multiples of that time the auction would be extended by.

If no one places orders in the protective auction, the auction is exited and the original order is executed.  

:::note Read more
[Concept: Price monitoring](./market-protections#price-monitoring)
:::

### Auction type: Block time
When the network experiences particularly slow block times - more than 10 seconds per block - all markets are moved into auction. The slowdowns can occur in situations such as after a network upgrade, or downtime. 

#### Entry into block time auction
A slow block that exceeds the threshold will trigger auctions on all markets.

The duration of the auction depends on how long the previous block took to be processed. The relationship between the two is set as a network parameter: <NetworkParameter frontMatter={frontMatter} param="auction.LongBlock" hideValue={true} />.

#### Exit from block time auction
When the auction duration time has passed, all markets will leave the block time auction.

### Auction call period
During the auction call period, no trades are created, but all orders are queued.

At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

### Orders accepted during auctions
When a market is in an auction, only certain order types and times in force can be used. Market orders are not permitted. An iceberg order can be entered, or carried into an auction, if its underlying time in force is supported.


| Pricing method | GTT | GTC | IOC | FOK | GFA | GFN |
| -------------- |:---:|:---:|:---:|:----:|:---:|:---:|
| Limit          | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Pegged         | ☑️ | ☑️ | ❌ | ❌ | ☑️ | ❌ |
| Market         | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Stop          | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

☑️ - Pegged orders will be [parked](./orders#parked-pegged-orders) if placed during an auction, with time priority preserved.

**Upon entering an auction:**
* Pegged orders are parked
* Limit orders stay on the book - unless they have a time in force of Good For Normal trading, in which case they're cancelled
* Non-persistent orders (Fill Or Kill and Immediate Or Cancel) are not accepted
* Stop orders are accepted 

**Upon exiting an auction:**
* Pegged orders are reinstated to the order book 
* Limit orders stay on the book - unless they have a time in force of Good For Auction, in which case they're cancelled
* Stop orders can be triggered by the auction uncrossing price if the auction results in a trade

### Exiting an auction
Auctions end, orders are uncrossed and resulting trades are created when:
* The auction call period end time is reached (if such a time is set)
* The criteria that end the particular auction are reached

Auctions **do not end** if the resulting state would immediately cause another auction to begin. Instead, the current auction gets extended.

### Auction uncrossing 
When an auction has been exited, the orders are uncrossed. During an auction uncrossing, orders that were collected during the auction generate trades. Those trades are processed in price-time priority. 

First, the protocol determines the range where the highest total quantity of trades can occur, in other words, the volume-maximising price range. Then, the trades at the mid-price within that range are filled. For example, if the volume-maximising price range is 98-102, the protocol prices all trades in the uncrossing at 100, i.e. `(minimum price of range + maximum price of range)/2`.