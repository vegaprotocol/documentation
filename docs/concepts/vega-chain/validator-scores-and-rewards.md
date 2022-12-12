---
sidebar_position: 3
title: Validator scores and rewards
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-staking.mdx'

# Validator scoring and rewards
Validators and nominators both receive incentives for securing the network. The amount of those incentives, rewarded as VEGA, depends on factors including how much stake is nominated. 

**To be considered for staking rewards, a tokenholder must associate VEGA to a Vega key and nominate one or more validators.**

:::info Try it out
Use **[token.fairground.wtf](https://token.fairground.wtf)** to try out associating testnet tokens and nominating validators. Staking rewards are paid into your Vega wallet after each epoch ends. 

Staking rewards must be withdrawn to an Ethereum wallet, and then associated to a Vega wallet, before they can be staked.
:::

In each epoch, rewards are distributed among validators in proportion to the number of tokens they represent (i.e., their total stake). The total stake includes a validator's own stake and the tokens nominated to that validator. Of this reward, a fixed amount is distributed among the tokenholders the validator represents. The proportion of rewards distributed to delegators is <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" hideName={true} />.

The reward received by each validator, and therefore passed onto their delegators, at the end of each epoch is based on their validator scores which account for various penalties. However, there is no token slashing, i.e., a tokenholder cannot lose their tokens through any actions of a validator.

A validating node’s score is calculated based on three factors:

* Total stake 
* Penalties for overstaking 
* Performance

These factors drive a number of individual scores which combine to form the overall score for each validator in the epoch. 

:::tip Query for data
See each validator's rewards scores by [querying the API](../../api/rest/data-v2/trading-data-service-list-nodes).
:::

## Raw validator score 
The raw validator score represents the overall share of total stake the validator represents, and determines if a node is overstaked, and thus penalised.

Overstaking is a risk to network security since it can lead to a concentration of voting power with a small number of nodes, allowing those nodes to potentially halt the network.

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
> `optimal_stake_multiplier` = value defined by <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.optimalStakeMultiplier" hideValue={true} />), which indicates how many times the optimal stake a validator is penalised for, if they are further than the optimal stake
> 
>`validator_stake_i` = stake of the given validator whose score is being calculated
>
>`flat_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake`)
>
> `higher_penalty` = the greater of 0, OR (`validator_stake` - `optimal_stake_multiplier` * `optimal_stake`)

The raw validator score is calculated as follows:

`raw_validator_score` = (`validator_stake_i` - `flat_penalty` - `higher_penalty`) / `total_stake`

In other words, the network calculates an optimal stake which represents an even distribution of stake for the current number of consensus validators and the desired competition level. It then penalises any validators that have stake that exceeds that amount. The raw validator score is then the resulting amount divided by the total stake on the network.

:::note Go deeper
[Proof of stake rewards spec](https://github.com/vegaprotocol/specs/blob/master/protocol/0061-REWP-pos_rewards.md): Read the full details on how scores are calculated.
:::

## Performance score
For the network to run effectively, it requires nodes that are highly available, highly performant, and process the transactions expected of them. Therefore a performance score is calculated for all validator nodes. This calculation of performance score differs slightly between consensus and standby validators.

### Consensus validators 
In tendermint consensus, the number of times a consensus validator can be expected to propose a block is roughly proportional to their voting power from the previous epoch. Therefore, in order to assess the performance of a node, the protocol compares the number of times that node should have been expected to propose a block in the previous epoch against the number of blocks it actually proposed.

Let `p` be the number of times the validator proposed blocks in the previous epoch 

Let `b` be the number of blocks in the previous epoch 

Let `v` be the voting power of the validator in the previous epoch 

Let `t` be the total voting power in the previous epoch

Then `expected_blocks` = `v/t x b` 
ie. the number of blocks the validator is expected to propose is equal to their share of the voting power in the previous epoch multiplied by the total blocks proposed in that epoch.

Then `performance_score = max(0.05, min((p/expected, 1))`
ie. the performance score is equal to the ratio of number of blocks actually proposed vs number of expected blocks, with a score of 1 representing a node that has proposed at least as many blocks as were expected.

### Standby validators
Standby validators do not propose blocks, therefore the method above is not suitable for assessing performance of standby validators. Instead, the performance score of a standby validator is calculated based on them successfully submitting transactions to the network. The performance score for *new* standby validators is set to 0 for the first epoch. 

Validator candidates that have submitted a transaction to become standby validating nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.

## Validator score and voting power
The validator score for the epoch is calculated as:

`validator_score` = `raw_validator_score` x `performance_score` x `multisig_bonus`

Where `multisig_bonus` is used to ensure consensus validators are registered to the multisig contract. If a consensus validator is not registered to the multisig they will get a score of zero, otherwise they get 1. Non-consensus validators are always awarded a `multisig_bonus` of 1 since they are not required to be registered to the multisig.

Finally, the validator score is normalised to sum to 1. This `normalised score` is then used to define a node's `voting power` in the next epoch. Note that the `voting power` is multiplied by 10,000 and rounded to integer values, to meet Tendermint requirements.

## Reward allocation
:::caution 
As of version 0.47.5, the Vega network does not prevent tokenholders from nominating stake that would cause a node to be over-nominated. Tokenholders must actively manage their stake and keep track of the nodes they support.
:::

At the end of each epoch the full pool of staking rewards is allocated to validators, with each validator receiving `total rewards` x `normalised score`.

Each validator keeps a share of these rewards, where that share is:

1 minus the delegator share of <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" hideName={true} />.

If the validator does not have sufficient self-stake as defined by <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> then it will not receive these rewards and they are returned to the reward pool.

The remaining rewards are then distributed to the tokenholders delegating to the node in proportion to their share of delegation on that node.


