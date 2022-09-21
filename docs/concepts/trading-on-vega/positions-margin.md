---
sidebar_position: 2
title: Positions and margin
hide_title: false
---
Trading margined derivatives (such as futures) allows you to create leveraged positions, meaning you only need some of the notional value of a trade to place orders on a market on Vega. 

Leverage is, in effect, the inverse of the initial margin that the protocol takes from your collateral when you place a trade. 

Margin is the amount of assets required to keep your positions open and orders funded. You can think of margin as the 'down payment' to open a position. Leverage, meanwhile, describes how many times larger in value than your margin you can have as a position. (For example, if you need 20DAI to open a position worth 100DAI: Your leverage is 5x and your initial margin is 20% of the full value.)

The exact margin requirements of open orders and positions are determined by the market's risk model and market conditions. The larger the position and the more volatile the market, the greater the amount of margin that will be set aside. The volatility tolerance of the market is driven by the risk model.

## Positions
A trader's position on a market is their open volume and orders. Margin requirements are calculated based on the position, and recalculated based on market movements and changes to the position. Orders that the increase your risk level of your position will require more margin.

When a party on Vega opens a position, the minimum amount of money required to open that position is put into a margin account for that party in that market. 

Over the course of the position's lifetime, the margin requirements will likely change - the margin account may be topped up, and/or some margin is released back to collateral. If that party is trading on more than one market that uses the same asset, the collective positions on those markets will inform how much is set aside for margin. 

## Automated market mechanisms 
As markets and collateral are not managed through human intervention, markets must have certain automated processes that allow for well-functioning markets and assurance that the collateral required to manage positions is available when it's needed.

