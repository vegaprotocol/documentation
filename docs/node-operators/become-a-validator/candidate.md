---
sidebar_position: 2
title: Become a candidate validator
sidebar_label: Candidate
---
import NetworkParameter from '@site/src/components/NetworkParameter';

All validators begin as candidates.

The number of candidate validators is unlimited.

They are promoted to [standby validator](standby) when they pass [the selection criteria](standby#how-standby-validators-are-chosen).

## Requirements

1. [Run a validating node](http://localhost:3000/docs/testnet/node-operators/get-started)
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens"/> with the key used to set up the node

## Infrastructure guidelines
Validators need to run a set of executables each with their own resource requirements to enable the network to function under varying loads. 

For a validator running a node the following guidelines can be used when sizing up the hardware required.

| Resource    | Minimum     | Recommended |
| ----------- | ----------- | ----------- |
| CPU | 4 cores at >3Ghz | 6 cores at >= 4Ghz|
| RAM   | 8GB        | 16GB        |
| Storage   | 256GB SSD| 1TB NVMe SSD |

The impact of using fewer cores than recommended is that the critical parts (data node and non-validators) will be starved of CPU resources, which will reduce the maximum throughput of the network.

The impact of having slower cores than recommended (or older cores that have a reduced IPC rate compared to modern Zen3 cores) is that the maximum throughput will be reduced due to the bottlenecks being single threaded.

## How candidate validators are ranked
At the end of each epoch, the Vega network will calculate validator score. The consensus validators during that epoch will have their validator scores scaled by (1 + <NetworkParameter frontMatter={frontMatter} param="network.validators.incumbentBonus" hideName={true} />). This number combines self-stake and nominated stake with the performance score (which measures basic node performance).

Vega sorts all current consensus validators from the highest performance score to the lowest. All of those who submit a transaction expressing intent to be a validator are then sorted by their validator score, highest to lowest.

* If there are already empty consensus validator slots, then the non-consensus validators who have the top scores are moved in to be consensus validators, starting in the next epoch.
* If a potential validator has a higher score than the lowest incumbent consensus validator, then in the next epoch the higher-scoring validator becomes a consensus validator, and the lowest scoring incumbent becomes a standby validator.
* If two validators have the same performance score, then the network places higher the one who's been validator for longer, and if two validators who joined at the same time have the same score, the priority goes to the one who submitted the transaction to become validator first.