---
vega_network: MAINNET
---
import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes'

# Using the APIs

<Topic />

There are a number of ways to interact with Vega through APIs and Ethereum bridge contracts, and below you can learn more about the reference documentation and tutorials that are currently available.

As most of the APIs are designed to use for trading-related queries, the best place to try them out is on the testnet network, also known as Fairground. 

:::info 
[Vega Fairground documentation](https://docs.fairground.vega.xyz/) includes [how-to guides](https://docs.fairground.vega.xyz/docs/api-howtos/) and a Gitpod environment to try out Vega Fairground. 
:::
## Node API endpoints
<DataNodes frontMatter={frontMatter} />

## Tutorials
Tutorials provide the information you'll need about the protocol to understand and use the guide, as well as instructions on how to interact with scripts, API calls, or other code. 

[Tutorials](../tutorials/index.md): See the tutorial(s) currently available for this network.

## Ethereum bridges
You can also interact with the Ethereum smart contracts, which allow for bridging between Vega and Ethereum.

[Smart contracts overview](./bridge/index.md): Start exploring the bridge.

## GraphQL
If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

[GraphQL overview](./graphql/generated.md): See what GraphQL covers. 

[GraphQL Playground](https://graphql.vega.community/query/playground): Try out GraphQL queries. 

## gRPC
gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

[gRPC](./grpc/vega/vega.proto): Explore the gRPC reference documentation.

## REST
REST is the ubiquitous protocol for the web. Vega has four REST endpoints: two are served by core nodes, and two are served by data nodes. REST is fairly easy to get started with, and Vega supports nearly all the functionality provided by gRPC and GraphQL on the REST APIs. Note: REST does not support streaming.

[REST overview](./rest/overview.md): Read more about data and core node APIs.
