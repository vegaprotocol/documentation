---
title: Setting up a Vega node
hide_title: false
sidebar_position: 1
---
The Vega network runs on a set of publicly maintained computers, or nodes, on the validator testnet. A Vega network needs validating nodes that take part in consensus, as well as data nodes that receive and store network events that can be queried.

The more people run validators, the more robust the network will be. This is however limited by scalability of the underlying consensus protocol, and also requires some diversity properties (e.g., not all validators using the same cloud provider).

Setting up and running a validator can be broken down into three parts:

1. Setting up the server and building the software.
2. Configuring the components and getting it up and running.
3. Joining the network and requesting to be added to the validator set.

All nodes are running the same 'vega' codebase with the latest releases available on [GitHub ↗](https://github.com/vegaprotocol/vega).

Find out how to maintain and upgrade a node by working through the instructions below.

:::tip
**[Validating nodes](/docs/testnet/concepts/vega-chain#validating-nodes)**: Learn about how nodes work on Vega. Explore the different types of nodes that run a Vega network, how they're chosen, and what impact their scores have on their status. 
:::

| Topic                                                                 |  Description                                                                                                        |
| ----------------------------------------------------------------------| -------------------------------------------------------------------------------------------------------- |
| [System requirements](./system-requirements.md)                               | Find out what hardware and software you need to run a validating node for the Vega network. |
| [Install node binaries](./setup-server.md)                               | This guide walks you through installing the software and setting up the server. |
| [Set up a validator](./setup-validator.md)                               | This guide takes your through all the steps to configure your node as a validator and join an existing network. |
| [Network restarts](./network-restarts.md)                               | This guide walks you through how to manage network restarts. |
| [Snapshots](./snapshots.md)                               | This guide will take you through using the state snapshots. |
| [Rotating Vega keys](./vega-key-rotation.md)                               | This guide will take you through rotating your Vega key for security purposes. |
