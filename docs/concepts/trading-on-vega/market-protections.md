---
sidebar_position: 5
title: Market protections
vega_network: TESTNET
hide_title: false
description: Read about how markets can trade safely, pseudonymously.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

In a pseudonymous environment where counterparties may be identified by no more than a public key, it's essential for the software to consider credit risk, given that the avenues available for traditional marketplaces aren't available. If a counterparty owes more in settlement than their posted collateral, there is no way to reclaim those assets.

The Vega protocol has been designed with rules to detect dangerous market conditions and apply protective measures, and to constantly maintain effective collateralisation for all positions.

Margin calculations take into account the probability of the liquidation value of a position falling short of the available capital. The network is also designed to frequently re-evaluate each individual's risk, and preemptively close positions.

Some of those measures include price monitoring and frequent mark to market calculations.

:::warning A note on risk

Derivatives markets are financially risky, by design. If a market has no liquidity, it won't be possible to get out of a position.

Vega is not a retail or brokerage platform with third-parties to guarantee positions can always be exited. Vega provides a protocol for users to create markets that put traders directly in the market, with incentives built into the protocol to maximise the potential that a trader can get out of a position quickly. This, however, is not a guarantee.
:::

## Price monitoring
The dynamics of market price movements mean that prices don't always represent the participants' true average view of the price, but are instead artefacts of the market microstructure. 

Sometimes low liquidity and/or a large quantity of order volume can cause the price to diverge from the true market price. The Vega protocol is designed to assume that relatively small moves are 'real' and that larger moves might not be. 

Price monitoring exists to determine the real price, in the case that price moves are extreme and unrealistic. If the move is deemed to be large, the market's trading mode is temporarily changed to a protective auction to get more information from market participants before any trades are generated.

Distinguishing between small and large moves can be highly subjective and market-dependent. The protocol relies on risk models and price monitoring triggers to formalise this process.

A market's risk model can be used to obtain the price distribution at a future point in time, given the current price and the model parameter. A protective auction trigger can be constructed using a projected fixed time horizon and probability level.

Note: A market's risk model is defined within the market proposal.

### Price monitoring triggers
Each market has a set of price monitoring triggers. When those points are breached, the market will enter a protective auction. Price monitoring triggers are defined in a market's proposal, and a governance proposal to change them can be raised and voted on by tokenholders. Each market can have a maximum of 5 sets of price monitoring triggers for a market.

Each trigger contains:
* *Horizon*: Time horizon of the price projection in seconds
* *Probability*: The probability level for price projection. For example, a value of 0.95 will result in a price range such that over the specified horizon, the prices observed in the market should be in that range 95% of the time
* *Auction extension*: Auction extension duration in seconds. Should the price breach its theoretical level over the specified horizon at the specified probability level, the market will continue in auction for the time specified

