---
sidebar_position: 2
title: Positions and margin
hide_title: false
description: Dynamic margining maximises collateral usage and market solvency.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Trading margined derivatives (such as futures) allows you to create leveraged positions, meaning you only need some of the notional value of an instrument to place orders on a market on Vega. 

Margin is the amount of the settlement asset of the market required to keep your positions open and orders funded. You can think of margin as the 'down payment' to open a position. Leverage, meanwhile, describes how many times larger is the notional value of that position compared to the margin you have dedicated to it. For example, if you need 20 DAI to open a position worth 100 DAI: your leverage is 5x and your initial margin is 20% of the full value.

The exact margin requirements of open orders and positions are determined by the market's risk model and market conditions. The larger the position and the more volatile the market, the greater the amount of margin that will be set aside. The volatility tolerance of the market is driven by the risk model.

## Positions
A trader's margin requirements in a given market are driven by their open volume and orders. They are recalculated based on market movements and changes to the open volume and/or orders. Orders that then increase your risk level of your position will require more margin, orders that reduce the exposure can be placed without any additional capital.

When a party on Vega opens a position, the minimum amount of assets required to open that position is put into a margin account for that party in that market. 

Over the course of the position's lifetime, the margin requirements will likely change - the margin account may be topped up, and/or some margin is released back to collateral. If that party is trading on more than one market that uses the same asset, the collective positions on those markets will inform how much is set aside for margin. Margin balances are also affected by the price movements in the market where the position is being held. These hypothetical changes in a position's value are called unrealised profit and loss. 

`[margin account balance] = [initial margin requirement] + [unrealised profit] OR - [unrealised losses]`

## Automated market mechanisms 
As markets and collateral are not managed through human intervention, markets must have certain automated processes that allow them to function well and assure that the collateral required to manage positions is available when it's needed.

