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

## gRPC API and Protocol Buffers
gRPC uses Protocol Buffers (protobufs) as its underlying data definition. Protobuf messages are language-neutral data definitions that are used to generate language-specific data structures. Code generation of a protobuf message also generates functions to serialise each message so that they can be sent through gRPC to each RPC service endpoint.

This means that Vega's gRPC API is fully defined by its protobuf definitions, and so the protobuf definitions themselves provide complete documentation.

## Relationship to REST API
The buf ecosystem contains plugins that also allow automatic generation of REST API endpoints from the protobuf definitions. The result is that Vega's gRPC and REST API match exactly in both structure and functionality.

If you are new to interacting with gRPC, using REST may be a more familiar way to interact with the APIs. Experiencing Vega first through the REST API and using the REST documentation may help ease an initial integration, without any loss of functionality. Migrating later to using gRPC will then require minimal changes since the the input parameters and responses are contain the same data.

As an example to show the similarities, below are two Python snippets of how to list transfers using both REST and gRPC:
<Tabs>
<TabItem value="REST" label="REST">

```py
def list_transfers(base_url, pubkey, direction):

    params = {
        "pubkey": pubkey,
        "direction": direction,
    }

    r = requests.get(
        base_url + "/transfers", params=params,
    )

    return r.json()
```
</TabItem>

<TabItem value="gRPC" label="gRPC">

```py
def list_transfers(rpc_conn, pubkey, direction):

	request = trading_data.ListTransfersRequest(
		pubkey=pubkey,
		direction=direction,
	)

	r = grpc_conn.ListTransfers(
		request,
	)

    return MessageToDict(r)
```

</TabItem>

</Tabs>

To find the name of a gRPC call from a REST url, or vice versa, a YAML file containing the mappings can be found [on the Vega GitHub repo](https://github.com/vegaprotocol/vega/blob/develop/protos/sources/data-node/grpc-rest-bindings.yml). Also note that for REST end-points with path parameters, the gRPC equivalent will supply that parameter in the request object.

If you think using the REST API maybe be a better starting point, then see the documentation [for using REST](../rest/overview.md).

### Data node API
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data nodes give the end user a way to query historic information without the need to be always connected to the network. The data node also builds cumulative data which allows the end user to get a snapshot of the current state of a part of the system.

The latest protobuf definitions for the data node API can be found [in the Vega repo](https://github.com/vegaprotocol/vega/blob/develop/protos/sources/data-node/api/v2/trading_data.proto). They allow for read-only queries for trading data and historic states of the network. 

### Core node API
Core nodes are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the basic state of the network, such as block time and block height, allow transactions to be submitted to the network, and allow subscribing to event streams so that changes of internal state can be seen.

The latest protobuf definitions for the core node API can be found [on the Vega GitHub repo](https://github.com/vegaprotocol/vega/blob/develop/protos/sources/vega/api/v1/core.proto). They allow for interacting with the network and sending in transactions.

As a data node acts as a proxy to its core node, all `CoreService` API such as sending in transactions are also available from the data node's RPC address.

:::caution Make sure you use the correct version
Before using the protobuf definitions linked above be sure to check out the version that matches the network you want to interact with. This can be found by using the [statistics endpoint](../rest/core/core-service-statistics.api.mdx) and reading the `appVersion` field. From Vega's git repository you can then do `git checkout ${appVersion}`.
:::

## Client stub examples
As an example, the below is an RPC endpoint and messages for querying an order defined with Protocol Buffers:

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

The above protobuf definitions can be used to generate client and server code in a given language. This can be done by using the protocol-compiler `protoc` directly and supplying an output language, or by using CLI tools from the buf ecosystem, namely `buf generate`. As an example, YAML configuration for compiling Vega's protobuf definition into Golang using `buf generate` can be found [on the Vega repo](https://github.com/vegaprotocol/vega/blob/develop/buf.gen.yaml)


Once generated they can be imported and used from the generated language specific client stubs as follows:

<Tabs>
<TabItem value="py" label="Python">

```py
import grpc
from data_node.api.v2 import trading_data_pb2 as trading_data, trading_data_pb2_grpc as trading_data_grpc

# order ID to get
ORDER_ID = "01c25933750f9c3e35f38da9ee65c8b3eda165e914e86cad743b9effe826f2dc"
# gRPC of a data node
GRPC_ADDRESS = ""

def main():
	# set up a grpc connection
	ch = grpc.insecure_channel(GRPC_ADDRESS)
	grpc.channel_ready_future(ch).result(timeout=10)
	trading_data_stub = trading_data_grpc.TradingDataServiceStub(ch)

	# fill in a request to get an order by its ID
	request = trading_data.GetOrderRequest(order_id=ORDER_ID)

	# call into the data node using the GetOrder endpoint
	try:
		response = trading_data_stub.GetOrder(request)
		print(response.order)
	except grpc.RpcError as rpc_error:
		if rpc_error.code() == grpc.StatusCode.NOT_FOUND:
			print("order was not found")
		else:
			print("unable to get order from a data node:", rpc_error)

if __name__ "__main__":
	main()
```

</TabItem>

<TabItem value="go" label="Golang">

```go
package main

import (
	"context"
	"fmt"

	datanode "code.vegaprotocol.io/vega/protos/data-node/api/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
)

const (
	// order ID to get
	orderID := "01c25933750f9c3e35f38da9ee65c8b3eda165e914e86cad743b9effe826f2dc"
	// gRPC of a data node
	grpcAddress := ""
)

func main() {
	conn, err := grpc.Dial(grpcAddress, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("unable to connect to data node", err)
	}
	tradingDataClient := datanode.NewTradingDataServiceClient(conn)

	// call into the data node using the GetOrder endpoint
	request := &datanode.GetOrderRequest{OrderId: orderID}
	response, err := tradingDataClient.GetOrder(context.Background(), request)
	if err != nil {
		switch status.Code(err) {
		case codes.NotFound:
			log.Fatal("order not found")
		default:
			log.Fatalf("unable to get order from a data node:", err)
		}
	}

	// order was found
	fmt.Printf("%#v\n", response)
}
```

</TabItem>

</Tabs>

## Rate limiting
To prevent abuse of the APIs provided by data nodes, there are limitations to the rate of API requests that can be enabled by data node operators. Rate limiting is applied on a per-remote-IP-address basis.

Read about the rate limits on the [API overview page](../../api/using-the-apis.md#rate-limiting).
