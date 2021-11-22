

# Overview

The Vega data node has three APIs for you to interact with. 

Most of the APIs are designed to use for trading-related queries, and if you'd like to try out the APIs on testnet, you can find more [reference documentation](https://docs.fairground.vega.xyz/docs/api-reference/) (including the GraphQL playground) and [how-to guides](https://docs.fairground.vega.xyz/docs/api-howtos/) (including a Gitpod environment), within [Vega Fairground documentation](https://docs.fairground.vega.xyz/). 

## What is each API best for?

### gRPC

gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

### GraphQL

If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

### REST

REST is the ubiquitous protocol for the web. It’s verbose but pretty easy to get started with and Vega supports nearly all the functionality provided by gRPC and GraphQL on the REST APIs. Note: REST does not support streaming.