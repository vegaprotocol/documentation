---
sidebar_position: 4
title: Become a consensus validator
sidebar_label: Consensus nodes
---
import NetworkParameter from '@site/src/components/NetworkParameter';

To become a consensus validator, a validator must first be a [standby](standby), then meet the following [requirements](#requirements).

The number of consensus validators is limited to <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />.

They may be relegated to [standby](standby-nodes) if a standby validator exceeds their performance.

## Requirements
1. Run a validating node
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> with the key used to set up the node
3. Forward the relevant Ethereum events
4. Maintain a [ranking](../ranking) amongst the top <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} /> validators

## How consensus validators are chosen
Consensus validators are chosen based on a range of variables, including the validator scores, and the number of available slots. If there are no empty slots, at most one validator can be changed per epoch.

If a standby validator has a better validator score (which includes performance score and stake) than an existing consensus validator, then a standby validator can be promoted to replace a consensus validator.