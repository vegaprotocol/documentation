---
sidebar_position: 6
title: Validator scores and rewards
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

# Validator scoring and rewards
Validators and nominators both receive revenue for securing a network running Vega software. The amount can depend on factors including how much stake is nominated to the validator.

In each [epoch](./network.md#epochs), rewards are distributed among validators in proportion to the number of tokens they represent (i.e., their total stake). The total stake includes a validator's own stake and the tokens nominated to that validator. Of this reward, a fixed amount is distributed among the tokenholders the validator represents. The proportion of staking rewards distributed to nominators is determined by a network parameter: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" />.

The reward received by each validator, and therefore passed onto their nominators at the end of each epoch, is based on their validator scores. The score accounts for any penalties. However, there is no token slashing, i.e., a validator or a tokenholder will not lose tokens through any validator actions or poor performance.

A validating node’s score is calculated based on three factors:
* Total stake 
* Penalties for too much stake
* Performance

These factors drive a number of individual scores which combine to form the overall score for each validator in the epoch. 

:::tip Query for data
[API: List nodes](../../api/rest/data-v2/trading-data-service-list-nodes): See each validator's rewards scores.
:::

## Raw validator score 
The raw validator score represents the overall share of total stake the validator represents, and determines if a node is overstaked, and thus penalised.

Overstaking is a risk to network security since it can lead to a concentration of voting power with a small number of consensus validator nodes, allowing those nodes to potentially halt the network.

See below for how the validator score is calculated. 

> `min_validators` = value of the network parameter that defines the minimum viable number of consensus validators to run the network
> 
> `num_validators` = actual number of validators running nodes
> 
> `comp_level` = value of the network parameter that defines the competition level¹
> 
> `total_stake` = sum of all stake across all validators and their nominations
> 
> `optimal_stake` = total nomination divided by the greater of `min_validators`, OR (`num_validators` / `comp_level`): Optimal stake is how much stake each validator is expected to have, at most
> 
> `optimal_stake_multiplier` = value defined by network parameter <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.optimalStakeMultiplier" />), which indicates how many times the optimal stake a validator is penalised for, if they are further than the optimal stake¹
> 
>`validator_stake_i` = stake of the given validator whose score is being calculated
>
>`flat_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake`)
>
> `higher_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake_multiplier` * `optimal_stake`)

The **raw validator score** is calculated as follows:

`raw_validator_score` = (`validator_stake_i` - `flat_penalty` - `higher_penalty`) / `total_stake`

In other words, the network calculates an optimal stake set so that not all validators can reach it, so if the distribution is completely even, no validator has reached the optimum.¹ Optimal stake enures that validators have no financial benefit from becoming over-proportionally large. It then penalises any validators that have stake that exceeds the optimal stake amount. The raw validator score is then the resulting amount divided by the total stake on the network.

¹ The network parameter <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.competitionLevel" /> influences how much stake is needed for all validators to reach optimal stake.

:::note Go deeper
[Spec: Proof of stake reward score calculations ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0061-REWP-pos_rewards.md)
:::

## Performance score
For the network to run effectively, it requires nodes that are highly available, highly performant, and process the transactions expected of them. Therefore a performance score is calculated for all validator nodes. This calculation of performance score differs slightly between consensus and standby validators.

Candidate validators start with a performance score of 0. Then their score will increase to 1, as long as they have sufficient self stake, their node stays up for an entire epoch, and the node has forwarded enough Ethereum events.

### Consensus validators 
In tendermint consensus, the number of times a consensus validator can be expected to propose a block is roughly proportional to their voting power from the previous epoch. Therefore, in order to assess the performance of a node, the protocol compares the number of times that node was expected to propose a block in the previous epoch against the number of blocks it actually proposed.

Let `p` be the number of times the validator proposed blocks in the previous epoch 

Let `b` be the number of blocks in the previous epoch 

Let `v` be the voting power of the validator in the previous epoch 

Let `t` be the total voting power in the previous epoch

Then `expected_blocks` = `v/t x b` 

The number of blocks the validator is expected to propose is equal to their share of the voting power in the previous epoch multiplied by the total blocks proposed in that epoch.

Then `performance_score = max(0.05, min((p/expected, 1))`

The performance score is equal to the ratio of number of blocks actually proposed vs number of expected blocks, with a score of 1 representing a node that has proposed at least as many blocks as were expected.

### Standby validators
Standby validators do not propose blocks, therefore the method above is not suitable for assessing their performance. Instead, the performance score of a standby validator is calculated based on them successfully submitting heartbeat transactions to the network. The performance score for *new* standby validators is set to 0 for the first epoch.

Validator candidates that have submitted a transaction to become standby validator nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.

## Validator score and voting power
The validator score for the epoch is calculated as:

`validator_score` = `raw_validator_score` x `performance_score` x `multisig_score`

The validator score is normalised to sum to 1. This `normalised score` is then used to define a node's `voting power` in the next epoch. Note that the `voting power` is multiplied by 10,000 and rounded to integer values, to meet Tendermint/CometBFT requirements.

### Multisig score
The multisig score is used to ensure all (and only) consensus validators are registered to the [multisig control contract](../../api/bridge/contracts/MultisigControl.md).

If any *consensus validator is missing* from the multisig, then each missing validator will receive a multisig score of zero until it is added to the multisig contract. 

If any *non-consensus* validator is in the multisig, then all consensus validators are given a multisig score of zero. 

The multisig score is used in the calculation of rewards. For each validator that gets a multisig score of zero, **no staking rewards** are paid to that consensus validators and their nominators until the epoch following the one in which the configuration issue is resolved. 

This mechanism is designed to ensure that the validators are incentivised to keep the multisig control up to date as validators join and leave, because if it is not correctly configured, the relevant chain cannot interact with the Ethereum chain and crucial operations like associating/staking tokens will not work.

Standby and candidate validators always receive a multisig score of 1 since they are not required to be in the multisig list.

To correct the configuration, any validator or tokenholder can submit a transaction bundle to the network. It will then be verified by the validators.

:::info Try it out
[How to correct the multisig contract](../../node-operators/how-to/maintain-multisig-contract.md)
:::

## Reward allocation

At the end of each epoch, staking rewards are distributed to validators, and then their nominators. The full pool of staking rewards is allocated to validators, with each validator receiving `total rewards` x `normalised score`.

Each validator keeps a share of these rewards, where that share is:

1 minus the nominator (delegator) share of network parameter value <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" />.

If the validator does not have sufficient self-stake as defined by network parameter <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" /> then it will not receive these rewards and they are returned to the reward pool.

The remaining rewards are then distributed to the tokenholders nominating the validator node in proportion to their share of nomination on that node.

Rewards will not be paid to a validator if the multisig control is incorrectly configured or outdated and leads to that validator having a zero-score. Read more in [multisig score](#multisig-score).

## Validator metric-based rewards
There may be extra rewards to consensus and standby validators, if the [rewards](../trading-framework/discounts-rewards.md#how-to-fund-rewards) are funded. These rewards are based on validators' ranking scores.