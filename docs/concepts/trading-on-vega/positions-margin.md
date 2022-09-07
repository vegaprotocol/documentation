---
sidebar_position: 2
title: Margin
hide_title: false
---
As markets and collateral are not managed through human intervention, markets must have certain automated processes that allow for well-functioning markets and assurance that the collateral required to manage positions is available when it's needed. 

There are a few mechanisms that work differently to how they would on a centralised exchange, in order to keep the markets solvent. They include:
- **Margin**: Vega has implemented automated cross-margining. Margin is calculated automatically depending on the number of positions, the size, and the market movements so that there's enough collateral available to sustain a position and not put other market participants, or the market itself, under strain
- **Mark to market**: Mark to market on Vega happens much more frequently than on a centralised exchange. Every time the market price moves, the mark to market price is recalculated

## Leverage [WIP]
A market's leverage can be calcuated as one over the risk factor.

## Mark to market
Marking to market refers to the settling of gains and losses due to changes in the market value of the underlying product. Marking to market aims to provide a realistic appraisal of of a position based on the current market conditions.

If the value goes up, a trader that holds a long position receives money in their general account – equal to the underlying's change in value – from a trader that holds a short position, and conversely if the value goes down, the holder of the short position recieves money from the holder of the long position. 
For a market created on Vega, the mark-to-market price is calculated every time the price moves. This is in contrast to traditional futures markets, for which marking to market occurs once per day.

Settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party,  and the process is repeated each time the mark price changes until the maturity date for the market is reached.

Because the margin for a market is calculated dynamically based on the market conditions, the mark price also has an effect on how much collateral is set aside for margin.

:::note Read more
[Mark to market settlement](./trade-lifecycle#mark-to-market-settlement)
:::

## Margin
The margin calculation for a new order, and the amount deducted from collateral to cover margin, is based on all of a trader's open orders. A trader will need enough margin to keep a position open, whether it goes for or against the trader. The margin calculations ensure a trader does not enter a trade that will immediately need to be closed out.

Vega's margining system implements automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets that use the same settlement asset. 

:::note Go deeper
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

### Margin calculations on open positions
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

:::note Read more
[Price monitoring](#price-monitoring)
:::

If there is not enough collateral to provide the required margin, then the position will be closed out.

### Margin: Releasing collateral
Traders who have a margin account balance greater than the release level will have the excess assets released to their general collateral account, to the point where their new margin level is equal to the initial margin level.

### Maintenance margin

