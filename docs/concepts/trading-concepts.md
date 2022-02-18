# Trading protocol (?)

## Orders
### Submitting an order
Orders can be submitted into any market that is active - i.e. not in a protective auction, or matured, expired, or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. 

If, during continuous trading, an order is going to be matched with another order on the book for the same party (wash trade), then execution of that order will be stopped and the order will be cancelled and removed (if on the book). 

### Order sizes
Order sizes can be fractional, as long as the order is within the maximum number of decimal places allowable. Any order containing more precision that this will be rejected.  If a market requires that orders are specified using integers, fractional order sizes does not apply and 1 is the smallest increment. A market's decimal places are specified in the market framework (link).

### Amending an order
Amendments that change price or increase size will be executed as an atomic cancel and replace, meaning the time priority will be lost (i.e. as if the original order was cancelled and removed from the book and a new order submitted with the modified values). 

   #### Cancelling an order
   #### Order types/Times in force
   ### Batch operations on orders
 

## Position management and margin
Vega's margining system implements automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets. More detailed explanation on the rationale is available in [Section 6 of the protocol whitepaper](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21).

### Margin 
The margin for a new order, and the amount deducted from collateral to cover margin, is based on all the open orders. A trader will need enough margin to keep a position open, whether it goes for or against the trader. The margin calculations ensure a trader does not enter a trade that will immediately need to be closed out.

### Basic margin calculations
Vega calculates four margin levels:
* **Initial level**: The amount that will be transferred from your collateral to be used as margin when an order is placed or trade executed. To avoid a margin search as soon as position is open, the initial margin level is set above the search level:
  * m<sup>initial</sup> := α<sup>initial</sup> * m<sup>maintenance</sup>, where α<sup>initial</sup> is a constant and α<sup>initial</sup> > α<sup>search</sup>.
* **Search level**: When the margin balance drops below the search level -- but is still above the maintenance level -- the network will try to allocate an additional amount (up to the current initial margin level) from a trader's collateral, if possible, to be used for margin:
  * m<sup>search</sup> := α<sup>search</sup> * m<sup>maintenance</sup>, where α<sup>search</sup> is a constant and α<sup>search</sup> > 1.
* **Release level**: Once a trader's margin balance exceeds the margin release level, the position is considered overcollateralised and funds are released back to collateral so that the margin balance is equal to the current initial margin level:
  * m<sup>release</sup> := α<sup>release</sup> * m<sup>maintenance</sup>, where α<sup>release</sup> is a constant and α<sup>release</sup> > α<sup>initial</sup>.
* **Maintenance margin**: This is implied by the risk model and corresponds to the minimum amount required to cover adverse market moves with a given probability level. As soon as the margin balance drops below the maintenance margin level, the position close-out process gets initiated.

#### Calculating the margin on open orders
The network calculates the largest long / short position. If the long position is the riskiest, the margin algorithm multiplies by a `risk factor long` and by the `mark price` (for futures). If the short position is the riskiest, then the algorithm multiplies the position by the `risk factor short` and by the `mark price`. These capture the outcome of probabilistic distribution of future market moves, and are market specific.

##### Example 
Image to be uploaded - <img alt="Calculating margin on open orders" src="/images/2-calculate-margin-open-orders.png" width="500" />

There is an open sell order of size 1 on the book. The risk factor for short positions is 0.074347011. The current mark price is 0.02690. So minimum margin = 0.2690 x 0.074347011 = 0.00200 (rounded to 5 decimal places).

##### Margin on open positions
The following calculation takes into account "slippage" as seen on an order book.

##### Example:

<img alt="Calculating margin on an open positions" src="/images/3-margin-open-positions.png" width="500" />

The trader has an open short position of size 1 and no open orders. The risk factor for short positions is 0.074347011. The current mark price is 0.02672. The best offer price is 0.02676 and it has enough volume so that theoretically the position could be closed-out at that price. So maintenance margin = 0.02672 x 0.074347011 + max (0, 0.02676 - 0.02672) = 0.00203 (rounded to 5 decimal places), where the second term in the sum is the "slippage" component. Other margin levels are derived from the maintenance margin using the scaling factors that form part of the market configuration.

### Initial margin calculation
The initial margin is the minimum amount of collateral required to enter a new trade.

A market parameter will specify α<sup>initial</sup> > α<sup>search</sup> and the minimum collateral amount required for a new trade to be entered into as the initial margin. m<sup>initial</sup>:= (1 + α<sup>initial</sup>) m<sup>maintenance</sup>

An initial margin level m<sup>initial</sup> that is higher than the margin search level (1 + α<sup>search</sup>) m<sup>maintenance</sup> ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral immediately after a trade has been entered into.

### Mark to market
- what is mark to market 
- for a market created on Vega, the mark-to-market price is calculated every time the price moves. This is in contrast to traditional futures markets, for which mark to market is calculated once per day. 

