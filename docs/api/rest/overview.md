---
title: Using REST
hide_title: false
---

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

## Rate limits 
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

## Pagination
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
What data you're looking for will determine the type of endpoints you use.

## Served by data nodes
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data nodes give the end user a way to query historic information without the need to be always connected to the network. The data node also builds cumulative data which allows the end user to get a snapshot of the current state of a part of the system.

- Get historic information and cumulative data, such as 'governance data for all proposals'. See all available endpoints using the REST sidebar.
- [Block explorer](../../category/api/rest/explorer/block-explorer): Get information about blocks created on the Vega network.

## Served by core nodes
Core nodes run the network. They are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the state of the network (block time, block height etc), allow transactions to be submitted to the network and to subscribe to event streams so that changes of internal state can be seen.

- [Network (core) state](../../category/api/rest/core/core-service): Get basic information about the network, such as 'block height' and 'Vega time'.
- [Core state](../../category/api/rest/state/core-state-service): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
