---
title: Start developing
sidebar_position: 1
vega_network: TESTNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import EthAddresses from '@site/src/components/EthAddresses';

<Topic />

This page describes the Vega architecture, how authentication and transactions work, and the versioning process.

## Decentralised network
The Vega protocol provides the backbone to form a network specifically built to support trading of financial products on markets proposed and voted on by members of the Vega community.

Vega is a public, decentralised network run by independent validators. 

There are a number of different servers that you'll need to interact while working with the network - data will generally be recieved from one service and transactions will be sent to another using data nodes. See the [the next section on data flow](#data-flow).

:::caution Supplying your own data
Anyone that plans to build significant integrations, trading bots, or power backed services should expect to run their own data node, or collaborate with a data node provider, if one exists. 
:::

## Architecture 
#
### Data flow
Most of the data you will want to access will come from the trading data REST service. This is served by a 'data node' - servers that read from the event stream (event queue), from a Vega core node and produce a database of the current state, and in some cases store the past state. These data nodes are where you will read data from. 

To send in a transaction - you'll need to use a Vega wallet, which will combine your command with a signature and public key, and send that bundle, which makes up the transaction, to a validator node to be included in the chain.

![How data cycles through the Vega network](/img/concept-diagrams/data-flow-vega.png)

<!--
This guide will use a wallet server running on localhost to 'write' data, and a specific data node to read data from. Depending on your use case, you may eventually run your own data source, or host a wallet on a remote machine.
-->

### Core nodes
Vega's chain is built using the CometBFT (previously Tendermint) consensus mechanism. Read more about Tendermint in their [documentation](https://docs.cometbft.com/). You can see what version of Comet the Vega core is using by checking the [statistics endpoint](../api/rest/core/core-service-statistics.api.mdx) for the `chainVersion`.

The Vega core processes each transaction in order, from a block that's been created by CometBFT, by validating and then executing the transaction. When the transaction is executed, it will trigger actions in the core. For example, an order submission could enter the order book, match other orders, create trades, etc. The core is comprised of the order books, risk engines, governance mechanisms, market lifecycle, and other essential protocol functions.

![Simplified view of the transaction flow](/img/concept-diagrams/transactions-flow-easy.png)

### Data nodes
While the core emits events when states change, it does not store the data about those events. Any processing that isn't required to make the next block is done by the data node. The data node collects, stores, and relates the events, and makes them available through the API queries.

Some data nodes are run by consensus validators and offer public access to the APIs for viewing data, others may be entirely private. Community members and other service providers may also operate public data nodes. These may have usage restrictions, rate limits, limited data retention, or other restrictions or terms. 

Anyone who wants to can run a data node.

:::note Go deeper
* **[Data node concepts](../concepts/vega-chain/data-nodes.md)**: Get into the details about data nodes.
* **[How to set up a data node](../node-operators/get-started/setup-datanode.md)**: Step by step instructions and config guidance.
:::

## Authentication
Authentication takes several forms when interacting with Vega. When requesting data from a standard data node, such as through a query, you don't need to authenticate nor do you need an API token. Service providers offering free or paid data nodes may require you to authenticate, however. If this is the case you will need to refer to the provider's documentation for details of how to do so.

If you want to interact with the network, you'll need to ensure that you have a Vega Wallet, which provides authentication in the form of a signature when sending transactions. 

When creating any scripts or software to interact with Vega, you'll need a wallet authentication token. 

:::note Go deeper
**[Wallet API guides](./vega-wallet/before-you-start.md)**: See the wallet API documentation for more on authentication tokens.
:::

## Sending transactions to the chain
When sending transactions, you'll need a Vega Wallet with at least one keypair, and have the wallet service running. You'll need to have your Vega public key (also known as a party ID) to hand, as well as the relevant transaction data, in order to submit your transaction.

To access the Vega network, the wallet needs to be configured with the location of one of more data nodes.

When your client wants to send a transaction using the Vega wallet API, it will construct the transaction in JSON and pass it to the wallet. The wallet performs a client-side proof-of-work calculation, signs the transaction and forwards it to a validator node before it is added to a block. It is also possible to have the wallet sign a transaction without sending it, if needed.

:::note Go deeper
* **[Transactions](./../concepts/vega-chain/transactions.md)**: Learn about transactions, commands, validation, and ordering.
* **[Commands API](./grpc/vega/commands/v1/commands.proto)** See a full list of transaction types. 
:::

### Transaction hashes
Once a transaction has been successfully submitted to the chain, you receive the transaction's hash from the wallet. A transaction hash is a unique identifier for the transaction, and can be used to find that transaction and check its status on a Vega block explorer. Note that a transaction can only be seen by the block explorer once it's been processed by the network and been propagated to the Vega node on the block explorer backend.

Depending on transaction type, most will be given a deterministic ID, derived from the transaction hash, which is specific to the object the transaction creates once it's processed. You can use that object-specific ID with the relevant endpoint to then get richer, more detailed information about it. 

For example, a submitted order will receive an order ID once the transaction to submit the order has been accepted into a block. You can use the REST endpoint to [get order by ID](./rest/data-v2/trading-data-service-get-order.api.mdx).

## Versioning

:::tip Network software versions 
You can switch between documentation of the networks' software versions in the top menu bar on every page.
:::

Once the latest code is prepared for a release, it's deployed to a testnet, where the latest features and updates can be trialled. When and if the validator node operators agree that a new version contains changes that should be accepted into mainnet, and is sufficiently stable, they will deploy the code on their nodes and vote on chain to signal readiness to upgrade. 

Find out what version a data node is running with the [data node info endpoint](./rest/data-v2/trading-data-service-info.api.mdx).

Breaking APIs changes go through a deprecation cycle, and are announced in the summary for each [release](../releases/overview.md).

The documentation on this site covers the core software version running on the Vega Fairground testnet, and the version on the Vega mainnet. Check which version's documentation you're viewing (and switch between them) by referring to the top navigation bar for each page. 

See the [releases page](../releases/overview.md) for a summary of each software release and links to the full changelog on GitHub. 

## Next steps
Once you have a high-level understanding, read through the following topics.

**[Primary elements](./primary-elements.md)**: The basic building blocks you should know about.
**[Using the APIs](./using-the-apis.md)**: All the API frameworks and smart contracts in one place, plus tips on connecting.
**[Public endpoints](./public-endpoints.md)**: Public endpoints that are currently available for interacting with the APIs on the testnets.
**[Tutorials](../tutorials/index.md)**: Each tutorial includes info about the protocol that you need to use the guide, as well as instructions on how to interact with scripts, API calls, or other code.