If the market did not have any triggers specified in its market proposal, then the default triggers will be used (defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.monitor.price.defaultParameters" hideValue={true} />). If the triggers are set to an empty array, either explicitly or if they are omitted and that's what the network parameter is set to, then price monitoring is effectively switched off, and the market will never go into a protective auction.

In case of multiple monitoring triggers, each trigger is checked separately and the resulting protective auction length will be the sum of auction durations from all the triggers that were breached.

There could be a situation where only a single trigger is breached to begin with, but as the initial protective auction period comes to an end, the indicative uncrossing price breaches one or more of the other triggers, resulting in an auction extension. This process continues until no more triggers are breached after the appropriate auction extension period elapses. This can be because price doesn't breach any other triggers, or all triggers have already been breached. Once a given trigger is activated, it's not checked again until the protective auction is resolved and the market goes back into its default trading mode.

Price monitoring is meant to stop large market movements that are not 'real' from occurring, rather than just detect them after the fact. To achieve that, the module works preemptively: a transaction that would've caused the price monitoring bounds to be breached doesn't get processed in the default trading mode. The market first switches to a protective auction, and then that transaction (and any subsequent ones until the auction time elapses) get processed. 

The market can still make a large move within the auction, as long as crossing orders from both buy and sell side get submitted. 

The purpose of price monitoring is to extract more information out of the market in the event of a large move, not to stop the market from making that move altogether.

### Price monitoring examples
Use the [price monitoring python notebook ↗](https://github.com/vegaprotocol/research/blob/master/notebooks/misc/Price%20monitroing%20bounds.ipynb) to try out different price monitoring bounds, and see a worked example in the section below. 

<details><summary>See a worked price monitoring example</summary>
<p>

* Assume the market is configured to have two price monitoring triggers, where horizon, probability and auction extension for the two triggers are:
  * trigger 1: `1h, 0.95, 1min`,
  * trigger 2: `2h, 0.99, 5min`.
* Assume that the current mark price and price history imply the following valid price ranges for the two triggers:
  * trigger 1: `[95,105]`,
  * trigger 2: `[90,110]`.
* Any trades with prices greater than or equal to `95` and less than or equal to `105` will be generated as per the default trading mode of the market.

Now:
  * If an incoming order would get matched so that the price of any of the resulting trades is less than `90` or more than `110`, then that order won't be processed in the default trading mode, the market will go into a protective auction, the order will get processed in the auction mode (if order type is valid for an auction), and after 6 minutes the relevant (if any) trades will be generated as per the order book state at that time. The market will return to its default trading mode and price monitoring bounds will be reset, with price ranges depending on the last mark price available.
  * If an incoming order would get matched so that the price in any of the resulting trades is in the `[90,95]` or `[105,110]` range, the market goes into a protective auction with the initial duration of 1 minute.
    * If after 1 minute has passed there are no trades resulting from the auction or the indicative price of the auction, then if in the `[95,105]` the trades are generated and the protective auction concludes.
    * If after 1 minute has passed the indicative price of the auction is outside the `[95,105]`, the auction gets extended by 5 minutes, as concluding the auction at the 1 minute mark would breach the valid ranges implied by the second trigger. After the 5 minutes, trades (if any) are generated irrespective of their price, as there are no more active triggers, and the protective auction concludes.

The images below show how according to the risk model, 90%, 95%, or 99% of the price moves from the current price of 10 over the time horizon are in the green area under the density function. Anything outside the green area is considered unlikely and would trigger an auction.


![Price distribution graph 90% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-90.png)
![Price distribution graph 95% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-95.png)
![Price distribution graph 99% for price monitoring example](/img/concept-diagrams/price-distribution-monitoring-99.png)

</p>
</details>

## Distressed traders
If a trader's available margin on a market is below the closeout level and cannot be replenished, that trader is considered distressed.

How a distressed trader's positions and orders are treated depends on if they're using isolated or cross margining.

If a distressed trader is using **isolated margin**, an *open position* that drops below the maintenance margin level will be closed out. Any open orders will remain active, as long as there's enough margin set aside to meet the [order margin](./margin.md#margin-order) requirement. The margin for each is calculated and funded separately.

If the margin set aside for *orders* isn't enough, all of the trader's open orders on the market are cancelled and margin is returned to the general account. An open position in that market stays open, as it's margined separately.

A distressed trader using **cross margining** has all their open orders on that market cancelled. The network will then recalculate the margin requirement on the trader's remaining open position. If they then have enough collateral, they are no longer considered a distressed trader. If the trader still does not have sufficient collateral, their position is closed out.

### Closeouts
When a participant does not have enough collateral to hold an open position, the protocol will automatically trigger a closeout. The closeout process is a last resort for a position.

A position that's been closed out is transferred to the network, which can become a market participant in order to unload closed out positions.

Any margin balance remaining after a closeout is transferred to the market's insurance pool.

### Position resolution
Once a trader is closed out, the position is taken over by the network. The network's open volume for the market increases, and the market's insurance pool acts as the network's margin account. 

The network party then submits an IOC limit order to unload the position - selling for a long position or buying for a short position. This is called a [network order](./orders.md#network-order). Network orders do not affect the market's mark price.

How much of the position the network party tries to offload depends on the liquidation parameters for disposal, set per market:
* Disposal time step: How often the network attempts to unload its position, as long as the market isn't in auction
* Disposal fraction: What fraction of network's current open volume it will try to reduce in one attempt
* Full disposal size: The lowest position size before the network will attempt to dispose the remaining amount in one order
* Max fraction of order book side that can be consumed: The max amount of the order book's total volume, within the liquidity bounds, that the network can use to close its position, as a fraction

### Loss socialisation 
Loss socialisation occurs when there are traders that don't have sufficient collateral to handle the price moves of their open position(s), and the market's insurance pool cannot cover their shortfall. 

This situation would mean collection funds are not able to supply the full amount to the market settlement account, and not enough funds can be collected to distribute the full amount of mark to market gains made by traders on the other side. 

The funds that have been collected are then fairly distributed by reducing the amount distributed to each trader with a mark to market gain, based on their relative position size.

```
distribute_amount[trader] = mtm_gain[trader] * ( actual_collected_amount / target_collect_amount )
```

### Insurance pools
Each market has its own insurance pool, and each asset has its own general insurance pool. Insurance pools are available in case there are unreasonable market events, and traders are closed out and unable to cover their losses.

When a market expires, the funds from that market's insurance pool go into a bigger asset insurance pool, which other markets that use the same settlement asset can pull from. However, in a successor market proposal, a portion of a market's insurance pool can be earmarked for transfer to the successor market.

Insurance pools grow in two scenarios:
* If a trader is closed out because they do not have enough collateral to support an open positions
* If a liquidity provider pays a penalty for failing to provide their committed liquidity