There are a few mechanisms that work differently to how they would on a centralised exchange, in order to keep the markets solvent. They include:
- [**Mark to market**](#mark-to-market): Mark to market on Vega happens much more frequently than on an exchange where counter parties are not pseudonymous. Every time the market price moves, the mark to market price could be recalculated
- [**Margin**](#margin): When a party opens a position: the *initial margin* requirement is calculated automatically depending on the market's risk model. If the market moves against the party, and the margn towards the *maintenance level*, Vega will *search* for more collateral in the general account, to avoid liquidating the position. Margin can also be *released* if the position is in sufficient profit. Other positions in markets with the same settlement asset may also interact with the same general account. Therefore, Vega is a cross-margin based system by default.

## Mark to market
Marking to market refers to settling gains and losses due to changes in the market value of the underlying product. Marking to market aims to provide a realistic appraisal of a position based on the current market conditions.

When marking to market, the protocol takes the current market price and recalculates traders' margin requirements based on how their position is affected by price moves.

If the market price goes up, a trader that holds a long position receives money in their margin account – equal to the underlying's change in value – from a trader that holds a short position, and conversely if the value goes down, the holder of the short position recieves money from the holder of the long position.

For a futures market created on Vega, the mark-to-market price is calculated every time the price moves, and is based on the last traded price. This is in contrast to traditional futures markets, for which marking to market occurs once per day. One exception is when the market settles at expiry, at which point the mark to market price comes from the data source's final settlement price.

Settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party, and the process is repeated each time the mark price changes until the maturity date for the market is reached.

Because the margin for a market is calculated dynamically based on the market movements, the mark price also has an effect on how much collateral is set aside for margin.

:::note Read more
[Mark to market settlement](./settlement#mark-to-market-settlement)
:::

## Margin
Margin is the amount of collateral required to keep your position open. It can change depending on how your position is impacted by your own actions and market movement.

The margin calculations ensure a trader does not enter a trade that will immediately need to be closed out.

When placing a key's first order on a market: the protocol will calculate the initial margin required. If there is not a sufficient balance in the general account to fund this, the order will be rejected. If there is, these funds will be moved into a margin account for that market.  


Orders that increase your open volume will increase the required margin. Orders that decrease it should not increase your margin requirements (unless you end up opening a position in the opposite direction).

### Cross-margining
Vega's margining system provides automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets that use the same settlement asset.

To more closely control how much is risked on a position, it's possible to replicate the effects of isolated margin by using one party (public key) per market.

:::note Go deeper
**[Automated cross margining](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21)** - Section 6 of the protocol whitepaper.
:::

### Margin requirements
The Vega protocol calculates four margin levels, which are used to determine when a trader has the right amount, too much, or not enough margin set aside to support their position(s). Those levels are: maintenance margin, initial margin, search level, collateral release level. 

The maintenance margin (minimum amount needed to keep a position open) is derived from the market's risk model, and all other margin levels are based the maintenance margin level.

### Margin level: Maintenance
Throughout the life of an open position, the minimum required amount to keep a position open is called the maintenance margin. It corresponds to the minimum amount required to cover a position during adverse market moves within a given probability level. 

The amount a trader will have held aside as maintenance margin is derived from the market's risk model. Specifically, it's based on a risk measure called the expected shortfall, used to evaluate the market or credit risk of the collective positions.

If the margin balance drops below the maintenance margin level, the position closeout process gets initiated.

:::note Read more
[Closeouts](./market-protections#closeouts)
[Risk models](../vega-protocol#risk-models-and-parameters)
:::

### Margin level: Initial
The *initial margin level* is the amount that will be transferred from the trader's general account to be used as margin when an order is placed or a trade is executed. The initial margin is more than the absolute minimum needed to support a position, as it offers a cushion to keep a position open as the mark price changes.

The initial margin is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `initial_margin` scaling factor, which is set by the network parameter `market.margin.scalingFactors`.

`initial margin level = maintenance margin x initial_margin scaling factor`

The initial margin level being higher than the *margin search level* (which itself is higher than the *maintenance margin level*) ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral immediately after a trade has been entered into.

### Margin level: Searching for collateral
If the balance available in a trader's margin account is less than their position's *margin search level*, but is still above the maintenance level -- the network will try to allocate more money (up to the current initial margin level) from a trader's general account to be used for margin.

If the margin account can be topped up, then the position stays open. If a market's swing is bigger than a user's margin is can cover, then money is pulled from the collateral to cover the requirement. In most cases, the allocated margin should cover market swings.

The search level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `search_level` scaling factor, which is set by the network parameter `market.margin.scalingFactors`.

`search level = maintenance margin x search_level scaling factor`

:::note Read more
[Closeouts](./market-protections#closeouts)
:::

If there is not enough collateral to provide the required margin, then the position will be closed out.

### Margin level: Releasing collateral
If a trader's margin balance exceeds the *collateral release level*, the position is considered overcollateralised. The excess money is released to their general account, to get their margin back to the *initial margin level*. 

Those gains can then be withdrawn, or used to fund other trades.

The release level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `collateral_release` scaling factor, which is set by the network parameter `market.margin.scalingFactors`.

`release level = maintenance margin x collateral_release scaling factor`

<!-- 
### Calculating the margin on open orders
The network calculates the largest long / short position.
* If the long position is the riskiest, the margin algorithm multiplies by a `risk factor long` and by the `mark price` (for futures). * If the short position is the riskiest, then the algorithm multiplies the position by the `risk factor short` and by the `mark price`. 

These capture the outcome of the probabilistic distribution of future market moves, and are market specific.
#### Example [WIP]
Image to be uploaded - <img alt="Calculating margin on open orders" src="/images/2-calculate-margin-open-orders.png" width="500" />

There is an open sell order of size 1 on the book. The risk factor for short positions is 0.074347011. The current mark price is 0.02690. So minimum margin = 0.2690 x 0.074347011 = 0.00200 (rounded to 5 decimal places).

### Margin calculations on open positions
The following calculation takes into account 'slippage', as seen on an order book.

#### Example [WIP]
<img alt="Calculating margin on an open positions" src="/images/3-margin-open-positions.png" width="500" />

The trader has an open short position of size 1, and no open orders.

The risk factor for short position is 0.074347011. 

The current mark price is 0.02672. 

The best offer price is 0.02676 and it has enough volume so that theoretically the position could be closed-out at that price. 

maintenance margin = 0.02672 x 0.074347011 + max (0, 0.02676 - 0.02672) = 0.00203 (rounded to 5 decimal places), where the second term in the sum is the 'slippage' component. 

Other margin levels are derived from the maintenance margin using the scaling factors that form part of the market configuration. -->


:::note Go deeper
**[Margins and credit risk ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf)** - Section 6 of the protocol whitepaper.
:::
