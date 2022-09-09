---
sidebar_position: 2
title: Become a candidate validator
sidebar_label: Candidate nodes
---
import NetworkParameter from '@site/src/components/NetworkParameter';

All validators begin as candidates.

The number of candidate validators is unlimited.

They are promoted when they pass [standby validator requirements](standby#requirements).

## Requirements

1. [Run a validating node](http://localhost:3000/docs/testnet/node-operators/get-started)
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens"/> with the key used to set up the node

## How candidate validators are chosen

All validators who pass the requirements above are accepted and [ranked](../ranking).