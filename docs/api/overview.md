---
vega_network: TESTNET
---
import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';

<Topic />

## Introduction
The Vega protocol forms a blockchain specifically built to support trading of financial products on markets proposed and voted on by members of the Vega community.

There several ways to interact with Vega through APIs and smart contracts, and below you can learn more about the overall technical structure, the reference documentation, and tutorials that are currently available.

As most of the APIs are designed to use for trading-related queries, the best place to try them out is on the testnet network, also known as Fairground. The public endpoints differ between testnet and mainnet, as do the network configurations your Vega-compatible wallet needs in order to connect. See the public endpoints page for details. You can switch between documentation of the networks' software versions in the top menu bar on every page.

The easiest way to get started with Vega programmatically is by using REST. There are also [gRPC](./grpc/overview.md) and [GraphQL](./graphql/generated.md) endpoints geared towards users with specific requirements. For more about the endpoints they provide, go to their specific sections.

Because Vega is a decentralised network run by independent validators, there are a number of different servers that you'll need to interact while working with the network - data will generally be recieved from one service and transactions will be sent to another. See the [the next section on data flow](#data-flow).

## Data flow [WIP]
Most of the data you will want to access will come from the trading data REST service. This is served by a 'data node' - servers that read the blockchain and produce a database of the current state, and in some cases store the past state. These data nodes are where you will read data from. 

To 'write' to the chain - that is to send in a transaction - you will use a Vega wallet, which will sign your transactions and send them to a validator node to be included in the chain.

<!-- to diagram
Data node via API (or run your own) --- > You --- > Wallet --- > Chain --- > Data Node ...MENTION ETHEREUM in flow.
-->

<!--
This guide will use a wallet server running on localhost to 'write' data, and a specific data node to read data from. Depending on your use case, you may eventually run your own data source, or host a wallet on a remote machine.
-->

## Authentication
Authentication takes several forms when interacting with Vega. When requesting data, such as through a query, you don't need to authenticate nor do you need an API token. 

If you want to interact with the network, you'll need to ensure that you have a Vega Wallet, which provides authentication in the form of a signature when sending transactions. 

When creating any scripts or software to interact with Vega, you'll need a wallet authentication token. See the [Wallet API guide to get started](./vega-wallet/get-started.md).

## Sending transactions to the chain
When sending transactions, you'll need a Vega Wallet with at least one keypair, and have the wallet service running. You'll also need to have your Vega public key (also known as a party ID) to hand, as well as the relevant transaction data, in order to submit your transaction.

When your client needs to sends a transaction, it fills in the details and passes it to the wallet to be signed, and forwarded to a validator node before being added to a block.

:::note Go deeper
Read concepts about [transactions on Vega](./../concepts/vega-chain/transactions.md)

You can see a full list of transaction types on the [commands API](./grpc/vega/commands/v1/commands.proto).
:::

### Transaction hashes
Once a transaction has been successfully submitted to the chain, you receive the transaction's hash from the wallet. A transaction hash is a unique identifier for the transaction, and can be used to find that transaction and check its status on a Vega block explorer. Note that a transaction can only be seen by the block explorer once it's been processed by the network.

Depending on transaction type, most will be given an ID, derived from the transaction hash, which specific to the object the transaction creates once it's processed. You can use that object-specific ID with the relevant endpoint to then get richer, more specific information about it. 

For example, a submitted order will receive an order ID once the transaction to submit an order has been accepted into a block. You can use the REST endpoint to [get order by ID](./rest/data-v2/trading-data-service-get-order.api.mdx).

## Versioning
Once the latest code is prepared for a release, it's deployed to a testnet, where the latest features and updates can be trialled. When the validator node operators agree that a version is sufficiently stable to be released to mainnet, all code from that version and the previous versions are upgraded to. Find out what version a data node is running with the [data node info endpoint](./rest/data-v2/trading-data-service-info.api.mdx).

Breaking APIs changes go through a deprecation cycle, and are announced in the summary for each [release](../releases/overview.md).

The documentation on this site covers the core software version running on the Vega testnet, and the version on the Vega mainnet. Check which version's documentation you're viewing (and switch between them) by referring to the top navigation bar for each page. 

See the [releases page](../releases/overview.md) for a summary of each software release and links to the full changelog on GitHub. 

