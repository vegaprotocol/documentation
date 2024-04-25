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
        -c "max_locks_per_transaction=256" \
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

#### Max locks per transaction

New Value:

```conf
max_locks_per_transaction = 256
```

This value may change in the future to a bigger number, depending on the network traffic. See the [Postgres docs ↗](https://postgresqlco.nf/doc/en/param/max_locks_per_transaction/) for reference.

:::note Error state
When the value is too low, you may see the following error: `ERROR: out of shared memory (SQLSTATE 53200)`.
:::

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

## Preparing a home directory for the data node

An archive data node containing the entire chain history is expected to hold a lot of data. The data saved to disk will be both the underlying block-data for the chain, and all the event data emitted by the core node for every block. For this reason it is recommended to use a file-system with compression such as `ZFS`.

The below steps will walk through how to create a `ZFS` volume on an external drive that can be used as a home directory for both a data node and a core node.

### Prerequisites

A CLI tool is needed to create and configure `ZFS` volumes. It can be installed using the following command:

```
apt-get update -y && apt-get install -y zfsutils-linux
```

You'll also need a dedicated, external hard drive to store and compress all data written by the data node. Assuming this storage device is called `DEVICE_NAME` ensure that any exisiting data is removed from it:

```
wipefs --all -force /dev/DEVICE_NAME
```

### Creating the ZFS volume

With the `ZFS` utility installed and `DEVICE_NAME` clear and ready, an initial "pool" can be created and turned into a `ZFS` volume:

```
# creates a pool containing DEVICE_NAME
zpool create vega_pool /dev/DEVICE_NAME

# shows the status of the newly created pool
zpool status

# creates the zfs
zfs create vega_pool/home
```

You can then create a mount point to use as a home directory, and then set a compression algorithm:

```

# creates a directory where the device with be mounted
mkdir -p /home/vega
zfs set mountpoint="/home/vega" vega_pool/home

# checks the the mount point is now as expected
zfs get mountpoint vega_pool/home

# sets the compression algorithm
zfs set compression=zstd vega_pool/home
```

It is possible to further fine-tune the compression settings to your particular needs if you find this necessary. More information can be found in `ZFS`'s [documentation↗](https://openzfs.github.io/openzfs-docs/Performance%20and%20Tuning/index.html).

Finally, the Postgres configuration should be updated so that its data directory is set to the `ZFS` volume. It is also important to ensure that the Postgres process will have permissions to write to the volume:

```
sed -i /etc/postgresql/14/main/postgresql.conf "s/data_directory.*/data_directory = '/home/vega/postgresql'/g"

# gives the postgres process permissions to write to the volume
chown -R postgres:postgres /home/vega/postgresql
chomd 700 /home/vega/postgresql
```

## Starting the data node from block 0

If you're starting your data node from block zero, the non validator node must also be starting from block 0. If you don't already have a non validator set up, do it before continuing.

1. Edit the vega config file at `$VEGA_PATH/config/node/config.toml` and set the following value:

```toml
  [Broker]
    [Broker.Socket]->Enabled = true
```

2. Initialise the data node config files

```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011"
```

By default the data node will retain all historic data generated by the chain. This is the expected behaviour for public data nodes. Find out more about data retention in the section on [data node retention policies](#data-node-retention-profiles).

3. Start the data node

```
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```

4. Now start the non validator node and confirm that both apps are running and you can see the block height increasing on both.

### Potential error: Cannot unregister order
A bug crashed the mainnet network at block `26439343`. This makes replaying the chain from block 0 more complicated.

If your node fails with this error message, follow the procedure described below: `cannot unregister order with potential sell + size changes < 0`

1. Roll back one block: `vega tm rollback --home <tendermint_home>`. Your node will reprocess the problem block with the correct version.
2. Download the [v0.73.6-patch.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.6-patch.1) binary
3. Start your node with downloaded binary from block `26439116`, e.g: with the following flag: `--snapshot.load-from-block-height 26439116`
4. The binary will apply some fixes to the broken transactions, but the node will fail with the following error: `panic: cannot unregister order with potential sell + size change < 0`.
5. Reply steps 1-3, but use the [v0.73.6-patch.2 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.6-patch.2) binary.

**It is essential to let the binary fail with the `v0.73.6-patch.1` binary, or you won't be able to move your node forward!**

After `v0.73.6-patch.2` your node will continue replaying normally.

### Potential error: Invalid memory address
A bug crashed the mainnet network at block `34669654`.

This makes replaying chain from block 0 more complicated.

If your node fails with this error message, follow the procedure described below: `runtime error: invalid memory address or nil pointer dereference`

1. Download the [v0.73.13-patch.1 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.13-patch.1) binary
2. Replace the old vega binary with the one you downloaded
3. Start your node with the latest local snapshot - just restart node with a new binary

### Potential error: wrong Block.Header.LastResultsHash

A bug crashed the mainnet network at block `38535816`.

The error you should expect is:

```
wrong Block.Header.LastResultsHash.  Expected 3A736D1F6EAC1219BB9B2A38F7778707A14B837A9723DC72C8B40DE8F26E9EC0, got A939F9452FB4C17D926C8853B65F4629FF2EB00E188E1970872D688DEEF33AC2
```

To fix the issue, follow these steps:

1. Stop your node if it is still running
2. Swap your vega binary with [the v0.74.7-patch-mainnet-affected-nodes release ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.74.7-patch-mainnet-affected-nodes)
3. Rollback the last comet bft block with the `vega tm rollback --home <tendermint_home>` command
4. Start your node

### Potential error: wrong Block.Header.AppHash at block 41090347

A bug crashed the mainnet network at block `41090347`.

You may see the following error:

```
wrong Block.Header.AppHash.  Expected E02A8186F254267A97D069DEFE0DE1EB581B952ACE04CA9C73F5C930EFD581E2, got 24808BBEF33F7B7DDB59F814621A9AC587000D7E4191646256DADD2345A8BB56
```

To fix the issue follow the below steps:

1. Stop your node.
2. Run tm rollback for a single block: `vega tm rollback --home <tendermint_home>`
3. Replace the vega binary with [0.74.10-fix.1](https://github.com/vegaprotocol/vega/releases/tag/v0.74.10-fix.1)
4. Update the config/flag to your node from the one before the last snapshot.
    a. If you use Visor you can add the following path to the run-config.toml(`<vegavisor_home>/current/run-config.toml`) file: `"--snapshot.load-from-block-height", "41090047"` 
    b. If you do not use Visor, you can add the following flag to your start command: `--snapshot.load-from-block-height 41090047`
    c. You can also update core config (`<vega_home>/config/node/config.toml`): `Snapshot.StartHeight = 41090047`
5. Start node
6. When your node is stable, and it is running revert the change applied in step 4.

## Starting the data node from network history

If you're using network history to get the current state to start up your data node, you'll first need to start the non validator node using a snapshot. Follow the instructions in the [non validator node set up guide](./setup-non-validator.md#start-a-node-using-a-remote-snapshot).

1. Edit the vega config file at `$VEGA_PATH/config/node/config.toml` to set the following value:

```toml
  [Broker]
    [Broker.Socket]
      Enabled = true
      ...
```

2. Initialise the data node config files

```
vega datanode init --home=$YOUR_DATANODE_HOME_PATH "vega-mainnet-0011"
```

3. Change the data node configuration at `$YOUR_DATANODE_HOME_PATH/config/data-node/config.toml` to `AutoInitialiseFromNetworkHistory` = true

4. Find the list of network history bootstrap nodes by querying the network history bootstrap API. For example: `https://api0.vega.community/api/v2/networkhistory/bootstrap`

5. Still in your data node configuration file, paste the list of nodes into the `NetworkHistory.Store.BootstrapPeers`:

```toml
  [NetworkHistory]
    [NetworkHistory.Store]
      BootstrapPeers = ["/dns/api1.vega.community/tcp/4001/ipfs/12D3KooWDZrusS1p2XyJDbCaWkVDCk2wJaKi6tNb4bjgSHo9yi5Q", "/dns/api2.vega.community/tcp/4001/ipfs/12D3KooWEH9pQd6P7RgNEpwbRyavWcwrAdiy9etivXqQZzd7Jkrh", "/dns/api3.vega.community/tcp/4001/ipfs/12D3KooWEH9pQd6P7RgNEpwbRyavWcwrAdiy9etivXqQZzd7Jkrh"]
```

6. Set number of blocks to sync to a low value if you do not need historical data - it drastically improves startup time.

```toml
...
  [NetworkHistory.Initialise]
    MinimumBlockCount = 100
    ...
```

7. Set the block retention span

```toml
  ...
  [NetworkHistory.Store]
    HistoryRetentionBlockSpan = 10000000
    ...
```

8. If your node is for internal use only, disable publishing network history segments - it will improve performance.

```toml
[NetworkHistory]
  Enabled = true
  Publish = false
  ...
  ...
```


9. Start the data node

```shell
vega datanode start --home=$YOUR_DATANODE_HOME_PATH
```

:::warning This may take some time
The data node will by default pull all the entire chain's history and is expected to take almost 24 hours. The `--networkhistory.initialise.block-count` option can be used to limit the amount of data pulled, but this is not recommended for the purposed of a public data node.
:::

10. Start the non validator node. Confirm that both nodes are running and you can see the block height increasing on both.

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

:::note Post start actions

Make sure you disable statesync by setting `statesync.enabled = false` in the tendermint configuration and `AutoInitialiseFromNetworkHistory = false` in the network history. Otherwise your node will FAIL after next restart.
:::


## Configure the data node SSL certificate

See the [secure data node documentation page](../requirements/data-node-security.md)

## Data node retention profiles

When initialising a data node, you can choose the data retention configuration for your data node, depending on the use case for the node. The retention policy details can all be fine-tuned manually, as well.

There are 3 retention policy configurations:

- **Archive (default)**: The node retains all data and is the expected, and only recommended, retention profile for a public data node.
- **Minimal**: The node retains only data about a network's current state. This can be useful for private data nodes that will serve live data and stream changing states.
- **Conservative**: The node does not retain all data and per-table rentention is set. This can be useful for private data nodes that need customised per-table data rentention based on a specific usecase.

To choose a retention profile use the following flag when running the `datanode init` command:

```
--retention-profile=[archive|minimal|conservative]
```

If you want to run a private data node and are considering tweaking the per-table retention policies, this can be updated in the data node's `config.toml`.

For example the below will limit data retained on `balances` to those entries created in the last 7 days:

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

## Performance tuning

Depening on how your servers are configured, your drives may be mounted without `noatime` being set. This can have a significant impact on the database performance and can cause deadlocks and database panics under certain conditions. It is therefore recommended that when setting up your Linux server for running a data node, you ensure that the drives are mounted with the `noatime` option set.