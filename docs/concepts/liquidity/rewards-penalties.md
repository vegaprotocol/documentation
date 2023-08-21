---
sidebar_position: 5
title: Rewards and penalties
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Liquidity providers earn [rewards](#rewarding-liquidity-providers) for providing enough liquidity. LPs who can’t support their liquidity commitment financially are [penalised](#penalties-for-not-fulfilling-liquidity-commitment). If an LP doesn’t have liquidity on the book to meet the minimums required by the [SLA](#liquidity-sla), they won’t receive any rewards.

## Rewarding liquidity providers
Liquidity providers earn from the fees paid by takers on the market. How much LPs are rewarded depends on: 
* A provider's relative commitment
* How early in the market’s lifecycle they committed 
* How they perform against the liquidity SLA

Note: During an auction uncrossing, an LP’s orders will not need to provide liquidity or enable trades. However, they must maintain their liquidity commitment and their orders are placed back on the order book when normal trading resumes.

## Community-funded LP rewards
In addition to the income made from fees, anyone can fund reward pools that will pay out to liquidity providers at the end of each epoch, based on the proportion of fees they have received.

:::Read more
Learn more about this, and trading rewards in general on the [fees and rewards](../trading-on-vega/fees-rewards) page.
:::

## Earning liquidity fees
Liquidity providers receive a cut of the fees paid by price takers on each trade.
 
The amount each liquidity provider receives depends on:
* The percentage of a trade's value that is collected from the price taker for each trade, and combined in a pool to be paid to liquidity providers. This is called the liquidity fee (link to derived)
* Their performance against the [liquidity SLA](#liquidity-sla), which defines what percentage of an LP’s bond is used to provide orders, and for how long it needs to be on the book. If an LP does not meet the SLA minimum, they do not get any revenue from the liquidity fee
* LP’s equity-like share of the market, which is based on the relative size of their commitment amount, and when they committed liquidity to the market. Liquidity providers who commit to a market early benefit from helping to grow the market by getting a higher share of the fee revenue
* LP’s liquidity score, which is the average volume-weighted probability of trading of all their orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders)
 
Read more about how it works: [Dividing liquidity fees among LPs](#dividing-liquidity-fees-among-lps) 

### Liquidity SLA
[WIP]
When committing to provide liquidity, an LP enters into an agreement to receive a portion of fees paid by traders in return for keeping the market liquid.

The terms of that agreement, called the liquidity SLA, are that each LP needs to have (market.liquidity.slaCompetitionFactor %) of their commitment amount on the order book for (net param % market.liquidity.commitmentMinTimeFraction) of each epoch.

Doing less than the minimum means liquidity fee payments being withheld for that epoch, and it will have an impact on future fee revenue earnings (hysteresis link). Everything at or above the minimum means some amount of the LP’s accrued fee amount will be paid to them. The better an LP does against the SLA, the more fee revenue they’ll receive. 

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

How the pool’s assets are divided depends on the liquidity provider’s:
* [Equity-like share](./provision.md#equity-like-share) of the market
* Ability to meet the [SLA](#liquidity-sla)
* Liquidity score

Equity-like share: Because an LP who committed to a market early provided a larger proportion of the commitment earlier on, they continue to keep that larger share of fees even once other parties are also committing liquidity to the market, assuming they meet the SLA.

Liquidity score: An LP’s liquidity score is the average volume-weighted probability of trading of all their orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders), averaged over the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.calculationTimeStep" hideName={false} />. It's calculated for all orders placed by the liquidity provider.

Generally speaking, an order's probability of trading decreases the further away from the mid-price it is placed, so all other things being constant, the provider who places orders closer to the mid-price will receive a higher fraction of the fees than someone who places orders further away. Furthermore, the probability of trading is set to 0 outside the narrowest price monitoring bounds, so any orders deployed there will decrease the liquidity score.

:::note Go deeper
* [LP equity-like share calculations](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-liquidity-provider-equity-like-share): See the variables that go into calculating a liquidity provider's share.
* [Average volume-weighted probability of trading](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-the-liquidity-score): Learn more about how liquidity score is calculated and used.
:::

### How liquidity fees are distributed
The liquidity fee amount is collected from traders on every trade, and held in a separate account. This account is under the network’s control.

How often fees are distributed is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.calculationTimeStep" hideName={false} />. Starting with the end of the market's opening auction, every time the time-step has been hit, the balance in the account is transferred to each liquidity provider's margin account for the market, depending on their share and how well they met the SLA.

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
Not meeting the SLA deprives an LP of all liquidity fee revenue, but no extra penalties are applied. However, not meeting the SLA will affect future fee revenue even in epochs when the SLA is met. 

The number of epochs over which past performance will continue to affect rewards is determined by the network parameter: `market.liquidity.performanceHysteresisEpochs`

<!--
Go deeper: link to spec for calculations (still cosmic elevator branch)
-->

### Penalties for not supporting orders 
Not being able to support the orders you posted using funds in your general and/or margin accounts will put you at risk of closeout, and can put the market into a situation where there is not enough liquidity.

If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will take funds from their liquidity commitment bond to cover the shortfall. A penalty will be applied, and funds to cover the shortfall and pay the penalty will be transferred from the provider’s bond to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in their liquidity commitment.

Should the funds in the bond account drop to 0, the liquidity provider will be marked for closeout and their orders will be cancelled. If this puts the market into a state where it isn’t meeting the target stake, the market will go into a liquidity monitoring auction. If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied.

:::note Read more
[Liquidity monitoring](./../trading-on-vega/market-protections#liquidity-monitoring)
:::

#### Calculation of penalty for not supporting orders
The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* <NetworkParameter frontMatter={frontMatter} param="market.liquidity.bondPenaltyParameter" hideName={false} hideValue={true} /> can be changed through governance
* shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement, or are needed to meet their margin requirements