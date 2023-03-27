---
title: API Overview
sidebar_position: 1
vega_network: TESTNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import EthAddresses from '@site/src/components/EthAddresses';

<Topic />

## Introduction
The Vega protocol provides the backbone to form a network specifically built to support trading of financial products on markets proposed and voted on by members of the Vega community.

There are several ways to interact with Vega through APIs and smart contracts, and below you can learn more about the overall technical structure, the reference documentation, and tutorials that are currently available.

As most of the APIs are designed to be used for trading-related queries, the best place to try them out is on the testnet network, also known as Fairground. The public endpoints differ between testnet and mainnet, as do the network configurations your Vega-compatible wallet needs in order to connect. See the public endpoints page for details. You can switch between documentation of the networks' software versions in the top menu bar on every page.

The easiest way to get started with Vega programmatically is by using REST. There are also [gRPC](./grpc/overview.md) and [GraphQL](./graphql/generated.md) endpoints geared towards users with specific requirements. For more about the endpoints they provide, go to their specific sections.

Because Vega is a decentralised network run by independent validators, there are a number of different servers that you'll need to interact while working with the network - data will generally be recieved from one service and transactions will be sent to another. See the [the next section on data flow](#data-flow).

## Data flow
Most of the data you will want to access will come from the trading data REST service. This is served by a 'data node' - servers that read from the event stream (event queue), from a Vega core node and produce a database of the current state, and in some cases store the past state. These data nodes are where you will read data from. 

To send in a transaction - you'll need to use a Vega wallet, which will combine your command with a signature and public key, and send that bundle, which makes up the transaction, to a validator node to be included in the chain.

![How data cycles through the Vega network](/img/concept-diagrams/data-flow-vega.png)

<!--
This guide will use a wallet server running on localhost to 'write' data, and a specific data node to read data from. Depending on your use case, you may eventually run your own data source, or host a wallet on a remote machine.
-->

## Core nodes
Vega's chain is built using the Tendermint consensus mechanism. Read more about Tendermint in their [documentation](https://docs.tendermint.com/). You can see what version of Tendermint the Vega core is using by checking the [statistics endpoint](../api/rest/core/core-service-statistics.api.mdx) for the `chainVersion`.

The Vega core processes each transaction in order, from a block that's been created by Tendermint and then executing the transaction. When the transaction is being executed, it will trigger actions in the core. For example, an order submission could enter the order book, match other orders, trigger trades, etc. The core is comprised of the order books, risk engines, governance mechanisms, market lifecycle, and other essential protocol functions.

![Simplified view of the transaction flow](/img/concept-diagrams/transactions-flow-easy.png)

## Authentication
Authentication takes several forms when interacting with Vega. When requesting data, such as through a query, you don't need to authenticate nor do you need an API token. 

If you want to interact with the network, you'll need to ensure that you have a Vega Wallet, which provides authentication in the form of a signature when sending transactions. 

When creating any scripts or software to interact with Vega, you'll need a wallet authentication token. See the [Wallet API guides to get started](./vega-wallet/before-you-start.md).

## Sending transactions to the chain
When sending transactions, you'll need a Vega Wallet with at least one keypair, and have the wallet service running. You'll need to have your Vega public key (also known as a party ID) to hand, as well as the relevant transaction data, in order to submit your transaction.

When your client needs to sends a transaction, it fills in the details and passes it to the wallet. The wallet provides a client-side proof-of-work calculation, signs the transaction and forwards it to a validator node before it is added to a block.

:::note Go deeper
Read concepts about [transactions on Vega](./../concepts/vega-chain/transactions.md)

You can see a full list of transaction types on the [commands API](./grpc/vega/commands/v1/commands.proto).
:::

### Transaction hashes
Once a transaction has been successfully submitted to the chain, you receive the transaction's hash from the wallet. A transaction hash is a unique identifier for the transaction, and can be used to find that transaction and check its status on a Vega block explorer. Note that a transaction can only be seen by the block explorer once it's been processed by the network.

