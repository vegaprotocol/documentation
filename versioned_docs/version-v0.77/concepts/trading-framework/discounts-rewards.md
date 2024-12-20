---
sidebar_position: 5
title: Discounts and rewards
hide_title: false
description: Traders can get discounts on fees and rewards.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

You can offset some of the [fees](./fees.md) you pay, or earn even more, by receiving rewards based on trading activity. Rewards can be funded by anyone, and can be in any asset.

## Referral program
Participants can earn a commission for referring new users when a referral program is enabled. New users get a discount on their fees, while whoever refers them gets a cut of their referees’ trading fees. How much commission the referrer receives can be increased if they have the governance associated to their public key.

To create a code or join a referral set, you'll need to meet the minimum set of any asset by a network parameter: <NetworkParameter frontMatter={frontMatter} param="spam.protection.applyReferral.min.funds" />.

The referral program only exists if it's been enabled through a [governance proposal](../../tutorials/proposals/referral-program-proposal.md). Once it's enabled, both the requirements and benefits can also be replaced with a new program, also using a governance proposal.

You can see what the current program offers by using the [referral program API](../../api/rest/data-v2/trading-data-service-get-current-referral-program.api.mdx).

:::note Read more
* [Tutorial: Propose enabling or changing the referral program](../../tutorials/proposals/referral-program-proposal.md)
* [Spec: Technical design of the referral program ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0083-RFPR-on_chain_referral_program.md).
:::

### Referral sets
To benefit from referral program perks, you'll need to either create a referral set, or join one. Referral sets can also be made into [teams](#teams-and-games), which get access to rewards targeted towards team members.

A referral set is made up of the participant who created the set, known as the referrer, and all the referees who signed up using the referral code. Each referral set only has one referrer, but the number of referees is unlimited.