Mark to market aims to provide a realistic appraisal of of a position based on the current market conditions. 
Settlement instructions are generated based on the change in market value of the open positions of a party.

When the mark price changes, the network calculates settlement cash flows for each party.

The process is repeated each time the mark price changes until the maturity date for the market is reached.

### Margin search and release

### Close-outs
In most cases, the allocated margin should cover market swings. If the swing is bigger than the margin is collateralised for, then money is pulled from the collateral to cover the requirement. If a trader has no more collateral, and their allocated margin is below the maintenance margin, the trader gets closed out and any margin balance remaining after the close-out is transferred to the market's insurance pool. In the unlikely event that the insurance pool balance is insufficient to cover the entire balance, loss socialisation will get applied.

Note that (link->) price monitoring should assure that large swings occur only due to genuine changes in market participants' view of the true average price of the traded instrument, and not as a result of short-lived artefacts of market microstructure.

### Position resolution

## Pre-trade and trade

### Positions and netting

### Order types
There are three order types available to traders: limit orders, market orders, and pegged orders. One order type is automatically triggered to close out positions for distressed traders - that's called a network order.

### Limit order
A limit order is an instruction that allows you to specify the minimum price at which you will sell, or the maximum at which you will buy. 

Times in force available for limit orders:
* **GTC**: A Good til Cancelled order trades at a specific price until it is filled or cancelled. 
* **GTT**: A Good til Time order is a GTC order with an additional predefined cancellation time. 
* **GFN**: A Good for Normal order is an order that will only trade in a continuous market. The order can act like either a GTC or GTT order depending on whether the expiry field is set.
* **GFA**: A Good for Auction order will only be accepted during an auction period, otherwise it will be rejected. The order can act like either a GTC or GTT order depending on whether an expiry is set.
* **IOC**: An Immediate or Cancel order executes all or part of a trade immediately and cancels any unfilled portion of the order. 
* **FOK**: A Fill or Kill order either trades completely until the remaining size is 0, or not at all, and does not remain on the book if it doesn't trade.

### Market order
A market order is an instruction to buy or sell at the best available price in the market. 

Market orders can use either IOC or FOK.

### Network order
A network order is triggered by the Vega network to close out a distressed trader, as part of position resolution. Network orders cannot be submitted by a party.

Network orders use FOK market orders.  

### Pegged order
Pegged orders are orders that are a defined distance from a reference price (i.e. best bid, mid and best offer/ask), rather than at a specific price, and generate limit orders based on the set parameters. Currently, pegged orders can only use GTC and GTT times in force, but IOC and FOK will be available in a future release.

A pegged order is not placed on the order book itself, but instead generates a limit order with the price generated based on the reference and offset value. As the price levels in the order book move around, the order's price on the order book also moves.

The reference can only be positive and we apply it differently depending on if we are a buy or sell.
3:25 PM
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
| Non persistent (IOC, FOK) |	Sell  | <= 0        | < 0	  | < 0         |

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


# Collateral

## Trading modes 

### Continuous trading
On a continuous trading market, the Vega network tries to execute an order as soon as it is received. 

A continuous trading market uses a limit order book as the default price determination method.

### Auctions
Auctions are a trading mode that collect orders during a set period, called an auction call period. The auction call period's ending is based on the condition that the auction aims to meet. Auctions that are based on market conditions are triggered automatically.

During the call period, no trades are created, but all orders are queued. At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

The Vega protocol supports several types of auctions:

* Opening auctions: Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery
* Price monitoring auctions: A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction, the length of which is defined by price monitoring settings (chosen during the market proposal)
* Liquidity monitoring auctions: A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if the best bid and/or best ask price implied by limit orders from market participants are not available
* Frequent batch auctions: A trading mode set for a market in its inception, that has trading occur only through repeated auctions, as opposed to continuous trading (Not yet available)

## Market protection

### Price monitoring
The dynamics of market price movements are such that prices don't always represent the participants' true average view of the price, but are instead artefacts of the market microstructure: sometimes low liquidity and/or a large quantity of order volume can cause the price to diverge from the true market price. It is impossible to tell at any point in time if this has happened or not.

As a result, we assume that relatively small moves are "real" and that larger moves might not be. Price monitoring exists to determine the real price in the latter case. If the move is deemed to be large, the market's trading mode is temporarily changed into auction mode to get more information from market participants before any trades are generated.
Distinguishing between small and large moves can be highly subjective and market-dependent. We rely on risk models to formalise this process. A market's risk model can be used to obtain the price projection at a future point in time given the current price. A price monitoring auction trigger can be constructed using a projection fixed time horizon and probability level.

Price monitoring behaviour is governed by a set of price monitoring triggers specified for the market. Each trigger contains:

