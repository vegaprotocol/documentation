---
sidebar_position: 5
title: Rewards and penalties
vega_network: MAINNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Liquidity providers earn [rewards](#rewarding-liquidity-providers) for providing enough liquidity. 

If you are an LP and you can’t support your liquidity commitment financially, you will be [penalised](#penalties-for-not-supporting-orders). 

If you don't have liquidity on the book to meet the minimums required by the [SLA](#liquidity-sla), you won’t receive any rewards and will also be [penalised](#penalties-for-not-meeting-sla).

## Rewarding liquidity providers
Liquidity providers earn from the fees paid by takers on the market. How much you are rewarded depends on: 
* Your relative commitment
* How early in the market’s lifecycle you committed 
* How you perform against the liquidity SLA

Note: During an auction uncrossing, an LP’s orders will not need to provide liquidity or enable trades. However, you must maintain your liquidity commitment, and orders are placed back on the order book when normal trading resumes.

## Community-funded LP rewards
In addition to the income made from fees, anyone can fund reward pools that will pay out to liquidity providers at the end of each [epoch](../vega-chain/network.md#epochs), based on the proportion of fees the LPs have received.

:::note Read more
Learn more about this, and trading rewards in general on the [rewards](../trading-on-vega/discounts-rewards.md) page.
:::

## Earning liquidity fees
Liquidity providers receive a cut of the fees paid by price takers on each trade.
 
The amount each liquidity provider receives depends on:
* The percentage of a trade's value that is collected from the price taker for each trade, and combined in a pool to be paid to liquidity providers. This is called the liquidity fee
* Performance against the [liquidity SLA](#liquidity-sla), which defines what percentage of your bond is used to provide orders, and for how long it needs to be on the book. If you do not meet the SLA minimum, you do not get any revenue from the liquidity fee
* Your equity-like share of the market, which is based on the relative size of their commitment amount, and when you committed liquidity to the market. Liquidity providers who commit to a market early benefit from helping to grow the market by getting a higher share of the fee revenue
* LP’s liquidity score, which is the average volume-weighted probability of trading of all their orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders)
 
Read more about how it works: [Dividing liquidity fees among LPs](#dividing-liquidity-fees-among-lps) 

### Liquidity SLA
When committing to provide liquidity, you enter into an agreement to receive a portion of fees paid by traders in return for keeping the market liquid.

The terms of that agreement, called the liquidity SLA, are that each LP needs to have a certain percentage of their commitment amount on the order book for a minimum amount of time in each epoch.

The percentage of your commitment amount and minimum time are set for each individual market. You can [query a market details](../../api/rest/data-v2/trading-data-service-get-market.api.mdx) or review a market's [governance proposal](../../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) to see the SLA requirements.

These include:
* [LP price range](provision.md#price-range-for-liquidity-orders) - A price range, set from the mid-price outwards, that your orders must be within to count towards meeting the SLA.
* Minimum time on book - The fraction of time in an epoch that you must spend on the book providing your liquidity obligation.
* Competition factor - If you meet the SLA but another liquidity provider exceeds it, you may forefit some of your accrued fees to that provider. The value is a factor that's converted to a percentage.

Doing less than the minimum means liquidity fee payments will be withheld for that epoch, it will have an impact on [future fee revenue earnings](#penalties-for-not-meeting-sla), and a sliding penalty will be applied to your bond. Everything at, or above, the minimum means some amount of your accrued fee amount will be paid. The better you do against the SLA, the more fee revenue you'll receive.

<!--
Read more: How SLA performance is calculated (spec when out of CE branch)
-->

### Determining the liquidity fee percentage

1. Each liquidity provider submits their desired liquidity fee factor in the liquidity commitment transaction. It’s a number between 0 and 1. The final fee factor is converted into a percentage. Every LP’s proposed fee factor goes into determining the actual fee each trader will pay on a trade in that market.
2. The liquidity orders submitted are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom.
3. The market's 'winning' fee depends on the liquidity required for the market (target stake) and the amount committed from each bidder. The protocol processes the LP commitments from top to bottom, adding up the commitment amounts until it reaches a level equal to, or greater than, the target stake. When that point is reached, the proposed fee that was provided with the last processed liquidity commitment is used. Initially, before a market opens for trading, the market's initial liquidity fee is the lowest proposed, because the market’s target stake is zero.
4. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower, and whatever the proposed fee factor.
5. This fee percentage can change. Once the market passes governance and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated. Liquidity providers amending or cancelling their commitments will also lead to the fee factor changing.


<details><summary>Liquidity fee example</summary>
<p>
In the example below, there are 3 liquidity providers all bidding for their chosen fee level, with the lowest fee bid at the top, and the highest at the bottom.


* [LP 1 stake = 120 ETH, LP 1 liquidity-fee-factor = 0.5%]
* [LP 2 stake = 20 ETH, LP 2 liquidity-fee-factor = 0.75%]
* [LP 3 stake = 60 ETH, LP 3 liquidity-fee-factor = 3.75%]


* If the target stake = 119 then the needed liquidity is given by LP 1, thus the market's liquidity-fee-factor is the LP 1 fee: 0.5%.
* If the target stake = 123 then the needed liquidity is given by the combination of LP 1 and LP 2, and so the market's liquidity-fee-factor is LP 2 fee: 0.75%.
* If the target stake = 240 then all the liquidity supplied above does not meet the estimated market liquidity demand, and thus the market's liquidity-fee-factor is set to the highest, LP 3's fee: 3.75%.


</p>
</details>


### Dividing liquidity fees among LPs
The market's liquidity fee and the trading volume determine how big the market’s liquidity fee pool is.

How the pool’s assets are divided depends on your:
* [Equity-like share](./provision.md#equity-like-share) of the market
* Ability to meet the [SLA](#liquidity-sla)
* Liquidity score

Equity-like share: Because an LP who committed to a market early provided a larger proportion of the commitment earlier on, you continue to keep that larger share of fees even once other parties are also committing liquidity to the market, assuming you meet the SLA.

Liquidity score: Your liquidity score is the average volume-weighted probability of trading of all the orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders), averaged over the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providersFeeCalculationTimeStep" hideName={false} />. It's calculated for all orders placed by the liquidity provider.

Generally speaking, an order's probability of trading decreases the further away from the mid-price it is placed, so all other things being constant, the provider who places orders closer to the mid-price will receive a higher fraction of the fees than someone who places orders further away. Furthermore, the probability of trading is set to 0 outside the narrowest price monitoring bounds, so any orders deployed there will decrease the liquidity score.

:::note Go deeper
* [LP equity-like share calculations ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-liquidity-provider-equity-like-share): See the variables that go into calculating a liquidity provider's share.
* [Average volume-weighted probability of trading ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-the-liquidity-score): Learn more about how liquidity score is calculated and used.
:::

### How liquidity fees are distributed
The liquidity fee amount is collected from traders on every trade, and held in a separate account. This account is under the network’s control.

How often fees are distributed is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providersFeeCalculationTimeStep" hideName={false} />. Starting with the end of the market's opening auction, every time the time-step has been hit, the balance in the account is transferred to each liquidity provider's margin account for the market. This depends on your share and how well you performed against the SLA.

<details><summary>Fee distribution example</summary>
<p>
A market has 4 LPs with equity-like share. Each LP has the same liquidity score and meets but does not exceed the SLA:

* LP 1 share = 0.65
* LP 2 share = 0.25
* LP 3 share = 0.1

Participants trade on the market, and the `trade value for fee purposes` multiplied by the `liquidity fee factor` equals 103.5 ETH (the market's settlement asset).

Thus, the following amounts are then transferred to each LP's margin account once the time-step elapses:

* LP 1 receives: 0.65 x 103.5 = 67.275 ETH
* LP 2 receives: 0.25 x 103.5 = 25.875 ETH
* LP 3 receives: 0.10 x 103.5 = 10.350 ETH


</p>
</details>

## Penalties for not fulfilling liquidity commitment

### Penalties for not meeting SLA

Not meeting the SLA deprives you of all liquidity fee revenue, and a sliding penalty is applied to your bond amount. How much penalty is based on the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.sla.nonPerformanceBondPenaltySlope" />. It determines how steeply the bond penalty increases linearly, until it reaches the maximum. The maximum penalty that can be charged is capped by the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.sla.nonPerformanceBondPenaltyMax" /> network parameter.

See the full calculation in the [setting fees and rewarding LPs spec ↗](https://github.com/vegaprotocol/specs/blob/cosmicelevator/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-the-sla-performance-penalty-for-a-single-epoch).

Not meeting the SLA will also affect future fee revenue, even in epochs when the SLA is met. The number of epochs that are used to determine performance is called the `performanceHysteresisEpochs`. This number is defined in a market's parameters. If the parameter is set to 0, it will only count the just-completed epoch. If set to 1, the fee revenue is impacted by the just-completed epoch and the one before.

If you decrease or cancel your liquidity commitment below the market's target stake, you may forfeit some of your bond. This is called the early exit penalty.

You can [query a market details](../../api/rest/data-v2/trading-data-service-get-market.api.mdx) or review a market's [governance proposal](../../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) to see how the past performance will impact rewards, and what the early exit penalty is set at.

### Penalties for not supporting orders 
Not being able to support the orders you posted using funds in your general and/or margin accounts will put you at risk of closeout, and can put the market into a situation where there is not enough liquidity.

If the liquidity provider's margin account doesn't have enough funds to support the orders, the protocol will take funds from your liquidity commitment bond to cover the shortfall. A penalty will be applied, and funds to cover the shortfall and pay the penalty will be transferred from the provider’s bond to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in your liquidity commitment.

Should the funds in the bond account drop to 0, you will be marked for closeout and your orders will be cancelled. If this puts the market into a state where it isn’t meeting the target stake, the market will go into a liquidity monitoring auction. If this happens while the market is transitioning from auction mode to continuous trading, you will not be penalised.

:::note Read more
[Liquidity monitoring](./../trading-on-vega/market-protections#liquidity-monitoring)
:::

#### Calculation of penalty for not supporting orders
The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* <NetworkParameter frontMatter={frontMatter} param="market.liquidity.bondPenaltyParameter" hideName={false} hideValue={true} /> can be changed through governance.
* shortfall refers to the absolute value of the funds that: 
  * the liquidity provider was unable to cover through margin and general accounts
  * are needed for settlement
  * are needed to meet the margin requirements