---
sidebar_position: 1
title: Data node
vega_network: TESTNET
hide_title: false
---

Protocol users need to see and interact with data, such as price history, market changes, validator scores, and more. While the core emits events when states change, it does not store the data about those events. The core is responsible for processing transations for the chain and ensuring correctness. 

Any processing that isn't required to make the next block is done by the data node. The data node collects, stores, and relates the events, and makes them available through API queries that can be used directly, and through dapps and other tools.

Data node stores information in a PostgreSQL database, and augments the data (by linking order and party data together, for example) to provide richer, more informative APIs. Those functions require extra processing that is best kept separate from running the blockchain so as not to hinder its performance.

## Running a data node [WIP-tip]
Data nodes can be set up and run by anyone who wants to collect and store network event data and make it available. Data nodes can be publicly available for use by dApps, or they can be used privately.

Running your own data node would be useful for building a complex integration, or if you don't want to rely on a third-party data node. A data node can be run privately or publicly, though public data nodes help support the Vega community and users by allowing them to connect and reliably see live and historical data.

Setting up a data node requires configuring and using the Vega data node software. 

:::tip Try it out [WIP]
Set up a data node: Read the instructions for setting up a data node.
:::

## Data structure
In order to provide reliable, indexable data, the data node stores information with a specific structure and set of standard details. 

Each chunk of data contains an event ID that identifies the core event that created it, and the block in which the event was created. An event is emitted whenever the blockchain time updates, and each chunk of data stored is labelled with the timestamp.

:::note Go deeper
[Data node code ↗](https://github.com/vegaprotocol/vega/tree/master/datanode): See how the data node service is built.
:::

## Available data
The data node listens to the event stream and provides access not only to the raw data, but also links relevant information together, such as an order and the party ID that placed the order, or the order, the party and the positions that filled that order, so that queries like "show orders that were placed by Party Y" can be done. 

Other types of data that the data node makes queryable include (but are not limited to): 
* Validator node details and history: Current status and changes to stake and nominations, details per epoch, and performance metrics.
* Staking rewards per epoch per Vega ID of validators/tokenholders, including the asset, amount, percentage of total and timestamp
* Governance proposals: All proposals submitted, the 'yes' and 'no' votes, and the parameter changes proposed
* Trading related data: Prices current and historical such as best bid/ask, mid, mark price; open interest, trade price/volume, closeout trades, loss socialisation events, position mark-to-market events; indicative auction uncrossing price and volume
* Market lifecycle events: Auction start, end, reason for entering, type of auction; settlement, trading terminated
* Liquidity provision data: LP order submissions, Equity-like share changes, Market value proxy, Target stake, Supplied stake
* Risk data: Margin level events, Model parameter changes, Risk factor changes, Price monitoring bound setting changes, Price monitoring bounds
* Candle data: Data that corresponds to trades during a certain time period: first trade, highest traded price, lowest traded price

## APIs [WIP]
For clients to communicate with data nodes, the protocol exposes a set of APIs and methods for reading data Currently there are three protocols to communicate with the data node APIs: gRPC, GraphQL and REST.

When running your own data node, you can choose to enable any/all of the protocols, to tailor to your needs. Data nodes run by validators are expected to provide gRPC, GraphQL and REST, and reliably serve data. 

:::tip try it out
if you want to try running a data node to see data - set up data node instructions & capsule (?)
:::

## Data retention [WIP]
A data node can be configured to store only the network's current state (without saving any history), or to store historical data back to a certain date/time. 

(What is it?) default configuration for what's considered "minimal useful" data node.

How much is stored between chain resets?

## Data-node decentralized history
Each day, gigabites of event data are produced by the Vega core and stored in the data node. Data nodes have a way to fetch history from peer nodes, as it isn't feasible for a new data node to replay all blocks from the first block to recreate the history and get into a state to be able to consume new blocks. This feature is called decentralised history.

History segments produced on every node for a given block span are identical, such that the IPFS content IDs of the segment are the same across all nodes. This means there's no need to upload data between nodes, as each node produces history segments, and thus can be a source of history segments. When a new node joins the network and requests a history segment for a given IPFS content ID, the provision of data to the node is shared across all other nodes in the network.

:::note Go deeper
[Decentralised history readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/dehistory/README.md): How to use decentralised history for a data node
:::


## Database
The data node relies on PostgreSQL to store and provide data. PostgreSQL, an open source, relational database that supports relational and non-relational queries. 

:::note Go deeper
[About PostgreSQL ↗](https://www.postgresql.org/about/): Read about PostgreSQL and explore the documentation.
:::