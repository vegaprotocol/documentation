---
sidebar_position: 4
title: Fees and trading rewards
hide_title: false
description: Trades can incur fees as well as get rewards.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega trading fee structure incentivises passive trading (placing orders on the order book), providing liquidity, and running the network infrastructure. The protocol does not charge gas fees for interacting with the network.

In addition, any participant can fund accounts that reward traders for their activity in a market, including those who 'take' prices off the order book. Those rewards only exist when a party is funding them, and can be set per market and per activity type (or metric).

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
The liquidity portion of the fee is paid by a participant who hits an order on the order book, and is paid to those participants who [commit liquidity](../liquidity/provision.md#liquidity-commitments) to the market.

It's transferred to a liquidity fee account, and distributed to each liquidity provider's margin account at a defined time (based on network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.providers.fee.distributionTimeStep" />), and depending on how much their liquidity commitments have contributed to the market.

### Fee calculations
At a high level, the trading fee is calculated using the following formulas:

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
Market participants can also receive rewards for their trading, liquidity commitment, and market creation activity.

Depending on the rewards available, traders can receive bonuses for placing market and/or limit orders that are filled. Liquidity providers can receive rewards for placing liquidity orders that are likely to match, and market proposers can receive rewards for proposing markets that draw in trading volume. 

Reward proceeds are paid directly to the recipient's general account.

* Any party that trades on a market with a trading reward can be eligible to receive a portion of the rewards.
* Any party with an amount of a market's settlement asset can fund a reward pool to incentivise trading. 

Rewards are independent from fees, which are paid to validators, liquidity providers, and price makers on each trade.

:::tip Try it out
[Set up a reward transfer](../../tutorials/assets-tokens/transferring-assets.md): Choose an activity to reward and set up a one-off or recurring transfer to fund it.
:::

## Setting rewards
Rewards can be set up by anyone to incentivise certain trading behaviours they want to see on a market (or markets). 

Trading rewards are defined by three things:
* Type of activity to be rewarded (and how it's measured)
* An amount to reward
* How long a reward is offered

### Trading rewards dispatch metrics
As rewards are distributed based on certain criteria, they need to be defined and measured. Each reward dispatch metric is calculated per party, once at the end of each epoch.

Rewards can be set up to pay those who receive fees (functioning like a 'bonus'), or those who create markets.

Choosing a dispatch metric is a matter of transferring assets to the relevant account type, which then contributes to the reward pool for the metric.

#### Fee-based reward metrics
Fee-based rewards metrics are designed to incentivise trading volume on a given market, and are dependent on how much a participant pays in fees.

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

#### Market creation reward metric 
The market creation reward dispatch metric is designed to incentivise creating markets that attract good trading volume. Rewards are awarded to the proposers of any markets that meet a certain total trade value. 

The threshold for what counts as 'enough' trading volume is a formula that takes into account the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.marketCreationQuantumMultiple" />, as well as the settlement asset's quantum to assess the market's size.

An asset's quantum is defined as an approximation of the smallest 'meaningful' amount of that asset, generally expecting it to be the quantity of the asset valued at approximately the value of 1 USD. An asset's quantum is set in the governance proposal that enabled the asset for use on Vega.

**Example**: 

In a given epoch, 4 markets all reach $10,000 total trade value, which is the threshold value set in the network parameter. 

The proposers of each of those markets qualify for 25% of the market creation reward for that epoch.

:::note Go deeper
[Rewards spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0056-REWA-rewards_overview.md#market-creation-reward-metrics): See the full set of calculations that go into the market creation reward.
:::

### Reward pools 
Reward pools hold the funds that are used to pay out trading rewards, and are funded by participants through transfers. Choosing a dispatch metric is a matter of transferring assets to the relevant account type, which then contributes to the reward pool for the metric.

At the end of each epoch, all reward pools will be emptied and their funds allocated to users proportionally based on the reward metric defined for each pool. 

It is up to individual users to transfer funds to the reward pools in order to finance the rewards they want to pay. If there is no balance in the reward pool at the end of the epoch, then no rewards will be paid.

When setting up a reward, the following information determines that your funds go into the correct reward pool:
* Reward asset: The asset in which the rewards will be paid
* Market in scope: The Market ID of the market for which rewards will be calculated
* Reward metric type: The metric type to be used to calculate the reward

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

### Funding rewards 
Transfers are used to send assets to reward pools. 

To fund a single reward pool over multiple epochs, set up a **recurring transfer to a single reward pool** that will keep topping up the reward pool for each epoch, as long as there are funds available in the party's general account.

Another option is to regularly top up multiple reward pools across multiple markets, for a single metric and reward asset, by setting up a **recurring transfer to multiple reward pools**. 

Each epoch, the funds will be paid into each reward pool proportionally based on the contribution of each market to the metric in scope.  

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
