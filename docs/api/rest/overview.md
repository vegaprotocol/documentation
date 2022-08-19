---
title: REST API overview
hide_title: false
---

There are 4 REST endpoints that serve different needs, 2 of which are served by core nodes, and 2 of which are served by data nodes.

## Core nodes
Core nodes run the network. They are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the state of the network (block time, block height etc), allow transactions to be submitted to the network and to subscribe to event streams so that changes of internal state can be seen.

* [Network state](./core/core): Get basic information about the network, such as 'block height' and 'Vega time'. 
* [Core state](./core/state): Get lists of state about the internal Vega system, such as 'list accounts', 'list parties. 

## Data nodes
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data nodes give the end user a way to query historic information without the need to be always connected to the network. The data node also builds cumulative data which allows the end user to get a snapshot of the current state of a part of the system.

* [Data node (legacy API)](./data-node/data-v1): Get limited historical information, such as 'governance data for all proposals'. This API version will be deprecated in a future version, and does not cover the system as comprehensively as v2.
* [Data node (v2)](./data-node/data-v2): Get historic information and cumulative data, such as 'governance data for all proposals'. v2 is receiving active development.