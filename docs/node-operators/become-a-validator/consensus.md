---
sidebar_position: 4
title: Become a consensus validator
sidebar_label: Consensus
---
import NetworkParameter from '@site/src/components/NetworkParameter';

To become a consensus validator, a validator must first be a [standby](standby), then pass certain performance criteria.

The number of consensus validators is limited to <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />.

They may be relegated to [standby](standby-nodes) if a standby validator exceeds their performance.

## Requirements
1. Run a validating node
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> with the key used to set up the node
3. Forward the relevant Ethereum events
4. Maintain a [validator score](validator-score) in the top <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />

## How consensus validators are chosen
Consensus validators are chosen based on a range of variables, including the validator scores, and the number of available slots. If there are no empty slots, at most one validator can be changed per epoch.

If a standby validator has a better validator score (which includes performance score and stake) than an existing consensus validator, then a standby validator can be promoted to replace a consensus validator.

## Performance score
For each block, the proposer is selected deterministically and the number of times each consensus validator is selected is roughly proportional to their voting power.

A validator’s performance is calculated as follows:

let `p` be the number of times the validator proposed blocks in the previous epoch 
let `b` be the number of blocks in the previous epoch 
let `v` be the voting power of the validator in the previous epoch 
let `t` be the total voting power in the previous epoch
let expected = `v*b/t` the number of blocks the validator is expected to propose. 
Then `validator_performance = max(0.05, min((p/expected, 1))`