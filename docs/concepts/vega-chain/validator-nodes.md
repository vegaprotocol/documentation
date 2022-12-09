---
sidebar_position: 3
title: Validator nodes
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

## Validator nodes
The Vega network is operated by a number of independent validators, who each run a node. 

There are three types of validating nodes: consensus validators, standby validators, and pending validators. 

Consensus validators are responsible for keeping the network and transactions running. Standby validating nodes are ready to step in if a consensus validating node does not fulfil its requirements or the community votes to expand the set of consensus validators. Pending validating nodes are one level below standby, and should be equipped to move up and replace a standby validating node if a spot opens up.

Tokenholders keep the network fair by controlling the voting power of validators. The tokenholders use their tokens to choose the validators for the network, thus managing who validates the network (and its transactions). By nominating credible validators that are running reliable nodes, tokenholders improve the stability and robustness of the network. 

## Consensus validator nodes
Consensus validator nodes are responsible for proposing new blocks so that all nodes can reach consensus on the order and content of transactions in that block and define the state of the network. 

Assuming they have a minimum amount of self-stake, they receive rewards based on the total staked to their node including delegation from tokenholders. The tokenholders delegating to consensus validators also receive a share of the rewards.

If a consensus validating node stops validating, or performs poorly, then a standby validator can replace it.

### How consensus validators are chosen
Consensus validators are chosen based their validator scores. The number of Consensus validators is set by the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.tendermint.number" />, with the top validators by score being chosen as consensus.

If a standby validator has a better validator score than an existing consensus validator, then they can be promoted to replace a consensus validator.  At most one validator can be replaced by a higher scoring standby validator per epoch.  However if the tendermint number was increased by governance, multiple standby validators can be promoted to fill the available slots. 

## Standby validators
Standby (also called ersatz) validators do not contribute to the chain, but are set up to join the consensus validator set if there are free slots for consensus validators, created by a consensus validator leaving the network, or more slots being  made available through governance. As standby validators don’t participate in consensus, they don’t need to be registered with the multisig contract.

As with the consensus validators, standby validators need to have a certain amount of self-stake, and must have submitted a heartbeat transaction to announce themselves to the network.

Standby validators, and the tokenholders who stake them, receive a share of rewards. The rewards for standby validators are calculated and penalised in the same way as consensus validators, except scaled down based on the scaling factor  <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.rewardFactor" />.  

:::info 
The network is set to not allow any standby validators for alpha mainnet, and the number of validators will be increased via governance as early alpha mainnet progresses.
:::

### How standby validators are chosen
The number of standby validators on the network is set as a multiple of the number of concensus validators and is managed by the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" />. 

To become a standby validator, a candidate / pending validator must:

1. Have enough self-stake: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> 
2. Forward the relevant Ethereum events

If there are free slots for one or more standby validators, they are added as standby validators in the next epoch. If a node that submits the transaction to join has a higher score than the lowest scoring standby validator, then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.

Read more: [Becoming a validator](#becoming-a-validator)

## Validator Scoring (I propose to make everything under here into a 5th page
A validating node’s score is calculated based on three factors:

* Stake 
* Penalties for overstaking 
* Performance

### Raw Validator Score 

The raw validator score takes into account a number of factors, including the total stake, optimal stake, minimum number of validators required, actual number of validators, and more. At a high level, it represents the overall share of total stake the validator represents, but penalises if the node is "overstaked".  Overstaking is a risk to network security since it can lead to a concentration of voting power with a small number of nodes, allowing those nodes to potentially halt the network.

See below for how the validator score is calculated. 

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

The raw validator score is calculated as follows:

`raw_validator_score` = (`validator_stake_i` - `flat_penalty` - `higher_penalty`) / `total_stake`

In other words, the network calculates an optimal stake which represents an even distribution of stake for the current number of concensus validators.  It then penalises any validators which have stake that exceeds that amount.  Then the raw validator score is the resulting amount divided by the total stake on the network.

Full details on this calculation can be found in https://github.com/vegaprotocol/specs/blob/master/protocol/0061-REWP-pos_rewards.md.

### Performance score
For the network to run effectively, it requires nodes that are highly available, highly performant, and process the transactions expected of them.  Therefore a performance score is calculated for all validator nodes.  This calculation of performance score differs slightly between consensus and standby validators.

#### Consensus validators 
In tendermint consensus, the number of times a consensus validator can be expected to propose a block is roughly proportional to their voting power from the previous epoch.  Therefore, in order to assess the performance of a node, the protocol compares the number of times that node should have been expected to propose a block in the previous epoch against the number of blocks it actually proposed.

Let `p` be the number of times the validator proposed blocks in the previous epoch 

Let `b` be the number of blocks in the previous epoch 

Let `v` be the voting power of the validator in the previous epoch 

Let `t` be the total voting power in the previous epoch

Then `expected_blocks` = `v/t x b` 
ie. the number of blocks the validator is expected to propose is equal to their share of the voting power in the previous epoch multiplied by the total blocks proposed in that epoch.

Then `performance_score = max(0.05, min((p/expected, 1))`
ie. the performance score is equal to the ratio of number of blocks actually proposed vs number of expected blocks, with a score of 1 representing a node that has proposed at least as many blocks as were expected.

#### Standby validators
Standby validators do not propose blocks, therefore the method above is not suitable for assessing performance of standby validators. Instead, the performance score of a standby validator is calculated based on them successfully submitting transactions to the network. The performance score for *new* standby validators is set to 0 for the first epoch. 

Validator candidates that have submitted a transaction to become standby validating nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.

### Validator score and voting power
The validator score for the epoch is then calculated as:

`validator_score` = `raw_validator_score` x `performance_score` x `multisig_bonus`

Where `multisig_bonus` is used to ensure consensus validators are registered to the multisig contract.  If a consensus validator is not registered to the multisig they will get a score of zero, otherwise they get 1.  Non-consensus validators are always awarded a `multisig_bonus ` of 1 since they are not required to be registered to the multisig.

Finally, this score is normalised to sum to 1 and is known as the `normalisedScore`.  This figure is then used to define that node's `voting_power` in the next epoch.  Note that this figure is multiplied by 10,000 and rounded to integer values because tendermint requires it. 

### Allocation of rewards

At the end of each epoch the full pool of staking rewards is allocated to validators, with each validator receiving `total_rewards` x `normalised_score`.

Each validator keeps a share of these rewards, where that share is given by 1 minus the delegator share <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" />).  

If the validator does not have sufficient self-stake as defined by <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> then it will not receive these rewards and they are returned to the reward pool.

The remaining rewards are then distributed to the tokenholders delegating to the node in proportion to their share of delegation on that node.  

:::caution 
As of version 0.47.5, the Vega network does not prevent tokenholders from nominating stake that would cause a node to be over-nominated. Tokenholders must actively manage their stake and keep track of the nodes they support.
:::


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