Depending on transaction type, most will be given an ID, derived from the transaction hash, which is specific to the object the transaction creates once it's processed. You can use that object-specific ID with the relevant endpoint to then get richer, more detailed information about it. 

For example, a submitted order will receive an order ID once the transaction to submit the order has been accepted into a block. You can use the REST endpoint to [get order by ID](./rest/data-v2/trading-data-service-get-order.api.mdx).

## Versioning
Once the latest code is prepared for a release, it's deployed to a testnet, where the latest features and updates can be trialled. When the validator node operators agree that a version is sufficiently stable to be released to mainnet, all code from that version and the previous versions are used to upgrade the network. 

Find out what version a data node is running with the [data node info endpoint](./rest/data-v2/trading-data-service-info.api.mdx).

Breaking APIs changes go through a deprecation cycle, and are announced in the summary for each [release](../releases/overview.md).

The documentation on this site covers the core software version running on the Vega testnet, and the version on the Vega mainnet. Check which version's documentation you're viewing (and switch between them) by referring to the top navigation bar for each page. 

See the [releases page](../releases/overview.md) for a summary of each software release and links to the full changelog on GitHub. 

## REST APIs
REST provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. The bulk of data can be acquired by querying the trading data API, which is served through data nodes.

* **Trading data API** providers historic information and cumulative data, and covers a wide range of data, including, but not limited to:
  * liquidity provisions
  * network limits and parameters
  * information about validator and non-validator nodes
  * reward summaries
  * governance proposals and votes
* **Core service API**: Provides the minimum state of the chain required to build and send a transaction. This is also exposed in the trading data API, which is the recommended API for querying information.
* **Explorer API**: Provides transaction details, designed particularly to support the development of block explorers.
* **Core state API**: This API is specifically for node operators, and may not be exposed by nodes running the network. All methods under this umbrella are also available on the trading data endpoints, which are recommended for querying for this information generally.

### Rate limiting 
To prevent abuse of the APIs provided by data nodes, there are limitations to the rate of API requests that can be enabled by data node operators. Rate limiting is applied on a per-remote-IP-address basis.

Each IP address that connects to data node is assigned a bucket of tokens. That bucket has a maximum capacity, and begins full of tokens. Each API request costs one token, which is removed from the bucket when the call is made. The data node adds a number of tokens every second (the rate of the limiter) to the bucket up to its maximum capacity.

On average over time, this enforces the average rate of API requests to not exceed rate requests/second. It also allows temporary periods of more intensive use; the maximum rate being to use the entire capacity of the bucket within one second.

