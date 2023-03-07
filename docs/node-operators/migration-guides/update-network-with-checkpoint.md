---
title: Upgrade node with the checkpoint
sidebar_label: Upgrade to latest
sidebar_position: 1
---

## Assumptions for the upgrade guide
The instructions below are written for Debian-like Linux operating systems. 

The guide uses systemd commands(`systemctl` and `journalctl`) to control binaries in our setup. If you are using something different, that article's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.68.0` or higher

Before you start, note that the instructions use the following variables for file paths:

* `<VEGA-NETWORK-HOME>`: the home path to the Vega network, e.g., `/home/vega/vega_home`
* `<TENDERMINT-HOME>`: the Tendermint home path, e.g., `/home/vega/tendermint_home`
* `<VEGAVISOR-HOME>`: the Vega Visor home path, e.g., `/home/vega/vegavisor_home`
* `<BACKUP-FOLDER>`: the folder where you store backups, e.g., `/home/vega/backups`
* `<VISOR-BIN>`: the path to the Vega Visor binary, e.g., `/home/vega/bin/visor`
* `<VEGA-BIN>`: the path to the Vega core binary, e.g., `/home/vega/bin/vega`
* `<CHAIN-ID>`: new chain ID for network; it is required to pass as an argument for data-node, e.g., current chain ID on mainnet is: `vega-mainnet-0009`

The following are placeholders for the PostgreSQL connection details for the data node - the ones you put in the data node `config.toml`.

* `<VEGA-DB-USER>` - PostgreSQL user you create and put in the data node config
* `<VEGA-DB-NAME>` - PostgreSQL database name

We will refer to the above paths in the following guide. The sample paths given above are just examples. We recommend setting the paths that align with the conventions adopted by your organisation.


## Study the changes between versions
Before upgrading your node software, read the upgrading file in the Vega repo for a full list of the changes between the two versions, and review the breaking API changes.

Review the **[release notes](../../releases/overview.md)** for a list of breaking API changes for each version from 0.54 onwards.

Review the **[upgrading readme ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md)** with details on major updates.
* [Repository changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#repository-changes)
* [Configuration changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes)
* [Command line changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#command-line-changes)

## Upgrade steps

### 1. Stop the network
At this point, validators need to choose and agree on the checkpoint that will be loaded into the network during the next restart, and stop the network as soon as everyone agrees on the selected checkpoint.

The reason to quickly stop the network is to avoid producing more checkpoints and missing transactions after the restart (the transactions executed between when the selected checkpoint is produced, and the network is stopped).

For testnet releases, the time requirement may be relaxed, but mainnet downtime must be limited as much as possible.

1. Stop the running node
    - Stop `vega` and optionally `data-node` if you are not running vegavisor: `sudo systemctl stop vega && sudo systemctl stop data-node`
    - Stop `vegavisor` if you are running your node under the `vegavisor`: `sudo systemctl stop vegavisor`
2. Verify the node has been stopped:
    - Vega: `systemctl status vega`
    - Optionally data-node: `systemctl status data-node`
    - Optionally vegavisor: `systemctl status vegavisor`


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

# copy vegavisor config if you are running visor on your node
cp -r <VEGAVISOR-HOME>/current <BACKUP-FOLDER>/vegavisor-current

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

:::node  Manual update for binaries when you are running visor
Visor cannot automatically restart(or upgrade) binaries because We are restarting the network with the `checkpoint`. Once you stop the Vega network, you must update the old binaries with the downloaded ones. You can find the binary path in the `<VEGAVISOR-HOME>/current/run-config.toml` file. Usually the path is `<VEGAVISOR-HOME>/current/vega`
:::

### 4. Reset and clear all data

:::warning Back up files before progressing
Ensure you have a backup of the network files because the steps below will remove data from your home.

You may also risk losing your wallets, so back them up as well.
:::

1. Call unsafe reset all for Tendermint: `<VEGA-BIN> tendermint unsafe-reset-all --home <TENDERMINT-HOME>`
2. Call unsafe reset all for vega core: `<VEGA-BIN> unsafe_reset_all --home <VEGA-NETWORK-HOME>`
3. Remove the data-node state directory: `rm -f <VEGA-NETWORK-HOME>/state/data-node`
4. Recreate the PostgreSQL database if you have data within: 
    - a. Call the following command in PostgreSQL terminal: `DROP DATABASE IF EXISTS <VEGA-DB-NAME>`
    - b. Follow instructions in the step to [Install/Upgrade PostgreSQL instance](./upgrade-node.md#15-installupgrade-postgresql-for-data-node) (optional for data node setup) to recreate new database


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

### 7. Update Vega core config

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

### 8. Update Tendermint config

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

### 9. Update data-node config

:::note Manual process
This step may be time consuming, as there is no automation and it needs to be done by hand.
:::

There are a few ways to update your existing data-node config. The most practical way is to see what changed in the Vega config between versions, as follows:

1. Generate the Vega node in a temporary location: `<VEGA-BIN> datanode init --home /tmp/vega-home --archive <CHAIN-ID>`. When the terminal asks you about passphrases, type anything. You are interested only in the `/tmp/vega-home/config/data-node/config.toml` file. The `<CHAIN-ID>` is a new chain ID for your network
2. Compare the old config with the generated one: `diff <VEGA-NETWORK-HOME>/config/data-node/config.toml /tmp/vega-home/config/data-node/config.toml`
3. Update your `<VEGA-NETWORK-HOME>/config/data-node/config.toml` file based on the above diff

:::warning Config parameters
We strongly recommend you read the list of configuration changes in the [upgrading file ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes) to understand what config parameters and sections have changed.

You are responsible for deciding what parameters you want to use. `vega datanode init` generates a config with default values. Values in your config may be changed intentionally. Review and prepare your config carefully.
:::

### 10. Start the upgraded network

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
