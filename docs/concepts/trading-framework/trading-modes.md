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
Auctions are a trading mode that collect orders during a set period, called an [auction call period](#auction-call-period). The end of an auction call period is determined by the condition that the auction aims to meet.

Auctions aggregate participation over time, up to a pre-set time when the market is uncrossed. The auction uncrossing generates trades at the conclusion of the auction, using an algorithm that processes, in price-time priority, the set of crossed orders that maximises traded volume. 

Currently, all auctions are triggered automatically based on market conditions. Market conditions that could trigger an auction:
* A market has opened for trading, which means it needs a defined price to start trading from 
* Price swing on a market is perceived, based on risk models, to be extreme and unrealistic
* Not enough liquidity on a market

### Auction type: Opening
Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery by determining a fair mid-price to start off continuous trading. 

#### Entry into an opening auction 
A new market’s opening auction begins at the proposal’s closing date.

#### Exit from an opening auction
A market’s opening auction ends at the market enactment time, unless an opening price can't be determined because no orders would uncross. In that case, the auction is extended by `market.auction.minimumDuration`. At the end of each extension time, the system looks for orders that would uncross.

When a market leaves its opening auction, it will use the mid-price within the range of auction bids that would result in the highest trade volume for its normal trading mode. For example, if the volume maximising range is 98-102, the market would price all trades in the uncrossing at 100. The order book would then be uncrossed at that price and the trades follow the normal flow.

### Auction type: Price monitoring
Sometimes low liquidity and/or a large quantity of order volume can cause a market's price to diverge from the true price. The Vega protocol is designed to assume that relatively small moves are 'real' and that larger moves might not be. The market's risk model and price monitoring settings are used to determine what the boundaries are between small, acceptable moves and large, unrealistic ones.

If a price move breaches the price monitoring bounds, a market will go into a price monitoring auction.

#### Entry into price monitoring auction 
A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction.

#### Exit from price monitoring auction 
A price monitoring auction's exit depends on how large the price move was, and relies on the market's risk model. For a relatively (contextually) small price move, it would be as long as `market.auction.minimumDuration`. The market's risk model informs  how many multiples of that time the auction would be extended by.

If no one places orders in the price monitoring auction, the auction is exited and the original order is executed.  

:::info Read more
[Price monitoring](./market-protections#price-monitoring)
:::

### Auction type: Liquidity monitoring
In order to ensure there is enough liquidity to keep a market active and protect against insolvent parties, the network will detect when the market's liquidity is too low, and if it is too low, will stop continuous trading and put the market into a liquidity monitoring auction. 

#### Entry into liquidity monitoring auction 
A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if there are no best bid and/or best ask prices on the market.

#### Exit from liquidity monitoring auction 
Enough liquidity relative to the market's open interest, to get the market back above the target stake.

If a market enters into a liquidity auction and never again attracts enough liquidity to exit it, the market will stay in a liquidity auction until the market's settlement. Once the market's settlement price is emitted by the data source, then all market participants are settled based on their positions and account balances.

::: Read more
[Liquidity monitoring](./market-protections#liquidity-monitoring)
:::

### Auction call period
During the auction call period, no trades are created, but all orders are queued.

At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

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
* Pegged orders (all types, including liquidity commitment orders) are reinstated to the order book 
* Limit orders stay on the book - unless they have a time in force of Good For Auction, in which case they're cancelled

### Exiting an auction
Auctions end, orders are uncrossed and resulting trades are created when:
* The auction call period end time is reached (if such a time is set)
* The criteria that end the particular auction are reached

Auctions **do not end** if the resulting state would immediately cause another auction to begin. Instead, the current auction gets extended.