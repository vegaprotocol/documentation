---
sidebar_position: 2
title: Validator requirements
sidebar_label: Requirements
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
| CPU | 6 cores at >= 4Ghz | 12 cores at >= 4Ghz|
| RAM   | 16GB            | 32GB        |
| Storage   | 1TB NVMe SSD| 2TB NVMe SSD |

The impact of using fewer cores than recommended is that the critical parts (data node and non-validators) will be starved of CPU resources, which will reduce the maximum throughput of the network.

The impact of having slower cores than recommended (or older cores that have a reduced IPC rate compared to modern Zen3 cores) is that the maximum throughput will be reduced due to the bottlenecks being single threaded.

## Token requirements
To run a validator node, the node operator must have a minimum amount of Vega available to stake to that node: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={false} formatter="governanceToken" suffix="tokens" />

## Validator community
To finalise setting up your validator node, you will need to join the Vega validators Discord channel. That channel is where important information is shared between node operators, and where validator votes, and new software availability are announced.

## Software requirements

### Operating system 
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far. 

### Go
You'll need 'go' version 1.19.1 or newer.

### Vega Wallet
You'll need a version of the Vega Wallet that matches with the version of software you're using to install your node. You can get this when you install Vega. 

## Data node PostgreSQL requirement
After building, to run your data node, you will have to run a PostgreSQL server (as of software v0.53).

There are several ways to do this:
**From 0.54.x onwards:**
- As described in the [data node readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md). The simplest and recommended way to do this is [using docker](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md#using-docker), which is also described in the data node readme.

## Block explorer PostgresSQL requirement [WIP]
