---
sidebar_position: 5
title: Set up a blockexplorer
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A Vega block explorer is a powerful tool for navigating and understanding the blockchain. It is an essential component for anyone looking to interact with a blockchain network, especially if you want to explore transaction history, monitor network activity, or verify the integrity of the blockchain data. The Vega source code for the block explorer is part of the vega binary, and it is available at [vegaprotocol/vega Github](https://github.com/vegaprotocol/vega/tree/develop/blockexplorer).
The above application provides users a comprehensive view of the Vega network through a REST and GRPC API.

A vega block explorer offers Transaction Tracking - You can search for specific transactions by providing transaction IDs, wallet addresses, or other relevant criteria. 
However, combining the blockexplorer API with the Tendermint API, you can get much more information about the vega network(see web server config and examples below).

## The design of the block explorer

The vega blockexplorer is strictly related to the tendermint, and the blockexplorer source all the data from the tendermint database.

Tendermint have two backends for indexing the transactions:

- `KV` (default) - the simplest possible indexer, backed by key-value storage (defaults to levelDB)
- `psql` - The psql indexer type allows an operator to enable block and transaction event indexing by proxying it to an external PostgreSQL instance allowing for the events to be stored in relational models. Since the events are stored in a RDBMS, operators can leverage SQL to perform a series of rich and complex queries that are not supported by the kv indexer type. Since operators can leverage SQL directly, searching is not enabled for the psql indexer type via Tendermint's RPC -- any such query will fail.

The Vega blockexplorer requires a `psql` indexer, so you have to change the default value in the tendermint configuration.

## Requirements

- A non-validator vega node setup
- PostgreSQL database running
- (Optional) Webserver for proxing requests like Nginx or Caddy

## Setup a block explorer

We are not going to cover the PostgreSQL installation here. Please see:

- [the official PostgreSQL install documentation](https://www.postgresql.org/docs/current/tutorial-install.html)
- [the official docs for install PostgreSQL on ubuntu](https://www.postgresql.org/download/linux/ubuntu/)

### 1. Download vega binary

Download the vega binary from the [Vega release page](https://github.com/vegaprotocol/vega/releases) - Check the version of vega mainnet on one of the mainnet server, e.g: [https://api0.vega.community/statistics](https://api0.vega.community/statistics)

```shell
wget https://github.com/vegaprotocol/vega/releases/download/v0.72.14/vega-linux-amd64.zip
```

Then unzip it and check the version

```shell
unzip vega-linux-amd64.zip

./vega version
Vega CLI v0.72.14 (282fe5a94609406fd638cc1087664bfacb8011bf)
```

### 2. Init 