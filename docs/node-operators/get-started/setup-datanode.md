---
sidebar_position: 4
title: Set up data node
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Running a data node

A data node gives the users a way to query the state of the network and included historic information about the objects over the lifetime of the blockchain. A data node connects to a non validator node and receives a stream of events as state is altered in the node. The data node stores these events and uses them to generate rich information which can be queried via APIs.

A data node can be started in 2 ways, first it can be connected to a node which is replaying the chain from block 0. Secondly it can connect to a node which is starting from a specific snapshot in the chains history. The advantage of performing a full replay of the chain is that the data node can contain all historic information from the beginning of chain, however it takes a considerable amount of time to replay and process the chain. As a rough estimate it can take around 1 full day to replay the blocks generated over a 2 month period. The advantage of the second option is that the data node can be started up very quickly to allow clients to access the current live information within an hour but the historic information will not be available.

# Running the backend database
The data node relies on the postgres database with a timescaledb plugin to hold all it's information. The easiest way to run this is using docker. Here is an example script that will start up the database in a way we can use it. We currently support Postgres 14 and TimescaleDB 2.8.0.

```script
docker run -d \
    --rm \
    --name vega_postgresql \
    -e POSTGRES_USER=vega \
    -e POSTGRES_PASSWORD=vega \
    -e POSTGRES_DB=vega \
    -p 5432:5432 \
    -v $POSTGRES_PATH/data:/var/lib/postgresql/data \
    timescale/timescaledb:2.8.0-pg14 \
        -c "max_connections=50" \
        -c "log_destination=stderr" \
        -c "work_mem=5MB" \
        -c "huge_pages=off" \
        -c "shared_memory_type=sysv" \
        -c "dynamic_shared_memory_type=sysv" \
        -c "shared_buffers=2GB" \
        -c "temp_buffers=5MB"
```
Make sure this is working correctly before continuing with the later steps.

```
user@veganode:~/vega$ psql -U vega -h localhost
Password for user vega:
psql (14.9 (Ubuntu 14.9-0ubuntu0.22.04.1), server 14.5)
Type "help" for help.

vega=#
```

The `POSTGRES_?` values set above need to match with the values specified in the data node configuration file. If you want to change from the default values above, make sure you update the values in both places.

# PostgreSQL configuration tuning (optional)
The default PostgreSQL configuration is not optimised for memory usage, and can be modified.

Find the PostgreSQL parameters in the `postgresq.conf` file. The default file path for Linux and PostgreSQL 14 is: `/etc/postgresql/14/main/postgresql.conf`.

:::note Memory usage
Total memory usage for PostgreSQL is predictable. To determine the values of the parameters below, you must know how PostgreSQL uses the memory.
There is a `shared_memory` that is used between all connections and background workers.

Each background worker and connection has its own smaller chunk of memory:

- `work_mem` - memory available for the query buffers in the connection session.
- `temp_buffers` - memory available for accessing temporary tables by the connection session.

You can assume that `Max RAM` utilisation can be rounded to: `shared_buffer + (temp_buffers + work_mem) * max_connections`.
:::

The suggested parameters are below.

#### Max connections

New value:

```conf
max_connections = 50
```

Limiting the maximum number of connections reduces the memory usage by PostgreSQL.

#### Huge pages

New value:

```conf
huge_pages = off
```

The default value of the `huge_pages` config is `try`. Setting it to `off` usually reduces the RAM usage, however, it increases the CPU usage on the machine.

#### Work mem

New value:

```conf
work_mem = 5MB
```

#### Temp buffers

New value:

```conf
temp_buffers = 5MB
```

#### Shared buffers

New value:

```conf
shared_buffers = 2GB
```

This value should be set to 25% of your server’s physical memory. The 2GB value would work for a server with 8GB physical memory.

#### Dynamic shared memory type

New value:

```conf
dynamic_shared_memory_type = sysv
```

#### Shared memory type

New value:

```conf
shared_memory_type = sysv
```

The two above parameters determine how your operating system manages the shared memory.

