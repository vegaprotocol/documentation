---
sidebar_position: 3
title: Margin and positions
hide_title: false
description: How margin is calculated and used.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Trading margined derivatives (such as futures) allows you to create leveraged positions, meaning you only need some of the notional value of an instrument to place orders. 

Margin is the amount of the market's settlement asset that's required to keep your positions open and orders funded. You can think of margin as the 'down payment' to open a position. Leverage, meanwhile, describes how many times larger is the notional value of that position compared to the margin you have dedicated to it. For example, if you need 20 DAI to open a position worth 100 DAI: your leverage is 5x and your initial margin is 20% of the full value.

Hypothetical changes in a position's value are called unrealised profit and loss.

## Automated market processes
As markets and collateral are not managed through human intervention, markets must have certain automated processes that allow them to function well and assure that the collateral required to manage positions is available when it's needed.

There are a few mechanisms that work differently to how they would on a centralised exchange, in order to keep the markets solvent. 

They include:
- [**Cross margining**](#cross-margining): When a participant places an order using cross margin mode, the *initial margin* requirement is calculated automatically depending on the market's risk model. If the market moves against the participant, and the margin towards the *maintenance level*, Vega will *search* for more collateral in the general account, to avoid liquidating the position. Margin can also be *released* if the position is in sufficient profit. Other positions in markets with the same settlement asset may also interact with the same general account. 
- [**Margin isolated per position**](#isolated-margin): When a participant places an order using isolated margin mode, the expected margin required for the life of the order, if it's filled, is set aside. The network continually tracks the requirements for open orders and positions to ensure there is enough margin to keep them open.
- [**Mark to market**](#mark-to-market): Mark to market on Vega happens much more frequently than typical exchanges. Every time a trade happens and moves the last traded price, positions are marked to market. Marking to market is used to move assets into your margin account (from someone else's) if you are in profit, or out of your margin account if not.

## Mark to market
Marking to market refers to settling gains and losses due to changes in the market value. Marking to market aims to provide a realistic appraisal of a position based on the current market conditions.

If the market price goes up, traders that hold long positions receive money into their margin account – equal to the change in the notional value of their positions – from traders that hold short positions, and conversely if the value goes down, the holders of short positions receive money from the holders of long positions.

For a derivatives market created on Vega, marking to market is carried out every time the price moves, and is based on the last traded price. This is in contrast to traditional derivatives markets, for which marking to market may occur only once per day. One exception is when a futures market settles at expiry, at which point the mark to market price comes from the market data source's final settlement price.

Mark to market settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party, and the process is repeated each time the mark price changes until the maturity date for the market is reached.

:::note Read more
[Concept: Mark to market settlement](./settlement.md#mark-to-market-settlement)
:::

## Margin
Margin is the amount of collateral required to keep your position open. When a party on Vega opens a position, the minimum amount of assets required to open that position is put into a margin account for that party in that market.

There are two ways the protocol lets you manage your leverage: cross-market margin or isolated margin. You can switch between the margin modes as long as you have enough to support the margin requirement for your potential position in the new mode.

* **Cross margining** provides a capital-efficient use of margin, particularly when trading on multiple markets using the same settlement asset. You can't control the amount of margin (and thus leverage) that you use on your position but the market sets money aside and returns it if it's not required.
* **Isolated margin** provides a way to control how much you set aside for margin and thus choose your leverage amount. The amount of margin set aside is static, unless you increase your position. If the market turns against your position, it could be closed out more quickly. 

Cross margining is the default mode, so to use isolated margin you'll need to switch before submitting your order. Once you choose isolated margin on a market, your orders will use continue to use that mode unless you update it to cross margining.

Overall, the margin tolerance of open orders and positions is determined by the market's risk model and market conditions. The larger the position and the more volatile the market, the greater the amount of margin that will need to be set aside. The volatility tolerance of the market is driven by the risk model.

When placing order on a market, you can set your margin factor when using isolated margin, or the protocol will calculate the initial margin required, when using cross margining. The required funds will be moved into a margin account for that market. If your key's general account doesn't have enough in it to fund this, the order will be rejected.

:::tip Try it out
[Use Console ↗](https://console.fairground.wtf) to trade using isolated margin or cross margin.

Or [use the update margin mode command](../../api/grpc/vega/commands/v1/commands.proto.mdx) to submit the transaction yourself.

Switching between modes may change your margin requirements.
:::

### Isolated margin
To set the amount of leverage you want for an order, use isolated margin. Margin can be isolated per order and position with isolated margin mode. You choose how much to set aside for the lifetime of each order and position, per market, depending on how much leverage you want. That fraction of your order's notional size is moved to an order margin account.

The margin needs to fall between the following bounds:
* Greater than 0% and less than or equal to 100%
* Greater than the [initial margin](#margin-level-initial) level
* Greater than `max(risk factor long, risk factor short)`

If that margin is depleted, your open position is closed. Any other positions that aren't distressed will remain open, and any open orders also stay open.

### Cross margining
Cross-market margin allows you to trade in a capital-efficient way. Cross margining means gains on one market can be released and used as margin on another. It's supported between all markets that use the same settlement asset.

The amount of margin set aside can change depending on how your position is impacted by your own actions and price movements in the market. Orders that increase your open volume will increase the required margin. Orders that decrease it should not increase your margin requirements - unless you end up opening a position in the opposite direction.

Over the course of the position's lifetime, the margin requirements will likely change - the margin account may be topped up, and/or some margin is released back to collateral. If you are trading on more than one market that uses the same asset, the collective positions on those markets will inform how much is set aside for margin.

`[margin account balance] = [initial margin requirement] + [unrealised profit] OR - [unrealised losses]`

The margin amount required for cross margining is recalculated every time marking to market is done. The protocol takes the current market price and recalculates every trader's margin requirements based on how their position is affected by price moves.

:::note Go deeper
**[Whitepaper: Automated cross margining ↗](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21)** - Section 6 of the protocol whitepaper.
:::

### Margin requirements
The Vega protocol calculates margin levels, which are used to determine when a trader has the right amount, too much, or not enough margin set aside to support their position(s).

The margin levels try to ensure that a trader does not enter a trade that will immediately need to be closed out.

Not all levels are relevant to both margin methods. 

The margin levels for active positions are:

* maintenance margin - relevant for cross and isolated margin
* initial margin - relevant for cross and isolated margin
* search level - only for cross margin
* collateral release level - only for cross margin

Margin level for a potential position using isolated margin:
* order margin - only for isolated margin

The maintenance margin (minimum amount needed to keep a position open) is derived from the market's risk model and includes some slippage calculations. This is applicable to positions using either margin mode. 

All other margin levels are based on the maintenance margin level.

### Margin level: Maintenance
Throughout the life of an open position, there is a minimum required amount to keep a position open, even through probable adverse market conditions, called the maintenance margin. This minimum margin amount is calculated for positions using both cross margining and isolated margin.

The amount required for your maintenance margin is derived from the market's risk model. Specifically, it's based on a risk measure called the expected shortfall, used to evaluate the market risk of the position and any open orders.

If your margin balance drops below the maintenance margin level, your position may be [closed out](./market-protections.md#closeouts).

For [perpetual futures markets](./market-types.md#perpetual-futures), the margin calculations contain additional term to capture the exposure of a given position to an upcoming funding payment. The market proposal includes a margin funding factor that determines to what degree the funding payment amount impacts a trader's maintenance margin. This can only increase the margin requirement if a given position is expected to make a payment at the end of the current funding period, but it will never decrease the margin requirement, even if you are expecting to receive a funding payment.

:::note Go deeper
**[Spec: Perpetuals payment calculations ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0053-PERP-product_builtin_perpetual_future.md#funding-payment-calculation)**
:::

#### Margin slippage
Maintenance margin is calculated as: 

```
maintenance margin = price x (linear slippage factor x |position| x position^2) + price x |position| x size x risk factor
```

Slippage factors are market parameters that specify by how much the liquidity component of the margin calculation is dependent on the position size in a low-volume market scenario.

If there is enough volume on the book, the slippage comes directly from the book and the liquidity component is not used. Margin slippage in a low-volume scenario is calculated as `slippageFromFactors = linear x position x position^2) x price`. If there is a lot of liquidity on the book, the protocol calculates the closeout amount and provides the lower amount, i.e., the liquidity part of the margin `min(slippageFromFactors, slippageFromBook)`. Increasing the linear slippage factor increases the liquidity part of the margin calculation, but only if there is little volume on the book; if there is enough volume on the book the slippage comes directly from the book.

The `risk factor` will be different for short and long positions; the risk model provides `risk factor long` for when `position > 0` and `risk factor short` for when `position < 0`.

Note that your limit orders are included as well and the maintenance margin is calculated for the riskiest long or short combination of orders and position.

:::note Read more
[Concept: Closeouts](./market-protections.md#closeouts)
[Concept: Risk model parameters](../governance.md#risk-models-and-parameters)
:::

### Margin level: Initial
The *initial margin level* has two different functions, depending on which margin mode you're using.

For *cross margin mode*, it sets the amount that will be transferred from a trader's general account to be used as margin when an order is placed or a trade is executed. The initial margin is more than the absolute minimum needed to support a position, as it offers a cushion to keep a position open as the mark price changes.

In *isolated margin mode*, it determines the minimum margin amount you can set for the given order size on the market. This provides your potential position with more than the bare minimum needed to keep it open at the current market price.

The initial margin is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `initial_margin` scaling factor, which is set by a network parameter: 
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors" />.

`[initial margin level] = [maintenance margin] x [initial_margin scaling factor]`

The initial margin level being higher than the *margin search level* (which itself is higher than the *maintenance margin level*) ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral immediately after a trade has been entered into.

### Margin level: Order
When using isolated margin mode, you can choose the leverage you're comfortable with, and the amount of margin required to support that is transferred to your margin account. If you place additional orders that increase your position, the margin required also increases. The amount above what's in your margin account that is needed to support your orders is the order margin. 

This extra margin is moved into an order margin account. If your order turns into a position, the extra margin for that position moves into your margin account.

For open orders, if the required order margin is higher than the balance in your order margin account, your orders will be cancelled and that margin collateral will be returned to your general account. If you have a position open on the market, it will stay open. 

### Margin level: Searching for collateral
For a trader using cross margining, if the balance available in your margin account is less than the position's *margin search level*, but is still above the maintenance level -- the network will try to allocate more money, up to the current initial margin level, from your general account to be used for margin.

If the margin account can be topped up, then the position stays open. If that's not possible because there are insufficient funds in the general account, and the market keeps moving against you so that the margin account balance drops below the current maintenance level, your position may be closed out. The first step is to cancel all of the trader's open orders and reevaluate the margin requirements. If the margin account balance is then higher than the maintenance margin level, the trader's position remains open, otherwise the protocol will attempt a liquidation.

In most cases, the allocated margin should cover market swings so that collateral search is attempted first as described above, however in extreme cases the market move could be so large as to immediately proceed to the liquidation step.

The search level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `search_level` scaling factor, which is set by a network parameter: 
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors" />.

`[search level] = [maintenance margin] x [search_level scaling factor]`

If there is not enough collateral to provide the required margin, then the position will be closed out.

:::note Read more
[Concept: Closeouts](./market-protections.md#closeouts)
:::

### Margin level: Releasing collateral
When using cross margin mode, if your margin balance exceeds the *collateral release level*, the position is considered overcollateralised. The excess money is released to your general account, to get your margin back to the *initial margin level*.

Those gains can then be withdrawn or used as collateral for other trades.

The release level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `collateral_release` scaling factor, which is set by a network parameter:
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors"/>.

`[release level] = [maintenance margin] x [collateral_release scaling factor]`

### Example: Calculating margin on open orders

For those using cross margining, the network calculates the overall long / short position including the submitted order. Depending on which one is larger a long or short risk factor is used for margin calculation. The maintenance margin (for futures) is then a product of the largest position, the corresponding risk factor and the `mark price`. Risk factors capture the outcome of the probabilistic distribution of future market moves, and are market specific.

:::note Go deeper
**[Whitepaper: Margins and credit risk ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf)** - Section 6 of the protocol whitepaper.
:::


* In the following scenario, the trader, using cross margining mode,  posts a sell order of size 1 that doesn't trade on submission and ends up being added to the order book
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

* In the following scenario, the trader has an open short position of size 1, and no open orders, using the cross margining mode
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