There are a few mechanisms that work differently to how they would on a centralised exchange, in order to keep the markets solvent. They include:
- [**Margin**](#margin): When a party opens a position: the *initial margin* requirement is calculated automatically depending on the market's risk model. If the market moves against the party, and the margin towards the *maintenance level*, Vega will *search* for more collateral in the general account, to avoid liquidating the position. Margin can also be *released* if the position is in sufficient profit. Other positions in markets with the same settlement asset may also interact with the same general account. Therefore, Vega is a cross-margin based system by default.
- [**Mark to market**](#mark-to-market): Mark to market on Vega happens much more frequently than typical exchanges. Every time a trade happens and moves the last traded price, positions are marked to market. Marking to market is used to move assets into your margin account (from someone else's) if you are in profit, or out of your margin account if not.

## Mark to market
Marking to market refers to settling gains and losses due to changes in the market value. Marking to market aims to provide a realistic appraisal of a position based on the current market conditions.

If the market price goes up, traders that hold long positions receive money into their margin account – equal to the change in the notional value of their positions – from traders that hold short positions, and conversely if the value goes down, the holders of short positions receive money from the holders of long positions.

For a futures market created on Vega, marking to market is carried out every time the price moves, and is based on the last traded price. This is in contrast to traditional futures markets, for which marking to market may occur only once per day. One exception is when the market settles at expiry, at which point the mark to market price comes from the market data source's final settlement price.

Mark to market settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party, and the process is repeated each time the mark price changes until the maturity date for the market is reached.

:::note Read more
[Mark to market settlement](./settlement#mark-to-market-settlement): How settlement works when the mark to market price is recalculated.
:::


## Margin
Margin is the amount of collateral required to keep your position open. It can change depending on how your position is impacted by your own actions and market movement.

The margin levels try to ensure that a trader does not enter a trade that will immediately need to be closed out.

When placing a party's (public key's) first order on a market: the protocol will calculate the initial margin required. If there is not a sufficient balance in the general account to fund this, the order will be rejected. If there is, these funds will be moved into a margin account for that market.  

Orders that increase your open volume will increase the required margin. Orders that decrease it should not increase your margin requirements - unless you end up opening a position in the opposite direction.

Once marking to market is finished, the protocol takes the current market price and recalculates every trader's margin requirements based on how their position is affected by price moves.

### Cross-margining
Vega's margining system provides automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets that use the same settlement asset.

To more closely control how much is risked on a position, it's possible to replicate the effects of isolated margin by using one party (public key) per market.

:::note Go deeper
**[Automated cross margining](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21)** - Section 6 of the protocol whitepaper.
:::

### Margin requirements
The Vega protocol calculates four margin levels, which are used to determine when a trader has the right amount, too much, or not enough margin set aside to support their position(s). Those levels are: maintenance margin, initial margin, search level, collateral release level. 

The maintenance margin (minimum amount needed to keep a position open) is derived from the market's risk model and includes some slippage calculations. All other margin levels are based on the maintenance margin level.

### Margin level: Maintenance
Throughout the life of an open position, the minimum required amount to keep a position open is called the maintenance margin. It corresponds to the minimum amount required to cover a position during adverse market moves within a given probability level. 

The amount a trader will have held aside as maintenance margin is derived from the market's risk model. Specifically, it's based on a risk measure called the expected shortfall, used to evaluate the market risk of the position and any open orders.

If the margin balance drops below the maintenance margin level, the position closeout process gets initiated.

#### Margin slippage
Maintenance margin is calculated as: 

```
maintenance margin = price x (linear slippage factor x |position| + quadratic slippage factor x position^2) + price x |position| x size x risk factor
```

Slippage factors are market parameters that specify by how much the liquidity component of the margin calculation is dependent on the position size in a low-volume market scenario.

If there is enough volume on the book, the slippage comes directly from the book and the liquidity component is not used. Margin slippage in a low-volume scenario is calculated as `slippageFromFactors = linear x position  + quadratic x position^2) x price`. If there is a lot of liquidity on the book, the protocol calculates the closeout amount and provides the lower amount, i.e., the liquidity part of the margin `min(slippageFromFactors, slippageFromBook)`. Increasing the linear or quadratic slippage factor increases the liquidity part of the margin calculation, but only if there is little volume on the book; if there is enough volume on the book the slippage comes directly from the book.

The `risk factor` will be different for short and long positions; the risk model provides `risk factor long` for when `position > 0` and `risk factor short` for when `position < 0`. 

Note that your party's limit orders are included as well and the maintenance margin is calculated for the riskiest long or short combination of orders and position.

:::note Read more
[Closeouts](./market-protections#closeouts): What triggers a closeout, and what happens in a closeout
[Risk models](../vega-protocol#risk-models-and-parameters): Details on the risk model parameters for a market
:::

### Margin level: Initial
The *initial margin level* is the amount that will be transferred from the trader's general account to be used as margin when an order is placed or a trade is executed. The initial margin is more than the absolute minimum needed to support a position, as it offers a cushion to keep a position open as the mark price changes.

The initial margin is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `initial_margin` scaling factor, which is set by a network parameter: 
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors" />.

`[initial margin level] = [maintenance margin] x [initial_margin scaling factor]`

The initial margin level being higher than the *margin search level* (which itself is higher than the *maintenance margin level*) ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral immediately after a trade has been entered into.

### Margin level: Searching for collateral
If the balance available in a trader's margin account is less than their position's *margin search level*, but is still above the maintenance level -- the network will try to allocate more money (up to the current initial margin level) from a trader's general account to be used for margin.

If the margin account can be topped up, then the position stays open. If that's not possible as there are no sufficient funds in the trader's collateral account, and the market keeps moving against the trader so that the margin account balance drops below the current maintenance level, a closeout procedure is initiated. The first step is to cancel all of the trader's open orders and reevaluate the margin requirements. If the margin account balance is then higher than the maintenance margin level, the trader's position remains open, otherwise the protocol will attempt a liquidation.

In most cases, the allocated margin should cover market swings so that collateral search is attempted first as described above, however in extreme cases the market move could be so large as to immediately proceed to the liquidation step.

The search level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `search_level` scaling factor, which is set by a network parameter: 
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors" />.

`[search level] = [maintenance margin] x [search_level scaling factor]`

If there is not enough collateral to provide the required margin, then the position will be closed out.

:::note Read more
[Closeouts](./market-protections#closeouts): What triggers a closeout, and what happens in a closeout
:::

### Margin level: Releasing collateral
If a trader's margin balance exceeds the *collateral release level*, the position is considered overcollateralised. The excess money is released to their general account, to get their margin back to the *initial margin level*. 

Those gains can then be withdrawn, or used to fund other trades.

The release level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `collateral_release` scaling factor, which is set by a network parameter:
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors"/>.

`[release level] = [maintenance margin] x [collateral_release scaling factor]`

### Example: Calculating margin on open orders
The network calculates the overall long / short position including the submitted order. Depending on which one is larger a long or short risk factor is used for margin calculation. The maintenance margin (for futures) is then a product of the largest position, the corresponding risk factor and the `mark price`. Risk factors capture the outcome of the probabilistic distribution of future market moves, and are market specific.

:::note Go deeper
**[Margins and credit risk ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf)** - Section 6 of the protocol whitepaper.
:::


* In the following scenario, the trader posts a sell order of size 1 that doesn't trade on submission and ends up being added to the order book
* Short risk factor is 0.05421518
* Current mark price is 100.00
* `maintenance margin = 1 x 100 x 0.05421518 = 5.42152` (rounded up to 5 decimal places) 

The initial margin scaling factor for the market (α<sup>initial</sup>) is 1.2 so the amount of collateral that gets moved to the trader's margin account for the market is 1.2 x 5.42152 = 6.50582.

#### Seen on Vega Console
![Calculating margin on open orders - Console](/img/concept-diagrams/calculate-margin-open-orders-console.png "Calculating margin on open orders - Console")

#### Queried using GraphQL
![Calculating margin on open orders - GraphQL](/img/concept-diagrams/calculate-margin-open-orders-graphQL.png "Calculating margin on open orders - GraphQL")

### Example: Calculating margin on open positions
The following calculation takes into account 'slippage', as seen on an order book.

* In the following scenario, the trader has an open short position of size 1, and no open orders
* Short risk factor is 0.05421518
* Current mark price is 100.10
* Best offer price is 100.20 and it has enough volume so that theoretically the position could be closed-out at that price
* `maintenance margin = 1 x (100.10 x 0.05421518 + max (0, 100.20 - 100.10)) = 5.52695` (rounded up to 5 decimal places), where the second term in the sum is the 'slippage' component

Other margin levels are derived from the maintenance margin using the scaling factors that form part of the market configuration.

Since the amount charged to trader's margin account upon order submission (6.50582 - see previous example) is still above the current (after the order gets filled and trader ends up with a short position of size 1) search level of 6.07964 = 1.1 x 5.52695, no further margin account balance changes are initiated.

#### Seen on Vega Console
![Calculating margin on open positions - Console](/img/concept-diagrams/calculate-margin-open-positions-console.png "Calculating margin on open orders - Console")

#### Queried using GraphQL
![Calculating margin on open positions - GraphQL](/img/concept-diagrams/calculate-margin-open-positions-graphQL.png "Calculating margin on open orders - GraphQL")
