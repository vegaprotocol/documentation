---
sidebar_position: 4
title: Validator score
---

A validating node’s performance is calculated based on three factors:

* Ranking, whether it is a consensus or standby validator
* Voting power based on the performance, which defines the performance score
* Stake, which defines the validator score

### Validator score
The validator score is calculated for each epoch, based on how much stake a validator has as well as other factors including the total number of validators and the optimal stake. This is true for both consensus and standby validators. 

If, at the end of an epoch, a validator does not have sufficient stake self-nominated or has overall too much stake, then their validator score will be lowered. This can impact the rewards a validator and its nominators receive. 

Below are the two factors that can lower a validator's score, and why. 

#### Not enough self-nominated stake
Self-nominated stake refers to the amount of VEGA a validator has staked to their own node.  The minimum stake amount required is <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} />. Not having enough self-nominated stake can have an impact on rewards. 

* **Network risk**: A validator who has not committed enough stake to meet the minimum is a risk to the network because they may not be invested in keeping the network running
* **Validator score**: If a validator does not have  <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens" />), the validator is given a lower score, which can affect their reward
* **Reward impact**: A validator with too little self-stake forfeits their share of the rewards for each epoch they are below the threshold. However tokenholders who nominated that validator will still receive rewards

#### Too much stake
An over-staked validator has more stake than is ideal for a healthy and functioning network. Staking to an over-staked node can your rewards. 

* **Network risk**: The risk of an over-staked node is that it could have too much consensus voting power
* **Validator score**: A node that is over-staked is given a lower validator score - the more over-staked it is, the lower the score 
* **Reward impact**: If a validator is too far from optimal stake, the validator and tokenholders who nominated that validator **will not receive rewards** for every epoch the node is heavily over-staked

:::caution 
As of version 0.47.5, the Vega network does not prevent tokenholders from nominating stake that would cause a node to be over-nominated. Tokenholders must actively manage their stake and keep track of the nodes they support.
:::

#### Validator score calculations
The validator score takes into account a number of factors, including the total stake, optimal stake, minimum number of validators required, actual number of validators, and more. See below for how the validator score is calculated. 

Factors that affect the validator score:

> `min_validators` = value of the network parameter that defines the minimum viable number of validators to run Vega
> 
> `num_validators` = actual number of validators running nodes on Vega
> 
> `comp_level` = value of the network parameter that defines the competition level
> 
> `total_stake` = sum of all stake across all validators and their delegations
> 
> `optimal_stake` = total delegation divided by the greater of `min_validators`, OR (`num_validators` / `comp_level`): Optimal stake is how much stake each validator is expected to have, at most
> 
> `optimal_stake_multiplier` = value defined by <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.optimalStakeMultiplier" />), which indicates how many times the optimal stake a validator is penalised for, if they are further than the optimal stake
> 
>`validator_stake_i` = stake of the given validator whose score is being calculated
>
>`flat_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake`)
>
> `higher_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake_multiplier` * `optimal_stake`)

The validator score is calculated as follows:

`validator_score` = (`validator_stake_i` - `flat_penalty` - `higher_penalty`) / `total_stake`

**Example:**

Assuming the available reward pool is 1000, and there are 3 validators:
- Validator 1 is heavily over-staked and they are given a validator score of 0
- Validator 2 is not over or under-staked and gets a validator score of 0.2
- Validator 3 is also well-staked and gets a validator score of 0.2

Those scores are then normalised (divided by the sum of them):
- Validator 1 gets a normalised score of 0
- Validator 2 gets a normalised score of 0.5
- Validator 3 gets a normalised score of 0.5

The normalised validator score number directly affects how much each validator (and its nominators) would recieve of the 1000 reward. 

- Validator 1 (and its nominators) will receive 0 rewards. Validator 2 & 3 will split the 1000 equally.