---
title: Using the APIs
sidebar_position: 2
description: See the frameworks and how to use the APIs.
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import EthAddresses from '@site/src/components/EthAddresses';

<Topic />

## Connecting to the APIs
As most of the APIs are designed to be used for trading-related queries, the best place to try them out is on the testnet network, also known as Fairground. The public servers differ between testnet and mainnet, as do the network configurations your Vega-compatible wallet needs in order to connect. See the [public servers page](./public-servers.md) for details. 

To use the Vega APIs, a developer will need access to a network-compatible instance of the relevant software, depending on their goals: core node, data node, and/or Vega Wallet.

**Mainnet**: Consensus validators may provide public servers for accessing the mainnet APIs, however that does not mean they should be relied upon for constant uptime and full access to all APIs. Each Vega Wallet release for mainnet wallet is pre-configured with any publicly announced nodes at the time of release.

**Validator testnet**: Some consensus validators may provide public servers for accessing the APIs on the validator testnet network, however that does not mean they should be relied on for constant uptime or full access to APIs.

**Fairground**: The project team operate a number of data nodes with publicly available endpoints for the Vega-run testnet, called Fairground. Each Fairground wallet app release is pre-configured with known nodes, including those operated by the project team, at the time of release.

## Rate limiting
Some rate limiting is implemented with default limitations on the APIs.

For the specifics on WebSocket connections, see [WebSocket streams](./websocket.md) page.

To prevent abuse of the APIs provided by data nodes, there are limitations to the rate of API requests that can be enabled by data node operators. Rate limiting is applied on a per-remote-IP-address basis.

Each IP address that connects to a data node is assigned a bucket of tokens. That bucket has a maximum capacity, and begins full of tokens. Each API request costs one token, which is removed from the bucket when the call is made. The data node adds a number of tokens every second (the rate of the limiter) to the bucket up to its maximum capacity.

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

If a client continues to make requests despite having no tokens available, the response will be:
* REST: `HTTP 429 StatusTooManyRequests for HTTP APIs`
* gRPC: `14 Unavailable`

Each unsuccessful response will deduct a token from a separate bucket with the same refill rate and capacity as the requests bucket. Exhausting the supply of tokens in this second bucket will result in the client's IP address being banned for a period of time determined by the data node operators, with 10 minutes as the default.

If banned, the response will be `HTTP 403 Forbidden for HTTP APIs`.

Read more about rate limiting in the [rate limiting README ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/ratelimit/README.md) on GitHub.

## Formatting and field conventions

### Strings vs numbers format
When using an API, in many cases the field is described as requiring a number but the data type is a string. Numerical fields are passed in string format so that there is no loss of precision, or risk of integer overflow for large numbers.

### Decimal precision
The APIs don't provide or accept decimal points in numbers or strings, so the decimal precision must be calculated and the number represented in integers, depending on what decimal precision the number needs. 

* For quotes and prices, use the *market decimal places* to calculate, which can be found by [querying for a market's parameters](../api/rest/data-v2/trading-data-service-get-market.api.mdx) and using `decimalPlaces`
* For fees, margin, and liquidity, use the *settlement asset decimal places* to calculate, which can be found by [querying an asset's parameters](../api/rest/data-v2/trading-data-service-get-asset.api.mdx) and using `decimals`

### Timestamps
Unless otherwise specified, response timestamps, are encoded as a Unix timestamp, which is counted from midnight on 1 January, 1970. Requests that require timestamps will also need to be submitted in Unix time. Whether it's a nanosecond, second, or other, is signposted in the tutorial or API reference documentation.

## Available frameworks

### REST for easy API access
[REST](./rest/overview.md) provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. While the data provided through REST can come from three different places, the bulk of data can be acquired by querying the trading data API, which is served through data nodes. 

REST is easy to get started with, and Vega supports nearly all the functionality provided by gRPC and GraphQL though REST.

**[Using REST](./rest/overview.md)**: Read the REST overview for everything you need to know before using the endpoints, like the default rate limits and how to paginate results.

### WebSockets for streaming
**[WebSocket endpoints](./websocket.md)** offer real-time updates to changes in the state of the Vega network, allowing subscriptions to events such as per-market trades or changes to a party's position.

### gRPC for fast interactions
**[gRPC](./grpc/overview.md)** provides fast and efficient communication, and supports near real time streaming of updates from Vega.

### GraphQL for web apps
**[GraphQL](../api/graphql/overview.md)** is an alternative to REST that can be used to craft more complex queries.

Try out queries and learn the structure with the [GraphQL playground ↗](https://api.testnet.vega.xyz/graphql/)

## Vega Wallet integration
To integrate the Vega Wallet with a dApp or bots, you'll likely need to use the wallet API.

The **Wallet API** uses JSON-RPC with an HTTP wrapper. Find out [how to use the API](./vega-wallet/before-you-start.md) before jumping into the reference docs. 

[Download a Vega Wallet](../tools/vega-wallet/index.md) to use the Wallet API to programmatically interact with the network for your own transactions.

## Ethereum bridges
Vega uses ERC-20 assets from Ethereum, and to facilitate inter-chain interactions between Vega and Ethereum, those assets are then transferred through a series of smart contract bridges. These bridges provide a seamless experience for users, allowing them to use Ethereum assets on the (non-Ethereum) Vega chain.

Moreover, these smart contract bridges operate just like any other smart contract on Ethereum, meaning that users can interact with them directly using an Ethereum JSON-RPC node or a service like [Etherscan ↗](https://etherscan.io/), which provides a user-friendly interface for exploring and interacting with Ethereum smart contracts.

### Smart contracts
**[Smart contracts overview](./bridge/index.md)**: Explore the contracts.

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
