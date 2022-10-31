---
title: gRPC API overview
hide_title: false
---
gRPC is a low-latency, highly efficient API for interacting with the network and querying for and filtering data.

## Core node APIs
Core nodes run the network. They are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the state of the network (block time, block height etc), allow transactions to be submitted to the network and to subscribe to event streams so that changes of internal state can be seen.

- [Core](vega/api/v1/core.proto.mdx): Get information about the network, such as 'block height' and 'Vega time'.
- [Core state](vega/api/v1/corestate.proto): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties.
- [Commands](vega/commands/v1/commands.proto): Get all transaction types you can submit to the network.

## Data node API
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data nodes give the end user a way to query historic information without the need to be always connected to the network. The data node also builds cumulative data which allows the end user to get a snapshot of the current state of a part of the system.

- [Data](data-node/api/v2/trading_data.proto.mdx): Interact with all data that the data nodes store, including trading data, interactions between the network and Ethereum, and governance.