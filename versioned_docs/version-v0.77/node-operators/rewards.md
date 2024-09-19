---
sidebar_position: 8
title: Validator reward mechanics
sidebar_label: Validator rewards
---
import NetworkParameter from '@site/src/components/NetworkParameter';

Each type of validator node is entitled to a different rate of rewards. Non-validator nodes (such as data nodes) are not eligible for any rewards.

- **Consensus** nodes keep the network and transactions running, so earn **maximum rewards**
- **Standby** nodes are ready to step up to consensus node status, so earn rewards at a rate set by a network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.rewardFactor" / 
- **Candidate** nodes are ready to step up to standby status, and earn **no rewards**

Parties who meet the [requirements](requirements) and correctly [set up and run a node](get-started) will become a candidate validator node. They can be promoted to standby then consensus status by meeting performance and staking requirements.

## Earn standby validator rewards

### Conditions
1. Run a validator node
2. Self-stake at least the value of network parameter <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" /> with the key used to set up the node
3. Maintain a [validator score](../concepts/chain/validator-scores-and-rewards.md#raw-validator-score) better than the lowest scoring standby validator

### How standby validators are chosen

The number of standby validators is limited to the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" /> out of the number of consensus validators set by network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" />.

If there are free slots for one or more standby validators, and there are candidate nodes that have submitted the transaction to join (and satisfy all joining conditions), they are added as standby validators in the next [epoch](../concepts/chain/network.md#epochs).

If a node that submits the transaction to join has a higher score than the lowest scoring standby validator (scaled up by the incumbent factor), then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.

## Earning consensus validator rewards

### Conditions

1. Run a validator node
2. Self-stake at least the minimum set for the network by the parametr <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" /> with the key used to set up the node
3. Forward the relevant Ethereum events
3. Maintain a [validator score](../concepts/chain/validator-scores-and-rewards.md#raw-validator-score) better than the lowest scoring consensus validator

### How consensus validators are chosen

The number of consensus validators is limited to the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" />.

If a standby validator has a better validator score (which includes performance score and stake) than an existing consensus validator, then a standby validator can be promoted to replace a consensus validator.

## How rewards work

Rewards are calculated based on multiple factors, including the type of validator node and staked amount. [Read more about rewards](../concepts/chain/validator-scores-and-rewards.md).