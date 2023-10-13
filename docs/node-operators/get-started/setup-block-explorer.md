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
However, by combining the blockexplorer API with the Tendermint API, you can get much more information about the vega network(see web server config and examples below).

## The design of the block explorer

The vega blockexplorer is strictly related to the tendermint, and the blockexplorer source all the data from the tendermint database.

Tendermint have two backends for indexing the transactions:

- `KV` (default) - the simplest possible indexer, backed by key-value storage (defaults to levelDB)
- `psql` - The psql indexer type allows an operator to enable block and transaction event indexing by proxying it to an external PostgreSQL instance allowing for the events to be stored in relational models. Since the events are stored in a RDBMS, operators can leverage SQL to perform a series of rich and complex queries that are not supported by the kv indexer type. Since operators can leverage SQL directly, searching is not enabled for the psql indexer type via Tendermint's RPC -- any such query will fail.

The Vega blockexplorer requires a `psql` indexer in the `Tendermint`, so you have to change the default value in the tendermint configuration.

## Requirements

- A non-validator vega node setup
- PostgreSQL database running
- (Optional) Webserver for proxing requests like Nginx or Caddy

## Limitations

You must replay entire chain from block 0 to have the full-history about the Vega network transactions. We do not recommend to modify config of already running nodes.

If you do not want to have a full network history, you can start your non-validator node [from the last remote snapshot](../how-to/use-snapshots.md#start-a-new-node-using-network-snapshots).

We are not going to cover the PostgreSQL installation here. Please see:

- [the official PostgreSQL install documentation](https://www.postgresql.org/docs/current/tutorial-install.html)
- [the official docs for install PostgreSQL on ubuntu](https://www.postgresql.org/download/linux/ubuntu/)

:::note
You may start postgresql with docker. To do it, use the following command:

```shell
docker volume create block-explorer-postgres-volume

docker run \
    --name block-explorer-postgres \
    -e POSTGRES_PASSWORD=vega \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -e POSTGRES_DB=tendermint_db \
    -v block-explorer-postgres-volume:/var/lib/postgresql/data \
    -p 5432:5432 \
    -d postgres
```

You should be able to use the following credentials in your configs below:

- Host: `127.0.0.1`
- Post: `5432`
- Username: `postgres`
- Password: `vega`
- Database name: `tendermint_db`
:::

## Full history vs specific history span

Your node must replay from block 0 to get the full-history in your vega block explorer. The replay process for entire network history may take up to several days. You can start your node from a specific snapshot(height) if you do not need a full-history for the transactions. Each vega node creates snapshots on exactly every few hundred blocks(defined by the network-parameter). You need access to the vega node, which have a specific snapshot you want to use. Example nodes/endpoints you may use to find snapshots are:

- [api0.vega.community/api/v2/snapshots](https://api0.vega.community/api/v2/snapshots)
- [api1.vega.community/api/v2/snapshots](https://api1.vega.community/api/v2/snapshots)
- [api3.vega.community/api/v2/snapshots](https://api3.vega.community/api/v2/snapshots)

:::note
You may find more publicly available nodes on the [GitHub repository](https://github.com/vegaprotocol/networks/blob/master/mainnet1/mainnet1.toml).
:::

:::warning
Due to limitations of the Tendermint, you can restart the network  from block 0 or **the ten last snapshots**. We recommend selecting the latest possible snapshots for restart. If the setup process takes too long and the snapshot is not in the pool of the last ten snapshots, you need to choose a newer snapshot again. 
:::

## Setup a block explorer

### 1. Download vega and visor binary

<Tabs groupId="restart-way">
<TabItem value="block-0" label="Restart from block 0">

Download the vega binary from the [Vega release page](https://github.com/vegaprotocol/vega/releases).

You have to download the binary for version, network has been started from block 0. For mainnet the binary version is [v0.71.4](https://github.com/vegaprotocol/vega/releases/tag/v0.71.4)

```shell
wget https://github.com/vegaprotocol/vega/releases/download/v0.71.4/vega-linux-amd64.zip
wget https://github.com/vegaprotocol/vega/releases/download/v0.71.4/visor-linux-amd64.zip
```

Then unzip it and check the version

```shell
unzip vega-linux-amd64.zip
unzip visor-linux-amd64.zip 

./vega version
Vega CLI v0.71.4 (61d1f77ee360bf1679d5eb0e0efdb1cce977c9db)

./visor version
Vega Visor CLI v0.71.4 (61d1f77ee360bf1679d5eb0e0efdb1cce977c9db)
```

</TabItem>
<TabItem value="remote-snapshot" label="Restart from specific block">

Download the vega binary from the [Vega release page](https://github.com/vegaprotocol/vega/releases).

To find the version required for restart, first you must select the restart block. Visit the [/api/v2/snapshots endpoint of the data-node API](https://api0.vega.community/api/v2/snapshots) and find block you want to restart from.

Let's say We have the following response:

```json title="Example response from /api/v2/snapshots"
{
    "coreSnapshots": {
        "edges": [
            {
                "node": {
                    "blockHeight": "18591101",
                    "blockHash": "11a12f24de801d8c21dae5372e3914a05d15fe15a1316276d7af27896127d246",
                    "coreVersion": "v0.72.14",
                    "protocolUpgradeBlock": false
                },
                "cursor": "eyJWZWdhVGltZSI6IjIwMjMtMTAtMTJUMTE6NDg6MjkuOTA3OTI0WiIsIkJsb2NrSGVpZ2h0IjoxODU5MTEwMSwiQmxvY2tIYXNoIjoiMTFhMTJmMjRkZTgwMWQ4YzIxZGFlNTM3MmUzOTE0YTA1ZDE1ZmUxNWExMzE2Mjc2ZDdhZjI3ODk2MTI3ZDI0NiIsIlZlZ2FDb3JlVmVyc2lvbiI6InYwLjcyLjE0In0="
            },
            {
                "node": {
                    "blockHeight": "18590801",
                    "blockHash": "9997f0583706516543b9194bb1bb791f163c0c3c02678376fe8e4ba00a2149bc",
                    "coreVersion": "v0.72.14",
                    "protocolUpgradeBlock": false
                },
                "cursor": "eyJWZWdhVGltZSI6IjIwMjMtMTAtMTJUMTE6NDU6MTEuODA3NTAzWiIsIkJsb2NrSGVpZ2h0IjoxODU5MDgwMSwiQmxvY2tIYXNoIjoiOTk5N2YwNTgzNzA2NTE2NTQzYjkxOTRiYjFiYjc5MWYxNjNjMGMzYzAyNjc4Mzc2ZmU4ZTRiYTAwYTIxNDliYyIsIlZlZ2FDb3JlVmVyc2lvbiI6InYwLjcyLjE0In0="
            },
            ...
            ...
            ...
        ]
    }
}
```

Let's assume for this tutorial's purposes, We want to start our node from block `18591101`. The version for that block, you have to download is `v0.72.14`. We must also note the `blockHash` value, which we have to put in the tendermint config later in this instruction.

```shell
wget https://github.com/vegaprotocol/vega/releases/download/v0.72.14/vega-linux-amd64.zip
wget https://github.com/vegaprotocol/vega/releases/download/v0.72.14/visor-linux-amd64.zip
```

Then unzip it and check the version

```shell
unzip vega-linux-amd64.zip
unzip visor-linux-amd64.zip 

./vega version
Vega CLI v0.72.14 (282fe5a94609406fd638cc1087664bfacb8011bf)

./visor version
Vega Visor CLI v0.72.14 (282fe5a94609406fd638cc1087664bfacb8011bf)
```

</TabItem>
</Tabs>

### 2. Init non validator vega-node

We want to have the non-validator node, so We do not have to init all of the wallet. We also do not need the ethereum node for it.

```shell
mkdir vega_home tendermint_home blockexplorer_home

./visor init --home ./vegavisor_home
./vega init --home ./vega_home full
./vega tm init --home ./tendermint_home 
./vega blockexplorer init --home ./blockexplorer_home
```

### 3. Download the genesis file

We need to download the [genesis.json](https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json) file and put it in the tendermint home.

```shell
wget --output-document ./tendermint_home/config/genesis.json https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/
genesis.json
```

### 4. Update the visor config file

The config file is located at: `YOUR_VEGAVISOR_HOME/config.toml`.

```toml
maxNumberOfFirstConnectionRetries = 43200
```

### 5. Update the visor run-config for genesis binary

<Tabs groupId="restart-way">
<TabItem value="block-0" label="Restart from block 0">

The config file is located at: `YOUR_VEGAVISOR_HOME/genesis/run-config.toml`. Replace the entire content of the file with:

```toml title="YOUR_VEGAVISOR_HOME/genesis/run-config.toml"
name = "genesis"

[vega]
  [vega.binary]
    path = "vega"
    args = [
      "start",
      "--home", "ABSOLUTE_PATH_TO_YOUR_VEGA_HOME",
      "--tendermint-home", "ABSOLUTE_PATH_TO_YOUR_TENDERMINT_HOME",
          ]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"
```

Link the genesis folder `YOUR_VEGAVISOR_HOME/current`

```shell
ln -s YOUR_VEGAVISOR_HOME/genesis YOUR_VEGAVISOR_HOME/current
```

</TabItem>
<TabItem value="remote-snapshot" label="Restart from specific block">

Create folder in the `YOUR_VEGAVISOR_HOME` specific for your binary version. In our case we selected 

```shell
v0.72.14`: `mkdir -p YOUR_VEGAVISOR_HOME/v0.72.14
```

Create the `YOUR_VEGAVISOR_HOME/v0.72.14/run-config.toml` file with the below content:

```toml title="YOUR_VEGAVISOR_HOME/v0.72.14/run-config.toml"
name = "v0.72.14"

[vega]
  [vega.binary]
    path = "vega"
    args = [
      "start",
      "--home", "ABSOLUTE_PATH_TO_YOUR_VEGA_HOME",
      "--tendermint-home", "ABSOLUTE_PATH_TO_YOUR_TENDERMINT_HOME",
          ]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"
```

Link created folder (`YOUR_VEGAVISOR_HOME/v0.72.14`) to `YOUR_VEGAVISOR_HOME/current`

```shell
ln -s YOUR_VEGAVISOR_HOME/v0.72.14 YOUR_VEGAVISOR_HOME/current
```

</TabItem>
</Tabs>

### 6. Copy vega binary to the current config directory for the visor

```shell
cp ./vega YOUR_VEGAVISOR_HOME/current/vega
```

Make sure version is correct:


<Tabs groupId="restart-way">
<TabItem value="block-0" label="Restart from block 0">

```shell
./vegavisor_home/current/vega version
Vega CLI v0.71.4 (61d1f77ee360bf1679d5eb0e0efdb1cce977c9db)
```

</TabItem>
<TabItem value="remote-snapshot" label="Restart from specific block">

```shell
./vegavisor_home/current/vega version
Vega CLI v0.72.14 (282fe5a94609406fd638cc1087664bfacb8011bf)
```

</TabItem>
</Tabs>

### 7. Update the blockexplorer config

Update the following parameters in the block explorer config file located at: `PATH_TO_YOUR_BLOCK_EXPLORER_HOME/config/blockexplorer/config.toml`

```toml title="PATH_TO_YOUR_BLOCK_EXPLORER_HOME/config/blockexplorer/config.tom"
[Store]
  [Store.Postgres]
    Host = "SQL_SERVER_HOST"
    Port = 5432
    Username = "PSQL_DATABASE_USERNAME"
    Password = "PSQL_USER_PASSWORD"
    Database = "PSQL_DATABASE_NAME"
    SocketDir = ""
```

### 8. Update the tendermint config

Update the following parameters in the tendermint config file located at `PATH_TO_YOUR_TENDERMINT_HOME/config/config.toml`:

```toml title="PATH_TO_YOUR_TENDERMINT_HOME/config/config.toml"
[rpc]
cors_allowed_origins = ["*"]

[p2p]
max_incoming_connection_attempts = 100
seeds = "b0db58f5651c85385f588bd5238b42bedbe57073@13.125.55.240:26656,da2c4771f2aec1749cbc8db545b2af89099cdcb7@168.119.147.148:40656,13ce7373381072bc575566e702fabef0db64ffdb@20.82.255.140:26656,5d02699874ea6a1e14df948b2e9f1198d23b95a7@51.222.80.128:26656,abe207dae9367995526812d42207aeab73fd6418@18.158.4.175:26656,198ecd046ebb9da0fc5a3270ee9a1aeef57a76ff@144.76.105.240:26656,80fda55eeaa6036e5b61c11b423b073681a2b6b4@3.25.100.39:26656,211e435c2162aedb6d687409d5d7f67399d198a9@65.21.60.252:26656,c5b11e1d819115c4f3974d14f76269e802f3417b@34.88.191.54:26656,e2379bca600a528de55e845b77de5ff480c9631c@185.146.148.107:26656,0a972d61a57532ea8b521b01238bdf125fcd52b1@141.94.162.118:26656,9bcebff7664a3310bf4b31a76e5547f44ffb94cc@80.190.132.234:26656,61051c21f083ee30c835a34a0c17c5d1ceef3c62@51.178.75.45:26656"
persistent_peers = ""
unconditional_peer_ids = ""
max_packet_msg_payload_size = 16384
send_rate = 20000000
recv_rate = 20000000
pex = true
private_peer_ids = ""
allow_duplicate_ip = false

[mempool]
version = "v1"
size = 10000
cache_size = 20000
max_batch_bytes = 10485760

[statesync]
rpc_servers = "api0.vega.community:26657,api1.vega.community:26657,api2.vega.community:26657,api3.vega.community:26657"
trust_period = "744h0m0s"
discovery_time = "30s"
chunk_request_timeout = "30s"

[consensus]
timeout_prevote = "1s"
timeout_precommit = "1s"
timeout_commit = "0s"
skip_timeout_commit = true
create_empty_blocks = true
create_empty_blocks_interval = "1s"

[storage]
discard_abci_responses = true

[tx_index]
indexer = "psql"
psql-conn = "postgresql://PSQL_DATABASE_USERNAME:PSQL_USER_PASSWORD@SQL_SERVER_HOST:5432/PSQL_DATABASE_NAME?sslmode=disable"
index_all_keys = false
```

:::note Snapshot restart
When you reastart from the remote snapshot at specific block, put also the following values:

```toml title="PATH_TO_YOUR_TENDERMINT_HOME/config/config.toml"
[statesync]
enable = true
trust_hash = "BLOCK_HASH_FOR_SELECTED_SNAPSHOT"
trust_height = BLOCK_HEIGHT_FOR_SELECTED_SNAPSHOT
```

In the step 1. of this tutorial We selected the following values:

```toml title="PATH_TO_YOUR_TENDERMINT_HOME/config/config.toml"
[statesync]
enable = true
trust_hash = "11a12f24de801d8c21dae5372e3914a05d15fe15a1316276d7af27896127d246"
trust_height = 18591101
```

:::

:::note Other parameters
Leave all other parameters with default values.
:::

### 9. Update vega config

<Tabs groupId="restart-way">
<TabItem value="block-0" label="Restart from block 0">

You do not need to modify this config file if you start from block 0.

</TabItem>
<TabItem value="remote-snapshot" label="Restart from specific block">

Update the config file located at `PATH_TO_YOUR_VEGA_HOME/config/node/config.toml`

```toml title="PATH_TO_YOUR_VEGA_HOME/config/node/config.toml"
[Snapshot]
  StartHeight = BLOCK_HEIGHT_FOR_SELECTED_SNAPSHOT
```

For our selected snapshot it will be:

```toml title="PATH_TO_YOUR_VEGA_HOME/config/node/config.toml"
[Snapshot]
  StartHeight = 18591101
```

:::note Default value
Remember default value for the `Snapshot.StartHeight` parameter
:::

</TabItem>
</Tabs>

### 10. Init the blockexplorer database

The `vega blockexplorer init-db` command create database schema and prepares all indexes to optimize the database for the blockexplorer API.

```shell
./vega blockexplorer init-db --home ./blockexplorer_home 
```

### 11. Start vega node with the vegavisor command

```shell
./visor run --home ./vegavisor_home
```

Wait a coupe of minutes untill your node start processing blocks, before you move to the next step.

:::note
See code snippets below to setup systemd for your vega-node
:::

:::warning
It will take at least several hours to replay entire network
:::

### 12. Start the block explorer service

```shell
./vega blockexplorer start --home ./blockexplorer_home
```

### 13. Verify the block explorer works well

```shell
curl -s localhost:1515/rest/transactions | jq
```

You should get non-empty response for the above command.

### 14. Restore config changes to default value


<Tabs groupId="restart-way">
<TabItem value="block-0" label="Restart from block 0">

You do not need to execute this step for replaying from block 0

</TabItem>
<TabItem value="remote-snapshot" label="Restart from specific block">

For the vega config located at `PATH_TO_YOUR_VEGA_HOME/config/node/config.toml`, restore the original value fo the `Snapshot.StartHeight`.

Disable state sync by setting `statesync.enable = false` in the tendermint config located at `PATH_TO_YOUR_TENDERMINT_HOME/config/config.toml`.

</TabItem>
</Tabs>

## Useful code snippets

### Systemd for vegavisor

The config file usually should be located at: `/lib/systemd/system/vegavisor.service`

```conf title="/lib/systemd/system/vegavisor.service"
[Unit]
Description=vegavisor
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=vega
Group=vega
ExecStart="ABSOLUTE_PATH_TO_VEGA_BINARY" run --home "ABSOLUTE_PATH_TO_YOUR_VEGA_HOME"
TimeoutStopSec=10s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=false
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

### Systemd for blockexplorer

The config file usually should be located at: `/lib/systemd/system/blockexplorer.service`

```conf title="/lib/systemd/system/blockexplorer.service"
[Unit]
Description=blockexplorer
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=vega
Group=vega
ExecStart="ABSOLUTE_PATH_TO_VEGA_BINARY" blockexplorer start --home "ABSOLUTE_PATH_TO_YOUR_BLOCK_EXPLORER_HOME"
TimeoutStopSec=10s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=false
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

### Caddy config

Caddy file provide TLS termination for the tendermint and blockexplorer API.

```caddyfile title=Caddyfile"
{
    email admin@yourdomain.com
    order replace after encode

    servers {
        metrics
    }
}



your-block-explorer-domain.com:443 {
    # (gRPC is direct to 3002)

    # REST core
    route / {
        reverse_proxy http://localhost:3003
    }
    route /* {
        reverse_proxy http://localhost:3003
    }

    # Block Explorer
    route /grpc* {
        reverse_proxy http://localhost:1515
    }

    route /rest* {
        reverse_proxy http://localhost:1515
    }

    # Tendermint
    route /status {
        reverse_proxy http://localhost:26657
    }

    route /genesis {
        reverse_proxy http://localhost:26657
    }

    route /blockchain {
        reverse_proxy http://localhost:26657
    }

    route /validators {
        reverse_proxy http://localhost:26657
    }

    route /block {
        reverse_proxy http://localhost:26657
    }

    route /tx_search {
        reverse_proxy http://localhost:26657
    }

    route /unconfirmed_txs {
        reverse_proxy http://localhost:26657
    }

    route /websocket {
        @websockets {
            header Connection *Upgrade*
            header Upgrade websocket
        }
        reverse_proxy @websockets localhost:26657
    }

    route /* {
        reverse_proxy http://localhost:3003
    }
}
```
