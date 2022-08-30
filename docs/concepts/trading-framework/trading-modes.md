---
sidebar_position: 1
title: Trading modes
hide_title: false
---
# Trading modes 
A market's trading mode denotes the types of trading that can be done on it while the market is in that mode. A market can only have one trading mode at a time.

The Vega software currently supports two trading modes: continuous trading (using a limit order book) and auctions. 

## Continuous trading
On a market with continuous trading, the Vega network tries to execute an order as soon as it is received. 

A continuous trading market uses a limit order book as the default price determination method.

Most, but not all, order types and times in force are accepted during continuous trading. 

### Orders accepted during continuous trading

| Pricing method | GTT | GTC | IOC | FOK | GFA | GFN |
| -------------- |:---:|:---:|:---:|:---:|:---:|:---:|
| Limit          | Y   | Y   | Y*  | Y*  | N   | Y   |
| Pegged         | Y   | Y   | N** | N** | N   | Y   |
| Market         | N   | N   | Y   | Y   | N   | N   |

\* IOC/FOK LIMIT orders never rest on the book, if they do not match immediately they are cancelled/stopped.<br/>
\** IOC/FOK PEGGED orders are not currently supported as they will always result in the cancelled/stopped state. This may change in the future if pegged orders are allowed to have negative offsets that can result in an immediate match.

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

### Auction type: Opening
Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery. 

### Auction type: Price monitoring
A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. 

The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction, the length of which is defined by price monitoring settings (chosen during the market proposal).

Read more: price monitoring

### Auction type: Liquidity monitoring
A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if the best bid and/or best ask price implied by limit orders from market participants are not available. 

If a market enters into a liquidity auction and never again attracts enough liquidity to exit it, the market will stay in a liquidity auction until the market's settlement. Once the market's settlement price is emitted by the data source, then all market participants are settled based on their positions and account balances. 

### Orders accepted during auctions
When a market is in an auction, only certain order types and times in force can be used. Market orders are not permitted.


| Pricing method | GTT | GTC | IOC | FOK | GFA | GFN |
| -------------- |:---:|:---:|:---:|:----|:---:|:---:|
| Limit          | Y   | Y   | N   | N   | Y   | N   |
| Pegged         | Y*  | Y*  | N   | N   | Y*  | N   |
| Market         | N   | N   | N   | N   | N   | N   |

\* Pegged orders will be [parked](./orders#parked-pegged-orders) if placed during an auction, with time priority preserved.

**Upon entering an auction:**
* Pegged orders are parked
* Limit orders stay on the book - unless they have a time in force of Good For Normal trading, in which case they're cancelled
* Non-persistent orders (Fill Or Kill and Immediate Or Cancel) are not accepted

**Upon exiting an auction:**
* Pegged orders (all types, including liquidity commitment  orders) get reinstated in the order book they were originally submitted to
* Limit orders stay on the book - unless they have a time in force of Good For Auction, in which case they're cancelled

### Exiting an auction
Auctions end, orders are uncrossed and resulting trades are created when:
* The auction call period end time is reached (if such a time is set)
* The triggers that end the particular auction are reached

Auctions **do not end** if the resulting state would immediately cause another auction to begin. Instead, the current auction gets extended. 

For example, if a liquidity monitoring auction would be triggered at the end of an opening auction, then the opening auction continues and the auction extension trigger is updated to account for the fact that the opening auction has been extended due to insufficent liquidity.