If your operating system supports the POSIX standard, you may want to use the `map` value both for the `dynamic_shared_memory_type` and `shared_memory_type`. But the `sysv` value is more portable than `map`. There is no significant difference in [performance ↗](https://lists.dragonflybsd.org/pipermail/kernel/attachments/20120913/317c1aab/attachment-0001.pdf).


## Starting a data node from block 0

If a data node is going to be started from block zero, the non validator node must also be starting from block 0. We assume here that the non validator node is already configured (follow the instructions here **non validator instruction**).

1. Edit the vega config file at $VEGA_PATH/config/node/config.toml and set the value
```toml
  [Broker]
    [Broker.Socket]->Enabled = true
```
2. Initialise the data node config files
```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011" --archive
```

We have three retention policies that can be set during the init process. `--archive` as used above will retain everything. For details about the other settings please see the section below about retention policies.


3. Start the data node
```
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```
4. Now start the node and confirm that both apps are running and you can see the block height increasing on both.


## Starting the data node from network history

If network history is to be used to get the current state of the data node, we need to start the non validator node using a snapshot. Follow the instructions here (link to instructions for **non validator snapshots**)

1. Edit the vega config file at $VEGA_PATH/config/node/config.toml and set the value
```toml
  [Broker]
    [Broker.Socket]->Enabled = true
```
2. Initialise the data node config files
```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011" --archive
```
3. Edit the data node configuration file at $YOUR_DATANODE_HOME_PATH/config/data-node/config.toml and set `AutoInitialiseFromNetworkHistory` = true
4. Find out the list of network history bootstrap nodes by going to a URL like this ([bootstrap nodes](https://api.vega.community/api/v2/networkhistory/bootstrap))
5. Paste the list into the section
```toml
  [NetworkHistory]
    [NetworkHistory.Store]
      BootstrapPeers
```
6. Start the data node
```
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```
7. Now start the node and confirm that both apps are running and you can see the block height increasing on both.

## Using visor to control and upgrade your data node

We strongly recommend using the tool `visor` to start up the data node as it will transparently take care of upgrading the node as new versions of the software are required. Follow the instructions for visor in the non validator node docs to get the tool downloaded and set up for the vega core (linky **here**)

1. Edit the configuration file in $VISOR_PATH/genesis/run-config.toml and add the follow section to the bottom of the file
```toml
[data_node]
  [data_node.binary]
    path = "vega data-node"
    args = ["start", "--home=$YOUR_DATANODE_HOME_PATH"]
```
2. Start visor with the command
```
visor --home=$YOUR_VISOR_HOME_PATH run
```

## Configure the data node SSL certificate
You will need your data node to be reachable over the internet with a proper fully qualified domain name, and a valid signed certificate. You may provide data node with a path to an existing signed certificate and corresponding private key

```toml
  [Gateway]
    HTTPSEnabled = true
    CertificateFile = "/path/to/certificate/file"
    KeyFile = "/path/to/key/file"
```

Many administrators prefer to use a tool called `certbot` for generating and signing free certificates via `LetsEncrypt`. To obtain a signed certificate with this method:
* [Install certbot](https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/)
* Run `certbot certonly --standalone` to generate certificate
* Place the generated `fullchain.pem` into the `Gateway.CertificateFile` location and corresponding `privkey.pem` to `Gateway.KeyFile`.

**It is a hard requirement of the `LetsEncrypt` validation process that the tool answering its challenge is running on the standard HTTP/HTTPS ports(80, 443). Therefore if you are running behind a firewall you should port forward 80+443 to the machine generating the certificate for the duration of the creation process** 

## Data node retention profiles
When starting a data node, you can choose the data retention configuration for your data node, depending on the use case for the node. The retention policy details can all be fine-tuned manually, as well.

There are 3 retention policy configurations:
* **Standard (default)**: The node retains data according to the default retention policies, which assume a data node retains some data over time, but not all data
* **Lite**: The node retains enough data to be able to provide the latest state to clients, and produce network history segments. This mode saves enough to provide the current state of accounts, assets, balances, delegations, liquidity provisions, live orders, margin levels, markets, network limits, network parameters, node details, parties, positions
* **Archive**: The node retains all data

To run a node that doesn't use the standard default retention, use one of the following flags when running the `init` command:

* For a standard node, no flag
* For an archive node, use `--archive`
* For a lite node, use `--lite`

If you want to tweak the retention policy once the initial configuration has been generated, set it on per-table basis in the data node's `config.toml`.

For example:

```toml
[[SQLStore.RetentionPolicies]]
  HypertableOrCaggName = "balances"
  DataRetentionPeriod = "7 days"
```

Additionally, you can set the chunk interval for Timescale hypertables that are used to store historical data. Default values are chosen by Vega and are applied when the database migrations are run. The chunk interval determines how much data is stored in each chunk and affects the amount of RAM used by the database, as recent chunks are kept in memory in order to make querying faster. To change the chunk interval, set it on a per-table basis in the data node's `config.toml`.

For example:

```toml
[[SQLStore.ChunkIntervals]]
  HypertableName = "orders"
  ChunkInterval = "2 hours"
```

Additionally, you can set the chunk interval for Timescale hypertables that are used to store historical data. Default values are chosen by Vega and are applied when the database migrations are run. The chunk interval determines how much data is stored in each chunk and affects the amount of RAM used by the database, as recent chunks are kept in memory in order to make querying faster. To change the chunk interval, set it on a per-table basis in the data node's `config.toml`.

For example:

```toml
[[SQLStore.ChunkIntervals]]
  HypertableName = "orders"
  ChunkInterval = "2 hours"
```

## Resetting the data node
:::warning
Running the following command will remove all data from the data node and is not recoverable.
:::

To reset the data node and remove all data, execute the command:

```shell
vega datanode unsafe_reset_all -home=$YOUR_DATANODE_HOME_PATH
```

After this is done  you can repopulate the data node by replaying the chain or by initialising it from network history.