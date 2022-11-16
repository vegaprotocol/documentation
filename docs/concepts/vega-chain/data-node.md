---
sidebar_position: 1
title: Data node
vega_network: TESTNET
hide_title: false
---

Protocol users need to see and interact with data, such as price history, market changes, validator scores, and more. While the core emits events when states change, it does not store the data about those events. The core is responsible for processing transations for the chain and ensuring correctness. 

Any processing that isn't required to make the next block is done by the data node. The data node collects, stores, and relates the events, and makes them available through API queries that can be used directly, and through dapps and other tools.

Data node stores information in a PostgreSQL database, and augments the data (by linking order and party data together, for example) to provide richer, more informative APIs. Those functions require extra processing that is best kept separate from running the blockchain so as not to hinder its performance.

### Diagram: Data node structure
![Data node diagram](/img/concept-diagrams/data-node-overview.png)

## Running a data node [WIP-tip]
Data nodes can be set up and run by anyone who wants to collect and store network event data and make it available. Data nodes can be publicly available for use by dApps, or they can be used privately.

Running your own data node would be useful for building a complex integration, or if you don't want to rely on a third-party data node. A data node can be run privately or publicly, though public data nodes help support the Vega community and users by allowing them to connect and reliably see live and historical data.

Setting up a data node requires configuring and using the Vega data node software. 

:::tip Try it out [WIP]
Set up a data node: Read the instructions for setting up a data node.
:::

## Forwarding wallet transactions
The Vega Wallet is the conduit for approving and sending transactions from the user to the core. The data node exposes the exact same endpoints as the core node, and so it can act as a proxy for the core node.

When the wallet sends a transaction request to a data node, the data node ingests the request and directly forwards it to the core node it is connected to. That node, whether or not it is a consensus validator, will then send the transaction to the network. The consensus validators will then decide on the validity of the transaction and execute it.

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
For clients to communicate with data nodes, the protocol exposes a set of APIs and methods for reading data. Currently there are three protocols to communicate with the data node APIs: gRPC, GraphQL and REST.

If you are running your own data node, you can choose to enable any/all of the protocols, to tailor to your needs. Data nodes run by validators are expected to provide gRPC, GraphQL and REST, and reliably serve data. 

:::tip try it out
if you want to try running a data node to see data - set up data node instructions & capsule (?)
:::

## Data retention [WIP]
A data node can be configured to store only the network's current state (without saving any history), or to store historical data back to a certain date/time. 

Data types are grouped into categories, and the retention time for each type can be changed in the data node's config.toml file. 

Some data are saved in detail, but with a shorter default retention period, and then in a less-detailed sampling with a longer retention period. Take balances, for example: In addition to saving every balance change, the `conflated balances` keep a sample of a balance from once every hour. This allows the data node to have data for a long period of time, but taking up less space than saving every balance change over a year.

The default retention policy
| Data type                 	| Default retention 	|
|---------------------------	|-------------------	|
| Balances (fine-grained)   	| 7 days            	|
| Balances (conflated)      	| 1 year            	|
| Network checkpoints       	| 7 days            	|
| Historical delegations    	| 7 days            	|
| Ledger entries            	| 7 days            	|
| Orders                    	| 7 days            	|
| Trades                    	| 7 days            	|
| Trades 1 minute candle    	| 1 month           	|
| Trades 5 minute candle    	| 1 month           	|
| Trades 15 minute candle   	| 1 month           	|
| Trades 1 hour candle      	| 1 year            	|
| Trades 6 hour candle      	| 1 year            	|
| Market data               	| 7 days            	|
| Margin levels             	| 7 days            	|
| Margin levels (conflated) 	| 1 year            	|
| Positions                 	| 7 days            	|
| Conflated positions       	| 1 year            	|
| Liquidity provisions      	| 7 days            	|

## Data node decentralized history
The daily addition of gigabites of core event data to the data node make it infeasible for a new data node to replay all blocks from the first block. Rather than require that, new nodes can use a feature called decentralised history to recreate the history and get into a state to be able to consume new blocks. 

History segments produced on every node for a given block span are identical, such that the IPFS content IDs of the segment are the same across all nodes. This means there's no need to upload data between nodes, as each node produces history segments, and thus can be a source of history segments. 

When a new node joins the network and requests a history segment for a given IPFS content ID, the provision of data to the node is shared across all other nodes in the network.

:::note Go deeper
[Decentralised history readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/dehistory/README.md): How to use decentralised history for a data node
:::

## Database
The data node relies on PostgreSQL to store and provide data. PostgreSQL is an open source, relational database that supports relational and non-relational queries. 

:::note Go deeper
[About PostgreSQL ↗](https://www.postgresql.org/about/): Read about PostgreSQL and explore the documentation.
:::