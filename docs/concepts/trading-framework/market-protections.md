---
sidebar_position: 4
title: Market protections
hide_title: false
---
In a pseudonymous environment where counter-parties may be identified by no more than a public key, it's essential for the software to consider credit risk, given that the avenues available for traditional marketplaces aren't available. If a counterparty owes more in settlement than their posted collateral, there is no way to reclaim those assets.

The Vega protocol has been designed with rules to detect dangerous market conditions and apply protective measures, and to constantly maintain effective collateralisation for all positions.

Margin calculations take into account the probability of the liquidation value of a position falling short of the available capital. The network is also designed to frequently re-evaluate each individual's risk, and pre-emptively close positions.

Some of those measures include price monitoring, liqudity monitoring, and frequent mark to market calculations.

:::note Read more
* [Margin on Vega](./positions-margin#margin)
* [Mark to market](./positions-margin#mark-to-market)
:::

:::warning A note on risk

Derivatives markets are financially risky, by design. If a market has no liquidity, it won't be possible to get out of a position.

Vega is not a retail or brokerage platform with third-parties to guarantee positions can always be exited. Vega provides a protocol for users to create markets that put traders directly in the market, with incentives built into the protocol to maximise the potential that a trader can get out of a position quickly. This, however, is not a guarantee.
:::

## Price monitoring
The dynamics of market price movements mean that prices don't always represent the participants' true average view of the price, but are instead artefacts of the market microstructure. 

Sometimes low liquidity and/or a large quantity of order volume can cause the price to diverge from the true market price. The Vega protocol is designed to assume that relatively small moves are 'real' and that larger moves might not be. 

Price monitoring exists to determine the real price, in the case that price moves are extreme and unrealistic. If the move is deemed to be large, the market's trading mode is temporarily changed into auction mode to get more information from market participants before any trades are generated.

Distinguishing between small and large moves can be highly subjective and market-dependent. The protocol relies on risk models and price monitoring triggers to formalise this process.

A market's risk model can be used to obtain the price distribution at a future point in time, given the current price and the model parameter. A price monitoring auction trigger can be constructed using a projected fixed time horizon and probability level.

Note: A market's risk model is defined within the market proposal.

### Price monitoring triggers
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

The images below show how according to the risk model, 90%, 95%, or 99% of the price moves from current price of 10 over the time horizon are in the green area under the density function. Anything outside the green area is considered unlikely and would trigger an auction.

[Price monitoring notebook ↗](https://github.com/vegaprotocol/research/blob/master/notebooks/misc/Price%20monitroing%20bounds.ipynb): Try out different price monitoring bounds with a python notebook.

![Price distribution graph 90% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-90.png)
![Price distribution graph 95% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-95.png)
![Price distribution graph 99% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-99.png)

## Liquidity monitoring
Besides the obvious appeal to traders, a liquid market also offers some risk management, particularly in a system that does not have a central counter-party. When a trader is distressed, their position can only be liquidated if there is enough volume on the order book to offload it. 

In order to ensure there is enough liquidity to keep a market active and protect against insolvent parties, the network must be able to detect when the market's liquidity is too low.

The liquidity mechanics of the Vega protocol mean there is an incentive (through fee-setting) to provide the necessary liquidity.

Another risk mitigation comes in how LPs commit liquidity. As long as there are static bid and ask orders on the book, the system deploys enough volume, at the specified offsets that are within price monitoring bounds, and that have at least the minimum probability of trading set by the network parameter `market.liquidity.minimum.probabilityOfTrading.lpOrders`.

As a consequence, a market may only become illiquid in two cases: 
* The total supplied stake by all liquidity providers is below the target stake (a multiple of the maximum open interest over a period of time set by the network parameter `market.stake.target.timeWindow`). 
* The best static bid or best static ask prices are missing from the order book, meaning the volume implied by a liquidity provider's commitment cannot be deployed.

When a market is illiquid, it enters into a liquidity monitoring auction, and terminates that auction when the market liquidity level is back at a sufficiently high level.

If a market enters into a liquidity auction and never again attracts enough liquidity to exit it, the market will stay in a liquidity auction until the market's settlement. Once the market's settlement price is emitted by the data source, then all market participants are settled based on their positions and account balances.

## Distressed traders
If a trader's available margin on a market is below the closeout level and cannot be replenished, that trader is considered to be distressed.

A distressed trader has all their open orders on that market cancelled. The network will then recalculate the margin requirement on the trader's remaining open position. If they then have sufficient collateral, they are no longer considered a distressed trader. 

However, if the trader does not have sufficient collateral, they are added to list of traders that will then undergo position resolution to close out their positions.

:::note Read more
[Position resolution](#position-resolution)
:::

### Closeouts
When a participant does not have enough collateral to hold their open positions, the protocol will automatically trigger a closeout.

The closeout process is a last resort for a position. If a trader's deployed margin on the market is insufficient to cover a mark to market settlement liability, first Vega will search the trader's available balance of the settlement asset. If this search is unable to cover the full liability, the trader will be considered distressed and undergo position resolution. Any margin balance remaining after closeout is transferred to the market's insurance pool.

The insurance pool is drawn from to make up the difference required to cover the mark to market loss amount. Should the funds in the insurance pool be insufficient for that, loss socialisation will be applied.

:::note Read more
* [Position resolution](#position-resolution)
* [Loss socialisation](#loss-socialisation)
:::

### Position resolution
Position resolution is executed simultaneously, during a single event, for all traders on a market that have been determined to require it. Distressed trader(s) are ‘batched up’, and position resolution is run once the full set of traders is known for this event.

The network calculates the overall net long or short positions in the batch that requires position resolution, which tells the network how much volume (either long or short) needs to be sourced from the order book. For example, if there are 3 distressed traders with +5, -4 and +2 positions respectively, then the net outstanding liability is +3. 

The outstanding liability is sourced from the market's order book via a single market order executed by the network as a counterparty. In this example, a market order to sell 3 would be placed on the order book. This order is described as a 'network order'.

The network generates a set of trades with all the distressed traders, all at the volume weighted average price of the network's (new) open position. At this point, neither the distressed traders nor the network will have any open positions. Note, network orders do not affect the market's mark price. 

All of the remaining collateral in each distressed trader's margin account for that market is confiscated to the market's insurance pool.

:::note Read more
[Insurance pools](#insurance-pools)
:::

### Loss socialisation 
Loss socialisation occurs when there are traders that don't have sufficient collateral to handle the price moves of their open position(s), and the insurance pool cannot cover their shortfall. 

This situation would mean collection transfers are not able to supply the full amount to the market settlement account, and not enough funds can be collected to distribute the full amount of mark to market gains made by traders on the other side. 

The funds that have been collected must be fairly distributed. Loss socialisation is implemented by reducing the amount that is distributed to each trader with a mark to market gain, based on their relative position size. 

```
distribute_amount[trader] = mtm_gain[trader] * ( actual_collected_amount / target_collect_amount )
```

### Insurance pools
Each market has its own insurance pool, and each asset has its own general insurance pool. Insurance pools are available in case there are unreasonable market events, and traders are closed out and unable to cover their losses.

When a market expires, the funds from that market's insurance pool go into a bigger asset insurance pool, which other markets that use the same settlement asset can pull from. 

Insurance pools grow in two scenarios:
* If a trader is closed out because they do not have enough collateral to support an open positions
* If a liquidity provider pays a penalty for failing to provide their committed liquidity

:::note Read more
* [Closeouts](#closeouts)
* [Liquidity provision penalties](#penalties)
* [Loss socialisation](#loss-socialisation)
:::