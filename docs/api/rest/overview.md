---
title: REST API overview
hide_title: false
---

There are 4 REST endpoints that serve different needs, 2 of which are served by core nodes, and 2 of which are served by data nodes.

## Core nodes
Core nodes run the network. As they are primarily concerned with maintaining the state of the network, they present minimal endpoints that give access to some raw data.

* [Data node](/docs/api/rest/data-node/data)
* [Data node proxy](/docs/api/rest/data-node/proxy)

## Data nodes
Data nodes aggregate the outputs from core nodes and produce more useful APIs.

* [Core](/docs/api/rest/core/core)
* [Core state](/docs/api/rest/core/)