Clients can use the IETF-RFC compliant-headers to see their rate limiting status. (Read about the [IETF RFC standards↗](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers). 

It's implemented with the following headers in each API response:
* `RateLimit-Limit` The maximum request limit within the time window (1s)
* `RateLimit-Reset` The rate-limiter time window duration in seconds (always 1s)
* `RateLimit-Remaining` The remaining tokens

Upon rejection, the following HTTP response headers are available:
* `X-Rate-Limit-Limit` The maximum request limit
* `X-Rate-Limit-Duration` The rate-limiter duration
* `X-Rate-Limit-Request-Forwarded-For` The rejected request X-Forwarded-For.
* `X-Rate-Limit-Request-Remote-Addr` The rejected request RemoteAddr.

If a client continues to make requests despite having no tokens available, the response will be `HTTP 429 StatusTooManyRequests for HTTP APIs`.

Each unsuccessful response will deduct a token from a separate bucket with the same refill rate and capacity as the requests bucket. Exhausting the supply of tokens in this second bucket will result in the client's IP address being banned for a period of time determined by the data node operators, with 10 minutes as the default.

If banned, the reponse will be `HTTP 403 Forbidden for HTTP APIs`.

Read more about rate limiting in the [rate limiting README ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/ratelimit/README.md) on GitHub.

### Pagination
Pagination in REST is cursor-based. To query data, you can make a GET request to an endpoint. As an example, this section will use the `/transactions` endpoint. Use the query with the desired query parameters. If the query response contains more objects than the specified limit, you can use the `before` or `after` parameter to paginate through the results.

For example, to use `transactions` to retrieve the first 10 transactions, make a GET request to `/transactions?limit=10`. 

You can specify the `after` to be equal to the `endCursor` value (see below) of an item to retrieve the page of **older** objects occurring immediately **after** the named object in the reverse chronological stream. Similarly, if it has a previous page, you can specify the `before` to be equal to the `startCursor` value of an item to retrieve the page of **newer** objecs occurring immediately **before** the named object in the reverse chronological stream.

If your query above receives a response containing 10 transactions, and you want to retrieve the next 10 transactions, you can make a GET request to `/transactions?limit=10&after=<cursor-of-the-last-transaction>`. If you want to paginate backward through the results, you can use the `before` parameter in a similar way.

Example of the cursor part of a query response:
```
    "pageInfo": {
      "hasNextPage": true,
      "hasPreviousPage": false,
      "startCursor": "eyJzeW50aGV0aWNfdGltZSI6IjIwMjMtMDItMjhUMTI6NTg6NTUuMTA1NzRaIn0=",
      "endCursor": "eyJzeW50aGV0aWNfdGltZSI6IjIwMjMtMDItMjhUMTI6NTg6NTUuMTA1NzIzWiJ9"
    }
```
### Other available frameworks [WIP]
gRPC provides fast and efficient communication, and supports near real time streaming of updates from Vega.

GraphQL is used for building UIs that require complex queries. 

## Ethereum bridges
Vega uses ERC-20 assets from Ethereum, and to facilitate inter-chain interactions between Vega and Ethereum, those assets are then transferred through a series of smart contract bridges. These bridges provide a seamless experience for users, allowing them to use Ethereum assets on the (non-Ethereum) Vega chain.

Moreover, these smart contract bridges operate just like any other smart contract on Ethereum, meaning that users can interact with them directly using an Ethereum JSON-RPC node or a service like [Etherscan ↗](https://etherscan.io/), which provides a user-friendly interface for exploring and interacting with Ethereum smart contracts.

#### Smart contracts

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

#### Ethereum addresses
<EthAddresses frontMatter={frontMatter} />

**[Smart contracts overview](./bridge/index.md)**: Start exploring the contracts.

## Vega Wallet integration [WIP]
If you're looking to integrate the Vega Wallet with a dApp or bots, you'll most likely need to use the wallet API. The wallet is also how you authenticate and send transactions to the network. To use the API to programmatically interact with the network for your own transactions, [download a Vega Wallet](../tools/vega-wallet/index.md).

The [**Wallet API**](./vega-wallet/before-you-start.md) (in alpha) uses JSON-RPC with an HTTP wrapper. 

## Primary elements [WIP]
(Ordered so they layer up - each can't exist without one or more of the previous things. Still needed: links to concepts for more info on each)

### Parties
A party is a single user, defined as a Vega public key. As one person or entity can have many public keys, this is a unique identifier as far as an individual key's actions.  A party ID and a Vega public key (pubkey) are equivalent, and can be used interchangeably.

Show a paginated list of parties using the **[parties endpoint](../api/rest/data-v2/trading-data-service-list-parties.api.mdx)**.

### Assets
Assets used on Vega (to start) are all ERC-20 tokens, and thus originate on the Ethereum chain, not the Vega chain. Inter-chain asset interactions between Vega and Ethereum are facilitated through the [Ethereum bridges](#ethereum-bridges). 

Assets can only be added to the network to be used as a market settlement asset through a governance action, and a follow-on update to the asset bridge.

See all assets that can be used on the network with the **[list assets endpoint]](../api/rest/data-v2/trading-data-service-list-assets.api.mdx)**.

Show a specific asset details using the **[asset endpoint](../api/rest/data-v2/trading-data-service-get-asset.api.mdx)**.

### Deposits and withdrawals
Assets used on the Vega network need to be deposited from an Ethereum wallet using the [bridge contracts](#ethereum-bridges), and can be withdrawn back into an Ethereum wallet if they are not being used for margin or liquidity commitments.

[See all deposits](../api/rest/data-v2/trading-data-service-list-deposits.api.mdx) for a specific party ID.
[See a specific deposit](../api/rest/data-v2/trading-data-service-get-deposit.api.mdx) using its ID.

Read more: [Deposits and withdrawals](../concepts/deposits-withdrawals.md)

### Accounts
Vega relies on accounts to ensure funds are never lost or double spent. The amounts in each account, as well as the transactions that were added to and removed from those accounts, are all recorded and stored on-chain. Accounts are used either to hold assets that the public key holder is in control of using — such as deposited collateral, or for setting money aside that only the network can manage — to fulfil margin requirements, for example, or to store assets that are earmarked for rewards or paying out fees.

List [accounts](../api/rest/data-v2/trading-data-service-list-accounts.api.mdx) based on chosen filters.

[Read about accounts](../concepts/accounts.md)

### Markets
Markets have accounts, are created with proposals, and allow parties to place orders with assets.

| Documentation | Description | Call |
| ----------- | ----------- | ----------- |
| [List markets](../api/rest/data-v2/trading-data-service-list-markets.api.mdx) | See all markets on the network. | `GET /api/v2/markets`
| [Market](../api/rest/data-v2/trading-data-service-get-market.api.mdx) | Get information about a single market using the market's ID. | `GET /api/v2/market/:marketId`
| [Markets data](../api/rest/data-v2/trading-data-service-list-latest-market-data.api.mdx) | List the latest market data for every market. | `GET /api/v2/markets/data`

### Governance proposals and voting
Governance proposals used to add new assets and markets, as well as to suggest changes to assets, markets, and network parameters, as well as off-chain suggestions. VEGA tokens need to be associated to the Vega public key that wants to take part in governance.

| Documentation | Description | Call |
| ----------- | ----------- | ----------- |
| [List proposals](../api/rest/data-v2/trading-data-service-list-governance-data.api.mdx) | View all governance proposals with their current state, paginated. | `GET /api/v2/governances`
| [Proposal](../api/rest/data-v2/trading-data-service-get-governance-data.api.mdx) | Get detailed information about a specific governance proposal using its ID. | `GET /api/v2/governance`

#### Governance token
VEGA token are used for taking part in network, market, asset and freeform governance, and to secure the network by nominating validators that run the network.

| Documentation | Description | Call |
| ----------- | ----------- | ----------- |
| [List votes](../api/rest/data-v2/trading-data-service-list-votes.api.mdx) | See a list of votes. | `GET /api/v2/votes` |

Explore the **[tutorials for submitting proposals](../tutorials/proposals/index.md)** using the command line.

### Orders
An order is an instruction to buy or sell on a specific market, and it can go long or short on the market's price. Placing an order does not guarantee it gets filled, but if it is filled, it will result in a position, which will require collateral to use for margin to keep that position open.

| Documentation | Description | Call |
| ----------- | ----------- | ----------- |
| [Order](../api/rest/data-v2/trading-data-service-get-order.api.mdx) | Get information about an order using its ID. | `GET /api/v2/order/:orderId` |
| [List orders](../api/rest/data-v2/trading-data-service-list-orders.api.mdx) | Get a list of orders that have been filtered based on information you provide. | `GET /api/v2/orders`
| [List positions](../api/rest/data-v2/trading-data-service-list-all-positions.api.mdx) | Get a list of all positions for a specific party ID | `GET /api/v2/positions` 
| [List trades](/api/rest/data-v2/trading-data-service-list-trades.api.mdx) | Get a paginated list of all trades, optionally filtered by party, market, or order | `GET /api/v2/trades`

* [Read more about **orders**](../concepts/trading-on-vega/orders.md)
* [Read more about **positions**](../concepts/trading-on-vega/positions-margin.md)

## Tutorials
Tutorials provide the information you'll need about the protocol to understand and use the guide, as well as instructions on how to interact with scripts, API calls, or other code. 

**[Tutorials](../tutorials)**: See the tutorial(s) currently available for this network.
<!--
## Now we'll need more detail on the combinations of those things--->
