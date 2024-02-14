---
sidebar_position: 3
title: Margin and leverage
hide_title: false
description: How margin is calculated and used.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Trading margined derivatives (such as futures) allows you to create leveraged positions, meaning you only need some of the notional value of an instrument to place orders.

Margin is the amount of the market's settlement asset that's required to keep your positions open and orders funded. You can think of margin as the 'down payment' to open a position. Leverage, meanwhile, describes how many times larger is the notional value of that position compared to the margin you have dedicated to it. 

For example, if you need 20 DAI to open a position worth 100 DAI: your leverage is 5x and your initial margin is 20% of the full value.

Hypothetical changes in a position's value are called unrealised profit and loss.

## Margin modes

There are two ways the protocol lets you manage your leverage: cross-market margin or isolated margin. You can switch between the margin modes as long as you have enough to support the margin requirement for your potential position in the new mode.

* **Cross margining** provides a capital-efficient use of margin, particularly when trading on multiple markets using the same settlement asset. You can't control the amount of margin (and thus leverage) that you use on your position but the market sets money aside and returns it if it's not required.
* **Isolated margin** provides a way to control how much you set aside for margin and thus choose your leverage amount. The amount of margin set aside is static, unless you increase your position. If the market turns against your position, it could be closed out more quickly.

Cross margining is the default mode, so to use isolated margin you'll need to switch before submitting your order. Once you choose isolated margin on a market, your orders will continue to use that mode unless you update it to cross margining.

Overall, the margin tolerance of open orders and positions is determined by the market's risk model and market conditions. The larger the position and the more volatile the market, the greater the amount of margin that will need to be set aside. The volatility tolerance of the market is driven by the risk model.

When placing order on a market, you can set your margin factor when using isolated margin, or the protocol will calculate the initial margin required, when using cross margining. The required funds will be moved into a margin account for that market. If your key's general account doesn't have enough in it to fund this, the order will be rejected.

