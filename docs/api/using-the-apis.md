---
title: Using the APIs
sidebar_position: 2
description: See the frameworks and how to use the APIs.
vega_network: TESTNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import EthAddresses from '@site/src/components/EthAddresses';

<Topic />

## Connecting to the APIs
To use the Vega APIs, a developer will need access to a network-compatible instance of the relevant software, depending on their goals: core node, data node, and/or Vega Wallet.

**Mainnet**: The consensus validators may provide public endpoints for accessing the mainnet APIs, however that does not mean they should be relied upon for constant uptime and full access to all APIs. Each Vega Wallet release for mainnet wallet is pre-configured with any publicly announced nodes at the time of release.

**Validator testnet**: Some consensus validators may provide public endpoints for accessing the APIs on the validator testnet network, however that does not mean they should be relied on for constant uptime or full access to APIs.

**Fairground**: The project team operate a number of nodes and data nodes with publicly available endpoints for the Vega-run testnet. Each Fairground wallet app release is pre-configured with known nodes, including those operated by the project team, at the time of release.

## Available frameworks [WIP]

### REST
REST provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. While the data provided through REST can come from three different places, the bulk of data can be acquired by querying the trading data API, which is served through data nodes.

[Using REST](./rest/overview.md): Read the REST overview for everything you need to know before using the endpoints.

### WebSocket
WebSocket endpoints offer real-time updates to changes in the state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

### gRPC
gRPC provides fast and efficient communication, and supports near real time streaming of updates from Vega.

### GraphQL
GraphQL is used for building UIs that require complex queries. 

## Ethereum bridges
Vega uses ERC-20 assets from Ethereum, and to facilitate inter-chain interactions between Vega and Ethereum, those assets are then transferred through a series of smart contract bridges. These bridges provide a seamless experience for users, allowing them to use Ethereum assets on the (non-Ethereum) Vega chain.

Moreover, these smart contract bridges operate just like any other smart contract on Ethereum, meaning that users can interact with them directly using an Ethereum JSON-RPC node or a service like [Etherscan ↗](https://etherscan.io/), which provides a user-friendly interface for exploring and interacting with Ethereum smart contracts.

### Smart contracts

* [ERC20 Bridge Logic](./bridge/contracts/ERC20_Bridge_Logic.md)
  * Contains the functions necessary to deposit, withdraw, list assets, etc. It's controlled by Multisig Control and controls Asset Pool.
* [ERC20 Asset Pool](./bridge/contracts/ERC20_Asset_Pool.md)
  * Holds deposited assets and remits them to provided addresses based on orders from the assigned Bridge Logic. It is controlled by Bridge Logic and Multisig Control.
* [Multisig Control](./bridge/contracts/MultisigControl.md)
  * Handles verification of orders signed by a threshold of validators. 
* [Staking Bridge](./bridge/contracts/Vega_Staking_Bridge.md)
  * Allows users to deposit and withdraw VEGA tokens for staking. The VEGA tokens are always controlled exclusively by the tokenholder, even when on the Staking Bridge. Stake can be removed at any time by the tokenholder.
* VEGA Token contract
  * ERC20 token smart contract.
* Vesting contract
  * All VEGA tokens are issued through this. Handles the linear vesting of VEGA tokens and allows users to stake VEGA they own (vested or not).

### Ethereum addresses
<EthAddresses frontMatter={frontMatter} />

**[Smart contracts overview](./bridge/index.md)**: Start exploring the contracts.

## Vega Wallet integration
If you're looking to integrate the Vega Wallet with a dApp or bots, you'll most likely need to use the wallet API, as the Vega Wallet can be used to authenticate and send transactions to the network.

The **Wallet API** uses JSON-RPC with an HTTP wrapper. You can review the [guidance on how to use the API](./vega-wallet/before-you-start.md) before jumping into the reference documentation. 

To use the Wallet API to programmatically interact with the network for your own transactions, [download a Vega Wallet](../tools/vega-wallet/index.md) before starting.
