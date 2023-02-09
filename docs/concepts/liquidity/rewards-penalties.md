---
sidebar_position: 5
title: Rewards and penalties
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Liquidity providers receive [rewards](#rewarding-liquidity-providers), through fees, for providing liquidity. Providers who don't uphold their liquidity commitment through their available capital are [penalised](#penalties-for-not-fulfilling-liquidity-commitment).

:::info Read more
[Liquidity provision](provision.md): Liquidity providers can use two tactics to provide liquidity for a market: placing limit orders and committing liquidity.
:::

## Rewarding liquidity providers
Liquidity providers earn from the fees paid by takers on the market. How much providers are paid is calculated automatically and distributed based on how the liquidity was provided (through limit orders or a liquidity commitment), based on a provider's relative commitment and how early in the market’s lifecycle they committed. Once a provider meets their obligation, whether through a combination of limit orders and their liquidity commitment or solely through a commitment, they are eligible to receive their portion of the liquidity fee.

Note: During an auction uncrossing, orders derived from a liquidity providers' commitments will not need to provide liquidity or enable trades. However, providers must maintain their liquidity commitment, and their liquidity orders are placed back on the order book when normal trading resumes.

## Liquidity fees
Liquidity providers receive a cut of the fees paid by price takers. 
   
The amount each liquidity provider receives depends on:
* The market's liquidity fee, or the percentage of a trade's value which is collected from the price taker for every trade, and combined in a pool 
* Their equity-like share of the market, which is based on the relative size of their commitment amount, and when they committed liquidity to the market
* Their liquidity score, which is the average volume-weighted probability of trading of all their orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders), and includes automatically deployed and limit orders
   
The fee percentage determines how much money goes into the pool. How much a provider receives in fees is dependent on when they began to commit liquidity on the market, as liquidity providers who commit to a market early benefit from helping to grow the market (also known as the 'equity-like share').

As part of the liquidity commitment transaction, a liquidity provider submits their desired liquidity fee factor, as a number between 0 and 1. That number is converted to a percentage, and fees are paid on each trade.
   
The proposed fees are used to calculate the actual fee each participant will pay on a trade in that market. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower, and whatever the proposed fee factor. Anyone who submits a commitment becomes a liquidity provider. A provider receives a cut of the fees once, and for as long as, they meet their liquidity obligation.

This fee can change as the market's target stake changes, and / or as liquidity providers change their commitment or stop providing liquidity altogether. 

### How the fee is derived
The liquidity orders submitted are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom. 

The market's 'winning' fee depends on the liquidity required for the market (target stake) and the amount committed from each bidder. Vega processes the LP orders from top to bottom, adding up the commitment amounts until it reaches a level equal to, or greater than, the target stake. When that point is reached, the fee that was provided with the last processed liquidity order is used.

Initially, before a market opens for trading, the target stake is zero, as it's not possible to have a position on a market that's not opened yet. Hence by default the market's initial liquidity fee is the lowest proposed.

Once the market opens and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated.

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

### How liquidity fees are split
By committing liquidity, a liquidity provider gets a share of the market's fees that depends on how trading has grown on the market. This is known as the equity-like share. Liquidity providers who get into a market early benefit from helping to grow the market by earning a larger share of the market's trading fees than their actual commitment would imply.

The market's liquidity fee and the trading volume determine how big the liquidity fee pool is. A provider's equity-like share of the market and their liquidity score determine how that pool is distributed.

The liquidity score is the average volume-weighted probability of trading of all their orders within the [liquidity order price range](provision.md#price-range-for-liquidity-orders), averaged over the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" hideName={false} />. It's calculated for all orders placed by the liquidity provider: automatically deployed and limit orders. 

Generally speaking, an order's probability of trading decreases the further away from the mid-price it is placed, so all other things being constant, the provider who places orders closer to the mid-price will receive a higher fraction of the fees than someone who places orders further away. Furthermore, the probability of trading is set to 0 outside the narrowest price monitoring bounds, so any orders deployed there will decrease the liquidity score.

Because an LP who committed to a market early provided a larger proportion of the commitment earlier on, they continue to keep that larger share of fees even once other parties are also committing liquidity to the market.

:::note Go deeper
* [LP equity-like share calculations](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-liquidity-provider-equity-like-share): See the variables that go into calculating a liquidity provider's share.
* [Average volume-weighted probability of trading](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-the-liquidity-score): Learn more about how liquidity score is calculated and used.
:::

### How liquidity fees are distributed
The liquidity fee amount is collected from traders on every trade, and held in a separate account. This account is under control of the network.

How often fees are distributed is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" hideName={false} />. Starting with the end of the market's opening auction, every time the time-step has been hit, the balance in the account is transferred to each liquidity provider's margin account for the market, depending on their share at the time.

<details><summary>Fee distribution example</summary>
<p>
A market has 4 LPs with equity-like share, and each has the same liquidity score:

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


## Community-funded LP rewards 
In addition to the income made from fees, anyone can fund reward pools that will pay out to liquidity providers at the end of each epoch, based on the proportion of fees they have received. 

:::Read more 
Learn more about this, and trading rewards in general on the [fees and rewards](../trading-on-vega/fees-rewards) page.
:::

## Penalties for not fulfilling liquidity commitment
Not being able to support the orders created from your liquidity commitment with funds in your general and/or margin accounts will put you at risk of closeout, and can put the market into a situation where there is not enough liquidity.

**If a liquidity provider can't cover their commitment**: If the liquidity provider's margin account doesn't have enough funds to support the orders that are derived from their commitment, the protocol will search for funds in the general account for the settlement asset. 

If the general account doesn't have enough collateral to provide the margin to support the orders, then the protocol will transfer the remaining required amount from the liquidity provider's bond account, a penalty will be applied, and funds to cover the shortfall and pay the penalty will be transferred from the provider’s bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in their liquidity commitment.

Should the funds in the bond account drop to 0, the liquidity provider will be marked for closeout and their liquidity commitments will be removed from the market. If there's an imbalance between total and target stake as a result, the market will go into a liquidity monitoring auction.

If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied.

:::note Read more
[Liquidity monitoring](./../trading-on-vega/market-protections#liquidity-monitoring)
:::

### Liquidity penalty calculation
The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

* <NetworkParameter frontMatter={frontMatter} param="market.liquidity.bondPenaltyParameter" hideName={false} hideValue={true} /> can be changed through governance
* shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement, or are needed to meet their margin requirements
