---
vega_network: TESTNET
---
import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';

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

[Tutorials](../tutorials): See the tutorial(s) currently available for this network.

## Ethereum bridges
You can also interact with the Ethereum smart contracts, which allow for bridging between Vega and Ethereum.

[Smart contracts overview](./bridge/index.md): Start exploring the bridge.

## GraphQL
If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

[GraphQL overview](./graphql/generated.md): See what GraphQL covers. 

[GraphQL Playground](https://graphql.vega.community/query/playground): Try out GraphQL queries. 

## gRPC
gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

[gRPC](grpc/vega/vega.proto): Explore the gRPC reference documentation.
- [Core](grpc/vega/api/v1/core.proto.mdx): Get information about the network, such as 'block height' and 'Vega time'.
- [Core state](grpc/vega/api/v1/corestate.proto): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
- [Commands](grpc/vega/commands/v1/commands.proto): Get all transaction types you can submit to the network.
- [Data](grpc/data-node/api/v2/trading_data.proto.mdx): Interact with all data that the data nodes store, including trading data, interactions between the network and Ethereum, and governance.
- 
## REST
REST is the ubiquitous protocol for the web. Vega has four REST endpoints: two are served by core nodes, and two are served by data nodes. REST is fairly easy to get started with, and Vega supports nearly all the functionality provided by gRPC and GraphQL on the REST APIs. Note: REST does not support streaming.

[REST overview](rest/overview.md): Read more about data and core node APIs.
- [Core network state](rest/core/core-service.mdx): Get basic information about the network, such as 'block height' and 'Vega time'.
- [Core state](rest/state/core-state-service): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
- [Data node (legacy API)](rest/data-v1/trading-data-service): Get limited historical information, such as 'governance data for all proposals'. This API version will be deprecated in a future version, and does not cover the system as comprehensively as v2.
- [Data node (v2)](rest/data-v2/trading-data-service): Get historic information and cumulative data, such as 'governance data for all proposals'. v2 is receiving active development.
- [Block explorer](/testnet/category/api/rest/explorer/block-explorer): Get information about blocks created on the Vega network.

## Vega Wallet API
If you're looking to integrate a dApp or website with the Vega Wallet, you'll need to use a wallet API. 

For now, there are 2 wallet APIs: 
**V1**, which uses REST. The V1 API will not be supported once the V2 API is out of alpha.
The V1 API (in deprecation) uses REST.

* [V1 REST documentation](./vega-wallet/v1-api)

The **V2 API** (in alpha) uses JSON-RPC with an HTTP wrapper. You can interact directly with the JSON-RPC, or more easily via the HTTP layer.

* [Getting started](./vega-wallet/v2-api/get-started): Set up a connection with the Vega Wallet server. 
* [OpenRPC Wallet API](./vega-wallet/v2-api/openrpc): An overview of the API
* [JSON-RPC playground](./vega-wallet/v2-api/openrpc-api-playground): See what methods the wallet API calls.
