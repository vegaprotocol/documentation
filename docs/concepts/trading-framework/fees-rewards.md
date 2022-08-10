---
sidebar_position: 6
title: Fees and rewards
hide_title: false
---
## Trading fees and rewards
The Vega trading fee structure incentivises passive trading (placing orders on the order book), providing liquidity, and running the network infrastructure. 

Meanwhile, there is a mechanism that any participant can use to reward traders for their activity in a market, including those who 'take' prices off the order book. Those rewards only exist when a party is funding them, and can be set per market and per activity type (or metric). 

Read more:
* [Trading fees](#trading-fees)
* [Trading rewards](#trading-rewards)

### Trading fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles for a decentralised trading infrastructure.

Fees are incurred on every trade on a market in continuous trading, but it is the price taker who pays the fee. During a market's opening auction, no fees are collected.

The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) obtains part of the fee as a reward for providing liquidity.

An order may cross with more than one other order, creating multiple trades, which incur fees for each. Because of how the trade value for fee purposes is calculated (see below), the amount you'll pay for each order is the same, regardless of how many trades it takes to fill the order.

Fees are calculated and collected in the settlement currency of the market, and collected from your collateral. The fee is divided between the maker, the infrastructure provider, and the liquidity provider(s) for each market.

* Infrastructure portion of the fee, which is paid to validators as a reward for running the infrastructure of the network, is transferred to the infrastructure fee pool for that asset. It is then periodically distributed to the validators.
* Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker).
* Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market.

The trading fee is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x Trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade (This is true for futures, but may be calculated differently for other products.)

### Fees example
If you were to place an order for 100 futures at USDC50, the trade value for fee purposes is 100 x USDC50 = USDC5000.

In this example, each fee is 0.001, meaning total fee factor is 0.003.

USDC5000 x 0.003 = USDC15

The fee is the same irrespective of the number of transactions the order gets filled in, as long as they trade at the same price.

The fee factors are set through the following network parameters: `market.fee.factors.infrastructureFee`, `market.fee.factors.makerFee`, `market.fee.factors.liquidityFee`.

## Trading rewards 
In addition to fees incentivising liquidity provision, passive orders, and infrastructure maintenance, participants can also fund rewards to incentivise certain trading activities on a market (or markets).

Participants can choose to incentivise activity by choosing what type(s) of activity they want to reward, how much to reward those who take part, and for how long. 

### Trading rewards framework
The reward framework provides a mechanism for defining, measuring and rewarding certain trading activities on the Vega network. Any Vega network participant with assets can use the rewards functionality to incentivise behaviours they would like to see in a market. 

Rewards are independent from fees, which are paid to validators, liquidity providers, and price makers on each trade. 

### Trading rewards metrics
As rewards are distributed based on certain criteria, those criteria need to be defined and measured. Each of the reward metrics is calculated per party, and once at the end of each epoch.

Rewards can be defined to pay out to those who receive fees (functioning like a ‘bonus’), or those who create markets.

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

Party A, trading on Market X, has paid $100 in maker fees in one epoch. 

The total maker fees paid by all parties in that market is $10,000. 

Party A would receive $100 / $10,000 = 1% of the rewards for that epoch.

#### Market creation reward metric 
The market creation reward metric is designed to incentivise successful market creation.

Rewards are awarded to the proposers of any markets that meet a certain total trade value in a given epoch.  The threshold required is set by the network parameter `market.liquidityProvision.minLpStakeQuantumMultiple`, and can be changed via governance vote.

**Example**: 

In a given epoch, 4 markets all reach $10,000 total trade value, which is the threshold value set in the network parameter. 

The proposers of each of those markets qualify for 25% of the market creation reward for that epoch.

### Reward pools 
Reward pools hold the funds that are used to pay out trading rewards,  and are funded by participants through transfers. 

At the end of each epoch, all reward pools will be emptied and their funds allocated to users proportionally based on the reward metric defined for each pool. 

It is up to individual users to transfer funds to the reward pools in order to finance the rewards they want to pay. If there is no balance in the reward pool at the end of the epoch, then no rewards will be paid.

When transferring funds, providing the following information determines that your funds go into the correct reward pool: 

* Reward asset: The asset in which the rewards will be paid
* Market in scope: The Market ID of the market for which rewards will be calculated 
* Reward metric type: The metric type to be used to calculate the reward

**Examples**:

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

Finally, they may decide that they also want to provide a reward in the market’s settlement asset rather than solely reward in VEGA.  Therefore they transfer funds to an additional reward pool.

Reward pool 3: 
* Reward asset = USDT
* Market in scope = ETH / USDT 1Y Future
* Reward metric type = Maker fees paid

Now, any user that has been a price taker in this market will receive two reward payments at the end of the epoch, once in VEGA and one in USDT, with both proportional to their overall share of maker fees paid in the market. 

### Funding reward pools 
Transfers are used to send assets to reward pools, and those transfers can be set up to transfer an asset just once, or for each epoch. 

If a user wishes to provide a one-off reward in a single epoch only, they can do this by making a **single transfer** into the relevant reward pool. 

If a user wishes to fund a single reward pool over multiple epochs, they can do this by setting up a **recurring transfer to a single reward pool** to keep topping up the reward pool for each epoch.

Another option is to regularly top up multiple reward pools across multiple markets, for a single metric and reward asset, by setting up a **recurring transfer to multiple reward pools**. 

Each epoch, the funds will be paid into each reward pool proportionally based on the contribution of each market to the metric in scope.  

Note: a multiple market recurring transfer can only be used for markets that settle in the same asset, since otherwise they cannot be compared. 

**Example**:

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

Each reward pool is then distributed to individual parties as per the logic described in the [Reward pools](#reward-pools) section.

