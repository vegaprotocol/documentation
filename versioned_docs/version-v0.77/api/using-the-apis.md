---
title: API tips
sidebar_position: 2
description: See the frameworks and how to use the APIs.
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';

<Topic />

## Connecting to the APIs
As most of the APIs are designed to be used for trading-related queries, the best place to try them out is on the testnet network, also known as Fairground. 

The public servers differ between testnet and mainnet, as do the network configurations your Vega-compatible wallet needs in order to connect. See the [public servers page](./public-servers.md) for details. 

To use the APIs, a developer will need access to a network-compatible instance of the relevant software, depending on their goals: core node, data node, and/or Vega Wallet.

The project team operate a number of data nodes with publicly available endpoints for the Vega-run testnet, called Fairground. 

## Rate limiting
Some rate limiting is implemented with default limitations on the APIs.

For the specifics on WebSocket connections, see [WebSocket streams](./websocket.md) page.

Data node operators can limit the rate of API requests. Rate limiting is applied on a per-remote-IP-address basis.

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

Each unsuccessful response will deduct a token from a separate bucket with the same refill rate and capacity as the requests bucket. 

Exhausting the supply of tokens in this second bucket will result in the client's IP address being banned for a period of time determined by the data node operators, with 10 minutes as the default.

If banned, the response will be `HTTP 403 Forbidden for HTTP APIs`.

Read more about rate limiting in the [rate limiting README ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/ratelimit/README.md) on GitHub.

## Formatting and field conventions

### Strings vs numbers format
Often when an API requires a number, it uses the `string` data type. Numerical fields are passed in string format so that there is no loss of precision, or risk of integer overflow for large numbers.

### Decimal precision
The APIs don't provide or accept decimal points in numbers or strings, so the decimal precision must be calculated and the number represented in integers, depending on what decimal precision the number needs. 

* For quotes and prices, use the *market decimal places* to calculate, which can be found by [querying for a market's parameters](../api/rest/data-v2/trading-data-service-get-market.api.mdx) and using `decimalPlaces`.
* For fees, margin, and liquidity, use the *settlement asset decimal places* to calculate, which can be found by [querying an asset's parameters](../api/rest/data-v2/trading-data-service-get-asset.api.mdx) and using `decimals`.

### Timestamps
Unless otherwise specified, response timestamps are encoded as a Unix timestamp, which is counted from midnight on 1 January, 1970. Requests that require timestamps will also need to be submitted in Unix time. Whether it's a nanosecond, second, or other, is signposted in the tutorial or API reference documentation.

## Available frameworks

### REST for easy API access
[REST](./rest/overview.md) provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. While the data provided through REST can come from three different places, the bulk of data can be acquired by querying the trading data API, which is served through data nodes. 

REST is easy to get started with, and Vega supports nearly all the functionality provided by gRPC and GraphQL though REST.

**[Using REST](./rest/overview.md)**: Read the REST overview for everything you need to know before using the endpoints, like the default rate limits and how to paginate results.

### WebSockets for streaming
**[WebSocket endpoints](./websocket.md)** offer real-time updates to changes in the state of a network, allowing subscriptions to events such as per-market trades or changes to a party's position.

### gRPC for fast interactions
**[gRPC](./grpc/overview.md)** provides fast and efficient communication, and supports near real time update streaming.

### GraphQL for web apps
**[GraphQL](../api/graphql/overview.md)** is an alternative to REST that can be used to craft more complex queries.

Try out queries and learn the structure with the [GraphQL playground ↗](https://api.testnet.vega.xyz/graphql/)
