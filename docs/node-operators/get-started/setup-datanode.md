---
sidebar_position: 4
title: Set up a data node
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Before you set up a data node, you'll need to have a [non-validator node](./setup-non-validator.md) and confirmed it's running correctly. 

## What is a data node?
A data node gives you and potentially other users a way to query the state of the network and historic information over the lifetime of the blockchain. 

A data node connects to a non validator node and receives a stream of events as state is altered in the node. The data node stores these events and uses them to generate rich information that can be queried via APIs.

## Setting up a data node
A data node can be started in 2 ways:
- It can be connected to a node that is replaying the chain from block 0. 
- It can use network history by connecting to a different node that is restarting from a specific snapshot in the chain's history. 

The advantage of performing a full replay of the chain is that the data node can contain all historic information from the beginning of the chain. However, it takes a considerable amount of time to replay and process the chain. As a rough estimate it can take around 1 full day to replay the blocks generated over a 2 month period. 

The advantage of using network history is that the data node can be started up very quickly to allow clients to access the current live information within an hour. The drawback is that the historic information will not be available.

## Running the backend database
The data node relies on the Postgres database with a TimescaleDB plugin to hold all its information. The easiest way to run this is using Docker. 

Data node software currently supports Postgres 14 and TimescaleDB 2.8.0.

Example script to start up the database:

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

Use the following command to make sure it's working correctly before continuing:

```
user@veganode:~/vega$ psql -U vega -h localhost
Password for user vega:
psql (14.9 (Ubuntu 14.9-0ubuntu0.22.04.1), server 14.5)
Type "help" for help.

vega=#
```


The `POSTGRES_?` values set above need to match with the values specified in the data node configuration file (`$YOUR_DATANODE_HOME_PATH/config/data-node/config.toml`). If you want to change from the default values above, make sure you update the values in both places.

### PostgreSQL configuration tuning (optional)
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


## Starting the data node from block 0

If you're starting your data node from block zero, the non validator node must also be starting from block 0. If you don't already have a non validator set up, do it before continuing.

1. Edit the vega config file at `$VEGA_PATH/config/node/config.toml` and set the following value:

```toml
  [Broker]
    [Broker.Socket]->Enabled = true
```
2. Initialise the data node config files

```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011" --archive
```

There are three retention policies. If you don't want the default, you'll need to set it during the init process. `--archive`, as used above, will retain everything. For details about the other settings, see the section below about [data node retention policies](#data-node-retention-profiles).

3. Start the data node

```
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```
4. Now start the non validator node and confirm that both apps are running and you can see the block height increasing on both. 


## Starting the data node from network history

If you're using network history to get the current state to start up your data node, you'll first need to start the non validator node using a snapshot. Follow the instructions in the [non validator node set up guide](./setup-non-validator.md#start-a-node-using-a-remote-snapshot).

1. Edit the vega config file at `$VEGA_PATH/config/node/config.toml` to set the following value:

```toml
  [Broker]
    [Broker.Socket]->Enabled = true
```
2. Initialise the data node config files

```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011" --archive
```

3. Change the data node configuration at `$YOUR_DATANODE_HOME_PATH/config/data-node/config.toml` to `AutoInitialiseFromNetworkHistory` = true

4. Find the list of network history bootstrap nodes by querying the network history bootstrap API. For example: `https://api.vega.community/api/v2/networkhistory/bootstrap``

5. Still in your data node configuration file, paste the list of nodes into the section:

```toml
  [NetworkHistory]
    [NetworkHistory.Store]
      BootstrapPeers
```

6. Start the data node
```
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```

7. Start the non validator node. Confirm that both nodes are running and you can see the block height increasing on both.

## Using Visor to control and upgrade your data node

We strongly recommend using the tool `visor` to start up your data node as it will transparently take care of upgrading the node as new versions of the software are released and adopted by validators. 

Follow the instructions for Visor in the [non validator node setup guide](./setup-non-validator.md#upgrade-your-node-using-visor) to download and set up Visor.

1. In the configuration file in `$VISOR_PATH/genesis/run-config.toml`, add the follow section to the bottom of the file:

```toml
[data_node]
  [data_node.binary]
    path = "vega data-node"
    args = ["start", "--home=$YOUR_DATANODE_HOME_PATH"]
```

2. Start Visor:

```
visor --home=$YOUR_VISOR_HOME_PATH run
```

## Configure the data node SSL certificate
You will need your data node to be reachable over the internet with a proper fully qualified domain name, and a valid signed certificate. 

You can provide the data node with a path to an existing signed certificate and corresponding private key by updating this section in the file `$YOUR_DATANODE_HOME_PATH/config/data-node/config.toml`:

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

:::caution Ports for LetsEncrypt
It is a hard requirement of the `LetsEncrypt` validation process that the tool answering its challenge is running on the standard HTTP/HTTPS ports(80, 443). 

If you are running behind a firewall, you need to port forward 80+443 to the machine generating the certificate for the duration of the creation process.
::: 

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

## Resetting the data node
:::warning
Running the following command will remove all data from the data node and is not recoverable.
:::

To reset the data node and remove all data, execute the command:

```shell
vega datanode unsafe_reset_all -home=$YOUR_DATANODE_HOME_PATH
```

After this is done you can repopulate the data node by replaying the chain or by initialising it from network history.
