---
sidebar_position: 1
title: Overview
---
import NetworkParameter from '@site/src/components/NetworkParameter';

# Node operators

This section offers guidance on how to launch, maintain, and upgrade a node, and how to earn promotion to standby or consensus status for greater rewards.

## The validator journey

All validators begin as candidates, and can be promoted to [standby](concepts/vega-chain#standby-validators) and then [consensus](concepts/vega-chain#consensus-validator-nodes) status. There are some limits on the number of places available: <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} /> for consensus validators, and <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} suffix="×" /> that number for standby validators, but no limit for candidate validators. Places are assigned based on [performance](concepts/vega-chain#validating-node-performance).

## Set up a new node
When you're acquainted with the validator lifecycle, performance criteria, and [infrastructure guidelines](concepts/vega-chain#infrastructure-guidelines), follow the [tutorial to set up and run a validating node](node-operators/get-started):

1. [Install node binaries](node-operators/get-started/install)
2. [Set up a validating node](node-operators/get-started/setup-validator)
3. [Self-stake](node-operators/get-started/self-stake)
4. [Announce to the community](node-operators/get-started/announce)

## Maintain an existing node

The [how-to guides](node-operators/how-to) detail common node maintenance activities.