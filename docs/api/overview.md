

# API Overview

The Vega data node has three APIs for you to interact with. 

Most of the APIs are designed to use for trading-related queries, and so you can use them in the testnet environment. 

:::info 
[Vega Fairground documentation](https://docs.fairground.vega.xyz/) includes [how-to guides](https://docs.fairground.vega.xyz/docs/api-howtos/) and a Gitpod environment to try out Vega Fairground. 
:::

## What is each API best for?

### GraphQL

If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

[GraphQL overview](../graphql/): See what GraphQL covers. 

[GraphQL Playground](https://graphql.vega.community/query/playground): Try out GraphQL queries. 

### gRPC

gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

### REST

REST is the ubiquitous protocol for the web. Vega has four REST endpoints: two are served by core nodes, and two are served by data nodes. REST is fairly easy to get started with, and Vega supports nearly all the functionality provided by gRPC and GraphQL on the REST APIs. Note: REST does not support streaming.

[REST overview](./rest/overview): Read more about data and core node APIs.
