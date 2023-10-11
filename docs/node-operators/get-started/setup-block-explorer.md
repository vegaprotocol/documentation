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

The Vega blockexplorer requires a `psql` indexer, so you have to change the default value in the tendermint configuration.

## Requirements

- A non-validator vega node setup
- PostgreSQL database running
- (Optional) Webserver for proxing requests like Nginx or Caddy

## Limitations

You have to replay entire chain from block 0 to have the entire history about the Vega network transactions. We do not recommend to modify config of already running nodes.

If you do not want to have a full network history, you can start your non-validator node [from the last remote snapshot](../how-to/use-snapshots.md#start-a-new-node-using-network-snapshots).

We are not going to cover the PostgreSQL installation here. Please see:

- [the official PostgreSQL install documentation](https://www.postgresql.org/docs/current/tutorial-install.html)
- [the official docs for install PostgreSQL on ubuntu](https://www.postgresql.org/download/linux/ubuntu/)

:::Hint
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

## Setup a block explorer

### 1. Download vega and visor binary

Download the vega binary from the [Vega release page](https://github.com/vegaprotocol/vega/releases).

:::note Mainnet version
You have to download the binary for version, network has been started from block 0. For mainnet the binary version is [v0.71.4](https://github.com/vegaprotocol/vega/releases/tag/v0.71.4)
:::

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

The config file is located at: `<vegavisor_home>/config.toml`.

```toml
maxNumberOfFirstConnectionRetries = 43200
```

### 5. Update the visor run-config for genesis binary

The config file is located at: `<vegavisor_home>/genesis/run-config.toml`. Replace the entire content of the file with:

```toml
name = "genesis"

[vega]
  [vega.binary]
    path = "vega"
    args = [
      "start",
      "--home", "<absolute_path_to_vega_home>",
      "--tendermint-home", "<absolute_path_to_tendermint_home>",
          ]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"
```

### 6. Copy vega binary to the genesis config directory for the visor

```shell
cp ./vega <vegavisor_home>/genesis/vega
```

Make sure version is correct:

```shell
./vegavisor_home/genesis/vega version
Vega CLI v0.71.4 (61d1f77ee360bf1679d5eb0e0efdb1cce977c9db)
```

### 7. Update the blockexplorer config

Update the following parameters in the block explorer config file located at: `<blockexplorer-home>/config/blockexplorer/config.toml`

```toml
[Store]
  [Store.Postgres]
    Host = "<psql_server_host>"
    Port = 5432
    Username = "<psql_username>"
    Password = "<psql_password>"
    Database = "<psql_database_name>"
    SocketDir = ""
```

### 8. Update the tendermint config

Update the following parameters in the tendermint config file located at `<tendermint-home>/config/config.toml``:

```toml
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
psql-conn = "postgresql://<psql_username>:<psql_password>@<psql_server_host>:5432/<psql_database_name>?sslmode=disable"
index_all_keys = false
```

:::note Other parameters
Leave all other parameters with default values.
:::

### 9. Init the blockexplorer database

The `vega blockexplorer init-db` command create database schema and prepares all indexes to optimize the database for the blockexplorer API.

```shell
./vega blockexplorer init-db --home ./blockexplorer_home 
```

### 10. Start vega node with the vegavisor command

```shell
./visor run --home ./vegavisor_home
```

Wait a coupe of minutes untill your node start processing blocks, before you move to the next step.

:::Hint
See code snippets below to setup systemd for your vega-node
:::

:::Warrning
It will take at least several hours to replay entire network
:::

### 11. Start the block explorer service

```shell
./vega blockexplorer start --home ./blockexplorer_home
```

### 12. Verify the block explorer works well

```shell
curl -s localhost:1515/rest/transactions | jq
```

You should get non-empty response for the above command.
