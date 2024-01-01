---
sidebar_position: 4
title: Set up a data node
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To set up a data node, you must first have followed the guide to [install and set up a Vega node](setup-server.md). A data node must be run in conjunction with a **non-validator Vega node**.

The non-validator Vega node will send the events it receives from the network and the events it creates to the data node, which will then store them in a database. An API is provided to query the data stored by the data node.

Note: If you are running a Vega validator node it is recommended that you do not connect the data node to this node, but to a separate non-validator Vega node.

The database used by the data node is a PostgreSQL database with the Timescale extension installed. The database can be a dedicated database server, a docker container, or an embedded version of PostgreSQL with Timescale installed that is provided by Vega.

:::note Operating system
The following instructions assume you are installing on a Ubuntu Linux machine as explained in the [server setup guide](setup-server#os-and-software).
:::

## Pre-requisites

### Vega core
Please follow the instructions in the [server setup guide](setup-server.md) to install Vega.

### PostgreSQL and TimescaleDB full installation
We have tested and recommend using version 2.8.0 of the TimescaleDB plugin with Postgres 14.

Refer to the [PostgreSQL documentation ↗](https://www.postgresql.org/docs/14/index.html) for more detailed information on setting up a PostgreSQL database.

:::note Linux and MacOS guides

<Tabs groupId="operating-systems">
<TabItem value="linux" label="Linux">

### Linux users
To ensure you install the correct version of TimescaleDB, you can use the notes at the bottom of the [Timescales Documentation for Debian ↗](https://docs.timescale.com/install/latest/self-hosted/installation-debian/).

</TabItem>
<TabItem value="mac" label="MacOS">

### MacOS users
To ensure you install the correct version of TimescaleDB, you can use the notes at the bottom of the [Timescales Documentation for Mac ↗](https://docs.timescale.com/install/latest/self-hosted/installation-macos/).
</TabItem>
</Tabs>
:::

:::note Database user roles
Due to operations that are required for snapshotting, the database user for the data-node must have superuser privileges. This is a limitation that we currently have due to Postgresql 14 and TimescaleDB.
:::

### PostgreSQL and TimescaleDB docker installation
If you prefer to run PostgreSQL and TimescaleDB in a docker container, you can use the following command to start a Postgresql docker container with TimescaleDB installed:

This guide assumes you already have Docker installed on your system. For full installation guide consult Docker's [documentation ↗](https://docs.docker.com/engine/install/ubuntu/).

```Shell
docker volume create vega_pgdata

docker run -d \
    --rm \
    --name MY_LOVELY_DB_CONTAINER \
    -e POSTGRES_USER=DATABASE_USER \
    -e POSTGRES_PASSWORD=DATABASE_PASSWORD \
    -e POSTGRES_DB=DATABASE_NAME \
    -p LOCALDB_PORT:5432 \
    -v vega_pgdata:/var/lib/postgresql/data \
    timescale/timescaledb:2.8.0-pg14
```

Where:

- `database_user` is the user name you want to use to connect to the database.
- `database_password` is the password you want to use to connect to the database.
- `database_name` is the name of the database you want to use for storing the data.
- `localdb_port` is the port you want to use to connect to the database on your local machine. (5432 is the default port for Postgresql database server and may not be available if you already have a PostgreSQL database server running on your machine and want to use Docker for testing).

You should also consider [PostgreSQL configuration tuning](#postgresql-configuration-tuning).

Example command to start PostgreSQL:

```shell
docker volume create vega_pgdata

docker run -d \
    --rm \
    --name vega_postgresql \
    -e POSTGRES_USER=DATABASE_USER \
    -e POSTGRES_PASSWORD=DATABASE_PASSWORD \
    -e POSTGRES_DB=DATABASE_NAME \
    -p 5432:5432 \
    -v vega_pgdata:/var/lib/postgresql/data \
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

### PostgreSQL configuration tuning

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

## Generate configuration files

### Vega and Tendermint configuration
Before you can use Vega, you need to generate the default configuration files for Vega and Tendermint. You can then alter those to the specific requirements.

The below command will create home paths (if they don't already exist) and generate the configuration in the paths you chose.

```shell
vega init --home="YOUR_VEGA_HOME_PATH" --tendermint-home="YOUR_TENDERMINT_HOME_PATH" full
```

To update your node configuration, such as to set up ports for the APIs, edit the config file:

```shell
"YOUR_VEGA_HOME_PATH"/config/node/config.toml
```

:::note Setting up validator node
For more information about setting up a validator node, see the [validator node setup guide](setup-validator.md).
:::

### Data node configuration

#### Data node retention profiles
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

## Generate config
To generate the configuration files you need for the data node, you can use the following command:

```shell
vega datanode init --home="YOUR_DATA_NODE_HOME_PATH" "CHAIN_ID"
```

Find the `CHAIN_ID` by going to the relevant network genesis file in the relevant networks repo.

Visit [networks ↗](https://github.com/vegaprotocol/networks/) for mainnet and other validator-run networks, or [networks-internal ↗](https://github.com/vegaprotocol/networks-internal) for Vega-run testnet networks.

To update your data node configuration, such as to set up ports for the APIs or database credentials, edit the config file:

```shell
"YOUR_DATA_NODE_HOME_PATH"/config/data-node/config.toml
```

## Configure nodes

### Vega
To configure your Vega node to work with a data node you need to update the `[Broker.Socket]` section of the Vega configuration file `YOUR_VEGA_HOME_PATH/config/node/config.toml` from false to:

```toml
  [Broker.Socket]
    ...
    Enabled = true
    ...
```

:::note
While it's possible to run the data node and Vega node on separate machines, it's not recommended given the volume of data that will be transferred between the two.
:::

### Data node database
Data node database configuration is defined under the `[SQLStore.ConnectionConfig]` section of the data node configuration file `YOUR_DATA_NODE_HOME_PATH/config/data-node/config.toml`:

```toml
  [SQLStore.ConnectionConfig]
    Host = "localhost"
    Port = 5432
    Username = "USER_NAME"
    Password = "PASSWORD"
    Database = "DATABASE_NAME"
    MaxConnLifetime = "30m0s"
    MaxConnLifetimeJitter = "5m0s"
```

You should ensure the database configuration matches those of the database you created in the pre-requisite steps.

### Resetting the data node
:::warning
Running the following command will remove all data from the data node and is not recoverable.
:::

To reset the data node and remove all data, execute the command:

```shell
vega datanode unsafe_reset_all
```

After this is done you can repopulate the data node by replaying the chain or by [initialising it from network history](../how-to/restart-data-node-from-network-history.md).

### Embedded Postgres
:::warning
This is not recommended for use in production, but you can use it to test or learn about the system.
:::

If you do not have access to, or do not want to use a PostgreSQL database server, or a Postgres Docker container, it is possible to run a data node with an embedded version of Postgres. You can enable this by setting the flag:

```toml
[SQLStore]
  ...
  UseEmbedded = true
  ...
```

This will cause data node to download a specially prepared Postgresql package which is extracted to your local machine if it doesn't exist. A separate Postgresql process will be spawned by data node using the credentials you specified in the database configuration section. Once data node is stopped, the child Postgresql process will be stopped automatically.

You can launch PostgreSQL in its own separate process using the data node embedded PostgreSQL binaries by running the following command:

```shell
vega datanode postgres run --home="YOUR_DATA_NODE_HOME_PATH"
```

In either case, the files for the database will be stored in the data node `state` folder located at `YOUR_DATA_NODE_HOME_PATH/state/data-node/storage/sqlstore`.

### Buffered event source
When a data node is restarted from snapshots, it is possible for the event queue to become flooded, causing the Vega core to panic when the event queue is full and stop both the Vega core and data node.

To prevent this, the buffered event source flag is set to true by default. You can confirm this by looking at the following config section:

```toml
[Broker]
  ...
  UseBufferedEventSource = true
  ...
```

## Start Vega and data node
It is recommended to start the data node before starting the Vega node. By default if the `Broker.Socket.Enabled` flag is set to true, the Vega node will attempt to connect to the data node on startup. It will continue to try and connect for one minute before giving up.

**If you're using [Vega Visor](setup-server#install-visor)**, start your data node by running the service manager of your choice and use the following command:

```shell
visor run --home "VISOR_HOME_PATH"
```

If not using Vega Visor, to start the data node, run the following command:

```shell
vega datanode start --home="YOUR_DATA_NODE_HOME_PATH"
```

## Fetch network history
After starting a data node, you can load in a segment of network history, if you want your node to have more data than provided by the current height. This is particularly useful if you're running an archive node.

Before you can fetch network history, you will need to update your data node configuration file to add a list of bootstrap peers, as by default this is left empty and depends on which network you are connecting to:

```toml
[NetworkHistory]
...
  [NetworkHistory.Store]
  ...
  BootstrapPeers = ["/path/to/bootstrap-peer/1","/path/to/bootstrap-peer/2"]
```

To get a list of bootstrap peers available for your network, you can make a HTTP request to the API service for your chosen network: `/api/v2/networkhistory`.

```json
{
  "ipfsAddress": "/ip4/<data-node-ip-4-address>/tcp/4001/p2p/<some-uid>",
  "swarmKey": "/key/swarm/psk/1.0.0/\n/base16/\n<some key>",
  "swarmKeySeed": "<some-key-seed>",
  "connectedPeers": [
    "/ip4/<peer-ip-4-address>/tcp/4001/p2p/<peer-id>",
    ...
  ]
}
```


To see how much network history your data node has, run the following command:

```shell
vega datanode network-history show --home="YOUR_DATA_NODE_HOME_PATH"
```

### Fetching network history for a new data node

If you are building a new data node, you may have no history and you will see this message:

```shell
No network history is available. Use the fetch command to fetch network history
```

In this case, it is possible to get the latest history segment ids from your network history bootstrap peers:

```shell
vega datanode network-history latest-history-segment-from-peers --home="YOUR_DATA_NODE_HOME_PATH"
```

This will return a list of peers you can fetch network history from:

```text
Most Recent History Segments:

Peer:<peer-ip-and-api-port>, Swarm Key:<swarm-key>, Segment{from_height:75001  to_height:75300  history_segment_id:"some-segment-id"  previous_history_segment_id:"some-other-segment-id"}
...
```

:::note
It is possible that some data peers are behind and may not have the latest data. However, the `history_segment_id` should be the same across all nodes that are at the same height.
:::


To fetch a network history segment, run the command below. Use the ID of the segment you want (for example, the latest) followed by the number of blocks prior to the segment's height that you want fetch. `2000` is used in the following example. This will result in all blocks from height N-2000 to N being retrieved.

```shell
vega datanode network-history fetch <segment-id-of-segment-at-height-N> 2000 --home="YOUR_DATA_NODE_HOME_PATH"
```

Once the network history segments have been downloaded, running: 

```shell
vega datanode network-history show --home="YOUR_DATA_NODE_HOME_PATH"
```

should display the network history you have:

```text
Available contiguous history spans:

Contiguous history from block height XXXXX to XXXXX, from segment id: <first-segment-id> to <last-segment-id>


Datanode contains no data
```

### Loading network history into data node
Now that you have downloaded historical data you can load the history into the data node using:

```shell
vega datanode network-history load --home="YOUR_DATA_NODE_HOME_PATH"
```

:::note
Data node must not be running when you use this command. If you attempt to use `network-history load` while data node is running, you will get an error:

```text
datanode must be shutdown before data can be loaded
```
:::

You will be notified that the load command will force all existing connections to the data node database will be closed automatically and prompted if you want to continue. Enter `y` and data node will check how much history you have, tell you what it will load, and prompts you to confirm if you want to continue. Enter `y` again and the data node will load the history you have fetched.

This process may take a very long time depending on how much history you have retrieved and are loading into the database. Some processes in the restoration can take a long time to complete and it may look like the process is not doing anything. Do not try to terminate the process early or you may end up with a corrupted data node database.


## Data node recovery from network history

It is possible to start a data node and initialise it using network history automatically. By default, this process is disabled, and if enabled will only fetch - if you don't have the snapshot locally - the last segment before loading it into the data node. This is to allow users to quickly initialise a data node without fetching a lot of data and start participating while the data node is fetching more data in the background.

To enable this feature, set the `AutoInitialiseFromNetworkHistory` setting in the data node configuration file to `true`. It is safe to leave this setting to true. 

If the data node already contains data that should be removed before loading from network history this can be done using the following command:


`vega datanode unsafe_reset_all`

If you want to fetch more than the last segment, you may also set the `MinimumBlockCount` configuration setting.

If you want to initialise the data node automatically up to a specific segment and X blocks before it, you can set both the `ToSegment` and `MinimumBlockCount` configuration settings.

```toml
AutoInitialiseFromNetworkHistory = true

[NetworkHistory.Initialise]
  ToSegment = "<segment-id-of-last-segment-you-require>" 
  MinimumBlockCount = <number-of-blocks-before-the-end-of-the-segment-you-require>
```

To initialise the data node with the latest segment, you can leave `ToSegment` empty. By default, this will ensure you initialise the data node with the latest segment with the number of blocks that are specified in `MinimumBlockCount`. The default `MinimumBlockCount` is 1.

If you are trying to initialise the data node with a large number of blocks, or have a slow internet connection for example, it is possible that the network history download will fail due to a timeout. Your data node logs may see an error such as:

```text
2023-03-29T14:45:44.516+0100	ERROR	datanode.start.persistentPre	backoff@v2.2.1+incompatible/retry.go:37	failed to fetch history blocks: failed to fetch history:could not write out the fetched history segment: context deadline exceeded
```

To extend the timeout, you may set the `Timeout` setting for `NetworkHistory.Initialise`:

```toml
[NetworkHistory.Initialise]
  Timeout = "15m0s"
```

Additionally you can also set the `FetchRetryMax` configuration setting:

```toml
[NetworkHistory.Initialise]
  FetchRetryMax = 5
```

Retries will find segments that have already been downloaded and not try to download them again. By default the process will wait 1 second between retries, but you can change this by setting the `RetryTimeout` configuration setting:

```toml
[NetworkHistory.Initialise]
  RetryTimeout = "5s"
```


## Network history troubleshooting

### Network history cannot find any history

When using `latest-history-from-peers` command, the peers returns no history. There can be a number of reasons why this is not working:

1. You have copied a configuration file from another machine and the PeerID has been duplicated.
2. You are using an out-of-date ChainID.
3. You have not configured any network peers.

If you have copied a configuration file from another machine and the other machine already exists on the network, running `network-history` commands may fail due to duplicated `PeerID` you have copied to the new machine. You should use the `vega datanode init` command to create a new configuration file, and copy the `PeerID` from that into your configuration file, or update the newly generated configuration file with configuration settings you have obtained from the existing configuration file.

If the network's `ChainID` has been updated and the `ChainID` your data node is configured with is out of date, the mismatched `ChainID` will prevent your request from being accepted. You will need to update the `ChainID` in your data node configuration file to the appropriate ChainID.

If you have not configured any network peers, follow the instructions found under [Fetch Network History](#fetch-network-history) to add the peers to your data node configuration file.

## Configure data node APIs
In order for clients to communicate with data nodes, we expose a set of APIs and methods for reading data.

There are currently three protocols to communicate with the data node APIs:

### gRPC
gRPC is an open source remote procedure call (RPC) system initially developed at Google. In data node the gRPC API features streaming of events in addition to standard procedure calls.

The default port (configurable) for the gRPC API is `3007` and matches the [gRPC protobuf definition ↗](https://github.com/vegaprotocol/vega/tree/develop/protos).

gRPC configurations are defined under the `[Gateway.Node]` section of the data node configuration file `YOUR_DATA_NODE_HOME_PATH/config/data-node/config.toml`:

```toml
  [Gateway.Node]
    Port = 3007
    IP = "0.0.0.0"
```

### GraphQL
[GraphQL ↗](https://graphql.org/) is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data, originally developed at Facebook. The [Console ↗](https://github.com/vegaprotocol/frontend-monorepo/tree/develop/apps/trading) uses the GraphQL API to retrieve data including streams of events.

The GraphQL API is defined by a [schema ↗](https://github.com/vegaprotocol/vega/blob/master/datanode/gateway/graphql/schema.graphql). External clients will use this schema to communicate with Vega.

Queries can be tested using the GraphQL playground app which is bundled with a node. The default port (configurable) for the playground app is `3008` accessing this in a web browser will show a web app for testing custom queries, mutations and subscriptions.

The GraphQL default port and other configuration options can be found in the data node configuration file `YOUR_DATA_NODE_HOME_PATH/config/data-node/config.toml` under the `Gateway.GraphQL` section:

```toml
  [Gateway.GraphQL]
    Port = 3008
    IP = "0.0.0.0"
    Enabled = true
    ComplexityLimit = 0
    HTTPSEnabled = false
    AutoCertDomain = ""
    CertificateFile = ""
    KeyFile = ""
    Endpoint = "/graphql"
```

#### HTTPS
The REST and GraphQL API gateway can be configured to use secure http connections.

**GraphQL subscriptions do not work properly unless the HTTPS is enabled**.

You will need your data node to be reachable over the internet with a proper fully qualified domain name, and a valid signed certificate. You may either:

* Provide data node with a path to an existing signed certificate and corresponding private key
* Configure data node to create a certificate for you, and automatically request a signature via `LetsEncrypt`

In the former case, where you already have a certificate and corresponding private key file, you can specify them as follows:

```toml
  [Gateway]
    HTTPSEnabled = true
    CertificateFile = "/path/to/certificate/file"
    KeyFile = "/path/to/key/file"
```

You can buy a certificate from a verified source and save the obtained file to your preferred location. It is advised that the certificate and key files have a permission mask of `0600` and the directory where they are located as `0700`.

Many administrators prefer to use a tool called `certbot` for generating and signing free certificates via `LetsEncrypt`. To obtain a signed certificate with this method:
* [Install certbot ↗](https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/)
* Run `certbot certonly --standalone` to generate certificate
* Place the generated `fullchain.pem` into the `Gateway.CertificateFile` location and corresponding `privkey.pem` to `Gateway.KeyFile`.
* Read the [configuration considerations](https://serverfault.com/questions/790772/best-practices-for-setting-a-cron-job-for-lets-encrypt-certbot-renewal) for certbot in crontab.

Data node can optionally perform a similar role to `certbot` and manage creation and signing of certificates automatically via LetsEncrypt. To enable this feature, specify an `AutoCertDomain` instead of `CertificateFile` and `KeyFile` paths in the `[Gateway]` section data node's configuration file. For example:

```toml
  [Gateway]
    HTTPSEnabled = true
    AutoCertDomain = "my.lovely.domain.com"
```

**It is a hard requirement of the `LetsEncrypt` validation process that the the server answering its challenge is running on the standard HTTPS port (443).** By default, the GraphQL API listens on port 3008, and the REST API runs on 3009, so the validation will not succeed. This means if you wish to make use of data node's automatic certificate management, you must do one of the following:

* Forward port 443 on your machine to the GraphQL or REST API port using `iptables` or similar other network configuration CLI. Example: `iptables`: `iptables -A PREROUTING -t nat -p tcp --dport 443 -j DNAT --to-destination :3008`
* Proxy pass to port 3008 by using reverse proxy server. Some example sources on how to set one up:
  - [`caddy`](https://caddyserver.com/docs/quick-starts/reverse-proxy)
  - [`nginx`](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
  - [`httpd`](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)
* Directly listen on port 443 instead of the default with either the GraphQL or REST gateways in data node by specifying the following configuration:

```toml
  [Gateway.GraphQL]
    Port = 443
```

or

```toml
  [Gateway.REST]
    Port = 443
```
Note that Linux systems generally require processes listening on ports under 1024 to either run as root, or be specifically granted permission, e.g. by launching with the following:

```shell
setcap cap_net_bind_service=ep vega datanode run
```

#### GraphQL complexity
Currently the GraphQL complexity limit is globally set to 3750.

This setting is theoretical at the moment and will be refined and have different levels for different queries/resolvers in the future.

The intention behind this limit is to prevent the VEGA system from being abused by heavy queries (DOS). The complexity level is mostly affected by the number of objects a query contains. So the heaviest ones we currently have in the system are:

| Query | Items | Complexity |
| ----- | ----- | ---------- |
| SimpleMarkets (embedded candles) | 1 candle | 151 |
| SimpleMarkets (embedded candles) | 91 candle | 788 |
| MarketInfo (embedded candles) | 1 candle | 399 |
| MarketInfo (embedded candles) | 91 candles | 1036 |
| Orders (embedded orders) | 1 order | 163 |
| Orders (embedded orders) | 80 orders | 4003 |
| Trades (embedded trades) | 1 trades | 118 |
| Trades (embedded trades) | 75 trades | 1393 |
| Positions (embedded positions) | 1 position | 129 |
| Positions (embedded positions) | 40 positions | 2500 |

The approximate number of positions queries by customers is 40.

The GraphQL will return error for queries that have complexity above the set limit: "GraphQL error: Query is too complex to execute" and will not proceed with execution.

### REST
REST provides a standard between computer systems on the web, making it easier for systems to communicate with each other. It is arguably simpler to work with than gRPC and GraphQL. In Vega the REST API is a reverse proxy to the gRPC API, however it does not support streaming.

The default port (configurable) for the REST API is `3009` and we use a reverse proxy to the gRPC API to deliver the REST API implementation.

## Further reading
For more information about data node and developing on data node please see the data node [README ↗](https://github.com/vegaprotocol/vega/blob/master/datanode/README.md)

## Data node troubleshooting

### Block height on begin block is too high

If you start data node and you receive an error that looks like:

```text
block height on begin block, XXXXXX, is too high, the height of the last processed block is XXXXXX
```

This indicates that the core node block height is ahead of the data node it is connected to.

There are a number of ways this can happen:

1. Data node has been added and connected to a core node that has been running for a while and no history has been loaded into data node.
2. Core has been started from a snapshot, but data node has been had no history loaded.
3. Data node was restarted with `WipeOnStartup` set to true.
4. Core has been started from snapshot, and data node has been started from an earlier snapshot than core.

Data node requires that the first block of data it receives from core is no more that the last block height received by data node + 1. If the height of the block received from core is lower than the last block height received by data node, the events from core are ignored until events from the appropriate next block is received.

To fix this problem, use the [network-history load](#loading-network-history-into-data-node), or use [AutoInitialiseFromNetworkHistory](#data-node-recovery-from-network-history) to ensure the data-node contains the necessary history before starting the core node.
