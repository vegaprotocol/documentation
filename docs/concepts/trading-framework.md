# Trading framework
The Vega protocol software is built to provide a framework for creating markets for trading financial instruments that are based on the values of their underlying assets. All markets created using the Vega protocol have been initiated and voted on by tokeholders.

Participants that interact with a futures market created using Vega can submit market, limit, pegged and liquidity commitment orders. 

## Orders
An order is an instruction to execute a trade that is long or short on a market's price. Placing an order does not guarantee it is filled. Orders stay on the order book until they are filled, expired or cancelled.

When an order is placed, it is uniquely identified to the Vega network by its order ID, the market ID - which is unique to each market, and party ID - which is owned by the signer of the transaction. 

### Submitting an order
Orders can be submitted into any market that is active - i.e., not in a protective auction, or matured, expired, or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. 

[**Margin**](#margin): Find out how margin works in the Vega system. 

If, during continuous trading, an order is going to be matched with another order on the book for the same party (also known as a wash trade), then execution of that order will be stopped and the order will be cancelled and removed, if it on the book. 

### Order sizes
Order sizes can be fractional, as long as the order is within the maximum number of decimal places allowable for the market. Any order containing more precision than this will be rejected. A market's decimal places are specified in the market framework (link).

If a market requires that orders are specified using integers, fractional order sizes do not apply and 1 is the smallest increment.

### Amending an order
Orders that have not been filled can be amended using the APIs. Amendments that change price or increase size will be executed as a cancel and replace, meaning the time priority will be lost -- as if the original order was cancelled and removed from the book and a new order was submitted with the modified values.

Orders cannot be amended using Vega Console. Instead, an individual order should be cancelled and a new order placed. 

#### Cancelling an order
Orders that have not been filled can be cancelled. 

When trading using the APIs, there are three options for cancelling a standard limit or market order. A trader can cancel individual orders, all orders for their public key across all markets, or all orders for their public key on a single market. Each of those ways will remove the orders from the order book, and push out order update messages. 

* Cancel with orderID, marketID and partyID - This removes the defined order from the order book of the given market
* Cancel with partyID and marketID - This removes all the orders for a given party in the given market
* Cancel with partyID - This removes every order for that given party across all markets

When trading on Vega Console, a trader will only be able cancel individual orders on individual markets, one at a time. 

Cancelling the orders that are created from a liquiity commitment cannot be cancelled in the same way.

Read more: 
[Limit orders](#limit-order)
[Market orders](#market-order)
[Cancelling liquidity commitment orders](#cancel-liquidity-commitment-orders)

### Order types
There are three order types available to traders: limit orders, market orders, and pegged orders. One order type is automatically triggered to close out positions for distressed traders - that's called a network order.

### Limit order
A limit order is an instruction that allows you to specify the minimum price at which you will sell, or the maximum at which you will buy. 

#### Times in force available for limit orders
* **GTC**: A Good til Cancelled order trades at a specific price until it is filled or cancelled. 
* **GTT**: A Good til Time order is a GTC order with an additional predefined cancellation time. 
* **GFN**: A Good for Normal order is an order that will only trade in a continuous market. The order can act like either a GTC or GTT order depending on whether the expiry field is set.
* **GFA**: A Good for Auction order will only be accepted during an auction period, otherwise it will be rejected. The order can act like either a GTC or GTT order depending on whether an expiry is set.
* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Market order
A market order is an instruction to buy or sell at the best available price in the market. 

#### Times in force available for limit orders

* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Network order
A network order is triggered by the Vega network to close out a distressed trader, as part of position resolution. Network orders cannot be submitted by a party.

Read more: [Position resolution](#position-resolution)

#### Times in force used in network orders

* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Order status
If you don't have enough collateral to fill the margin requirements on an order, it will show up as 'Rejected'. If you cancel an order, the status will be listed as 'Cancelled', and if the the network cannot fill an order, based on the parameters you set, for example, then the order will show up as 'Stopped'. The following charts explain the order types and the statuses that they'll show, based on what happens in the network. 

#### Fill or Kill

| Time In Force | Filled | Resulting status |
|---------------|--------|------------------|
|      FOK      |   No   |      Stopped     |
|      FOK      |   Yes  |      Filled      |


#### Immediate or Cancel

| Time In Force | Filled  | Resulting status       |
|---------------|---------|------------------------|
|      IOC      |    No   |  Stopped               |
|      IOC      | Partial |  Partially Filled      |
|      IOC      |   Yes   |  Filled                |


#### Good til Cancelled

| Time In Force | Filled  | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|-------------------|--------------------|------------------|
|      GTC      |    No   |         No        |         No         |      Active      |
|      GTC      |    No   |         No        |        Yes         |      Stopped     |
|      GTC      |    No   |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |         No         |      Active      |
|      GTC      | Partial |        Yes        |         No         |     Cancelled    |
|      GTC      | Partial |         No        |        Yes         |      Stopped     |
|      GTC      |   Yes   |         No        |         No         |      Filled      |

#### Good til Time

| Time In Force | Filled  | Expired | Cancelled by user | Stopped by network | Resulting status |
|---------------|---------|---------|-------------------|--------------------|------------------|
|      GTT      |    No   |    No   |         No        |         No         |      Active      |
|      GTT      |    No   |   Yes   |         No        |         No         |      Expired     |
|      GTT      |    No   |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      |    No   |    No   |         No        |        Yes         |      Stopped     |
|      GTT      | Partial |    No   |         No        |         No         |      Active      |
|      GTT      | Partial |   Yes   |         No        |         No         |      Expired     |
|      GTT      | Partial |    No   |        Yes        |         No         |     Cancelled    |
|      GTT      | Partial |    No   |         No        |        Yes         |      Stopped     |
|      GTT      |   Yes   |    No   |         No        |         No         |      Filled      |

### Pegged order
Pegged orders are orders that are a defined distance from a reference price (i.e. best bid, mid and best offer/ask), rather than at a specific price, and generate limit orders based on the set parameters. Currently, pegged orders can only use GTC and GTT times in force, but IOC and FOK will be available in a future release.

A pegged order is not placed on the order book itself, but instead generates a limit order with the price generated based on the reference and offset value. As the price levels in the order book move around, the order's price on the order book also moves.

The reference can only be positive and Vega applies it differently depending on if the order is a buy or sell.

If we are a buy the offset is taken away from the reference price. If we are a sell they the offset is added to the reference price.

#### Reference prices for pegged orders
Rather than being set for a specific limit price, a pegged order is a defined distance from a reference price (such as the best bid, mid, or best offer/ask). That is the price against which the final order price is calculated. The reference price is based on the live market, and the final price is calculated and used to insert the new order. The distance is also known as the offset value, which is an absolute value that must be cleanly divisible by the tick size, and can be [negative or] positive. 

#### Amending pegged orders
Pegged orders can be amended like standard limit orders - their reference, offset and time in force values can all be amended. If amending an order cannot be performed in-place, the order will lose time priority in the order book (but will keep its priority in the list of pegged orders). Amends must be done to the pegged order itself, not any limit orders derived from pegged orders. 

#### Parked pegged orders 
There are some situations in which pegged orders are parked, or moved off the order book, until the market returns to a state that allows pegs, or the orders are cancelled or expire. When orders return to the book, they are re-priced based on current market prices, sorted by their original entry time. If the primary trading mode of a market doesn't allow pegged orders (such as an auctions-only market), then the pegged orders are rejected.  Those situations include:
* Auctions - pegged orders are only valid during continuous trading
* When the reference price does not exist (e.g. no best bid)
* The price moves to a value that means it would create an invalid order if the offset was applied

Pegged orders are restricted in what values can be used when they are created, these can be defined by a list of rules each order must abide with. Note: IOC and FOK are not currently available for pegged orders, but will be in a future release. 

| Type (Time in Force)      | Side  |   Bid Peg   | Mid Peg |  Offer Peg  |
|---------------------------|-------|-------------|---------|-------------|
| Persistent (GTC, GTT)	    | Buy	  | <= 0        | < 0     | Not allowed |
| Persistent (GTC, GTT)	    | Sell  | Not allowed | > 0     | >= 0        |
| Non persistent (IOC, FOK) |	Buy   | > 0         | > 0     | >= 0        |
| Non persistent (IOC, FOK) |	Sell  | <= 0        | < 0	    | < 0         |

### Batch operations on orders [WIP]

## Position management [WIP]
- margin 

## Market protections
In a pseudonymous environment where counter-parties may be identified by no more than a public key, it's essential to consider the credit risk, given that the avenues available for traditional marketplaces aren't available. If a counterparty owes more in settlement than their posted collateral, there is no way to reclaim those assets.

The Vega protocol has been designed with rules to detect dangerous market conditions and apply protective measures, and to constantly maintain effective collateralisation for all positions.

Margin calculations take into account the probability of the liquidation value of a position falling short of the available capital. The network is also designed to frequently re-evaluate each individual's risk, and pre-emptively close positions.

Some of those measures include price monitoring, liqudity monitoring, and frequent mark to market calculations.

Read more: 
* [Margin on Vega](#margin)
* [Price monitoring](#price-monitoring)
* [Liquidity monitoring](#liquidity-monitoring)
* [Distressed traders](#distressed-traders)

### Mark to market
Marking to market refers to the settling of gains and losses due to changes in the market value of the underlying product. Marking to market aims to provide a realistic appraisal of of a position based on the current market conditions.

If the value goes up, a trader that holds a long position receives money in their general account – equal to the underlying's change in value – from a trader that holds a short position, and conversely if the value goes down, the holder of the short position recieves money from the holder of the long position. 
For a market created on Vega, the mark-to-market price is calculated every time the price moves. This is in contrast to traditional futures markets, for which marking to market occurs once per day. 

Settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party,  and the process is repeated each time the mark price changes until the maturity date for the market is reached.

Because the margin for a market is calculated dynamically based on the market conditions, the mark price also has an effect on how much collateral is set aside for margin.

Read more: [Mark to market settlement](#mark-to-market-settlement)

### Margin
The margin calculation for a new order, and the amount deducted from collateral to cover margin, is based on all of a trader's open orders. A trader will need enough margin to keep a position open, whether it goes for or against the trader. The margin calculations ensure a trader does not enter a trade that will immediately need to be closed out.

Vega's margining system implements automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets that use the same settlement asset. 

:::note Further reading
**[Automated cross margining](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21)** - Section 6 of the protocol whitepaper.
:::

### Basic margin calculations
Vega calculates four margin levels:
* **Initial level**: The amount that will be transferred from your collateral to be used as margin when an order is placed or trade executed. To avoid a margin search as soon as position is open, the initial margin level is set above the search level:
  * m<sup>initial</sup> := α<sup>initial</sup> * m<sup>maintenance</sup>, where α<sup>initial</sup> is a constant and α<sup>initial</sup> > α<sup>search</sup>.
* **Search level**: When the margin balance drops below the search level -- but is still above the maintenance level -- the network will try to allocate an additional amount (up to the current initial margin level) from a trader's collateral, if possible, to be used for margin:
  * m<sup>search</sup> := α<sup>search</sup> * m<sup>maintenance</sup>, where α<sup>search</sup> is a constant and α<sup>search</sup> > 1.
* **Release level**: Once a trader's margin balance exceeds the margin release level, the position is considered overcollateralised and funds are released back to collateral so that the margin balance is equal to the current initial margin level:
  * m<sup>release</sup> := α<sup>release</sup> * m<sup>maintenance</sup>, where α<sup>release</sup> is a constant and α<sup>release</sup> > α<sup>initial</sup>.
* **Maintenance margin**: This is implied by the risk model and corresponds to the minimum amount required to cover adverse market moves with a given probability level. As soon as the margin balance drops below the maintenance margin level, the position close-out process gets initiated.

### Calculating the margin on open orders
The network calculates the largest long / short position. If the long position is the riskiest, the margin algorithm multiplies by a `risk factor long` and by the `mark price` (for futures). If the short position is the riskiest, then the algorithm multiplies the position by the `risk factor short` and by the `mark price`. These capture the outcome of probabilistic distribution of future market moves, and are market specific.

#### Example 
Image to be uploaded - <img alt="Calculating margin on open orders" src="/images/2-calculate-margin-open-orders.png" width="500" />

There is an open sell order of size 1 on the book. The risk factor for short positions is 0.074347011. The current mark price is 0.02690. So minimum margin = 0.2690 x 0.074347011 = 0.00200 (rounded to 5 decimal places).

### Margin on open positions
The following calculation takes into account 'slippage', as seen on an order book.

#### Example:
<img alt="Calculating margin on an open positions" src="/images/3-margin-open-positions.png" width="500" />

The trader has an open short position of size 1, and no open orders. 

The risk factor for short position is 0.074347011. 

The current mark price is 0.02672. 

The best offer price is 0.02676 and it has enough volume so that theoretically the position could be closed-out at that price. 

maintenance margin = 0.02672 x 0.074347011 + max (0, 0.02676 - 0.02672) = 0.00203 (rounded to 5 decimal places), where the second term in the sum is the 'slippage' component. 

Other margin levels are derived from the maintenance margin using the scaling factors that form part of the market configuration.

### Initial margin calculation
The initial margin is the minimum amount of collateral required to enter a new trade.

A market parameter will specify α<sup>initial</sup> > α<sup>search</sup> and the minimum collateral amount required for a new trade to be entered into as the initial margin. m<sup>initial</sup>:= (1 + α<sup>initial</sup>) m<sup>maintenance</sup>

An initial margin level m<sup>initial</sup> that is higher than the margin search level (1 + α<sup>search</sup>) m<sup>maintenance</sup> ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral immediately after a trade has been entered into.

### Margin: Searching for collateral
When a trader's balance in their margin account (for a market) is less than their position’s *search level*, the protocol will attempt to transfer sufficient collateral from the trader’s main collateral account to top up their margin account to the level of the initial margin. 

If the margin account can be topped up, then the position stays open. If a market's swing is bigger than a user's margin is collateralised for, then money is pulled from the collateral to cover the requirement. In most cases, the allocated margin should cover market swings.

Price monitoring should ensure that large swings only occur only due to genuine changes in market participants' view of the true average price of the traded instrument.

Read more: [Price monitoring](#price-monitoring)

If there is not enough collateral to provide the required margin, then the position will be closed out.

### Margin: Releasing collateral
Traders who have a margin account balance greater than the release level will have the excess assets released to their general collateral account, to the point where their new margin level is equal to the initial margin level.

### Distressed traders
If a trader's available margin on a market is below the closeout level and cannot be rectified, that trader is considered to be distressed.

A distressed trader has all their open orders on that market cancelled. The network will then recalculate the margin requirement on the trader's remaining open position. If they then have sufficient collateral, they are no longer considered a distressed trader. 

However, if the trader does not have sufficient collateral, they are added to list of traders that will then undergo position resolution to close out their positions.

Read more: [Position resolution](#position-resolution)

### Closeouts
When a participant does not have enough collateral to hold their open positions, the protocol will automatically trigger a closeout.

The closeout process is a last resort for a position. If a trader's deployed margin on the market is insufficient to cover a mark to market settlement liability, first Vega will search the trader's available balance of the settlement asset. If this search is unable to cover the full liability, the trader will be considered distressed and undergo position resolution. Any margin balance remaining after closeout is transferred to the market's insurance pool.

The insurance pool is drawn from to make up the difference required to cover the mark to market loss amount. Should the funds in the insurance pool be insufficient for that, loss socialisation will be applied.

Read more: 
* [Position resolution](#position-resolution)
* [Loss socialisation](#loss-socialisation)

### Position resolution
Position resolution is executed simultaneously, during a single event, for all traders on a market that have been determined to require it. Distressed trader(s) are ‘batched up’, and position resolution is run once the full set of traders is known for this event.

The network calculates the overall net long or short positions in the batch that requires position resolution, which tells the network how much volume (either long or short) needs to be sourced from the order book. For example, if there are 3 distressed traders with +5, -4 and +2 positions respectively, then the net outstanding liability is +3. 

The outstanding liability is sourced from the market's order book via a single market order executed by the network as a counterparty. In this example, a market order to sell 3 would be placed on the order book. This order is described as a 'network order'.

The network generates a set of trades with all the distressed traders, all at the volume weighted average price of the network's (new) open position. At this point, neither the distressed traders nor the network will have any open positions. Note, network orders do not affect the market's mark price. 

All of the remaining collateral in each distressed trader's margin account for that market is confiscated to the market's insurance pool.

Read more: [Insurance pools](#insurance-pools)

#### Loss socialisation 
Loss socialisation occurs when there are traders that don't have sufficient collateral to handle the price moves of their open position(s), and the insurance pool cannot cover their shortfall. 

This situation would mean collection transfers are not able to supply the full amount to the market settlement account, and not enough funds can be collected to distribute the full amount of mark to market gains made by traders on the other side. 

The funds that have been collected must be fairly distributed. Loss socialisation is implemented by reducing the amount that is distributed to each trader with a mark to market gain, based on their relative position size. 

```
distribute_amount[trader] = mtm_gain[trader] * ( actual_collected_amount / target_collect_amount )
```

## Pre-trade and trade [WIP]

### Positions and netting [WIP]

## Trading modes 
A market's trading mode denotes the types of trading that can be done on it while the market is in that mode. A market can only have one trading mode at a time.

The Vega software currently supports two trading modes: continuous trading (using a limit order book) and auctions. 

### Continuous trading
On a market with continuous trading, the Vega network tries to execute an order as soon as it is received. 

A continuous trading market uses a limit order book as the default price determination method.

### Auctions
Auctions are a trading mode that collect orders during a set period, called an *auction call period*. 

The end of an auction call period is determined by the condition that the auction aims to meet. Auctions that are based on market conditions are triggered automatically.

Market conditions that could trigger an auction:
* A market has opened for trading, which means it needs a defined price to start trading from 
* Not enough liquidity on a market
* Price swing on a market is perceived, based on risk models, to be extreme and unrealistic 

#### Auction call period
During the auction call period, no trades are created, but all orders are queued. 

At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

#### Auction types
The Vega protocol supports several types of auctions:

* **Opening auctions**: Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery
* **Price monitoring auctions**: A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction, the length of which is defined by price monitoring settings (chosen during the market proposal)
* **Liquidity monitoring auctions**: A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if the best bid and/or best ask price implied by limit orders from market participants are not available
* **Frequent batch auctions**: A trading mode set for a market in its inception, that has trading occur only through repeated auctions, as opposed to continuous trading (Not yet available)

### Price monitoring
The dynamics of market price movements mean that prices don't always represent the participants' true average view of the price, but are instead artefacts of the market microstructure. 

Sometimes low liquidity and/or a large quantity of order volume can cause the price to diverge from the true market price. The Vega protocol is designed to assume that relatively small moves are 'real' and that larger moves might not be. 

Price monitoring exists to determine the real price, in the case that price moves are extreme and unrealistic. If the move is deemed to be large, the market's trading mode is temporarily changed into auction mode to get more information from market participants before any trades are generated.

Distinguishing between small and large moves can be highly subjective and market-dependent. The protocol relies on risk models to formalise this process.

A market's risk model can be used to obtain the price projection at a future point in time, given the current price. A price monitoring auction trigger can be constructed using a projected fixed time horizon and probability level.

Note: A market's risk model is defined within the market proposal.

#### Price monitoring triggers
Each market has a set of price monitoring triggers. When those points are breached, the market will enter a price monitoring auction. Price monitoring triggers are defined in a market's proposal, and a governance proposal to change them can be raised and voted on by tokenholders.

Each trigger contains:
* *Horizon*: Time horizon of the price projection in seconds
* *Probability*: The probability level for price projection. For example, a value of 0.95 will result in a price range such that over the specified horizon, the prices observed in the market should be in that range 95% of the time
* *Auction extension*: Auction extension duration in seconds. Should the price breach its theoretical level over the specified horizon at the specified probability level, the market will continue in auction for the time specified

If the market did not have any triggers specified in its market proposal, then the default triggers will be used (defined by the network parameter `market.monitor.price.defaultParameters`). If the triggers are set to an empty array, either explicitly or if they are omitted and that's what the network parameter is set to, then price monitoring is effectively switched off, and the market will never go into price monitoring auction.

In case of multiple monitoring triggers, each trigger is checked separately and the resulting price monitoring auction length will be the sum of auction durations from all the triggers that were breached.

There could be a situation where only a single trigger is breached to begin with, but as the initial price monitoring auction period comes to an end, the indicative uncrossing price breaches one or more of the other triggers, resulting in an auction extension. This process continues until no more triggers are breached after the appropriate auction extension period elapses. This can be because price doesn't breach any other triggers, or all triggers have already been breached. Once a given trigger is activated, it's not checked again until the price monitoring auction is resolved and market goes back into its default trading mode.

Price monitoring is meant to stop large market movements that are not 'real' from occurring, rather than just detect them after the fact. To achieve that, the module works preemptively: a transaction that would've caused the price monitoring bounds to be breached doesn't get processed in the default trading mode. The market first switches to price monitoring auction mode, and then that transaction (and any subsequent ones until the auction time elapses) get processed. 

The market can still make a large move within the auction, as long as crossing orders from both buy and sell side get submitted. 

The purpose of price monitoring is to extract more information out of the market in the event of a large move, not to stop the market from making that move altogether.

#### Price monitoring example
* Assume the market is configured to have two price monitoring triggers, where horizon, probability and auction extension for the two triggers are:
  * trigger 1: `1h, 0.95, 1min`,
  * trigger 2: `2h, 0.99, 5min`.
* Assume that the current mark price and price history imply the following valid price ranges for the two triggers:
  * trigger 1: `[95,105]`,
  * trigger 2: `[90,110]`.
* Any trades with prices greater than or equal to `95` and less than or equal to `105` will be generated as per the default trading mode of the market.

Now:
  * If an incoming order would get matched so that the price of any of the resulting trades is less than `90` or more than `110`, then that order won't be processed in the default trading mode, the market will go into a price monitoring auction, the order will get processed in the auction mode (if order type is valid for an auction), and after 6 minutes the relevant (if any) trades will be generated as per the order book state at that time. The market will return to its default trading mode and price monitoring bounds will be reset, with price ranges depending on the last mark price available.
  * If an incoming order would get matched so that the price in any of the resulting trades is in the `[90,95]` or `[105,110]` range, the market goes into a price monitoring auction with the initial duration of 1 minute.
    * If after 1 minute has passed there are no trades resulting from the auction or the indicative price of the auction, then if in the `[95,105]` the trades are generated and the price monitoring auction concludes.
    * If after 1 minute has passed the indicative price of the auction is outside the `[95,105]`, the auction gets extended by 5 minutes, as concluding the auction at the 1 minute mark would breach the valid ranges implied by the second trigger. After the 5 minutes, trades (if any) are generated irrespective of their price, as there are no more active triggers, and the price monitoring auction concludes.

### Liquidity monitoring
Besides the obvious appeal to traders, a liquid market also offers some risk management, particularly in a system that does not have a central counter-party. When a trader is distressed, their position can only be liquidated if there is enough volume on the order book to offload it.

In order to ensure there is enough liquidity to keep a market active and protect against insolvent parties, the network must be able to detect when the market's liquidity is too low. 

When a market's liquidity drops below the safe level, the market enters into a liquidity monitoring auction, and terminates the auction when the market liquidity level is back at a sufficiently high level. The liquidity mechanics of the Vega protocol mean there is an incentive (through fee-setting) to provide the necessary liquidity. 

There are two scenarios that can trigger liquidity monitoring mechanisms: 

**If a market has too little liquidity**: Vega continuously calculates whether each market has a sufficient amount committed. When markets are deemed insufficiently liquid, they are placed into auction.

**If a liquidity provider can't cover their commitment**: If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will search for funds in the general account for the relevant asset. If the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the liquidity provider's bond account, and a penalty will be applied and funds transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in liquidity commitment.

Should the funds in the bond account drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will be removed from the market. If there's an imbalance between total and target stake (see below) as a result, the market will go into liquidity auction.

The liquidity obligation is calculated from the liquidity commitment amount using the stake_to_ccy_siskas network parameter as:

`liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

Note here `ccy` stands for 'currency'. Liquidity measure units are 'currency siskas', e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers, per each order book side, measured separately, is at least `liquidity_obligation_in_ccy_siskas`.

#### Target stake
The market's liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol to calculate the market's liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there's an imbalance between it and the total stake (sum of all liquidity commitments).

### Insurance pools
Each market has its own insurance pool, and each asset has its own general insurance pool. 

When a market expires, the funds from that market's insurance pool go into the bigger asset insurance pool, which other markets that use the same currency can pull from. 

Insurance pools grow in two scenarios:
* If a trader is closed out because they do not have enough collateral to support an open positions
* If a liquidity provider pays a penalty for failing to provide their committed liquidity

Read more:
* [Closeouts](#closeouts)
* [Liquidity provision penalties](#penalties)
* [Loss socialisation](#loss-socialisation)

## Market data [WIP]

### Decimal places
The number of decimal places for various figures can be configured, including the increments an order size can be priced in and the number of decimal places an asset has.

#### Market decimal places
It is possible to configure a market for which orders can only be priced in increments of a specific size. This is done by specifying, within a market proposal, a different (smaller) number of decimal places than the market's settlement asset supports. Consider a market that settles in GBP. This market can be configured to have 0 decimal places so that the price levels on the order book will be separated by at least £1, rather than the default £0.01 that the asset would support.

#### Asset decimal places [WIP]


## Liquidity
The Vega protocol allows liquidity to be priced individually for each market, a design decision that allows for liquidity providers to earn more on markets with little LP competition, and drives down fees on markets where there are many participants committing liquidity. 

Liquidity fees are defined based on the commitments and proposed fee levels chosen by the providers, not by the protocol. 

When a market is proposed, the proposer, who must also be able to provide liquidity, proposes the liquidity fee for that market. Other participants who want to commit liquidity can do so by submitting liquidity provision orders to an open market. 

Participants who want to commit liquidity to a market can enter their commitments as soon as a market proposal is submitted and accepted, or at any time during the market's  lifecycle. 

### Parameters [WIP]

### Liquidity providers
Participants with sufficient collateral can provide liquidity for markets. Every market on Vega must have at least one committed liquidity provider. When a governance proposal to create a market is submitted, the proposal has to include liquidity provision commitment.

A liquidity provision commitment is made up of a series of orders that sit on the order book to be filled. Liquidity providers need to be able to support their liquidity commitment - their available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment. 

#### Bond account
The amount committed during the liquidity provision transaction is stored in a bond account (one per party, per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. 

The funds are deposited as part of a successful liquidity provision transaction. They will remain in the bond account for as long as the liquidity provider is active, to act as a guarantee for the liquidity obligation taken on by the provider, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

### Liquidity rewards
Liquidity providers receive rewards for providing liquidity, and penalties for not upholding their commitment. 

Rewards are calculated automatically from the market's fees, which are paid by price takers, and distributed to the market's liquidity providers according to their relative commitments.

Note: During an auction uncrossing, liquidity providers are not required to supply any orders that offer liquidity or would cause trades. However, they must maintain their liquidity commitment, and their liquidity orders are placed back on the order book when normal trading resumes.

### Penalties for not fulfilling liquidity commitment
If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will search for funds in the general account for the relevant asset. If the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the liquidity provider's bond account, and a penalty will be applied and funds transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in liquidity commitment.

Should the funds in the bond account drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will be removed from the market. If there's an imbalance between total and target stake as a result, the market will go into liquidity auction.

If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied. 

The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* `market.liquidity.bondPenaltyParameter` is a network parameter
* shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement (mark to market or product driven), or are needed to meet their margin requirements

### Liquidity commitment transaction
Participants can commit liquidity by submitting a liquidity submission transaction to the network. 

The buy and sell orders that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by the manually maintained orders falls short of it. (??)

A liquidity commitment transaction must include:
* Market identifier for a market that is in a state that accepts liquidity commitments
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders

### Liquidity commitment order type
In essence, liquidity commitment orders are sets of pegged orders grouped by order book size, with a proportion set for each order within the order 'shape'. The overall volume depends on the remaining liquidity obligation, the mid-price, and the risk model parameters, but the sizes of orders relative to each other can still be controlled.

Those orders use a special batch order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

A liquidity commitment order type has a specific set of features that set it apart from a standard order: 
* *Submitted as a batch order*: A liquidity commitment order allows simultaneously specifying multiple orders in one message/transaction
* *Sits on the order book*: The orders are always priced limit orders that sit on the order book, and do not trade on entry
* *Returns to the order book after being filled*: The order is always refreshed after it trades, based on the above requirements so that the full commitment is always supplied

### Liquidity fee
As part of the liquidity commitment transaction, a liquidity provider submits their desired liquidity fee factor. The fee factors submitted by all those who submitted liquidity provision orders are used to calculate the actual fee each participant will pay on a trade in that market, and thus how much each liquidity provider receives.

This fee can change as the market's target stake changes, and / or as liquidity providers change their commitment or stop providing liquidity altogether. 

How much a provider receives in fees is also dependent on when they began to commit liquidity on the market, as liquidity providers who commit to a market early benefit from helping to grow the market (also known as the 'equity-like share')

Read more: 
* [Target stake](#target-stake)
* [Equity-like share for a liquidity provider](#equity-like-share-for-a-liquidity-provider)

The liquidity orders that LPs submit are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom. 

The fee level chosen for the market is derived from the liquidity commitment of the market (target stake) and the amount of stake committed from each bidder. Vega processes the LP orders from top to bottom by adding up the commitment stake as it goes, until it reaches a level equal to, or greater than, the target stake. When that point is reached, the fee factor that was provided with the last processed liquidity order is used.

Initially, before a market opens for trading, the target stake is zero, as it's not possible to have a position on a market that's not opened yet. Hence by default the market's initial liquidity-fee-factor is the lowest proposed.

Once the market opens and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated.

#### Liquidity fee example
In the example below, there are 3 liquidity providers all bidding for their chosen fee level, with the lowest fee bid at the top, and the highest at the bottom. 

* [LP 1 stake = 120 ETH, LP 1 liquidity-fee-factor = 0.5%]
* [LP 2 stake = 20 ETH, LP 2 liquidity-fee-factor = 0.75%]
* [LP 3 stake = 60 ETH, LP 3 liquidity-fee-factor = 3.75%]

* If the target stake = 119 then the needed liquidity is given by LP 1, thus market's liquidity-fee-factor is the LP 1 fee: 0.5%.
* If the target stake = 123 then the needed liquidity is given by the combination of LP 1 and LP 2, and so the market's liquidity-fee-factor is LP 2 fee: 0.75%.
* If the target stake = 240 then all the liquidity supplied above does not meet the estimated market liquidity demand, and thus the market's liquidity-fee-factor is set to the highest, LP 3's fee: 3.75%.

### Calculating market value proxy ???? [WIP]

It's calculated, with `t` denoting time now measured so that at t=0 the opening auction ended, as follows:

total_stake = sum of all LP stakes
active_time_window = [max(t-t_market_value_window_length,0), t]
active_window_length = t - max(t-t_market_value_window_length,0)

if (active_window_length > 0)
    factor =  t_market_value_window_length / active_window_length
    traded_value_over_window = total trade value for fee purposes of all trades executed on a given market during the active_time_window
    market_value_proxy = max(total_stake, factor x traded_value_over_window)
else
    market_value_proxy = total_stake

Note that trade value for fee purposes is provided by each instrument, see fees. For futures it's the notional and in the examples below are only relevant for futures.
Example

Let's say total_stake = 100. The network parameter t_market_value_window_length = 60s (though in practice a more sensible value is e.g. one week).

    Current time t = 0s i.e. the opening auction just resulted in a trade. Then active_window_length = 0 - max(0-60,0) = 0 - 0 =0 and so market_value_proxy = 100.
    Current time t = 10s i.e. the opening auction resulted in a trade and ended 10s ago. Then active_time_window = [0,t] = [0,10s] and active_window_length = 10 - max(10-60,0) = 10 - 0 = 10. Let's say the trade value for fee purposes over the time [0,t] was traded_value_over_window = 10 tUSD. We calculate factor = 60 / 10 = 6. Then market_value_proxy = max(100, 6 x 10) = 100.
    Current time t = 30s i.e. the opening auction resulted in a trade and ended 30s ago. Then active_time_window = [0,t] = [0,30s] and active_window_length = 30 - max(30-60,0) = 30 - 0 = 30. Let's say the trade value for fee purposes over the time [0,30s] was traded_value_over_window = 100 tUSD. We calculate factor = 60 / 30 = 2. Then market_value_proxy = max(100, 2 x 100) = 200.
    Current time t = 90s i.e. the opening auction resulted in a trade and ended 90s ago. Then active_time_window = [30s,90s] and active_window_length = 90 - max(90-60,0) = 90 - 30 = 60. Let's say the trade value for fee purposes over the time [30s,90s] was traded_value_over_window = 300 tUSD. We calculate factor = 60 / 60 = 1. Then market_value_proxy = max(100, 1 x 300) = 300.

Example

    The market was just proposed and one LP committed stake. No trading happened so the market_value_proxy is the stake of the committed LP.
    A LP has committed stake of 10000 ETH. The traded notional over active_time_window is 9000 ETH. So the market_value_proxy is 10000 ETH.
    A LP has committed stake of 10000 ETH. The traded notional over active_time_window is 250 000 ETH. Thus the market_value_proxy is 250 000 ETH.

### Equity-like share for a liquidity provider [WIP]

The concept of the equity-like share of a market's trading for a liquidity provider broadly ensures that liquidity providers who get into a market early benefit from helping to grow the market. Those liquidity providers who commit early in a market's existence will receive a larger proportion of the fees than their actual commitment would imply, because they were a larger proportion of the commitment earlier on, once other parties are also committing liquidity to the market.

The guiding principle of this is that by committing stake a liquidity provider buys a portion of the market_value_proxy of the market.

At any time let's say we have market_value_proxy calculated above and existing liquidity providers as below

[LP 1 stake, LP 1 avg_entry_valuation]
[LP 2 stake, LP 2 avg_entry_valuation]
...
[LP N stake, LP N avg_entry_valuation]

These have to all be greater or equal to zero at all times. At market creation all these are set zero except at least one LP that commits stake at market creation. So the initial configuration is the LP i stake = their commitment before market proposal gets enacted and LP i avg_entry_valuation = sum of total commited before market proposal is enacted. We then update these as per the description below.

From these stored quantities we can calculate, at time step n the following:

    (LP i equity)(n) = (LP i stake)(n) x market_value_proxy(n) / (LP i avg_entry_valuation)(n)
    (LP i equity_share)(n) = (LP i equity)(n) / (sum over j from 1 to N of (LP j equity)(n)) Here market_value_proxy(n) is calculated as per Section "Calculating market value proxy".

If at time step n liquidity provider i submits an order of type Liquidity Provision that requests its stake to be changed to new_stake then update the above values as follows:

if new_stake < min_LP_stake_quantum_multiple x quantum then
    reject transaction and stop. 
fi

total_stake(n+1) = sum of all but i's stake(n) + new_stake 
if new_stake < (LP i stake) then
    check that total_stake(n+1) is sufficient for `market target stake`; if not abort updating stakes and equity like shares (all values stay the same).
fi

if (LP i stake)(n) == 0 then 
    (LP i stake)(n+1) = new_stake
    (LP i avg_entry_valuation)(n+1) = market_value_proxy(n)
elif new_stake < (LP i stake)(n) then
    (LP i stake)(n+1) = new_stake
elif new_stake > (LP i stake)(n) then
    delta = new_stake - (LP i stake)(n) // this will be > 0
    (LP i stake)(n+1) = new_stake
    (LP i avg_entry_valuation)(n+1) = [(LP i equity)(n) x (LP i avg_entry_valuation)(n) 
                            + delta x market_value_proxy(n)] / [(LP i equity)(n) + (LP i stake)(n)]
fi

Example: In this example we assume that that market_value_proxy derives purely from committed stake (no is trading happening). There is only one LP, with index i = 1. At n=0 we have the following state:

LP 1 stake = 100, LP 1 avg_entry_valuation = 100

LP 1 submits a transaction with new_stake = 200. (see Liquidity Provision order type spec). We have (LP 1 equity)(0) = (LP 1 stake)(0) x market_value_proxy(n) / (LP 1 avg_entry_valuation)(n) = 100 x 100 / 100 = 100 and clearly (LP 1 equity_share)(0) = 1. Moreover market_value_proxy(0) = 100. We will be in the case new_stake = 200 > (LP 1 stake)(0) = 100. So then delta = 100 and then (LP i avg_entry_valuation)(1) = (100 x 100 + 100 x 100) / (100 + 100) = 20000 / 200 = 100. So at n=1 we have the following state:

LP 1 stake = 200, LP 1 avg_entry_valuation = 100

Say now LP 2 wishes to enter and submits a "liquidity-provision-order-type" with new_stake=200. We have n=1 and implicitly (LP 2 stake)(1) == 0 is True and so we set (LP 2 stake)(2) = 200 and (LP 2 avg_entry_valuation)(2) = market_value_proxy(1) = 200. After the update, at n = 2 we record the state as

LP 1 stake = 200, LP 1 avg_entry_valuation = 100
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Another "liquidity-provision-order-type" type comes in saying that LP 1 wants new_stake = 300. We have market_value_proxy(2) = 400 and (LP 1 equity)(2) = (LP 1 stake)(2) x market_value_proxy(2) / (LP 1 avg_entry_valuation)(2) = 200 x 400 / 100 = 800. We will be in the case new_stake = 300 > (LP 1 stake)(2) = 200. So then delta = 100 and then (LP i avg_entry_valuation)(1) = (800 x 100 + 100 x 400) / (800 + 200) = 120000 / 1000 = 120. After the update, at n = 3 we record the state as

LP 1 stake = 300, LP 1 avg_entry_valuation = 120
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Another "liquidity-provision-order-type" type comes in saying that LP 1 wants new_stake = 1. We check that market target stake <= 201 (assume true for purposes of example) and so we proceed so that after the update, at n=4 we record the state as

LP 1 stake =   1, LP 1 avg_entry_valuation = 120
LP 2 stake = 200, LP 2 avg_entry_valuation = 200

Check the sum from over i from 1 to N of LP i equity_share is equal to 1. Warning the above will be either floating point calculations and / or there will be rounding errors arising from rounding (both stake and entry valuation can be kept with decimals) so the above checks will only be true up to a certain tolerance.
Distributing fees

The liquidity fee is collected into either a per-market "bucket" belonging to liquidity providers for that market or into an account for each liquidity provider, according to their share of that fee. This account is not accessible by liquidity providers until the fee is distributed to them according to the below mechanism.

We will create a new network parameter (which can be 0 in which case fees are transferred at the end of next block) called liquidity_providers_fee_distribition_time_step which will define how frequently fees are distributed to a liquidity provider's general account for the market.

The liquidity fees are distributed pro-rata depending on the LP i equity_share at a given time.
Example

The fee bucket contains 103.5 ETH. We have 3 LPs with equity shares: share as below

LP 1 eq share = 0.65


LP 2 eq share = 0.25
LP 3 eq share = 0.1

When the time defined by ``liquidity_providers_fee_distribution_time_step` elapses we do transfers:

0.65 x 103.5 = 67.275 ETH to LP 1's margin account
0.25 x 103.5 = 25.875 ETH to LP 2's margin account
0.10 x 103.5 = 10.350 ETH to LP 3's margin account

### Submit liquidity commitment
A liquidity provider must submit a valid set of liquidity provider orders. That set must include a *buy shape* and a *sell shape*. 

The network will translate these shapes into order book volume by creating an order set. 

Each entry must specify:
* Public key: The public key being used to place the liquidity commitment
* The market’s unique ID, denoted as `marketId` - The market must be in a state to accept liquidity commitment, and is not a rejected market, has not had trading terminated, or has not been settled 
* Liquidity commitment amount: The amount of funds to allocate to providing liquidity. The amount will be moved into a bond account during the duration of the liquidity commitment, denoted as `commitmentAmount`
* Proposed liquidity fee level: The scaling factor for the fee the submitter is bidding to receive when the order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Note: The proposed fee level is used along with other proposed fee levels to define the fees on the market. Denoted as `fee`
* A set of liquidity buy and sell order shapes (denoted as `buys` and `sells`), which include:
    * Offset: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more postion risk
    * Proportion: The proportion of your committed collateral allocated to this order, as a weight
    * Reference price: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
  * Propagate: Is true or false. Propogate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected

See a full list of applicable reference price levels in the [API documentation](https://docs.vega.xyz/protodocs/vega/vega.proto#peggedreference)), denoted as `reference`.

#### Example:
*Buy shape*: {
  buy-entry-1: [liquidity-proportion-1, [price-peg-reference-1, number-of-units-from-reference-1]],
  buy-entry-2: [liquidity-proportion-2, [price-peg-reference-2, number-of-units-from-reference-2]],
}
*Sell-shape*: {
  sell-entry-1: [sell-liquidity-proportion-1, [sell-price-peg-reference-1, sell-number-of-units-from-reference-1]],
  sell-entry-2: [sell-liquidity-proportion-2, [sell-price-peg-reference-2, sell-number-of-units-from-reference-2]],
}
*Buy shape* with values: {
  buy-entry-1: [2, [best-bid, 10]],
  buy-entry-2: [13, [best-bid, 11]],
}
*Sell-shape* with values: {
  sell-entry-1: [5, [best-ask, 8]],
  sell-entry-2: [5, [best-ask, 9]],
}

### Amend liquidity commitment
Liquidity commitment orders can be amended by providing a new set of liquidity provision orders in the liquidity provider transaction. 

When amending a liquidity commitment, the network will always allow the submitter to provide more liquidity. However, reducing the liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If the submitter were to reduce their commitment to the point where the market would drop below its required stake threshold, then the amendment would not be accepted.

Submitting an amendment replaces the entire set of orders with the ones in the amendment transaction. To keep any of the existing order shapes, they'll need to added into the amendment.

### Cancel liquidity commitment
Cancelling a liquidity commitment, in effect, requests that the liquidity provision orders are amended to zero. Once the orders are cancelled, the bond amount is returned back into the submitter's general account.

If cancelling a commitment would leave a market without enough liquidity, then the cancellation will not be accepted. 

If there are any open positions that were created from the liquidity orders, they will not be cancelled when a liquidity commitment is cancelled. 

## Fees and rewards [WIP]

### Fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles for a decentralised trading infrastructure.

Fees are incurred on every trade on a market in continuous trading, but it is the price taker who pays the fee. During a market's opening auction, no fees are collected.

The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) obtains part of the fee as a reward for providing liquidity.

An order may cross with more than one other order, creating multiple trades, which incur fees for each. Because of how the trade value for fee purposes is calculated (see below), the amount you'll pay for each order is the same, regardless of how many trades it takes to fill the order.

Fees are calculated and collected in the settlement currency of the market, and collected from your collateral. The fee is divided between the maker, the infrastructure provider, and the liquidity provider(s) for each market.

* Infrastructure portion of the fee, which is paid to validators as a reward for running the infrastructure of the network, is transferred to the infrastructure fee pool for that asset. It is then periodically distributed to the validators.
* Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker).
* Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market.

The trading fee is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x Trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade (This is true for futures, but may be calculated differently for other products.)

### Fees example
If you were to place an order for 100 futures at USDC50, the trade value for fee purposes is 100 x USDC50 = USDC5000.

In this example, each fee is 0.001, meaning total fee factor is 0.003.

USDC5000 x 0.003 = USDC15

The fee is the same irrespective of the number of transactions the order gets filled in, as long as they trade at the same price.

The fee factors are set through the following network parameters: `market.fee.factors.infrastructureFee`, `market.fee.factors.makerFee`, `market.fee.factors.liquidityFee`.

## Collateral [WIP]

### Assets on Vega [WIP]

### Accounts (general, margin, bond) and transfers, double entry accounting [WIP]

### Bridges used for assets [WIP]

#### Ethereum [WIP]

## Market / product / trade lifecycle [WIP]

### Settlement
To start, only cash-settled futures markets can be created. This means that settlement occurs in the settlement asset of the market, which is defined in the market framework. 

The settlement asset does not need to be the same asset as the ‘quote unit’ (i.e. BTC/ETH on a BTC/ETH December 2028 market). The settlement asset is defined by within the governance proposal that led to the market's creation. 

The network executes settlement with a two step process:

1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay. The instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool. If the full required amount cannot be collected from all three accounts, then as much as possible is collected and loss socialisation is enacted.
 
Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.

Read more: 
* [Insurance pools](#insurance-pools)
* [Loss socialisation](#loss-socialisation)
 
#### Settlement at market expiry
When a market reaches its maturity date and time, a final settlement is carried out. That settlement is based on a pre-defined oracle publishing data that triggers the market’s expiry.

The oracle trigger will cause the market to enter into a 'trading terminated' state. Markets in this state no longer accept trading, but retain the positions and margin balances that were in place after processing the market’s maturity trigger. In the case of futures markets, termination occurs just prior to, or at, settlement.

Once a market settles:
* All open positions in that market are closed based on the final oracle price
* Open orders are cancelled
* Collateral held in the market is released back to the participants
* Corresponding cash flows happen as defined by the product type

For example: A cash-settled futures market reaches its expiry date and time. If the last mark price before settlement is 100, but the oracle price feed emits data that the price is 115, then a trader with a position of 1 long is paid 15. Another trader that has a position of 1 short, pays 15.

After all positions are closed at market expiry, they are ‘forgotten’ by the network.

Read more: [Data sources](#data-sources)

#### Mark to market settlement
Settlement instructions are generated based on the change in market value of the open positions of a party.

When the mark price changes, the network calculates settlement cash flows for each party.

Each time the mark price for a given market changes, all the open positions and orders are marked to market, resulting in interim partial payments that are calculated by the network. Those payments go directly the relevant trader's collateral. 

Read more: [Mark to market](#mark-to-market)

#### Settlement parameters defined through governance
Data sources for settlement must be specified when a market is proposed. For cash-settled futures, this is the final price/value at the expiry of the instrument, and the expiry date/time.

At the point when a market nears its specified expiry, trading terminates, and the data sources provide the final ‘settlement value’.

The network settles all open positions on the market using the price provided by the data source. Positions are regularly mark to market settled, so the final settlement is, in effect, a final mark to market settlement using the data source price.

Read more: [Mark to market settlement](#mark-to-market-settlement)

## Data sources
Data sources, or oracles, are essential to markets created on Vega.

Market settlement, risk models, and other features require a supplied price, or other data, which must come from somewhere, usually completely external to Vega. Specifically for settlement values, Vega requires external data.

Vega APIs and protocol capabilities support a wide range of data sourcing styles and standards, and Vega will not integrate directly with specific oracles / data providers at the protocol level. This framework is flexible to make it easy to create and combine oracles, and therefore to design markets on almost anything.

The current implementation requires that a market proposal defines two data sources, and the price based on those sources is final.

### Data sourcing framework
Vega supports three data source types, though not all three can be used to settle markets. Internal data sources cannot be nominated for settling a market, but are used to emit an event or value at/after a given Vega time to trigger 'trading terminated', for example.

Data sources must be able to emit four types of data:
* Number
* String
* Date/Time
* Structured data records, such  as a set of key-value pairs

### Data source requirements
Multiple instruments can rely on the same data source, and can settle based on the same `SubmitData` message.

Data sources must provide:

* Type of data source (signed message, internal Vega market data, date/time, Ethereum, etc.)
* Data type (e.g. float for a price) - this must be compatible with the usage of the data source (if it is a settlement price, a numeric value would be required; for a trading termination trigger which consumes no data then any data type, etc.). Note that it is possible to have more than one “compatible” type, for instance it might be that a number could be a string or a raw numeric value in a JSON data source.
* Data source specific details (for signed message, public key of sender; for Ethereum, contract address, method name; etc.)

Data sources must be able to emit the following data types:

* Number (for prices or in filter comparisons)
* String (to be used to compare against in filters)
* Date/Time (to compare against in filters)
* Structured data records, such as a set of key value pairs (inputs to filters)

Data sources nominated for use by Vega may refer to other data sources. For instance, one that takes a source of structured data records as input and emits only the value of a named field (e.g. to return BTCUSD_PRICE from a record containing many prices) or one that takes another data source as input and emits only data that matches a set of defined filters (e.g. to return only records with specific values in the timestamp and ticket symbol fields).

### Signed message data sources
Signed message data sources are the first external data source to be supported on Vega, and can be nominated for settling a market. They introduce a Vega transaction that represents a data result. The result is validated by ensuring the signed message is signed by one of a set of public keys provided in a market’s proposal.

:::info
There are no rewards associated with being a signed message data source, nor are there fees associated with being or using a signed message data source.
:::

A signed message data source must include:

* Public keys that can sign and submit values for this oracle, as well as the key algorithm to be used, if required
* Type of data to be supplied in the transaction. Supported types are a simple native Vega transaction (i.e. protobuf message) containing one or more key/value pairs of data fields with values that are expressed in the data types listed above
* ABI encoded data

### Filtered data source
As a public key may provide many messages, it's likely a filter is needed to extract the required message. A field select would then be used to extract the required field (‘price’ or ‘temperature’, etc.).

A filtered data source includes another data source definition within its own definition, and outputs a modified stream of data. It contains one or more conditions that are applied to data to determine whether that data is emitted.

Multiple products can filter the same data source differently and settle based on different SubmitData messages. Multiple products can filter the same data source differently and settle based on different fields from the same SubmitData message.

A filtered data source must specify:

* Data: Another data source that defines the input data
* Filters: A list of at least one filter to apply to the data

A filter specifies a condition to apply to the data. If all filters match, the data is emitted. The filter types are defined in the Operator field of a market proposal.

Filter condition types:

* Equals: Data must exactly match the filter, i.e. Equals key = ticker, value = TSLA
* Greater / greater or equal to: Data can be greater than or equal to the filter, i.e. GreaterOrEqual key = timestamp, value = 2021-12-31T23:59:59
* Less / less or equal to: Data can be less than or equal to the filter, i.e. LessOrEqual key = timestamp, value = 2021-12-31T23:59:59

### Internal data source
An internal data source provides information that comes from within Vega, rather than an external source. They are defined and used in the same way as external data sources, but are triggered by the relevant event in protocol rather than by an incoming transaction.

There are currently two types of data that can come from internal data sources: value and time-triggered.

#### Internal data source: Value [WIP]
This data source provides an immediate value, and is used where a data source is required, but the value is already known at the time of definition.

Any code expecting to be triggered when a value is received on a data source would be triggered immediately by a data source of this type, for instance as soon as a market parameter change is enacted, if it contained a value type data source for final settlement, final settlement would occur.

'Value' can be used to submit a governance change proposal to update a futures market's settlement data source to a price value. This would happen if the defined data source fails and tokenholders choose to vote to accept a specific value to be used for settlement.

Example:
`value { type: number, value: 1400.5 }`

#### Internal data source: Time triggered [WIP]
This data source would be used to emit an event or value, at or after the given time printed on the block. For example, this could be used to trigger 'trading terminated' for futures.

A time triggered data source will emit the contents of the specified data source (could be omitted if just triggering trading termination, or could be a value as described above, or another data source in order to implement a delay/ensure the value from the data source is not emitted before a certain time).

Every time the network 'ticks' (at a set time), it sends oracle data with a constant property name vegaprotocol.builtin.timestamp 
If you're using this property in your oracle binding, and in your trading termination declaration, it's no longer mandatory to use a type_boolean, and you can use the timestamp property instead. To settle at a given time without providing true/false terminated property. 

<!-- notes: 
(highlight shortcomings of trading termination as a way to extract data from a payload. no way to add computation on top of it. maybe it's worth adding some internal oracle data into the market proposal)

ideally: only have property emission time, filter on it, get the oracle data, and then say if data is greater than/equal, to timestamp, set termination to true. or make extra computations, such as settlment price that's average of a price range -->