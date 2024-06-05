---
title: Using REST
hide_title: false
---

REST provides endpoints for querying for trading data, account information, ledger movements, asset and market information, and much more. The bulk of data can be acquired by querying the trading data API, which is served through data nodes.

* **Trading data API** providers historic information and cumulative data, and covers a wide range of data, including, but not limited to:
  * network limits and parameters
  * information about validator and non-validator nodes
  * reward summaries
  * governance proposals and votes
  * orders and positions
  * liquidity commitments and fee bids
* **Transaction API**: Provides the minimum state of the chain required to build and send a transaction. This is also exposed in the trading data API, which is the recommended API for querying information.
* **Explorer API**: Provides transaction details, designed particularly to support the development of block explorers.
* **Core state API**: This API is specifically for node operators, and may not be exposed by nodes running the network. All methods under this umbrella are also available on the trading data endpoints, which are recommended for querying for this information generally.

## Rate limiting
To prevent abuse of the APIs provided by data nodes, there are limitations to the rate of API requests that can be enabled by data node operators. Rate limiting is applied on a per-remote-IP-address basis.

Read about the rate limits on the [API overview page](../../api/using-the-apis.md#rate-limiting). For the specifics on WebSocket connections, see [WebSocket streams](../websocket.md) page.

## Pagination
Pagination in REST is cursor-based. To query data, you can make a GET request to an endpoint. As an example, this section will use the `/transactions` endpoint. Use the query with the desired query parameters.

The pagination parameter should be used in the following combination allowing you to navigate forward or backward through the result set:
- `first`, and `first`/`after` - will return the *first* N results, and the first N results *after* the given `after` cursor
- `last`, and `last`/`before` - will return the *last* N results, and the last N results *before* the given `before` cursor

For example:

To use `transactions` to retrieve the first 5 transactions, make a GET request to `/api/v2/transactions?pagination.first=5`. 

For the next 5, the request should look like `/api/v2/transactions?pagination.first=5&pagination.after=CURSOR_OF_LAST_TRANSACTION`.

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

- [Transaction](../../category/api/rest/transaction/transaction): Submit transactions and get basic information about the network, such as 'block height' and 'Vega time'.
- [Core state](../../category/api/rest/state/core-state-service): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