## Available APIs [WIP]
Four/five areas: core/data node | ethereum bridges | vega wallet | block explorer(?)

Vega has been built to support REST, GRPC and GraphQL for interacting with the core and data nodes. 

The Vega Wallet serves an API that uses ? openrpc, rest ?

The Ethereum contracts serve ... 

### APIs for querying data
REST provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. 

* **Trading data API** covers a wide range of information, including, but not limited to:
  * liquidity provisions
  * network limits and parameters
  * information about validator and non-validator nodes
  * reward summaries
  * governance proposals and votes
* **Core service API**: Provides the minimum state of the chain required to build and send a transaction. This is also exposed in the trading data API
* **Explorer API**: Provides transaction details, particularly for uses in block explorers
* **Core state API**: This API is specifically for node operators, and may not be exposed by nodes running the network. All methods under that umbrella are also available under the other endpoints

## APIs for submitting data
gRPC: 

## API for using Vega Wallet
The Vega Wallet supports a JSON-RPC API for integrating interfaces with the wallet service to read keys, get transaction approval and other interactions.

## Rate limiting 
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

Using `transactions`, to retrieve the first 10 transactions, make a GET request to `/transactions?limit=10`. 

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

<!-->
## Ethereum bridges [rework]
You can also interact with the Ethereum smart contracts, which allow for bridging between Vega and Ethereum.

**[Smart contracts overview](./bridge/index.md)**: Start exploring the bridge.

## Vega Wallet API to connect a wallet
If you're looking to integrate a dApp, website, or bots with the Vega Wallet, you'll need to use a wallet API. The wallet is also how you authenticate and send transactions to the network. If you're looking to use the API to programmatically interact with the network for your own transactions, you'll need to [get a Vega Wallet](../tools/vega-wallet/index.md).

The **Wallet API** (in alpha) uses JSON-RPC with an HTTP wrapper.

* [JSON-RPC Wallet API](./vega-wallet/reference/core/json-rpc-basics): An overview of the API
* [JSON-RPC playground](./vega-wallet/reference/core/json-rpc-api-playground): See what methods the wallet API calls and try it out

- **[REST overview](rest/overview.md)**: Read more about data and core node APIs.
- [Core network state](rest/core/core-service.mdx): Get basic information about the network, such as 'block height' and 'Vega time'.
- [Core state](rest/state/core-state-service): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
- [Data node (v2)](rest/data-v2/trading-data-service): Get historic information and cumulative data, such as 'governance data for all proposals'. v2 is receiving active development.
- [Block explorer](/testnet/category/api/rest/explorer/block-explorer): Get information about blocks created on the Vega network.


## GraphQL for web apps [rework/remove?]
If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

**[GraphQL overview](./graphql/generated.md)**: See what GraphQL covers. 

**[GraphQL Playground](https://api.testnet.vega.xyz/graphql/)**: Try out GraphQL queries. 

## gRPC for fast interactions [rework]
gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

**[gRPC](grpc/vega/vega.proto)**: Explore the gRPC reference documentation.
- [Core state](grpc/vega/api/v1/corestate.proto): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
- [Commands](grpc/vega/commands/v1/commands.proto): Get all transaction types you can submit to the network.
- [Data](grpc/data-node/api/v2/trading_data.proto.mdx): Interact with all data that the data nodes store, including trading data, interactions between the network and Ethereum, and governance. 
-->

## Primary elements (resources, building blocks..?) [WIP]
(Ordered so they layer up - each can't exist without one or more of the previous things. Link to concepts for more info on each)

### Parties
A party is a vega pubkey. Show how to list parties. 

A Party ID and a Vega public key are equivalent. 

### Assets
Briefly what an asset is. List how to query for all assets, show details of an asset

### Accounts
Pretty much as above, show querying accounts by a party, accounts for assets

### Markets
Markets have accounts, are created with proposals, and allow parties to place orders with assets

### Proposals
Mention that proposals are how new assets are added, and markets created. Also need gov. tokens

#### Governance token

### Orders
How to see orders. Maybe positions too.


## Tutorials
Tutorials provide the information you'll need about the protocol to understand and use the guide, as well as instructions on how to interact with scripts, API calls, or other code. 

**[Tutorials](../tutorials)**: See the tutorial(s) currently available for this network.
<!--
## Now we'll need more detail on the combinations of those things--->