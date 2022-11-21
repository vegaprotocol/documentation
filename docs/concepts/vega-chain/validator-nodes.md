---
sidebar_position: 2
title: Validator nodes
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

## Validator nodes
The Vega network is operated by a number of independent validators, who each run a node. 

There are three types of validating nodes: consensus validators, standby validators, and pending validators. 

Consensus validators are responsible for keeping the network and transactions running. Standby validating nodes are ready to step in if a consensus validating node does not fulfil its requirements. Pending validating nodes are one level below standby, and should be equipped to move up and replace a standby validating node if a spot opens up.

Non-validator participants keep the network fair by controlling the voting power of validators. The tokenholders use their tokens to choose the validators for the network, thus managing who validates the network (and its transactions).

## Consensus validator nodes
Consensus validator nodes are responsible for agreeing on the order of transactions and creating new blocks so that all nodes can agree on the state of the network.

They receive rewards based on having enough (but not too much) self-stake, as well as how many tokenholders nominate them. The tokenholders who nominate them also receive a cut of the rewards.

If a consensus validator's stake or performance is subpar, their validator score will be lowered, and that validator's node will be chosen less frequently to propose a block, because Vega feeds the voting power of each validating node to the Tendermint consensus algorithm.

This can also affect the rewards they and their nominators receive.

If a consensus validating node stops validating, or performs poorly, then a standby validator can replace it.

### How consensus validators are chosen
Consensus validators are chosen based on a range of variables, including the validator scores, and the number of available slots. If there are no empty slots, at most one validator can be changed per epoch.

If a standby validator has a better validator score (which includes performance score and stake) than an existing consensus validator, then a standby validator can be promoted to replace a consensus validator.

## Standby validators
Standby (also called ersatz) validators do not contribute to the chain, but are set up to join the consensus validator set if there are free slots for consensus validators, such as if one drops off or more slots are made available. As they don’t participate in consensus, they don’t need to be registered with a multisig contract.

As with the consensus validators, standby validators need to have a certain amount of self-stake and nominated stake.

Standby validators, and the tokenholders who stake them, receive a share of rewards. The rewards for standby validators are calculated and penalised in the same way as consensus validators, except scaled down based on the amount of stake they have. The current scaling factor is <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.rewardFactor" />.

:::info 
The network is set to not allow any standby validators for alpha mainnet, and the number of validators will be increased via governance as early alpha mainnet progresses.
:::

### How standby validators are chosen
If there are free slots for one or more standby validators, and there are nodes that have submitted the transaction to join (and satisfy all joining conditions), they are added as standby validators in the next epoch. 

If a node that submits the transaction to join has a higher score than the lowest scoring standby validator (scaled up by the incumbent factor), then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.


Note: A node that has a ranking score of 0 (meaning they have no stake and a performance score of 0) for longer than 10 epochs is removed from Vega and will have to resubmit their request to become a validator.

Read more: [Becoming a validator](#becoming-a-validator)

### Moving from standby to consensus validator
A standby validator that wants to be in line for promotion to become a consensus validator needs to do the following: 

1. Run a validating node
2. Have enough self-stake: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> 
3. Forward the relevant Ethereum events

## Validating node performance
A validating node’s performance is calculated based on three factors:

* Ranking, whether it is a consensus or standby validator
* Voting power based on the performance, which defines the performance score
* Stake, which defines the validator score

### Performance score: Consensus validators
For each block, the proposer is selected deterministically and the number of times each consensus validator is selected is roughly proportional to their voting power.

A validator’s performance is calculated as follows:

let `p` be the number of times the validator proposed blocks in the previous epoch 
let `b` be the number of blocks in the previous epoch 
let `v` be the voting power of the validator in the previous epoch 
let `t` be the total voting power in the previous epoch
let expected = `v*b/t` the number of blocks the validator is expected to propose. 
Then `validator_performance = max(0.05, min((p/expected, 1))`

### Performance score: Standby validators
The performance score for *new* standby validators is set to 0. The performance score of a standby validator is calculated based on them successfully submitting transactions.

Validator candidates that have submitted a transaction to become consensus validating nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.

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

## Becoming a validator

:::info 
The network is set to not allow any standby validators for alpha mainnet, and the number of validators will be increased via governance as early alpha mainnet progresses.
:::

A node operator that wants to express interest in running a validating node for Vega needs to do the following: 

1. Start a Vega validating node, including the associated infrastructure (see below)
2. Submit a transaction using their keys, announcing they want to validate, and receive a response that the network has verified key ownership (see below)
3. Self-stake to their validator Vega key at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} />  
4. Wait for others to nominate them. It would be worth announcing to the community that you have started a node and are looking for stake)

### How candidate validators are ranked
At the end of each epoch, the Vega network will calculate validator score. The consensus validators during that epoch will have their validator scores scaled by (1 + <NetworkParameter frontMatter={frontMatter} param="network.validators.incumbentBonus" hideName={true} />). This number combines self-stake and nominated stake with the performance score (which measures basic node performance).

Vega sorts all current consensus validators from the highest performance score to the lowest. All of those who submit a transaction expressing intent to be a validator are then sorted by their validator score, highest to lowest.

* If there are already empty consensus validator slots, then the non-consensus validators who have the top scores are moved in to be consensus validators, starting in the next epoch.
* If a potential validator has a higher score than the lowest incumbent consensus validator, then in the next epoch the higher-scoring validator becomes a consensus validator, and the lowest scoring incumbent becomes a standby validator.
* If two validators have the same performance score, then the network places higher the one who's been validator for longer, and if two validators who joined at the same time have the same score, the priority goes to the one who submitted the transaction to become validator first.

<!--
### Validator scores in a restart
Read about how validator scores are treated during a network restoration from a checkpoint: [Validator scores in a restart](./network.md#validator-scores-in-a-restart)
-->