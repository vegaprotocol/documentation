---
title: Upgrade node to 0.68.0
sidebar_label: Upgrade to 0.68.0
sidebar_position: 1
---

To upgrade your validator node from version 0.53 to version 0.68.0, follow the steps below. 

## Study the changes between versions
Before upgrading your node software, read the upgrading file in the Vega repo for a full list of the changes between the two versions, review the breaking API changes, and study the `TOML` changes to the networks repo for the validator testnet.

Review the **[release notes](../../releases/overview.md)** for a list of breaking API changes for each version from 0.54 onwards.

Review the **[upgrading readme ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md)** with details on major updates.
* [Repository changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#repository-changes)
* [Configuration changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes)
* [Command line changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#command-line-changes)

Review the [wallet config ↗](https://github.com/vegaprotocol/networks/pull/131) structural and content changes. For mainnet, you will need to review/approve the equivalent PR.

## Assumptions for the upgrade guide
The instructions below are written for Debian-like Linux operating systems. 

The guide uses systemd commands(`systemctl` and `journalctl`) to control binaries in our setup. If you are using something different, that article's commands may vary.

This guide is specifically intended for those who are already running a validator node. 

Before you start, note that the instructions use the following variables for file paths:

* `<VEGA-USER>`: the Linux user that runs Vega, e.g., `vega`
* `<USER-HOME>`: path to the `<VEGA-USER>` home directory, e.g., `/home/vega`
* `<VEGA-NETWORK-HOME>`: the home path to the Vega network, e.g., `/home/vega/vega_home`
* `<TENDERMINT-HOME>`: the Tendermint home path, e.g., `/home/vega/tendermint_home`
* `<VEGAVISOR-HOME>`: the Vega Visor home path, e.g., `/home/vega/vegavisor_home`
* `<BACKUP-FOLDER>`: the folder where you store backups, e.g., `/home/vega/backups`
* `<VISOR-BIN>`: the path to the Vega Visor binary, e.g., `/home/vega/bin/visor`
* `<VEGA-BIN>`: the path to the Vega core binary, e.g., `/home/vega/bin/vega`
* `<CHAIN-ID>`: new chain ID for network; it is required to pass as an argument for data-node, e.g., current chain ID on mainnet is: `vega-mainnet-0009`
* `<POSTGRESQL-LINUX-USER>`: the user who runs the postgresql process

The following are placeholders for the PostgreSQL connection details for the data node - the ones you put in the data node `config.toml`).

* `<VEGA-DB-USER>` - PostgreSQL user you create and put in the data node config
* `<VEGA-DB-NAME>` - PostgreSQL database name
* `<VEGA-DB-PASS>` - Password for your `<VEGA-DB-USER>`

We will refer to the above paths in the following guide. The sample paths given above are just examples. We recommend setting the paths that align with the conventions adopted by your organisation.

## Upgrade steps

### 1. Stop the network
At this point, validators need to choose and agree on the checkpoint that will be loaded into the network during the next restart, and stop the network as soon as everyone agrees on the selected checkpoint. 

The reason to quickly stop the network is to avoid producing more checkpoints and missing transactions after the restart (the transactions executed between when the selected checkpoint is produced, and the network is stopped).

For testnet releases, the time requirement may be relaxed, but mainnet downtime must be limited as much as possible.

1. Stop the `vega` node
2. Stop the `tendermint` node
3. Stop the `data node` if running
4. Make sure `vega` and `tendermint` have been stopped

:::note Upgrade version note
Versions 0.68+ of Vega do not need to run Tendermint as a separate service. Vega has the Tendermint process incorporated into the Vega command.
:::

If you run the network with the systemd service, you can call the following commands to stop the network:

```bash
systemctl stop vega;
systemctl stop tendermint;
systemctl stop data-node;

# Check if network has been stopped
systemctl status vega;
systemctl status tendermint;
systemctl status data-node
```

### 2. Create backup

```bash
mkdir -p <BACKUP-FOLDER>/v0.53.0/wallets;
mkdir -p <BACKUP-FOLDER>/v0.53.0/core-state;
mkdir -p <BACKUP-FOLDER>/v0.53.0/tm-state;

# copy genesis
cp <TENDERMINT-HOME>/config/genesis.json <BACKUP-FOLDER>/v0.53.0/genesis.json

# copy config files
cp -r <VEGA-NETWORK-HOME>/config <BACKUP-FOLDER>/v0.53.0/vega-config
cp -r <TENDERMINT-HOME>/config <BACKUP-FOLDER>/v0.53.0/tendermint-config

# copy wallets
cp -r <VEGA-NETWORK-HOME>/data/node/wallets <BACKUP-FOLDER>/v0.53.0/wallets
cp <TENDERMINT-HOME>/node_key.json <BACKUP-FOLDER>/v0.53.0/wallets
cp <TENDERMINT-HOME>/priv_validator_key.json <BACKUP-FOLDER>/v0.53.0/wallets
cp <VEGA-NETWORK-HOME>/nodewallet-passphrase.txt <BACKUP-FOLDER>/v0.53.0/wallets  # filename and location might differ, depending on your setup
# copy network state
cp -r <VEGA-NETWORK-HOME>/state/node <BACKUP-FOLDER>/v0.53.0/core-state
cp -r <TENDERMINT-HOME>/data <BACKUP-FOLDER>/v0.53.0/tm-state

# Check if backup has been successfully done*; check if all files has been copied correctly
tree <BACKUP-FOLDER>

# Backup PostgreSQL if you have been running data node**
pg_dump --host=localhost --port=5432 --username=<VEGA-DB-USER> --password -Fc -f <BACKUP-FOLDER/data_node_db.bak.sql <VEGA-DB-NAME>
```

**Notes**: 
* *The `tree` command needs to be installed (e.g. `apt-get install -y tree`) but it is the easiest way to see if backup files match the original files without going too deep into details.
*  **You might see some errors when running `pg_dump`. To learn if they can be safely ignored, see the [troubleshooting section in the official timescaledb docs ↗](https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/troubleshooting/).

### 3. Download new binaries
Download new binaries for the upgrade version from the [GitHub releases page ↗](https://github.com/vegaprotocol/vega/releases) and unzip them. Save them in the `<VEGA-BIN>` and the `<VISOR-BIN>` you chose. 

The binaries you need: 
* Vega binary: Also includes Tendermint and data node as binary subcommands
* Visor binary: Optional for setting up Visor for protocol upgrades (See the docs listed in [step 7](#7-read-the-visor-documentation) for information on Visor.

See example commands for downloading below. You may need to update the version number depending on the version of the binaries you need to update to:

```bash
# Download archives
wget https://github.com/vegaprotocol/vega/releases/download/v0.68.0/vega-linux-amd64.zip
wget https://github.com/vegaprotocol/vega/releases/download/v0.68.0/visor-linux-amd64.zip

# Unzip downloaded archives
unzip vega-linux-amd64.zip
unzip visor-linux-amd64.zip

mv vega <VEGA-BIN>
mv visor <VISOR-BIN>
```

### 4. Reset and clear all data

:::warning Back up files before progressing
Ensure you have a backup of the network files because the steps below will remove data from your home.

You may also risk losing your wallets, so back them up as well.
:::

1. Call unsafe reset all for Tendermint: `<VEGA-BIN> tendermint unsafe-reset-all --home <TENDERMINT-HOME>`
2. Call unsafe reset all for vega core: `<VEGA-BIN> unsafe_reset_all --home <VEGA-NETWORK-HOME>`
3. Remove data-node state. Required for older version of data node (before v0.68.0): `rm -r <VEGA-NETWORK-HOME>/state/data-node`
4. Recreate the PostgreSQL database if you have data within: 
    - a. Call the following command in PostgreSQL terminal: `DROP DATABASE IF EXISTS <VEGA-DB-NAME>`
    - b. Follow instructions in the step to [Install/Upgrade PostgreSQL instance](#14-installupgrade-postgresql-instance) (optional for data node setup) to recreate new database


### 5. Prepare genesis file
We recommend doing this at the beginning of the upgrade procedure, but this can happen at any point before validators start the network. After the genesis is prepared, all the validators must use the same `genesis.json` file.

To load the checkpoint, find more information in the [restart network guide](../how-to/restart-network.md#load-checkpoint) 

1. One of the Vega team members will adjust [the genesis file ↗](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) in the [Vega Protocol networks repository ↗](https://github.com/vegaprotocol/networks).
2. The person responsible for updating genesis needs to create a PR with changes.
3. All of the validators need to accept changes and approve the PR.
4. Approved PR must be merged by one of the validators.

### 6. Download new genesis file
After creating a backup and preparing a new genesis file, put it on your server. All the validators **must** use the same genesis file. 

1. Download genesis
2. Remove old genesis at `<TENDERMINT-HOME>/config/genesis.json`
3. Save new, downloaded genesis to `<TENDERMINT-HOME>/config/genesis.json`
4. Verify genesis - see example below

#### Example workflow
An example workflow for reviewing the genesis file may look like following:

```bash 
# Download genesis
wget https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json

# Move old genesis to a different location
cp <TENDERMINT-HOME>/config/genesis.json <TENDERMINT-HOME>/config/genesis.json.bk

# Copy genesis to its final location
cp ./genesis.json <TENDERMINT-HOME>/config/genesis.json

# Verify genesis
<VEGA-BIN> verify genesis <TENDERMINT-HOME>/config/genesis.json
```

### 7. Read the Visor documentation
While Visor is optional, it is recommended that you install and use Visor to simplify protocol upgrades. 

- [See the Visor code ↗](https://github.com/vegaprotocol/vega/tree/develop/visor)
- [Read the Visor documentation ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme)

If you will NOT use Visor, skip to [step 12](#12-create-vega-and-data-node-systemd-services).

### 8. Initiate Visor (optional)
It's strongly recommended that you set up Visor for automatic protocol upgrades, i.e. to upgrade your node to a newer version. With Visor, an upgrade will happen at a predetermined block height without manual intervention.

If you have questions about Visor, or would like to suggest enhancements, please raise them in the Validators Discord channel, or as issues on the [Vega repo ↗](https://github.com/vegaprotocol/vega/issues).

You'll need to set up the Visor config to support your node's requirements. Generate Visor configuration with the command below. The `<VEGAVISOR-HOME>` folder must not already exist, as Visor is responsible for creating it.

```bash
<VISOR-BIN> init --home <VEGAVISOR-HOME>
```

Visor prepares the following structure:

```bash
├── config.toml
├── genesis
│   └── run-config.toml
└── vX.X.X
    └── run-config.toml

2 directories, 3 files
```

### 9. Prepare the Visor config
The config is located in the `<VEGAVISOR-HOME>/config.toml`. Update the configuration to support your requirements.

Use the following pages as a reference:

- [Documentation for Visor ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme)
- [Visor config documentation ↗](https://github.com/vegaprotocol/vega/blob/develop/visor/visor-config.md)

#### Example config

```toml
# <VEGAVISOR-HOME>/config.toml 

# Try every 2 seconds; 165 retries is 330 sec
maxNumberOfFirstConnectionRetries = 165
maxNumberOfRestarts = 3
restartsDelaySeconds = 5
stopSignalTimeoutSeconds = 15

[upgradeFolders]
  "vX.X.X" = "vX.X.X"

[autoInstall]
  enabled = false
```

### 10. Prepare Visor run config
The visor `run-config` defines the commands to start the network. 

Run config is found in the `<VEGAVISOR-HOME>/genesis/run-config.toml`. It is called genesis because it is used to start the network for the first Visor run. When you next use it for a protocol upgrade, other run-config may be used.

Use the following pages as a reference:

- [Prepare Visor documentation ↗](../get-started/setup-validator#prepare-initial-visor-run)
- [Visor run-config documentation on Github ↗](https://github.com/vegaprotocol/vega/blob/develop/visor/run-config.md)

#### Example config (without data node)

```toml
# <VEGAVISOR-HOME>/genesis/run-config.toml

name = "genesis"

[vega]
  [vega.binary]
    path = "<VEGA-BIN>"
    args = [
      "start",
      "--home", "<VEGA-NETWORK-HOME>",
      "--tendermint-home", "<TENDERMINT-HOME>",
      "--nodewallet-passphrase-file", "<VEGA-NETWORK-HOME>/nodewallet-passphrase.txt",
          ]
  [vega.rpc]
    socketPath = "<USER-HOME>/run/vega.sock"
    httpPath = "/rpc"
```

#### Example config (with data node): 

```toml
# <VEGAVISOR-HOME>/genesis/run-config.toml

name = "genesis"

[vega]
  [vega.binary]
    path = "<VEGA-BIN>"
    args = [
      "start",
      "--home", "<VEGA-NETWORK-HOME>",
      "--tendermint-home", "<TENDERMINT-HOME>",
      "--nodewallet-passphrase-file", "<VEGA-NETWORK-HOME>/nodewallet-passphrase.txt",
          ]
  [vega.rpc]
    socketPath = "<USER-HOME>/run/vega.sock"
    httpPath = "/rpc"

[data_node]
  [data_node.binary]
    path = "<VEGA-BIN>"
    args = [
      "datanode", "start",
      "--home", "<VEGA-NETWORK-HOME>",
    ]
```

#### Critical parameters
There are two **critical parameters**:

1. `--nodewallet-passphrase-file` - path to the file where you keep the passphrase for the Vega node wallet.
2. `socketPath` - path to the Unix sock file that Vega creates for communicating with other network components running locally. 

Make sure the parent directory for the `sock` file exists. To check that it does, run: `mkdir -p <USER-HOME>/run/vega.sock`

### 11. Prepare systemd service for Visor
Create the `/lib/systemd/system/vegavisor.service` file with the following content. The file **must** be created with the `root` or a higher permission user:

```toml
# /lib/systemd/system/vegavisor.service

[Unit]
Description=vegavisor
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=<VEGA-USER>
Group=<VEGA-USER>
ExecStart="<VISOR-BIN>" run --home "<VEGAVISOR-HOME>"
TimeoutStopSec=10s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```


### 12. Create Vega and data node systemd services
If you are not using Visor, you have to prepare similar systemd configs as seen in the step above, for the following services:
- Vega (Tendermint is part of the Vega process in newer versions)
- Data node (optional)

1. Create the vega systemd service under the location: `/lib/systemd/system/vega.service`
2. Create the data-node systemd file (if you run a data node): `/lib/systemd/system/data-node.service`

#### Example of the Vega service file

```toml
# /lib/systemd/system/vega.service

[Unit]
Description=vega
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=vega
Group=vega
ExecStart="<VEGA-BIN>" start --home "<VEGA-NETWORK-HOME>" --tendermint-home "<TENDERMINT-HOME>" --nodewallet-passphrase-file "<VEGA-NETWORK-HOME>/all-wallet-passphrase.txt"
TimeoutStopSec=10s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

#### Example of the data node service file

```
# /lib/systemd/system/data-node.service

[Unit]
Description=tendermint
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=vega
Group=vega
ExecStart="<VEGA-BIN>" datanode start --home "<VEGA-NETWORK-HOME>"
TimeoutStopSec=10s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

### 13. Update Vega core config

:::note Manual process
This step may be time consuming, as there is no automation and it needs to be done by hand. 
:::

There are a few ways to update your existing Vega config. The most practical way is to see what changed in the Vega config between versions, as follows:

1. Generate the Vega node in a temporary location: `<VEGA-BIN> init --home /tmp/vega-home <TYPE>`. When the terminal asks you about passphrases, type anything. You are interested only in the `config.toml` file. The `<TYPE>` may be different depending on the configuration you are running:
    - a. `validator` - if you are running only Vega core without data node, e.g.: `<VEGA-BIN> init --home /tmp/vega-home validator`
    - b. `full` - if you are running Vega core with a data node, e.g.: `<VEGA-BIN> init --home /tmp/vega-home full`
2. Compare the old config with the generated one: `diff <VEGA-NETWORK-HOME>/config/node/config.toml /tmp/vega-home/config/node/config.toml`
3. Update your `<VEGA-NETWORK-HOME>/config/node/config.toml` file based on the above diff

:::warning Config parameters
We strongly recommend you read the list of configuration changes in the [upgrading file ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes) to understand what config parameters and sections have changed.

You are responsible for deciding what parameters you want to use. `vega init` generates a config with default values. Values in your config may be changed intentionally. Review and prepare your config carefully.
:::

### 14. Update Tendermint config

:::note Manual process
This step may be time consuming, as there is no automation and it needs to be done by hand. 
:::

The procedure is very similar to updating the Vega config. We recommend you read the [documentation for running Tendermint in production ↗](https://docs.tendermint.com/v0.33/tendermint-core/running-in-production.html)

1. Generate Tendermint node in a temporary location: `<VEGA-BIN> tm init --home /tmp/tendermint-home`
2. Compare the original Tendermint config with the generated one: `diff /tmp/tendermint-home/config/config.toml <TENDERMINT-HOME>/config/config.toml`
3. Update your `<TENDERMINT-HOME>/config/config.toml` file based on the above diff

:::warning Config parameters
We recommend discussing Tendermint changes with the validator operators as they are essential for running the network. 

It is also important to understand the Tendermint configuration parameters as described in the [Tendermint docs ↗](https://docs.tendermint.com/v0.33/tendermint-core/configuration.html)

You are responsible for deciding what parameters you want to use. `vega tm init` generates a config with default values. Values in your config may be changed intentionally. Review and prepare your config carefully.
:::

### 15. Install/Upgrade PostgreSQL for data node
If you are running a data node, you will need to install or upgrade PostgreSQL. The PostgreSQL instance must be on the same server as the data node, as the PostgreSQL does data-snapshot in the data node location file space. The data node uses PostgreSQL snapshots for the network history feature.

Install the following versions of the software:
- PostgreSQL 14
- TimescaleDB: 2.8.0

If above versions are a mismatch, you should upgrade/downgrade your software to meet those.

The procedure for preparing PostgreSQL:
1. Install PostgreSQL. As a reference, use the [PostgreSQL documentation ↗](https://www.postgresql.org/download/linux/ubuntu/)
2. Install TimescaleDB. As a reference, use [the Timescale documentation ↗](https://docs.timescale.com/install/latest/self-hosted/installation-linux/)
3. Apply recommended Timescale tuning unless you want to do it manually - and you know what you are doing: `timescaledb-tune` 
4. Log in as PostgreSQL superuser: `sudo -u postgres psql`
5. Create the `<VEGA-DB-USER>` user in PostgreSQL: `create user <VEGA-DB-USER> with encrypted password '<VEGA-DB-PASS>';`
6. With the `<VEGA-DB-USER>` user create a `<VEGA-DB-NAME>` database: `create database <VEGA-DB-NAME> with OWNER=<VEGA-DB-USER>;`
7. Ensure `<VEGA-DB-USER>` has permissions to `<VEGA-DB-NAME>`: `grant all privileges on database <VEGA-DB-NAME> to <VEGA-DB-USER>;`
8. Grant the `SUPERUSER` permissions for the `<VEGA-DB-USER>` user: `alter user <VEGA-DB-USER> with SUPERUSER;`
9. Switch database to `<VEGA-DB-NAME>`: `\c <VEGA-DB-NAME>`
10. Activate extension for new database: `CREATE EXTENSION IF NOT EXISTS timescaledb;`
11. Quit the PostgreSQL terminal: `\q`
12. Ensure you have access to the Vega database with your new credentials: `psql --host=127.0.0.1 --port=5432 --username=<VEGA-DB-USER> --password <VEGA-DB-NAME>`, and enter the `<VEGA-DB-PASS>`
13. Ensure `<POSTGRESQL-LINUX-USER>` (see below for how to determine it) has access to the `<VEGA-NETWORK-HOME>/state/data-node` directory: `sudo usermod -a -G <VEGA-USER> <POSTGRESQL-LINUX-USER>`

#### How to determine the POSTGRESQL-LINUX-USER
The user who runs the PostgreSQL process needs access to the data node state directory to put snapshots there. To determine the user, run the following command:

```bash
ps aux | grep 'postgres' | grep -v 'grep' | awk '{ print $1 }' | sed '1 d' | sort | uniq
```

The result should look similar to:

```sql
postgres=# \du
                                                    List of roles
 Role name         |                         Attributes                         |   Member of
-------------------+------------------------------------------------------------+----------------
 postgres          | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 <VEGA-DB-USER>    | Superuser                                                  |
```

### 16. Update data node config
While following the same procedure for a data node as for `vega` and `tendermint` is possible, there are a lot of changes in the data node config, thus we suggest an alternative process:

1. Ensure you have backup first, then remove the data node state: `rm -r <VEGA-NETWORK-HOME>/state/data-node/`
2. Save a backup of your old data node config: `cp <VEGA-NETWORK-HOME>config/data-node/config.toml <BACKUP-FOLDER>/data-node-config.toml`
3. Initiate the data node config: `<VEGA-BIN> datanode init --archive --home=<VEGA-NETWORK-HOME> <CHAIN-ID> --force`
4. Modify generated data node config: `<VEGA-NETWORK-HOME>config/data-node/config.toml` - see section below for important parameters

Use the `--archive` flag to keep all data, forever. Read more about the [data retention modes](../../concepts/vega-chain/data-nodes.md#data-retention-modes) available.

#### Data node config
Important config keys that you need to update: 

- `AutoInitialiseFromNetworkHistory` - We recommend setting it to `false` when you start the network from scratch (e.g. checkpoint restart), or if there is no other data node available.
- `ChainID` - Make sure it matches the new chain ID for your network.
- `Admin.Server.SocketPath` - Path for the Unix `sock` file; Ensure parent directory exists. Example may be `<VEGA-NETWORK-HOME>/run/datanode.sock`.
- `API.CoreNodeIP` - IP of the server where the Vega core node is running. Often, it is `127.0.0.1.` (localhost).
- `API.CoreNodeGRPCPort` - Port you expose for the Vega core gRPC node. Default: `3002`.
- `SQLStore.wipe_on_startup` - Defines if the data node removes data from the postgreSQL after the restart. We recommend setting it to `false`.
- `SQLStore.UseEmbedded` - If true, internal (managed by the binary itself) postgreSQL is used. We strongly recommend setting it to `false` for production, as it is intended for testing only.
- `SQLStore.ConnectionConfig` - Update the entire section, as it is where you set PostgreSQL credentials.
- `NetworkHistory.Enabled` - Enables IPFS network history. See the [network history](#a-bit-about-network-history) section below.

#### Example of the PostgreSQL connection section:

```toml
  [SQLStore.ConnectionConfig]
    Host = "localhost"
    Port = 5432
    Username = "<VEGA-DB-USER>"
    Password = "<VEGA-DB-PASS>"
    Database = "<VEGA-DB-NAME>"
```

#### A bit about network history
The network history feature allows you to get data into your data node (which acts as a rich API node) faster by fetching data from the other nodes instead of replaying it.

There is an entire section called `NetworkHistory` in the data node's `config.toml`. To use it, you must provide at least one other data node that exposes the IPFS node in the `NetworkHistory.Store.BootstrapPeers` parameter. If you do not provide that, you won't be able to use the IPFS-based network history.

Format of `BootstrapPeers`:

```
"/dns/<DATA-NODE-HOST>/tcp/<DATA-NODE-SWARM-PORT>/ipfs/<DATA-NODE-PEER-ID>"
```

Example `BootstrapPeers` value:

**Do not use the below bootstrap peers as it is an example from a test network.**

```toml
BootstrapPeers = ["/dns/n05.stagnet1.vega.xyz/tcp/4001/ipfs/12D3KooWHNyJBuN9GmYp23FAdMbL3nmwe5DzixFNL8d4oBTMzxag","/dns/n06.stagnet1.vega.xyz/tcp/4001/ipfs/12D3KooWQpceAbYaEaas65tEt8CJofHgjRPANaojwA7oaQApHTvB"]
```

### 16. Reload systemd services
Reload the systemd services to load the previously added Vega Visor, or Vega and data node services. 

Use the following command: `sudo systemctl daemon-reload`.

### 17. Start the upgraded network

#### If you are running Visor 

```bash
sudo systemctl start vegavisor
```

To verify the Vega node is working correctly, check the status of Visor with the `systemctl status vegavisor` command.

To check the network logs, you can run the following command: `journalctl -u vegavisor -n 10000`

#### If you are running without Visor

```bash
sudo systemctl start vega
sudo systemctl start data-node
```

To check their statuses run the following commands:

```bash
sudo systemctl status vega
sudo systemctl status data-node
```

To see their logs run the following commands:

```bash
journalctl -u vega -n 5000
journalctl -u data-node -n 5000
```
