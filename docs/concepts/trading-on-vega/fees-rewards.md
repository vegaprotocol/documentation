---
sidebar_position: 4
title: Fees and trading rewards
hide_title: false
description: Trades can incur fees as well as gain rewards.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

Participants in the Vega network who place orders on the order book, provide liquidity and run the network infrastructure receive the fees that are paid on filled trades and transfers. The protocol does not charge gas fees for interacting with the network.

You can offset some of those fees, or earn even more, by receiving rewards based on trading activity. Rewards can be funded by anyone, and can be in any asset. You can see what rewards are currently available on [vega.xyz ↗](https://vega.xyz/rewards).

Learn about the [fee structure](#trading-fees) and [trading rewards](#trading-rewards) below.

## Trading fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles in a decentralised system.

Fees are incurred on every trade on a market in continuous trading, but it's the price taker who pays the fee. The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) receives some of the trading fees as a reward for placing orders on the book.

The amount a trader pays in fees for each order is the same regardless of how many trades it takes to fill the order. Even though, if an order crosses with more than one other order, multiple trades are created and multiple fees are incurred, in the end they would balance out. See an example fee calculation below.

During a market's opening auction, no fees are collected.

### Fee distribution and breakdown
Fees are calculated when a trade is filled, and paid in the market's settlement currency. The fees due are taken from the collateral in the trader's general account. 

The fee is divided between the maker for the trade, the infrastructure providers, and the liquidity provider(s) for each market.

### Maker fee
The maker portion of the fee is paid by the aggressive party in a trade (the taker), and transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker). This is done as soon as the trade settles.

### Infrastructure fee
The infrastructure portion of the fee is paid to validators as a reward for running the network infrastructure, and transferred to the infrastructure fee pool for the market's settlement asset. It is then distributed to the validators at the end of each epoch, in proportion to the number of tokens they represent. 

Some of the infrastructure fee paid to validators is then distributed to the validators' nominators.

### Liquidity fee
The liquidity portion of the fee is paid by a trader who hits an order on the order book, and is paid to those who [commit liquidity](../liquidity/provision.md#liquidity-commitments) to the market.

It's transferred to a liquidity fee account, and distributed to each liquidity provider's margin account at a defined time (based on network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" />), and depending on how much liquidity they have contributed to the market.

### Fee calculations
At a high level, the trading fee that someone pays is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade
  
#### Fee calculation example
* Trade value for fee purposes: If you were to place an order for 100 at USDC50, the trade value for fee purposes is: *100 x USDC50 = USDC5000*. 
* Fee factor: For this example, each of the 3 fees is *0.001*, meaning total fee factor is *0.003*.
* Trade value and fee factor: *USDC5000 x 0.003 = USDC15*
* The fee is the same regardless of the number of transactions the order needs to be completely filled, as long as they trade at the same price.

Two of the three fee factors are set through network parameters: <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.infrastructureFee" />, <NetworkParameter frontMatter={frontMatter} param="market.fee.factors.makerFee" />. The liquidity fee is set by the liquidity providers on the market.

## Transfer fees
When transferring assets, whether from one Vega key to another, or from a Vega key to a reward pool to fund trading rewards, the party that initiates the transfer needs to pay a fee. The fee amount is taken when the transfer is executed, on top of the total amount to be transferred. It's charged in the same asset that is being transferred.

The fee goes to validators for providing the network infrastructure that supports transfers, and goes into the infrastructure fee pool.

The fee is calculated by multiplying the transfer amount and the <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" /> network parameter.

## Trading rewards
Market participants can also receive rewards for their trading activity, liquidity provision, and for proposing active markets.

Traders can receive bonuses for placing market and/or limit orders that are filled, and keeping positions open. 

Liquidity providers can receive rewards for placing orders that are likely to match. 

Market proposers can receive rewards for proposing markets that draw in trading volume. 

Your reward earnings can grow if you have an activity streak and/or keep earned rewards in your reward account.

See what rewards are currently available on [vega.xyz ↗](https://vega.xyz/rewards).

Earned rewards are paid into a per-asset *reward vesting account*. Each epoch, a percentage of those accumulated rewards are moved into a *reward vested account*. From there, they can be transferred into the general account and withdrawn. How long rewards stay in the *reward vesting account* depends on the lock period that's defined in the transfer proposal that funds the reward.

Rewards are independent from fees, which are paid to validators, liquidity providers, and price makers on each trade.

## Setting rewards
Rewards can be set up by anyone to incentivise certain trading behaviours they want to see on a market (or markets). 

Trading rewards can be defined by the following things:
* Type of activity to be rewarded (and how it's measured)
* An amount to reward
* How long a reward is offered
* How the reward is distributed to those eligible, pro-rata or by rank
* How many epochs a trader's activity is evaluated

Extra rewards for validators can also be set up. Learn more about them on the [validator scores and rewards page](../vega-chain/validator-scores-and-rewards.md#validator-metric-based-rewards).

#### Example: Evaluating reward performance over time
Some rewards measure trader activity over a number of epochs (set per reward). The image below shows how an average of your scores is taken across the window, i.e., the number of epochs chosen for measurement.

<img src="/img/concept-diagrams/reward-score-example.png" width="650"/>

:::tip Try it out
* [How to fund rewards](#how-to-fund-rewards): Get the high-level overview, below.
* [Set up a reward transfer](../../tutorials/assets-tokens/transferring-assets.md): Choose an activity to reward and set up a one-off or recurring transfer to fund it.
:::

### How rewards are scaled
Since rewards can only be provided if they're funded, the [recurring tranfer](../assets/transfers.md#recurring-transfers) that's used to fund those rewards also includes details on how the final reward amount is calculated.

Pro-rata: A participant's reward is scaled based on their activity streak and/or how long they've kept previous reward earnings in their vested rewards account, which will influence how high up the rankings they are.

Rank: A participant's reward is scaled based on where they sit on the list of traders who are eligible for the reward. Those higher up the list receive a higher ratio of the reward for each reward period.

## Available trading rewards
As rewards are distributed based on certain criteria, they need to be defined and measured. Each reward dispatch metric is calculated per party, once at the end of each epoch.

Rewards can be set up to pay those who receive fees (functioning like a 'bonus'), or those who create markets.

Choosing a dispatch metric is a matter of transferring assets to the relevant account type, which then contributes to the reward pool for the metric.

### Fee-based rewards
Fee-based rewards are designed to incentivise trading volume on a given market, and are dependent on how much a participant pays in fees.

Targets for rewards can be set based on one of three categories: 

* Sum of the maker fees a party paid 
* Sum of the maker fees a party received
* Sum of liquidity fees a party received

Each is calculated per market, and assessed per party, relative to the total sum of fees across all parties for the given market. 

When incentivising based on fees paid/received, any participant who, for example, places a market order that is filled, will receive a proportion of the reward amount available. 

**Example**:
Traders on Market X are eligible for rewards based on maker fees paid. 

Party A, trading on Market X, has paid *$100* in maker fees in one epoch. 

The total maker fees paid by all parties in that market is *$10,000*. 

Party A would receive $100 / $10,000 = 1% of the rewards for that epoch.

### Largest traders by position size
The largest traders by position size category rewards traders with consistenly larger positions that rank higher in the standings than other traders, as long as they can keep the positions open.

It measures a trader's time-weighted average position over a set number of epochs to determine how long each trader is able to manage a position that's larger than the positions of other traders, without being closed out. It's also known as the "average position metric".

#### Example of largest traders by position size
The image below shows how the largest traders by positions size is calculated in a single 24-hour epoch.

<img src="/img/concept-diagrams/largest-trader-example.png" width="650"/>

Actions of the example trader in the image above over 24 hours: 
- 00:00 - trader opens a position
- 04:00 - trader closes their position, their average position starts to decrease
- 08:00 - trader reopens their position, their average position starts to increase
- 12:00 - trader reduces their position, their average position starts to decrease

### Most profitable traders
The most profitable traders category rewards high profit in relation to traders' position sizes. A trader's highest relative profit is taken from each epoch in the reward window, and averaged out. Those who have higher relative profits rank better in the standings. It's also known as the "relative return metric".

#### Example of most profitable traders
The image below shows how the most profitable trader's score is calculated across epochs.

<img src="/img/concept-diagrams/most-profitable-trader-example.png" width="650"/>

### Most consistently profitable traders
The most consistently profitable traders category rewards traders with the least amount of variance in their returns while they had a position open on a market in the rewards window. Traders who have similar amount of profit across the epochs, rather than spikes and dips, rank higher in the standings.

This is measured by taking the sum of each trader's mark to market gains and losses, both realised and unrealised, and includes funding gains and losses if trades are on a perpetuals market. It's also known as the "returns volatility metric".

### Market creation rewards 
The market creation reward dispatch metric is designed to incentivise creating markets that attract good trading volume. Rewards are awarded to the proposers of any markets that meet a certain total trade value. 

The threshold for what counts as 'enough' trading volume is a formula that takes into account the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.marketCreationQuantumMultiple" />, as well as the settlement asset's quantum to assess the market's size.

An asset's quantum is defined as an approximation of the smallest 'meaningful' amount of that asset, generally expecting it to be the quantity of the asset valued at approximately the value of 1 USD. An asset's quantum is set in the governance proposal that enabled the asset for use on Vega.

**Example**: 

In a given epoch, 4 markets all reach $10,000 total trade value, which is the threshold value set in the network parameter. 

The proposers of each of those markets qualify for 25% of the market creation reward for that epoch.

:::note Go deeper
[Rewards spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0056-REWA-rewards_overview.md#market-creation-reward-metrics): See the full set of calculations that go into the market creation reward.
:::

#### Reward examples
In the section below are descriptions of potential reward scenarios, including the scopes and dispatch metrics used. 

<details><summary>See reward examples</summary>
<p>
An early liquidity provider who supports the ETH / USDT 1Y Future market wants to encourage people to trade on the market, and as an early adopter of Vega wants to incentivise people to hold VEGA too. That provider would transfer their chosen amount of funds to the relevant reward pool.

Reward Pool 1: 
* Reward asset = VEGA
* Market in scope = ETH / USDT 1Y Future (defined by Market ID)
* Reward metric type = Maker fees paid

This reward pool will transfer VEGA to anyone acting as a price taker and therefore paying maker fees on the market. 

They may later decide that they have successfully driven so much volume that they would like to encourage more liquidity in the market to help supplement their own. In this case they could fund another reward pool.

Reward Pool 2: 
* Reward asset = VEGA
* Market in scope = ETH / USDT 1Y Future
* Reward metric type = Liquidity fees

This will provide an additional incentive for LPs to commit liquidity, since in addition to the liquidity fees they would already receive (in USDT, the settlement asset of the market), they would also receive VEGA proportional to the share of liquidity fees they received for the market.

Finally, they may decide that they also want to provide a reward in the market’s settlement asset rather than solely reward in VEGA. Therefore they transfer funds to an additional reward pool.

Reward pool 3: 
* Reward asset = USDT
* Market in scope = ETH / USDT 1Y Future
* Reward metric type = Maker fees paid

Now, any user that has been a price taker in this market will receive two reward payments at the end of the epoch, once in VEGA and one in USDT, with both proportional to their overall share of maker fees paid in the market. 

</p>
</details>

## How to fund rewards
Trading rewards are all on-chain, and funded when users transfer assets to the reward pool for a particular reward, based on the asset used to pay the reward.

Choosing a reward to fund is a matter of transferring assets to the specific account type.

To fund a single reward pool over multiple epochs, set up a **recurring transfer to a single reward pool** that will keep topping up the reward pool for each epoch, as long as there are funds available in the party's general account.

Another option is to regularly top up multiple reward pools across multiple markets, for a single metric and reward asset, by setting up a **recurring transfer to multiple reward pools**. 

At the end of each epoch, all reward pools are emptied and their funds allocated to users proportionally based on the specifics for each reward. 

Anyone can finance rewards. If a reward pool doesn't have assets in it, then no rewards will be paid. 

When setting up a reward, the following information determines that your funds go into the correct reward pool:
* Reward asset: The asset in which the rewards will be paid
* Market in scope: The Market ID of the market for which rewards will be calculated
* Reward metric type: The metric type to be used to calculate the reward

Note: a multiple market recurring transfer can only be used for markets that settle in the same asset, since otherwise they cannot be compared.

#### Funding examples
In the dropdown below  you can read through examples of how funding reward pools works.
<details><summary>See funding examples</summary>
<p>
A participant wants to incentivise trading on three new markets, all of which have the same settlement asset. They can create a transfer that will top up the reward pools for those markets that accept VEGA as a reward and that calculate based on the ‘maker fees paid’ metric.

* Reward Pool 1:  Reward Asset = VEGA | Market ID = A | Metric Type = Maker fees paid 
* Reward Pool 2:  Reward Asset = VEGA | Market ID = B | Metric Type = Maker fees paid
* Reward Pool 3:  Reward Asset = VEGA | Market ID = C | Metric Type = Maker fees paid

All 3 markets settle in USDT. The rewards will be split to each market proportionally based on how much was paid out in maker fees for each market, and then each market’s pool will be split proportionally between users who paid maker fees in each defined market. 

In the current epoch:
* Market A has 200 USDT in maker fees paid
* Market B has 100 USDT in maker fees paid
* Market C has 700 USDT in maker fees paid

The user sets up a recurring transfer for 10,000 VEGA into the three reward pools above. 
* Reward Pool 1 share: 200 / (200 + 100 + 700) = 0.2 x 10,000 = 2,000 VEGA
* Reward Pool 2 share: 100 / (200 + 100 + 700) = 0.1 x 10,000 = 1,000 VEGA
* Reward Pool 3 share: 700 / (200 + 100 + 700) = 0.7 x 10,000 = 7,000 VEGA

Each reward pool is then distributed to individual parties as described in the [Reward pools](#reward-pools) section. 

</p>
</details>