---
title: Architecture
sidebar_position: 3
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';

<Topic />

This page describes the Vega architecture.

## Data flow
Most of the data you will want to access will come from the trading data REST service. This is served by a 'data node' - servers that read from the event stream (event queue), from a Vega core node and produce a database of the current state, and in some cases store the past state. These data nodes are where you will read data from. 

To send in a transaction - you'll need to use a Vega wallet, which will combine your command with a signature and public key, and send that bundle, which makes up the transaction, to a validator node to be included in the chain.

![How data cycles through the Vega network](/img/concept-diagrams/data-flow-vega.png)

<!--
This guide will use a wallet server running on localhost to 'write' data, and a specific data node to read data from. Depending on your use case, you may eventually run your own data source, or host a wallet on a remote machine.
-->

## Core nodes
Vega's chain is built using the CometBFT (previously Tendermint) consensus mechanism. Read more about CometBFT in their [documentation](https://docs.cometbft.com/). You can see what version of Comet the Vega core is using by checking the [statistics endpoint](../api/rest/transaction/transaction-statistics.api.mdx) for the `chainVersion`.

The Vega core processes each transaction in order, from a block that's been created by CometBFT, by validating and then executing the transaction. When the transaction is executed, it will trigger actions in the core. For example, an order submission could enter the order book, match other orders, create trades, etc. The core is comprised of the order books, risk engines, governance mechanisms, market lifecycle, and other essential protocol functions.

![Simplified view of the transaction flow](/img/concept-diagrams/transactions-flow-easy.png)

## Data nodes
While the core emits events when states change, it does not store the data about those events. Any processing that isn't required to make the next block is done by the data node. The data node collects, stores, and relates the events, and makes them available through the API queries.

Some data nodes are run by consensus validators and offer public access to the APIs for viewing data, others may be entirely private. Community members and other service providers may also operate public data nodes. These may have usage restrictions, rate limits, limited data retention, or other restrictions or terms. 

Anyone who wants to can run a data node.

:::note Go deeper
* **[Data node concepts](../concepts/vega-chain/data-nodes.md)**: Get into the details about data nodes.
* **[How to set up a data node](../node-operators/get-started/setup-datanode.md)**: Step by step instructions and config guidance.
:::

## Next steps
Once you have a high-level understanding, read through the following topics.

* **[Useful endpoints](./useful-endpoints.md)**: The basic features you should know about and their APIs.
* **[Using the APIs](./using-the-apis.md)**: Quick intro to all the frameworks and smart contracts to help you find what you need.
* **[Public servers](./public-servers.md)**: Public servers that are currently available for interacting with the APIs on the testnets.
* **[Tutorials](../tutorials/index.md)**: Each tutorial includes info about the protocol that you need to use the guide, as well as instructions on how to interact with scripts, API calls, or other code.