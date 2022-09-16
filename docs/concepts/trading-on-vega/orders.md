---
sidebar_position: 5
title: Orders
hide_title: false
description: See the order types and when they're applicable for a market.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

# Orders
An order is an instruction to buy or sell on specific market, and it can go long or short on the market's price. Placing an order does not guarantee it gets filled. 

:::info Try it out
Place orders on markets using [Vega Console ↗](https://console.fairground.wtf), configured to the Fairground network, which only uses testnet assets.
:::

## Order data
The information needed by Vega to process an order:

| Name           | Description                                                                    | How it's determined |
|-----------|------------------------------------------------------------------------------------------|----------------|
| [Price](#limit-order)|Price to buy or sell at, for a limit order. Market orders use the best available price|Chosen by user|
| [Time in force](#times-in-force)	  | Instructions for how the order must behave                    |Chosen by user|
| Side	  | Buy or sell                                                                               |Chosen by user|
| Market	  | Name or ID of the market the order is placed in                                       | Chosen by user|
| [Size](#order-sizes)	  | How much to buy or sell                                                   | Chosen by user|
| Party	  | Vega public key of the party placing the order                                            | Chosen by user|
| Expires at | If the order has a Good 'til Time TIF, the specific time the order will expire | Chosen by user|
| [Type](#order-types)	  | Type of order (such as limit or market)                                   | Chosen by user|
| [Pegged order](#pegged-order) | Details about a pegged order, if an order uses pegs                 |Chosen by user|
| [Liquidity provision](./../../tutorials/providing-liquidity.md) | Provides details if an order is a liquidity commitment order   |Chosen by user|
| Order ID | Unique deterministic ID, can be used to query but only exists after consensus      |Determined by network|
| [Order status](#order-status)	  | Whether an order is filled, partially filled, stopped or cancelled |Determined by network|
| Reference | Unique order reference, used to retrieve an order submitted through consensus |Determined by network|
| Remaining	  | How many units of the order have not been filled, if any                        |Determined by network|
| Created at  | Vega date and time the order was created at                                     |Determined by network|
| Rejection reason | If an order is rejected, this describes why                     |Determined by network|
| [Version](#amend-an-order) | If a user amends an order, this increases by 1. You can fetch previous versions |Determined by network|
| [Updated at](#amend-an-order) | If an order has been amended, when it was amended    |Determined by network|
| Batch ID  | Used to identify which batch an auction orders falls under |Determined by network|

## Order sizes
The order size defines how much of a unit the user wants to buy or sell with their order. 

Orders are filled if the price is achieved, and an order can fill partly, completely or not at all. This doesn't affect the original order size, but does effect the remaining order size. 

Order sizes can be whole numbers or fractional, as long as the order is within the maximum number of decimal places allowable for the market. Any order containing more precision than this will be rejected. A market's decimal places are specified at the time of the market's proposal.

If a market requires that orders are specified using integers, fractional order sizes do not apply and 1 is the smallest increment.

## Order types
There are three order types available to traders: limit orders, market orders, and pegged orders. One order type is automatically triggered to close out positions for distressed traders - that's called a network order.

Orders can be persistent (stay on the order book) or non-persistent (never hit the order book). Some order types in Vega depend on the market state. 

### Limit order
A limit order is an instruction that allows you to specify the minimum price at which you will sell, or the maximum at which you will buy.

Limit orders stay on the order book until they are filled, expired or cancelled, unless they use IOC or FOK times in force.

#### Times in force available for limit orders
* **GTC**: A Good 'til Cancelled order trades at a specific price until it is filled or cancelled. 
* **GTT**: A Good 'til Time order is a GTC order with an additional predefined cancellation time. 
* **GFN**: A Good for Normal order is an order that will only trade in a continuous market. The order can act like either a GTC or GTT order depending on whether the expiry field is set.
* **GFA**: A Good for Auction order will only be accepted during an auction period, otherwise it will be rejected. The order can act like either a GTC or GTT order depending on whether an expiry is set.
* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and is not placed on the order book if it doesn't trade.

### Market order
A market order is an instruction to buy or sell at the best available price in the market. Because market orders can only use IOC or FOK times in force, they are never placed on the order book.

#### Times in force available for market orders
* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. An IOC order is never placed on the order book.
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and is never placed on the order book.

### Pegged order
Pegged orders are orders that are a defined distance from a reference price (i.e. best bid, mid and best offer/ask), rather than at a specific price, and generate limit orders based on the set parameters.

A pegged order is not placed on the order book itself, but instead generates a limit order with the price generated based on the reference and offset value. As the price levels in the order book move around, the order's price on the order book also moves.

The reference can only be positive and Vega applies it differently depending on if the order is a buy or sell. If the order is a `buy`, then the offset is taken away from the reference price. If the order is a `sell` they the offset is added to the reference price.

#### Values available for pegged orders
Pegged orders are restricted in what values can be used when they are created, and only the times in force of Good 'til Cancelled and Good 'til Time can be used.

| Type (Time in Force)      | Side  |   Bid Peg   | Mid Peg |  Offer Peg  |
|---------------------------|-------|-------------|---------|-------------|
| Persistent (GTC, GTT)	    | Buy	  | <= 0      | < 0     |  ❌ |
| Persistent (GTC, GTT)	    | Sell  |  ❌ | > 0     | >= 0        |

#### Reference prices for pegged orders
Rather than being set for a specific limit price, a pegged order is a defined distance from a reference price (such as the best bid, mid, or best offer/ask). That is the price against which the final order price is calculated. 

The reference price is based on the live market, and the final price is calculated and used to insert the new order. The distance is also known as the offset value, which is an absolute value that must be cleanly divisible by the tick size, and must be positive.

#### Amend pegged orders
Pegged orders can be amended like standard limit orders - their reference, offset and time in force values can all be amended. Amends must be done to the pegged order itself, not any limit orders derived from pegged orders. 

If the price or size are changed in an amendment, the order will lose time priority in the order book, but will keep its priority in the list of pegged orders. 

#### Parked pegged orders 
There are some situations in which pegged orders are parked, or moved off the order book, until the orders are cancelled or expire, or the market returns to a state that allows pegs. 

When orders return to the book, they are re-priced based on current market prices, and sorted by their original entry time.

Unparked pegged orders will be rejected:
* If the reference price no longer exists (e.g. no best bid)
* If the price moves to a value that means it would create an invalid order if the offset was applied

### Network order
A network order is triggered by the Vega network to close out a distressed trader, as part of position resolution. Network orders cannot be submitted by a party.

:::note Read more
[Position resolution](#position-resolution)
:::

## Order status
* **Filled**: Orders can be fully or partially filled. If the entire order amount has traded, it's `fully filled`. If only some of the order has traded, it's `partially filled`
* **Rejected**: If you don't have enough collateral to fill the margin requirements on an order, it will show up as `rejected`
* **Cancelled**:  If you cancel an order, the status will be shown as `cancelled`
* **Stopped**: If the the network cannot fill an order, based on the parameters you set, for example, then the order will show up as `stopped`

## Times in force
The following charts explain the times in force for orders and the statuses that they'll show, based on what happens in the network. 

### Fill Or Kill
Fill Or Kill (FOK): A non-persistent order that either trades all of its volume immediately on entry or is stopped/cancelled immediately without trading anything. In other words, unless the order can be completely filled immediately, it does not trade at all. It is never placed on the book, even if it does not trade.


| Time In Force | Filled | Resulting status |
|---------------|--------|------------------|
|      FOK      |   ❌   |      Stopped     |
|      FOK      |   ✅  |      Filled      |


### Immediate Or Cancel
Immediate Or Cancel (IOC): A non-persistent order that trades as much of its volume as possible with passive orders already on the order book (assuming it is crossed with them) and then stops execution. It is never placed on the book even if it is not completely filled immediately, instead it is stopped/cancelled.

| Time In Force | Filled  | Resulting status       |
|---------------|---------|------------------------|
|      IOC      |    ❌   |  Stopped               |
|      IOC      | Partial |  Partially Filled      |
|      IOC      |   ✅   |  Filled                |


### Good 'Til Cancelled
Good 'Til Cancelled (GTC): A persistent order that is valid indefinitely, until it's completely filled or the trader cancels it.

| Time In Force | Filled  | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|-------------------|--------------------|------------------|
|      GTC      |    ❌   |         No        |         No         |      Active      |
|      GTC      |    ❌   |         No        |        Yes         |      Stopped     |
|      GTC      |    ❌   |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |         No         |      Active      |
|      GTC      | Partial |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |        Yes         |      Stopped     |
|      GTC      |   ✅   |         No        |         No         |      Filled      |

### Good 'Til Time
Good 'Til Time (GTT): A persistent order that is valid until the trader's supplied expiry time. This can be an absolute date/time or a relative offset from the timestamp on the order.

| Time In Force | Filled  | Expired | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|---------|-------------------|--------------------|------------------|
|      GTT      |    ❌   |    No   |         No        |         No         |      Active      |
|      GTT      |    ❌   |   Yes   |         No        |         No         |      Expired     |
|      GTT      |    ❌   |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      |    ❌   |    No   |         No        |        Yes         |      Stopped     |
|      GTT      | Partial |    No   |         No        |         No         |      Active      |
|      GTT      | Partial |   Yes   |         No        |         No         |      Expired     |
|      GTT      | Partial |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      | Partial |    No   |         No        |        Yes         |      Stopped     |
|      GTT      |   ✅   |    No   |         No        |         No         |      Filled      |

### Good For Auction
Good For Auction (GFA): This order is dependent on the market's state, and will only be accepted by the system if it arrives during an auction period, otherwise it will be rejected. The order can act like either a Good 'Til Cancelled or Good Til Time order depending on whether an expiry is set.

When an auction uncrosses, GFA orders that are not matched are stopped. 

### Good For Normal
Good For Normal (GFN): This order is dependent on the market's state and will only be accepted by the system if it arrived during the market's standard trading mode, otherwise it will be rejected. The order can act like either a Good 'Til Cancelled or Good Til Time order depending on whether an expiry is set.

Good for Normal orders are stopped if the market moves into an auction.

## Submitting, amending and cancelling orders
This section is specific to market and limit orders. 

See [pegged orders](#pegged-order) and [liquidity commitment orders](./../../tutorials/providing-liquidity) for information on how to manage those order types.

### Submit an order 
Orders can be submitted into any market that is active - not expired or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. Not all orders can be submitted in all trading modes. 

If, during continuous trading, an order is going to be matched with another order on the book for the same party (also known as a wash trade), the order will be stopped, cancelled, and removed from the order book.

#### Opening auctions
Liquidity commitment orders, and [Good For Auction](#good-for-auction) orders can be submitted to markets that are in a pending state, and thus in opening auction. 

Pegged orders can also be placed, but will be parked until the market is out of auction. 

:::note Read more
**[Market status: pending](./market-lifecycle#market-status-pending)**
**[Opening auctions](./trading-modes#auction-type-opening)**
:::

### Amend an order
Orders that have not been fully filled can be amended.

If your amendment will change the price you're seeking or increase the order size, it will cancel the existing order and replace it with a new one. The time priority will be lost, because, in effect, the original order was cancelled and removed from the book and a new order was submitted with the modified values.

### Cancel an order
Market, limit and pegged orders that have not been fully filled can be cancelled. 

Liquidity commitment orders can be cancelled, but the cancellation will only be accepted if there's enough liquidity on the market without those committment orders.

When trading using the APIs, a trader can cancel individual orders, all orders for their public key across all markets, or all orders for their public key on a single market.