:::tip Try it out
[Use Console ↗](https://console.fairground.wtf) to trade with cross margin or isolated margin. The leverage slider lets you set your isolated margin level.

Or [use the update margin mode command](../../api/grpc/vega/commands/v1/commands.proto.mdx#updatemarginmode) to submit the transaction yourself.

Switching between modes may change your margin requirements.
:::

### Isolated margin
To set the amount of leverage you want for an order, use isolated margin. Margin can be isolated per order and position with isolated margin mode. You choose how much to set aside for the lifetime of each order and position, per market, depending on how much leverage you want. That fraction of your order's notional size is moved to an order margin account.

The margin needs to fall between the following bounds:
* Greater than 0% and less than or equal to 100%
* Greater than the [initial margin](#margin-level-initial) level
* Greater than `max(risk factor long, risk factor short)`

If that margin is depleted, your open position is closed. Any other positions that aren't distressed will remain open, and any open orders also stay open.

When switching to isolated margin mode, the network will calculate how much needs to be moved from, or returned to, your general account. 

For *active positions* the calculation is: 
`average entry price * abs(position) * margin factor`

For *active orders* the calculation is: 
`limit price * remaining size * margin factor`, added to the difference calculated for active positions.
* For example, if you have an open long position size 5, and you place a short order size 8, then the remaining size is 8-5=3.

### Cross margining
Cross-market margin allows you to trade in a capital-efficient way. Cross margining means gains on one market can be released and used as margin on another. It's supported between all markets that use the same settlement asset.

The amount of margin set aside can change depending on how your position is impacted by your own actions and price movements in the market. Orders that increase your open volume will increase the required margin. Orders that decrease it should not increase your margin requirements - unless you end up opening a position in the opposite direction.

Over the course of the position's lifetime, the margin requirements are likely to change - the margin account may be topped up, and/or some margin is released back to collateral. If you are trading on more than one market that uses the same asset, the collective positions on those markets will inform how much is to be set aside for margin.

`[margin account balance] = [initial margin requirement] + [unrealised profit] OR - [unrealised losses]`

The margin amount required for cross margining is recalculated every time marking to market is done. The protocol takes the current market price and recalculates every trader's margin requirements based on how their position is affected by price moves.

:::note Go deeper
**[Whitepaper: Automated cross margining ↗](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21)** - Section 6 of the protocol whitepaper.
:::

## Margin requirements
The Vega protocol calculates margin levels, which are used to determine when a trader has the right amount, too much, or not enough margin set aside to support their position(s).

The margin levels try to ensure that a trader does not enter a trade that will be closed out immediately.

Not all levels are relevant to both margin methods. 

The margin levels for active positions are:

* [maintenance margin](#margin-level-maintenance) - relevant for cross and isolated margin
* [initial margin](#margin-level-initial) - relevant for cross and isolated margin
* [search level](#margin-level-searching-for-collateral---cross-only) - only for cross margin
* [collateral release level](#margin-level-releasing-collateral---cross-only) - only for cross margin

Margin level for a potential position using isolated margin:

* [order margin](#margin-level-order---isolated-only) - only for isolated margin

The maintenance margin (minimum amount needed to keep a position open) is derived from the market's risk model and includes some slippage calculations. This is applicable to positions using either margin mode. 

All other margin levels are based on the maintenance margin level.

### Margin level: Maintenance
Throughout the life of an open position, there is a minimum required amount to keep a position open, even through probable adverse market conditions, called the maintenance margin. 

This minimum margin amount is calculated for positions using both cross margining and isolated margin.

The amount required for your maintenance margin is derived from the market's risk model. Specifically, it's based on a risk measure called the expected shortfall, used to evaluate the market risk of the position and any open orders.

If your margin balance drops below the maintenance margin level, your position may be [closed out](./market-protections.md#closeouts).

For [perpetual futures markets](./market-types.md#perpetual-futures), the margin calculations contain an additional term to capture the exposure of a given position to an upcoming funding payment. The market proposal includes a margin funding factor that determines to what degree the funding payment amount impacts a trader's maintenance margin. This can only increase the margin requirement if a given position is expected to make a payment at the end of the current funding period, but it will never decrease the margin requirement, even if you are expecting to receive a funding payment.

:::note Go deeper
**[Spec: Perpetuals payment calculations ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0053-PERP-product_builtin_perpetual_future.md#funding-payment-calculation)**
:::

Maintenance margin is calculated as: 

```
maintenance margin = min(mark price x linear slippage factor x |position|, slippage per unit x |position|) + mark price x |position| x risk factor
```

The `risk factor` will be different for short and long positions; the risk model provides `risk factor long` for when `position > 0` and `risk factor short` for when `position < 0`.

Note that your limit orders are included as well, and the maintenance margin is calculated for the riskiest long or short combination of orders and position.

#### Margin slippage
Markets include a linear slippage factor to be used in low-volume market scenarios, where the standard slippage calculation isn't sufficient. In effect, it caps the margin level when the market wouldn't be able to support a position's margin increasing.

Margin slippage in a low-volume scenario is calculated as `slippageFromFactor = linear factor x position x price`.

If there is enough volume on the book, the slippage comes directly from the book and the linear slippage factor isn't used.

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

### Margin level: Order - isolated only
When using isolated margin mode, you can choose the leverage you're comfortable with, and the amount of margin required to support that is transferred to your margin account. If you place additional orders that increase your position, the margin required also increases. The amount above what's in your margin account that is needed to support your orders is the order margin. 

This extra margin is moved into an order margin account. If your order turns into a position, the extra margin for that position moves into your margin account.

For open orders, if the required order margin is higher than the balance in your order margin account, your orders will be cancelled and that margin collateral will be returned to your general account. If you have a position open on the market, it will stay open. 

### Margin level: Searching for collateral - cross only
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

### Margin level: Releasing collateral - cross only
When using cross margin mode, if your margin balance exceeds the *collateral release level*, the position is considered overcollateralised. The excess money is released to your general account, to get your margin back to the *initial margin level*.

Those gains can then be withdrawn or used as collateral for other trades.

The release level is scaled from the *maintenance margin* amount. It's calculated by multiplying the maintenance margin amount by the `collateral_release` scaling factor, which is set by a network parameter:
<NetworkParameter frontMatter={frontMatter} param="market.margin.scalingFactors"/>.

`[release level] = [maintenance margin] x [collateral_release scaling factor]`

### Example: Calculations for cross margin open orders

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

### Example: Calculations for cross margin open position
The following calculation takes into account slippage, as seen on an order book.

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

## Mark to market
Marking to market refers to settling gains and losses due to changes in the market value. Marking to market aims to provide a realistic appraisal of a position based on the current market conditions.

If the market price goes up, traders that hold long positions receive money into their margin account – equal to the change in the notional value of their positions – from traders that hold short positions, and conversely if the value goes down, the holders of short positions receive money from the holders of long positions.

The mark to market frequency is controlled by a network parameter: <NetworkParameter frontMatter={frontMatter} param="network.markPriceUpdateMaximumFrequency" />. 

Mark to market settlement instructions are generated based on the change in market value of the open positions of a party. When the mark price changes, the network calculates settlement cash flows for each party, and the process is repeated each time the mark price changes until the maturity date for the market is reached.

When a dated futures market settles at expiry, the mark price comes from the market data source's final settlement price.

:::note Read more
[Concept: Mark to market settlement](./settlement.md#mark-to-market-settlement)
:::

## Mark price
The mark price represents the current market value, and is used to determine the value of a trader's open position against the prices the trades were executed at, to determine the cash flows for mark to market settlement and funding payments.

The default mark price is the last traded price. Mark price calculations can also use additional price synthesis methods that can take into account trades, the order book, oracle inputs and update recency and can be combined via medians or weighted means.

For perpetual futures markets, there’s also the market price for funding payments, the calculations can also use additional price synthesis methods the same way as the mark price.

How mark price is calculated is configured per market, and can be changed with a governance proposal to update a market.

### Mark price algorithms 
The current mark price algorithms that can be used in a market configuration are described below.

1. Last traded price
When the mark price is set to be the last traded price, this means it is set after each order transaction is processed from a sequence of transactions with the same timestamp, provided that at least <NetworkParameter frontMatter={frontMatter} param="network.markPriceUpdateMaximumFrequency" hideName="true" /> has elapsed since the last mark price update.

For example, say the maximum frequency is set to 10 seconds.

The mark price was last updated to $900, 12 seconds ago. There is a market sell order for -20 and a market buy order for +100 with the same timestamp. 

The sell order results in two trades: 15 @ 920 and 5 @ 910. The buy order results in 3 trades: 50 @ $1000, 25 @ $1100 and 25 @ $1200. 

The mark price changes once to a new value of $1200.

Now 8 seconds has elapsed since the last update. There is a market sell order for 3 that executes against book volume as 1 @ 1190 and 2 @ 1100. The mark price isn't updated because the 10 second maximum frequency has not elapsed yet.

Then 10.1 seconds has elapsed since the last update and there is a market buy order for 5 that executes against book volume as 1 @ 1220, 2 @ 1250 and 2 @ 1500. The mark price is then updated to 1500.

2. Flexible mark price methodology
The mark price methodology can also be fine-tuned per market:

* Decay weight is a parameter controlling to what extent observation time impacts the weight in the mark price calculation. 0 implies uniform weights.
* Decay power is a parameter controlling how quickly the weight assigned to older observations should drop. The higher the value, the more weight is assigned to recent observations.
* Cash amount, in asset decimals, used in calculating the mark price from the order book.
* Weights determine how much weight goes to each composite price component. The order of sources used is as follows: price by trades, price by book, oracle_1, ... oracle_n, median price.
* Staleness tolerance for data source. How long a price source is considered valid. This uses one entry for each data source, such that the first is for the trade-based mark price, the second is for the order book-based price, and the third is for the first oracle, followed by any other data source staleness tolerance.
* Type of composite price, weighted, median or last trade. 
    * Weighted: Composite price is calculated as a weighted average of the underlying mark prices.
    * Median: Composite price is calculated as a median of the underlying mark prices.
    * Last trade: Composite price is calculated as the last trade price.
