---
title: Using gRPC
sidebar_label: Using gRPC
hide_title: false
description: Learn how to use the gPRC API.
vega_network: TESTNET
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

gRPC is a low-latency, highly efficient communication method that allows a client and a server to send data over HTTP. Vega supports a gRPC API for interacting with the network and querying for and filtering data. 

## gRPC API and protocol-buffers

gRPC uses protocol-buffers (protobufs) as its underlying data defintion. Protobuf messages are language-neutral data defintions that are used to generate lanugage-specific data-structures. Code generation of a protobuf message also generates functions to serialise each message so that they can be sent through gRPC to each RPC service endpoint.

This means that Vega's gRPC API is fully defined by its protobuf definitions, and so the protobuf definitions themselves provide complete documentation.

### Data node API
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data nodes give the end user a way to query historic information without the need to be always connected to the network. The data node also builds cumulative data which allows the end user to get a snapshot of the current state of a part of the system.

The protobuf definitions for the data node API can be found [here](https://github.com/vegaprotocol/vega/blob/develop/protos/sources/data-node/api/v2/trading_data.proto). They allow for read-only queries for trading data and historic states of the network. 

### Core node API
Core nodes are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the basic state of the network (block time, block height etc), allow transactions to be submitted to the network and to subscribe to event streams so that changes of internal state can be seen.

The protobuf definitions for the core node API can be found [here](https://github.com/vegaprotocol/vega/blob/develop/protos/sources/vega/api/v1/core.proto). They allow for interacting with the network and sending in transactions.

As a data node acts as a proxy to its core node, all `CoreService` API such a sending in transactions are also available from the data node's RPC address.

## Client stub examples

As an example, the below is an RPC endpoint and messages for querying an order defined with protocol-buffers:
```proto
// Get order
//
// Get an order by its ID. An order's ID will be the SHA3-256 hash of the signature that the order was submitted with
rpc GetOrder(GetOrderRequest) returns (GetOrderResponse) {
  option (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_operation) = {tags: "Orders"};
}

// Request that is sent when executing the query for getting a single order
message GetOrderRequest {
  // Order ID to retrieve order information for.
  string order_id = 1 [(google.api.field_behavior) = REQUIRED];
  // Historic version number of the order to return. If not set, the most current version will be returned.
  optional int32 version = 2;
}

// Response received from the query for getting a single order
message GetOrderResponse {
  // Order details, if one was found.
  vega.Order order = 1;
}
```

The above protobuf definitions can be used to generate client and server code in a given language. This can be done by using the protocol-compiler `protoc` directly and supplier a output language, or by using CLI tools from the buf-ecosystem, namely `buf generate`. As an example, YAML configuration for compiling Vega's protobuf definition into Golang using `buf genreate` can be found here [here](https://github.com/vegaprotocol/vega/blob/develop/buf.gen.yaml)


Once generated they can imported and used from the generated language specific client stubs as follows:

<Tabs>
<TabItem value="py" label="Python">

```py
import grpc
from data_node.api.v2 import trading_data_pb2 as trading_data, trading_data_pb2_grpc as trading_data_grpc

# set up a grpc connection
grpc_address = ""
ch = grpc.insecure_channel(grpc_address)
grpc.channel_ready_future(ch).result(timeout=10)
trading_data_stub = trading_data_grpc.TradingDataServiceStub(ch)

# fill in a request to get an order by its ID
order_id = "03bac81ff8ee067c2fcbfe1ec29f6eee071fd12f399f0f6d5bed634299f84390"
request = trading_data.GetOrderRequest(order_id=order_id))

# call into the datanode using the GetOrder endpoint
response = trading_data_stub.GetOrder(request)

# read the response
order = resp.Order
```

</TabItem>

<TabItem value="go" label="Golang">

```golang
package main

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	datanode "code.vegaprotocol.io/vega/protos/data-node/api/v2"
)

func main() {
    // set up a grpc connection
    grpcAddress = ""
    conn, err := grpc.Dial(grpcAddress, grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil {
        panic("unable to connect to data node")
    }
    tradingDataClient := datanode.NewTradingDataServiceClient(connection)

    // fill in a request to get an order by its ID
    orderID := "03bac81ff8ee067c2fcbfe1ec29f6eee071fd12f399f0f6d5bed634299f84390"
    request := &datanode.GetOrderRequest{OrderId: orderID}

    // call into the datanode using the GetOrder endpoint
    response, err := dataNode.GetOrder(context.Background(), request)
    if err != nil {
        panic("unable to call data node endpoint")
    }

    // read the response
    order := response.Order
}
```

</TabItem>

</Tabs>

## Relationship to REST API

The buf-ecosystem contains plugins that also allow automatic generation of REST API from the protobuf-definitions. The result is that the Vega's gRPC and REST API matches exactly in both structure and functionality.

As REST is a more familiar way interact with a product than gRPC, experiencing Vega first through the REST API and using the REST documentation may help ease an initial integration, without any loss of functionality. Migrating later to using gRPC is then trivial since the mapping between REST and gRPC is 1-to-1.

## Rate limits 

TODO: I copied this directly from the REST API overview and it applies *almost* exactly. But maybe we want to combine it somewhere else? I'm unsure how much this applies to GraphQL so I'm unsure if we can just throw it in the top level "overview" instead.

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

If a client continues to make requests despite having no tokens available, the response will be the gRPC response `14 Unavailable` for all the gRPC API.

Each unsuccessful response will deduct a token from a separate bucket with the same refill rate and capacity as the requests bucket. Exhausting the supply of tokens in this second bucket will result in the client's IP address being banned for a period of time determined by the data node operators, with 10 minutes as the default.

Read more about rate limiting in the [rate limiting README ↗](https://github.com/vegaprotocol/vega/blob/develop/datanode/ratelimit/README.md) on GitHub.

gRPC streaming connections are rate limited by a maximum allowed number of subscriptions per IP address. The default maximum is set to 250 connections, but note that this value may differ between data node operators.