* Horizon: time horizon of the price projection in seconds.
* Probability: probability level for price projection, e.g. value of 0.95 will result in a price range such that over the specified projection horizon, the prices observed in the market should be in that range 95% of the time.
* Auction extension: auction extension duration in seconds, should the price breach its theoretical level over the specified horizon at the specified probability level.

If the market has no triggers specified in the market proposal then the default triggers driven by a network parameter will be used. If triggers are set to an empty array (either explicitly or if they are omitted and that's what the network parameter is set to), then price monitoring is effectively switched off, and the market will never go into price monitoring auction irrespective of prices generated by trades.

In case of multiple triggers, each trigger is checked separately and the resulting price monitoring auction length will be the sum of auction durations from all the triggers that were breached. Furthermore, there could be a situation where only a single trigger is breached to begin with, but as the initial price monitoring auction period comes to an end, the indicative uncrossing price breaches one or more of the other triggers resulting in an auction extension. This process continues until no more triggers are breached after the appropriate auction extension period elapses (either because price doesn't breach any other triggers or all triggers have already been breached - once a given trigger is activated it's not checked again until the price monitoring auction is resolved and market goes back into its default trading mode).

Let's work through an example:

* Assume the market is configured to have two price monitoring triggers, where horizon, probability and auction extension for the two triggers are:
  * trigger 1: `1h, 0.95, 1min`,
  * trigger 2: `2h, 0.99, 5min`.
* Assume that the current mark price and price history imply the following valid price ranges for the two triggers:
  * trigger 1: `[95,105]`,
  * trigger 2: `[90,110]`.
* Any trades with prices greater than or equal to `95` and less than or equal to `105` will be generated as per the default trading mode of the market.
* Now:
  * If an incoming order would get matched so that the price of any of the resulting trades is less than `90` or more than `110`, then that order won't get processed in the default trading mode, the market will go into a price monitoring auction, the order will get processed in the auction mode (if order type is valid for an auction), and after 6 minutes the relevant (if any) trades will be generated as per the order book state at that time. The market will return to its default trading mode and price monitoring bounds will be reset, with price ranges depending on the last mark price available.
  * If an incoming order would get matched so that the price in any of the resulting trades is in the `[90,95]` or `[105,110]` range, the market goes into a price monitoring auction with the initial duration of 1 minute.
    * If after 1 minute has passed there are no trades resulting from the auction or the indicative price of the auction, then if in the `[95,105]` the trades are generated and the price monitoring auction concludes.
    * If after 1 minute has passed the indicative price of the auction is outside the `[95,105]`, the auction gets extended by 5 minutes, as concluding the auction at the 1 minute mark would breach the valid ranges implied by the second trigger. After the 5 minutes, trades (if any) get generated irrespective of their price (there are no more active triggers) and the price monitoring auction concludes.

As mentioned above, price monitoring is meant to stop large market movements that are not 'real' from occurring, rather than just detect them after the fact. To achieve that the module works preemptively: a transaction that would've caused the price monitoring bounds to be breached doesn't get processed in the default trading mode, the market first switches to price monitoring auction mode and then that transaction (and any subsequent ones until the auction time elapses) get processed. Clearly, the market can still make a large move within the auction as long as crossing orders from both buy and sell side get submitted. The purpose of price monitoring is only to extract more information out of the market in the event of a large move and not to stop the market from making that move altogether.

### Liquidity monitoring

### Insurance pools
Each market has its own insurance pool set aside. However, there's also a general insurance pool per asset. It sits there until there are markets that use that asset. When a market expires, the insurance pool funds from that market go into the bigger insurance pool, which other markets that use the same collateral currency can pull from. Insurance pools grow in two scenarios: if a trader gets closed out, and if a liquidity provider pays a fine for failing to provide their committed liquidity. (link to liquidity provision)

If a trader's deployed margin on the market is insufficient to cover a mark to market (MTM) settlement liability, Vega will search the trader's available balance of the settlement asset. If this search is unable to cover the full liability, the trader will be considered distressed and undergo position resolution, and the market's insurance pool (for that settlement asset) will be utilised to make up the difference required to cover the MTM loss amount. Should the funds in the insurance pool be insufficient for that, (link ->)loss socialisation will be applied.


## Market data

## Liquidity mining (provision)

### Parameters

### Liquidity providers
Participants with sufficient collateral can provide liquidity for markets. Every market on Vega must have at least one committed liquidity provider. When a governance proposal to create a market is submitted, the proposal has to include liquidity provision commitment.

A liquidity provision commitment is made up of a series of orders that sit on the order book to be filled. Liquidity providers need to be able to support their liquidity commitment - their available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment. 

### Liquidity rewards
Liquidity providers receive rewards for providing liquidity, and penalties for not upholding their commitment. 

Rewards are calculated automatically from the market's fees, which are paid by price takers, and distributed to the market's liquidity providers according to their relative commitments.

### Liquidity commitment transaction

Participants can commit liquidity by submitting a liquidity submission transaction to the network.

A liquidity commitment transaction must include:
* Market identifier, provided the market is in a state that accepts liquidity commitments
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders

### Submit liquidity commitment orders
A liquidity provider must submit a valid set of liquidity provider orders. That set must include a buy shape and a sell shape. 

The network will translate these shapes into order book volume by creating an order set according to a set of rules. 

Each entry must specify:

  **Liquidity proportion**: The relative proportion of the commitment to be allocated at a price level. Note, the network will normalise the liquidity proportions of the refined order set. This must be a strictly positive number.
  **Price peg**: A price level must be specified by a reference point (e.g mid, best bid, best offer) and an amount of units away.

# Example:
Buy-shape: {
  buy-entry-1: [liquidity-proportion-1, [price-peg-reference-1, number-of-units-from-reference-1]],
  buy-entry-2: [liquidity-proportion-2, [price-peg-reference-2, number-of-units-from-reference-2]],
}

# Example with values
Buy-shape: {
  buy-entry-1: [2, [best-bid, -10]],
  buy-entry-2: [13, [best-bid, -11]],
}

### Amend liquidity commitment orders
Liquidity commitment orders can be amended by providing a new set of liquidity provision orders in the liquidity provider transaction. If the amended orders are invalid, the transaction is rejected, and the previous set of orders will be retained.

### Cancel liquidity commitment orders

#### Not enough liquidity 

**If a market has too little liquidity**: Vega continuously calculates whether each market has a sufficient amount committed. When markets are deemed insufficiently liquid, they are placed into a liquidity monitoring auction.

**If a liquidity provider can't cover their commitment**: If the liquidity provider's margin account doesn't have enough funds to support their orders: the protocol will search for funds in the general account for the appropriate asset. If even the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the bond account, and a penalty will be applied and transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account for the appropriate asset and attempt to top up bond account to the amount specified in liquidity commitment.

Should the funds in the bond account eventually drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will get removed from the market. If there's an imbalance between total and target stake (see below) as a result, the market will go into liquidity auction as a consequence.

The liquidity obligation is calculated from the liquidity commitment amount using the stake_to_ccy_siskas network parameter as:

`liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

Note here `ccy` stands for 'currency'. Liquidity measure units are 'currency siskas', e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers per each order book side measured separately is at least `liquidity_obligation_in_ccy_siskas`.

The amount committed during the liquidity provision transaction is stored in a bond account (one per party per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. The funds will be deposited as part of the successful liquidity commitment transaction. They will remain there for as long as the liquidity provider is active, to act as a guarantee for the liquidity obligation taken on by the provider, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

#### Target stake
The market's liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol for calculating the market's liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there's an imbalance between target stake and total stake (sum of all liquidity commitments).

### Liquidity provision orders
The buy and sell orders that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by the manually maintained orders falls short of it.

Those orders use a special batch order type that automatically updates price/size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision. They are essentially sets of pegged orders grouped by order book side, with a proportion of required volume specified for each order. Hence they are sometimes referred to as 'shapes', since the overall volume depends on the remaining liquidity obligation and the mid-price along with the risk model parameters, but the sizes of orders relative to each other can still be controlled.

Liquidity providers are not required to supply any orders that offer liquidity or trade during an auction uncrossing. They must maintain their stake however and their liquidity orders will be placed back on the book when normal trading resumes.

## Data sourcing framework

### Signed messages

### Filters

### Internal sources

## Fees and rewards

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


## Collateral

### Assets on Vega

### Accounts (general, margin, bond) and transfers, double entry accounting

### Bridges

#### Ethereum

## Market / product / trade lifecycle

### Settlement
  Vega executes settlement with a two step process:
  1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay collateral. The collection instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool (link). If the full required amount cannot be collected from all three accounts then as much as possible is collected and loss socialisation is enacted. 
 
  Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
 2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
 These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.
 
   #### Loss socialisation 
   If some collection transfers are not able to supply the full amount to the market settlement account due to some traders having insufficient collateral to handle the price / position (mark to market) move, and if the insurance pool can't cover the shortfall, then not enough funds can be collected to distribute the full amount of the mark to market gains made by traders on the other side. In that case, the funds that have been collected must be fairly distributed. This is called loss socialisation. 
 
  Loss socialisation is implemented by reducing the amount that is distributed to each trader with a mark to market gain, based on their relative position size. 
```
distribute_amount[trader] = mtm_gain[trader] * ( actual_collected_amount / target_collect_amount )
```
#### Settlement when closing out

#### Settlement at expiry

#### Mark to market settlement (link to m-t-m)
