---
title: Setting up a Vega node
hide_title: false
sidebar_position: 1
---
The Vega network runs on a set of publicly maintained computers. A Vega network needs validator nodes that take part in consensus, as well as data nodes that receive and store network events that can be queried.

The more people run validators, the more robust the network will be. This is however limited by scalability of the underlying consensus protocol, and also requires some diversity properties (e.g., not all validators using the same cloud provider).

:::warning
It is highly recommended that you have significant system administration experience before attempting to run your own validator node.

You must be able to handle and act on technical issues with your node. Being a validator involves more than just executing the Vega binary and self-staking.
:::

## Requirements
**[Security, infrastructure, self-stake and active communication](requirements/index.md)**: Prospective validators on Vega must meet the requirements for their node infrastructure as well as building trust with the community.

<!--**[Validator node overview](/docs/testnet/concepts/vega-chain#validator-nodes)**: Before beginning the process, learn how nodes work on Vega. Explore the different types of validator nodes that run a Vega network, how they're chosen, and what impact their scores have on their status.-->

## Getting started
Setting up and running a validator can be broken down into these parts:

1. [Configuring the components](./get-started/setup-validator.md)
2. [Joining the network and the validator set](./get-started/setup-validator.md#synchronise-your-node)

## Maintaining your node
To keep your node and its related components functioning and up-to-date, refer to the how-tos below.

| Topic                       |  Description                                                                                                        |
| ----------------------------------------------------------------------| -------------------------------------------------------------------------------------------------------- |
| [Restart network with checkpoints](./how-to/restart-network.md)                               | This explains how to manage network restarts. |
| [Restart from snapshots](./how-to/use-snapshots.md)                               | This guide will take you through using the state snapshots. |
| [Propose and execute a protocol upgrade](./how-to/upgrade-network.md) | This guide describes how to propose a protocol software upgrade and then upgrade the network using Visor or manually. |
| [Rotate Ethereum keys](./how-to/rotate-ethereum-keys.md) | This guide will take you through rotating your Ethereum key for security purposes. |
| [Rotate Vega keys](./how-to/rotate-vega-keys.md)                               | This guide will take you through rotating your Vega key for security purposes. |
| [Resolve common issues](./how-to/solve-frequent-issues.md)                               | This guide will describe issues you may encounter, and potential solutions. |
