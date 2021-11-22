

# Overview

The Vega data node presents three APIs for you to interact with. 

## What is each API best for?

### gRPC

gRPC provides fast and efficient communication with Vega’s APIs. gRPC supports near real time streaming of updates from Vega. gRPC/Protobuf is the transport of choice for many web3 apps.

### GraphQL

If you’re writing a web app, GraphQL is flexible and allows efficient data retrieval. Like gRPC, GraphQL supports near real time streaming of updates from Vega. It uses websockets under the hood but follows the specification for streaming as set by GraphQL.

### REST

REST is the ubiquitous protocol for the web. It’s verbose but pretty easy to get started with and Vega supports nearly all the functionality provided by gRPC and GraphQL on the REST APIs. Note: REST does not support streaming.