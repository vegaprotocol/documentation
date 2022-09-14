---
sidebar_position: 3
title: Become a standby validator
sidebar_label: Standby nodes
---
import NetworkParameter from '@site/src/components/NetworkParameter';

To become a standby validator, a validator must first be a [candidate](candidate-validators), then meet the following [requirements](#requirements).

The number of standby nodes is limited to (<NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} /> × <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" name="the number of consensus nodes" />).

They are promoted when they pass [consensus validator requirements](consensus#requirements).

## Requirements
1. Run a validating node
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> with the key used to set up the node
3. Maintain a [ranking](../ranking) amongst the top (<NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} /> × <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />) validators

## How standby validators are chosen
If there are free slots for one or more standby validators, and there are nodes that have submitted the transaction to join (and satisfy all joining conditions), they are added as standby validators in the next epoch.

If a node that submits the transaction to join has a higher score than the lowest scoring standby validator (scaled up by the incumbent factor), then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.