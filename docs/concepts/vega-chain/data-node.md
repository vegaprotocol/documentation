---
sidebar_position: 1
title: Data node
vega_network: TESTNET
hide_title: false
---

Protocol users need data about events, such as price history, trade data, validator scores, and more. While the core emits events when states change, it does not store the data. The data node collects and stores those events, and makes them available through API queries that can be used directly, or through dapps and other tools.

The core is responsible for processing transations for the chain and ensuring correctness. Any processing that isn't required to make the next block is done by the data node. The data node stores information in a PostgreSQL database, and augments the data (by linking order and party data together, for example) to provide richer, more informative APIs. Those functions require extra processing that is best kept separate from running the blockchain so as not to hinder its performance.

## Running a data node
Data nodes can be set up and run by anyone who wants to collect and store network event data and make it available. Data nodes can be publicly available for use by dApps, or they can be used privately.

Running your own data node would be useful for building a complex integration, or if you don't want to rely on a third-party data node. A data node can be run privately or publicly, though public data nodes help support the Vega community and users by allowing them to connect and reliably see live and historical data.

Setting up a data node requires configuring and using the Vega data node software. 

:::tip Try it out [WIP]
Set up a data node: Read the instructions for setting up a data node.
:::

## Data structure [WIP]

(spec) Each chunk of data contains the eventID that created it and the block from which the event was created. An event is emitted on each occasion the blockchain time updates, and each chunk of data stored is labelled with the time stamp. 


postgresql database, big relational database behind it. 

## APIs [WIP]
Talk about the APIs that display data node information. 

:::tip try it out
if you want to try running a data node to see data - set up data node instructions & capsule (?)
:::

can turn on/off graphql, rest, grpc for a data node you run, to tailor to your needs. 

there are data nodes run by consensus validators, which are expected to be running all apis and reliably serve data, though as they are run by validators, the reliability depends on the operator

It must be possible to augment APIs so data returned is in a shape and size that is appropriate for clients.

## Data retention [WIP]
A data node can be configured to store only the network's current state (without saving any history), or to store historical data back to a certain date/time. 

(What is it?) default configuration for what's considered "minimal useful" data node.

How much is stored between chain resets?

## Data-node decentralized history [WIP]

## What kinds of data (more specifics) [WIP]

listens to event stream, links order and party together for example, so queries such as "which orders were placed by x party" can be done 

Stake / Delegations / Validator Score history

All changes to staking and delegation, Validator score changes and state at any time (validatorID, epoch, score, normalised score), Validator performance metrics.

Rewards per epoch per Vega ID (party, epoch, asset, amount, percentage of total, timestamp).

Governance proposal history: All proposals ever submitted + votes (asset, network parameter change, market).

Trading Related Data:  Best static bid, best static ask, static mid, Best bid, best ask, mid, Mark price. If in auction, indicative uncrossing price and volume. Open interest. Trade price, trade volume, Closeout trades, Loss socialisation event, Position mark-to-market events

Market Data

Market lifecycle events: Auction start, end, reason for entering, type. Settlement / price data received event. Trading terminated event. 

Prices History

available at various time resolutions: on every change, on every blockchain time change, every minute, hour, 6 hours, day. 
   
Liquidity provision data: LP order submissions, Equity-like share changes, Market value proxy, Target stake, Supplied stake

Risk data: Margin level events, Model parameter changes, Risk factor changes, Price monitoring bound setting changes, Price monitoring bounds
    
Candle data

Orders