### Teams and games
When a user creates or updates a referral set, they can opt to turn it into a team. Teams can get access to games, which are [trading rewards](#trading-rewards) set to target those in a team, if they are set up.

A team member can switch to a different team by using the team's referral code.

Teams can have names and avatars to differentiate themselves on leaderboards. 

The team leader, or referrer, can also choose when the team is open to all or to only certain participants.

#### Game rewards
Game rewards are assigned to a team based on the team's overall performance, and then rewards are distributed amongst the team members based on their multipliers. However, if you get a 0 score, then you won't get any rewards, even if your team was rewarded. 

You'll need to be in a team for the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.team.minEpochsInTeam" suffix="epochs" /> to be eligible for game rewards.

## Fee discounts based on trading volume
Traders can get discounts on their [fees](./fees.md) when there's an active volume discount program on the network. The higher your volume of aggressive trades on a market, the greater the discount you can receive.

The size of the discount, generally speaking, depends on the volume of your taker trades over a set window of time. You can get access to different levels of discounts when your trading volume is higher.

All of the details for the volume discount program are proposed and accepted through governance. You can see what the current program offers by checking the [volume discount program API](../../api/rest/data-v2/trading-data-service-get-current-volume-discount-program.api.mdx).

:::note Read more
* [Tutorial: Propose enabling or changing the volume discount program](../../tutorials/proposals/volume-discount-program-proposal.md)
* [Spec: Technical design of the volume discount program ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0084-VDPR-volume_discount_program.md).
:::

## Rebate for high-volume market makers
Market makers who are involved in a significant fraction of all trading can receive a rebate on their trading fees from trades in which they're involved.

This program must be set up using a governance proposal. 

### Rewards for eligible participants
Participants who exceed certain eligibility criteria can be rewarded when the eligible entities reward is funded. 

When setting up the reward, one or both criteria can be set:

* Minimum number of governance tokens that need to be staked
* Minimum notional time-weighted average position, on any market using the asset nominated in the reward, or the specified market/markets

## Trading rewards
Market participants can also receive rewards for their trading activity, liquidity provision, and for proposing actively traded markets.

**Traders** can receive bonuses for placing market and/or limit orders that are filled, and keeping positions open. 

**Liquidity providers** can receive rewards on top of the fees they earn for placing orders that are likely to match. 

**Market proposers** can receive rewards for proposing markets that draw in trading volume. 

Reward earnings can grow with an activity streak and/or by keeping earned rewards in the rewards account.

A reward can be set to target participants with certain statuses:

* Teams - Only those in teams are eligible, and rewards are divided based on team performance then distributed amongst the team members.
    * Team reward eligibility can be limited to a selected list of teams
* Individuals:
    * All - Everyone is eligible.
    * Not in a team - Only participants that are not in a team are eligible.
    * In a team - Only participants in a team are eligible, but they are rewarded based on individual performance.

Rewards are independent from [fees](./fees.md), which are paid to validators, liquidity providers, and price makers on each trade.

### How rewards are paid
Rewards that you earn are paid into a per-asset *vesting rewards account*.

* **Rewards may be locked.** Each reward has its own lock period. Check the [transfers API](../../api/rest/data-v2/trading-data-service-list-transfers.api.mdx) to see how many [epochs](../chain/network.md#epochs) each reward is locked for.
* After rewards unlock, a proportion of the rewards move into a *vested account* each epoch, set by a network parameter: <NetworkParameter frontMatter={frontMatter} param="rewards.vesting.baseRate" />. That percentage can be higher if you have an [activity streak](#activity-streak) going.
* Redeem them from your vested account by transferring them into your general account. Then you can withdraw.

### Reward hoarder bonus
Leaving your reward earnings in your vested account will increase your share of the trading rewards you've accrued. How much extra you get depends on your total rewards balance, whether it's locked, vesting, or vested.

You can see the current reward hoarder bonus requirements and benefits by querying the [network parameters API](../../api/rest/data-v2/trading-data-service-list-network-parameters.api.mdx) for the `rewards.vesting.benefitTiers` network parameter.

These tiers are set through network parameters, and thus can be changed through [governance](../governance/network-parameter.md).

:::tip Try it out
[Tutorial: Propose a network parameter change](../../tutorials/proposals/network-parameter-proposal.md)

Note: You'll need to format your proposal using JSON to include multiple tiers in the value field.
:::

## Activity streak 
Traders that keep up an activity streak, either by placing trades or keeping a position open over several epochs, can receive a greater share of rewards and their locked reward proceeds will be available sooner.

Keeping up your activity gives you access to greater benefits as your streak grows. Activity streaks are measured in epochs.

You need a minimum trade volume of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.activityStreak.minQuantumTradeVolume" /> or a minimum open volume of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.activityStreak.minQuantumOpenVolume" hideName={true} /> (both expressed in quantum) to be considered active.

If you go inactive for more than the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.activityStreak.inactivityLimit" suffix="epochs"/>, you will lose your streak.

You can see the current activity streak requirements and benefits by querying the [network parameters API](../../api/rest/data-v2/trading-data-service-list-network-parameters.api.mdx) for the `rewards.activityStreak.benefitTiers` network parameter.

The details for activity streaks are set through network parameters, and thus can be changed through [governance](../governance/network-parameter.md).

:::tip Try it out
[Tutorial: Propose a network parameter change](../../tutorials/proposals/network-parameter-proposal.md)

Note: You'll need to format your proposal using JSON to include multiple tiers in the value field.
:::

## Setting rewards
Rewards can be set up by anyone to incentivise certain trading behaviours they want to see on a market (or markets). 

Trading rewards can be defined by the following things:
* Type of activity to be rewarded (and how it's measured)
* An amount to reward
* How long a reward is offered
* How the reward is distributed to those eligible, pro-rata, by rank, or by lottery
* How many epochs a trader's activity is evaluated
* If the reward is available to individuals or those on a team
* If a reward's payout is capped - which takes into account a trader's paid fees

Extra rewards for validators can also be set up. Learn more about them on the [validator scores and rewards page](../chain/validator-scores-and-rewards.md#validator-metric-based-rewards).

#### Example: Evaluating reward performance over time
Some rewards measure trader activity over a number of epochs (set per reward). The image below shows how an average of your scores is taken across the window, i.e., the number of epochs chosen for measurement.

<img src="/img/concept-diagrams/reward-score-example.png" width="650"/>

:::tip Try it out
* [Concept: How to fund rewards](#how-to-fund-rewards)
* [Tutorial: Set up a reward transfer](../../tutorials/assets-tokens/transferring-assets.md)
:::

### How rewards are scaled
Since rewards can only be provided if they're funded, the [recurring transfer](../assets/transfers.md#recurring-transfers) that's used to fund those rewards also includes details on how the final reward amount is calculated.

**Pro-rata**: A participant's reward is scaled based on their score.

**Rank**: A participant's reward is scaled based on where their score lands on a rank table, which is also set in the transfer. The rank table determines a rank group, for example 1-8, and what ratio of the reward amount that group would receive.

**Lottery**: Each eligible participant is randomly assigned a position in the rank table. If the lottery distribution is used for a trading reward (i.e., not the eligible entities reward), the probability of a participant being selected is based on their score towards that trading reward. 

If you have *multipliers* from the activity streak and/or the reward hoarder bonus, your share of the reward grows in proportion to those multipliers.

### How rewards are capped
If a reward is given an upper limit, each participant's actual reward amount received will be whichever is smaller of: full earned reward amount, or the reward cap number multiplied by the participant's trading fees paid in the epoch. The reward cap is included in the transfer that set up the reward. If any of the reward amount is unpaid, it stays in the pool.

Example:
3 market participants are eligible for the 200 USDC reward pool per epoch. The cap is set to 1 (100%).

Party A: Trades enough to get 20% of reward
Party B: Trades enough to get 30% of reward
Party C: Trades enough to get 50% of reward

Party A: Paid 500 in trading fees
Party B: Paid 1000 in trading fees
Party C: Paid 50 in trading fees

Party A: Receives 40 (20% of 200) - the full amount
Party B: Receives 60 (30% of 200) - the full amount
Party C: Receives 50 (50% of 200 is 100, but reward is capped by 100% of fees paid)

The last 50 is distributed between party A and party B, with the process repeated until all parties rewards reach cap or the reward pool is empty.

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

### Largest traders by notional size
The _largest traders by notional size_ category rewards traders whose positions have consistently higher notional that rank higher in the standings than other traders, as long as they can keep the positions open.

It measures a trader's time-weighted average notional position over a set number of epochs to determine how long each trader is able to manage a position that's larger than the positions of other traders, without being closed out. It's also known as the "average notional metric".

This reward is applicable to trading on derivatives markets, not spot markets.

#### Example of largest traders by position size
The image below shows how the largest traders by positions size is calculated in a single 24-hour epoch.

<img src="/img/concept-diagrams/largest-trader-example.png" width="650"/>

Actions of the example trader in the image above over 24 hours: 
- 00:00 - trader opens a position
- 04:00 - trader closes their position, their average position starts to decrease
- 08:00 - trader reopens their position, their average position starts to increase
- 12:00 - trader reduces their position, their average position starts to decrease

### Most profitable traders
The most profitable traders category rewards traders with a competitive profit and loss (PnL) in relation to their position sizes. A trader's relative PnL are taken from each epoch in the reward window, and averaged out. Those with a greater relative PnL rank better in the standings. It's also known as the "relative return metric".

This reward is applicable to trading on derivatives markets, but not spot markets.

#### Example of most profitable traders
The image below shows how the most profitable trader's score is calculated across epochs. A trader with a large amount of capital will have as much chance of winning as a trader with a smaller amount.

<img src="/img/concept-diagrams/most-profitable-trader-example.png" width="650"/>

### Most consistently profitable traders
The most consistently profitable traders category rewards traders with the least amount of variance in their returns while they had a position open on a market in the rewards window. Traders who have similar amount of profit across the epochs, rather than spikes and dips, rank higher in the standings.

This is measured by taking the sum of each trader's mark to market gains and losses, both realised and unrealised, and includes funding gains and losses if trades are on a perpetuals market. It's also known as the "returns volatility metric".

This reward is applicable to trading on derivatives markets, but not spot markets.

### Highest realised return
The realised returns metric rewards traders with the highest realised returns during the competition window. Only realised profits on the market are counted for this reward - in other words, the gains on any portion of a closed position. 

This reward is applicable to trading on derivatives markets, but not spot markets.

### Market creation rewards 
The market creation reward dispatch metric is designed to incentivise creating markets that attract high trading volumes. Rewards are awarded to the proposers of any markets that meet a certain total trade value. 

The threshold for what counts as 'enough' trading volume is a formula that takes into account the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="rewards.marketCreationQuantumMultiple" />, as well as the settlement asset's quantum to assess the market's size.

An asset's quantum is defined as an approximation of the smallest 'meaningful' amount of that asset, generally expecting it to be the quantity of the asset valued at approximately the value of 1 USD. An asset's quantum is set in the governance proposal that enabled the asset for use on a network.

**Example**: 

In a given epoch, 4 markets all reach $10,000 total trade value, which is the threshold value set in the network parameter. 

The proposers of each of those markets qualify for 25% of the market creation reward for that epoch.

:::note Go deeper
**[Rewards spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0056-REWA-rewards_overview.md#market-creation-reward-metrics)**: See the full set of calculations that go into the market creation reward.
:::

#### Reward examples
In the section below are descriptions of potential reward scenarios, including the scopes and dispatch metrics used. 

<details><summary>See reward examples</summary>
<p>
An early liquidity provider who supports the ETH / USDT 1Y Future market wants to encourage people to trade on the market, and as an early adopter wants to incentivise people to hold the governance token too. That provider would transfer their chosen amount of funds to the relevant reward pool.

Reward Pool 1: 
* Reward asset = governance-token
* Market in scope = ETH / USDT 1Y Future (defined by Market ID)
* Reward metric type = Maker fees paid

This reward pool will transfer governance-token to anyone acting as a price taker and therefore paying maker fees on the market. 

They may later decide that they have successfully driven so much volume that they would like to encourage more liquidity in the market to help supplement their own. In this case they could fund another reward pool.

Reward Pool 2: 
* Reward asset = governance-token
* Market in scope = ETH / USDT 1Y Future
* Reward metric type = Liquidity fees

This will provide an additional incentive for LPs to commit liquidity, since in addition to the liquidity fees they would already receive (in USDT, the settlement asset of the market), they would also receive governance-token proportional to the share of liquidity fees they received for the market.

Finally, they may decide that they also want to provide a reward in the market’s settlement asset rather than solely reward in governance-token. Therefore they transfer funds to an additional reward pool.

Reward pool 3: 
* Reward asset = USDT
* Market in scope = ETH / USDT 1Y Future
* Reward metric type = Maker fees paid

Now, any user that has been a price taker in this market will receive two reward payments at the end of the epoch, once in governance-token and one in USDT, with both proportional to their overall share of maker fees paid in the market. 

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
A participant wants to incentivise trading on three new markets, all of which have the same settlement asset. They can create a transfer that will top up the reward pools for those markets that accept governance-token as a reward and that calculate based on the ‘maker fees paid’ metric.

* Reward Pool 1:  Reward Asset = governance-token | Market ID = A | Metric Type = Maker fees paid 
* Reward Pool 2:  Reward Asset = governance-token | Market ID = B | Metric Type = Maker fees paid
* Reward Pool 3:  Reward Asset = governance-token | Market ID = C | Metric Type = Maker fees paid

All 3 markets settle in USDT. The rewards will be split to each market proportionally based on how much was paid out in maker fees for each market, and then each market’s pool will be split proportionally between users who paid maker fees in each defined market. 

In the current epoch:
* Market A has 200 USDT in maker fees paid
* Market B has 100 USDT in maker fees paid
* Market C has 700 USDT in maker fees paid

The user sets up a recurring transfer for 10,000 governance-token into the three reward pools above. 
* Reward Pool 1 share: 200 / (200 + 100 + 700) = 0.2 x 10,000 = 2,000 governance-token
* Reward Pool 2 share: 100 / (200 + 100 + 700) = 0.1 x 10,000 = 1,000 governance-token
* Reward Pool 3 share: 700 / (200 + 100 + 700) = 0.7 x 10,000 = 7,000 governance-token

Each reward pool is then distributed to individual parties as described in the [Reward pools](#reward-pools) section. 

</p>
</details>