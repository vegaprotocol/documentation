---
title: Using GraphQL
hide_title: false
sidebar_position: 1
---
GraphQL provides read-only queries and subscriptions for getting data from Vega. Support is built into the data nodes, and some Vega data nodes may have a GraphQL interface enabled. GraphQL is an alternative to REST that provides more flexibility for building custom queries.

While REST provides multiple endpoints with small amounts of data, GraphQL provides a single endpoint that inputs complex queries and outputs as much information as is needed for the query.

:::note Intro to the APIs
For general guidance and info you need to know about the APIs provided by Vega, read the [Using the APIs](../using-the-apis.md) page.
:::

## Queries
Here is a simple query to fetch the current block height and Vega time from a data node:

```
{
  statistics {
    blockHeight
    vegaTime
  }
}
```

It would return a result in JSON as follows:

```
{
  "data": {
    "statistics": {
      "blockHeight": "1776332",
      "vegaTime": "2023-05-31T15:06:26.962283107Z"
    }
  }
}
```

### Using POST
GraphQL queries send requests to an endpoint using the POST method.

While you could use cURL:
```
curl ‘https://api.n06.testnet.vega.xyz/graphql’ -X POST -H ‘content-type: application/json’ --data-raw ‘{"query":"{ statistics { blockHeight vegaTime }}"}’
```

It’s more likely that you’ll use a library for building queries, for example [URQL ↗](https://formidable.com/open-source/urql/docs/). 

Using cURL is a nice way to see how libraries are actually working before choosing one.

### Paginated results
Most queries for Vega data could return a lot of results. To help navigate this, Vega’s GraphQL schema implements [cursor based pagination ↗](https://graphql.org/learn/pagination/#pagination-and-edges), which gives the user a unique string that can be passed back to the server to fetch data relative to the last request. 

Before getting into cursor passing, let’s look at a paginated result. You can guess a result will be paginated if the query name ends with `Connection`.

```

{
  proposalsConnection(pagination: { first: 1 }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        rationale {
          title
        }
      }
    }
  }
}
```

This would return something that looks like:
```
{
  "data": {
    "proposalsConnection": {
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJzdGF0ZSI6NiwidmVnYV90aW1lIjoiMjAyMy0wNS0yNFQxNDowMDowMS4wMjk3MTZaIiwiaWQiOiI4NDAyNWU2ODM4N2NmNjFjMmI5MTIyOGQ3NjhkY2RkNGYxMGE5ZWU1Y2QyODI0ZmRlYTM1YjI1OTk3NmY1OWMxIn0="
      },
      "edges": [
        {
          "node": {
            "id": "84025e68387cf61c2b91228d768dcdd4f10a9ee5cd2824fdea35b259976f59c1",
            "rationale": {
              "title": "VMP-007 - Create market - LINK/USDT Future - 2023/06/30"
            }
          }
        }
      ]
    }
  }
}
```

There’s some added complexity here. Let’s break it down:

On the simple query, the structure of the result is basically identical to the query - so the shape is almost exactly what you've requested and nothing else.

Whereas with the paginated connections, the results contain extra nesting that isn't in the query. 

This nesting includes a `pageInfo` property with some information about the data set. Here, you can see that with the current limit of 1, there is another page. You can also see the cursor for the last item in the result.

There's also an edges property that contains nodes. The data under node shows a proposal, information you would get by querying for a proposal by ID.

Paginated results use this added nesting to provide the extra information you need to navigate the data. Each edge item in the array also has a cursor property you could select if you need to.

After fetching this result, it's clear that there are more proposals. You can use `endCursor` from the first result to fetch the next one, which will return the next 1 proposal, and a new cursor:

```
{
  proposalsConnection(pagination: { first: 1, after: "eyJzdGF0ZSI6NiwidmVnYV90aW1lIjoiMjAyMy0wNS0yNFQxNDowMDowMS4wMjk3MTZaIiwiaWQiOiI4NDAyNWU2ODM4N2NmNjFjMmI5MTIyOGQ3NjhkY2RkNGYxMGE5ZWU1Y2QyODI0ZmRlYTM1YjI1OTk3NmY1OWMxIn0="}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        rationale {
          title
        }
      }
    }
  }
} 
```

## Subscriptions
Subscriptions are like queries that keep returning data as it updates. These work similarly to the Observe endpoints in the REST service. 

For example, the following query would show a result only when a new proposal came in:

```
subscription {
  proposals {
    id
    rationale {
      title
    }
  }
}
```

A more useful query might be the following one, which receives an update every time the mid-price of the specified market updates:

```
subscription {
  marketsData(marketIds: "2dca7baa5f7269b08d053668bca03f97f72e9a162327eebd941c54f1f9fb8f80") {
    midPrice
  }
}
```

### Bus event subscription 
The bus event subscription is different from other subscriptions in one particular way. It has an extra filter for batch size. If you choose 0, then the subscription will deliver each event as it occurs. Otherwise, if you pick 10, for example, you'll receive results in batches of 10, but no response until there are 10 results.

Example that would provide an immediate result from the event bus query:

```
subscription {
  busEvents(types: [TimeUpdate], batchSize: 0) {
    event {
      ... on TimeUpdate {
        timestamp
      }
    }
  }
}
```

```

{
  "data": {
    "busEvents": [
      {
        "event": {
          "timestamp": "2023-03-05T15:05:33.177819749Z"
        }
      }
    ]
  }
}
```

## GraphQL playground
For a more approachable interface, GraphQL playground provides an interactive environment for you to build up queries with full integrated documentation. 

For most users this will be the best way to get to grips with the schema. 

Try visiting the GraphQL endpoint of a server. For example, you can try the [GraphQL Playground](https://api.n07.testnet.vega.xyz/graphql/) for Fairground, the Vega operated testnet.


## Next steps

* Visit the official [GraphQL documentation ↗](https://graphql.org/learn/) for more information about building queries
* Try out queries on Testnet using the [Playground ↗](https://api.n07.testnet.vega.xyz/graphql/)
* Check out the latest GraphQL schema in the [Vega code ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/gateway/graphql/schema.graphql)
* Choose a library to start building with on the [GraphQL site ↗](https://graphql.org/code/)