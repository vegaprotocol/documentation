---
sidebar_position: 4
title: Market protections
hide_title: false
---

# Position management
As markets and collateral are not managed through human intervention, markets must have certain automated processes that allow for well-functioning markets and assurance that the collateral required to manage positions is available when it's needed. 

There are a few mechanisms that work differently to how they would on a centralised exchange, in order to provide those reassurances. They include
- Margin: Vega has implemented automated cross-margining. Margin is calculated automatically depending on the number of positions, the size, and the market movements so that there's enough collateral available to sustain a position and not put other market participants, or the market itself, under strain. 
- Mark to market: Mark to market on Vega happens much more frequently than on a centralised exchange. Every time the market price moves, the mark to market price is recalculated

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