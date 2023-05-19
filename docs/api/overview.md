---
title: Start developing
sidebar_position: 1
vega_network: TESTNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import EthAddresses from '@site/src/components/EthAddresses';

<Topic />

This page describes how authentication and transactions work, and the versioning process.

## Decentralised network
The Vega protocol provides the backbone to form a network specifically built to support trading of financial products on markets proposed and voted on by members of the Vega community.

Vega is a public, decentralised network run by independent validators. 

There are a number of different servers that you'll need to interact while working with the network - data will generally be recieved from one service and transactions will be sent to another using data nodes. See the [data flow section on the architecture page](./architecture.md#data-flow).

:::caution Supplying your own data
Anyone that plans to build significant integrations, trading bots, or power backed services should expect to run their own data node, or collaborate with a data node provider, if one exists. 
:::

## Authentication
Authentication takes several forms when interacting with Vega. When requesting data from a standard data node, such as through a query, you don't need to authenticate nor do you need an API token. 

Data node operators offering free or paid data nodes may require you to authenticate, and if this is the case you will need to refer to the provider's documentation for details of how to do so.

If you want to submit transactions to the network, all you need is a Vega wallet or signer library to sign the transaction using your keys.

However, if you want to integrate the official Vega wallet implementation with your web application or script, you'll need to use the connection layer built into the wallet API, and a wallet API authentication token.

:::note Go deeper
**[Wallet API guides](./vega-wallet/before-you-start.md)**: See the wallet API documentation for more on authentication tokens.
:::

## Sending transactions to the chain
When sending transactions, you'll need a Vega Wallet with at least one keypair, and have the wallet service running. You'll need to have your Vega public key (also known as a party ID) to hand, as well as the relevant transaction data, in order to submit your transaction.

To access the Vega network, the wallet needs to be configured with the location of one of more [data nodes](./architecture.md#data-nodes).

When your client wants to send a transaction using the Vega wallet API, it will construct the transaction in JSON and pass it to the wallet. The wallet performs a client-side proof-of-work calculation, signs the transaction and forwards it to a node on the network before it is added to a block. It is also possible to have the wallet sign a transaction without sending it, if needed. Alternatively, you can build the signer into your client, though you'll need to account for the PoW calculations.

:::note Go deeper
* **[Transactions](./../concepts/vega-chain/transactions.md)**: Learn about transactions, commands, validation, and ordering.
* **[Commands API](./grpc/vega/commands/v1/commands.proto)** See a full list of transaction types. 
:::

### Transaction hashes
Once a transaction has been successfully submitted to the chain, you receive the transaction's hash from the wallet. A transaction hash is a unique identifier for the transaction, and can be used to find that transaction and check its status on a Vega block explorer. Note that a transaction can only be seen by the block explorer once it's been processed by the network and been propagated to the Vega node on the block explorer backend.

Depending on transaction type, most will be given a deterministic ID, derived from the signature, which is specific to the object the transaction creates once it's processed. You can use that object-specific ID with the relevant endpoint to then get richer, more detailed information about it. 

For example, a submitted order will receive an order ID once the transaction to submit the order has been accepted into a block. You can use the REST endpoint to [get order by ID](./rest/data-v2/trading-data-service-get-order.api.mdx).

## Versioning

:::tip Network software versions 
You can switch between documentation of the networks' software versions in the top menu bar on every page.
:::

Once the latest code is prepared for a release, it's deployed to a testnet, where the latest features and updates can be trialled. When and if the validator node operators agree that a new version contains changes that should be accepted into mainnet, and is sufficiently stable, they will deploy the code on their nodes and vote on chain to signal readiness to upgrade. 

Find out what version a data node is running with the [data node info endpoint](./rest/data-v2/trading-data-service-info.api.mdx).

Breaking APIs changes go through a deprecation cycle, and are announced in the summary for each [release](../releases/overview.md).

The documentation on this site covers the core software version running on the Vega Fairground testnet, and the version on the validator-run Vega mainnet. Check which version's documentation you're viewing (and switch between them) by referring to the top navigation bar on each page. 

See the [releases page](../releases/overview.md) for a summary of each software release and links to the full changelog on GitHub. 

## Next steps
To learn more about developing on Vega, read through the following topics.

* **[Using the APIs](./using-the-apis.md)**: All the API frameworks and smart contracts in one place, plus tips on connecting.
* **[Architecture](./architecture.md)**: Explore the architecture of the Vega network.
* **[Primary elements](./primary-elements.md)**: The basic building blocks you should know about.
* **[Public endpoints](./public-endpoints.md)**: Public endpoints that are currently available for interacting with the APIs on the testnets.
* **[Tutorials](../tutorials/index.md)**: Each tutorial includes info about the protocol that you need to use the guide, as well as instructions on how to interact with scripts, API calls, or other code.