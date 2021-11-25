---
title: REST API overview
hide_title: false
---

There are 4 REST endpoints that serve different needs, 2 of which are served by core nodes, and 2 of which are served by data nodes.

## Core nodes
Core nodes run the network. They are responsible for ensuring the consensus rules are met and that a consistent view of the network is seen. They present endpoints that give access to the state of the network (block time, block height etc), allow transactions to be submitted to the network and to subscribe to event streams so that changes of internal state can be seen.

* [Core](/docs/api/rest/core/core)
* [Core state](/docs/api/rest/core/state)

## Data nodes
Data nodes aggregate the outputs from core nodes and produce more meaningful APIs. They are stateful and build up a bigger view of the system from the events emitted from the core nodes. The data-nodes give the end user a way to query historic information without the need to be always connected to the network. The data-node also builds cumulitive data (such as account balances and positions) which allows the end user to get a snapshot of the current state of a part of the system.

* [Data node](/docs/api/rest/data-node/data)
* [Data node proxy](/docs/api/rest/data-node/proxy)

