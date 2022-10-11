---
sidebar_position: 2
title: Validator infrastructure requirements
sidebar_label: Infrastructure
vega_network: TESTNET
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';

This page covers the minimum token requirements, minimum and recommended hardware requirements, and the software requirements for running a Vega node to be a validator candidate.

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

## Token requirements
To run a validator node, the node operator must have a minimum amount of Vega available to stake to that node: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={false} formatter="governanceToken" suffix="tokens" />

## Software requirements

#### Go
You'll need 'go' version 1.19.1 or newer.

#### Vega Wallet
You'll need a version of the Vega Wallet that matches with the version of software you're using to install your node.
