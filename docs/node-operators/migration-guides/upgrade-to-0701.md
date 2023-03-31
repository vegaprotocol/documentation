---
title: Upgrade to 0.70.1
sidebar_label: Upgrade to 0.70.1
---

This guide describes the steps to upgrade to 0.70.1 using a checkpoint. See the [release notes for v0.70.1](https://github.com/vegaprotocol/documentation/blob/main/docs/releases/overview.md#pre-release-versions-0700-and-0701-combined--2023-03-28) for information about breaking changes and other details.


## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems. 

The guide uses systemd commands(`systemctl` and `journalctl`) to control binaries in the set-up. If you are using something different, your system's commands may vary.


This guide is specifically intended for those who are already running a validator node with version `v0.68.0` or higher.

Before you start, note that the instructions use the following variables for file paths:

* `<VEGA-NETWORK-HOME>`: the home path to the Vega network, e.g., `/home/vega/vega_home`
* `<TENDERMINT-HOME>`: the Tendermint home path, e.g., `/home/vega/tendermint_home`
* `<VEGAVISOR-HOME>`: the Vega Visor home path, e.g., `/home/vega/vegavisor_home`
* `<BACKUP-FOLDER>`: the folder where you store backups, e.g., `/home/vega/backups`
* `<VISOR-BIN>`: the path to the Vega Visor binary, e.g., `/home/vega/bin/visor`
* `<VEGA-BIN>`: the path to the Vega core binary, e.g., `/home/vega/bin/vega`
* `<CHAIN-ID>`: new chain ID for network; it is required to pass as an argument for data node, e.g., current chain ID on mainnet is: `vega-mainnet-0009`

The following are placeholders for the PostgreSQL connection details for the data node - the ones you put in the data node `config.toml`.

* `<VEGA-DB-USER>` - PostgreSQL user you create and put in the data node config
* `<VEGA-DB-NAME>` - PostgreSQL database name

This guide will refer to the above paths. The sample paths given above are just examples. We recommend setting the paths that align with the conventions adopted by your organisation.

## Study the changes between versions
Before upgrading your node software, review the **[release notes](../../releases/overview.md)** for a list of breaking API changes for each version from the previously released version, and find links to each release's detailed changelog.

## Upgrade steps

### 1. Stop the network
At this point, validators need to choose and agree on the checkpoint that will be loaded into the network during the next restart, and stop the network as soon as everyone agrees on the selected checkpoint.

The reason to quickly stop the network is to avoid producing more checkpoints and missing transactions after the restart (the transactions executed between when the selected checkpoint is produced, and the network is stopped).

For testnet releases, the time requirement may be relaxed, but mainnet downtime must be limited as much as possible.

1. Stop the running node
    - Stop `Vega` and optionally `data node` if you are not running Visor: `sudo systemctl stop vega && sudo systemctl stop data-node`
    - Stop `vegavisor` if you are running your node with Visor: `sudo systemctl stop vegavisor`
2. Verify the node has been stopped:
    - Vega: `systemctl status vega`
    - Optionally data node: `systemctl status data-node`
    - Optionally Visor: `systemctl status vegavisor`

### 2. Create backup

```bash
mkdir -p <BACKUP-FOLDER>/v0.70.1/wallets;
mkdir -p <BACKUP-FOLDER>/v0.70.1/core-state;
mkdir -p <BACKUP-FOLDER>/v0.70.1/tm-state;

# copy genesis
cp <TENDERMINT-HOME>/config/genesis.json <BACKUP-FOLDER>/v0.70.1/genesis.json

# copy config files
cp -r <VEGA-NETWORK-HOME>/config <BACKUP-FOLDER>/v0.70.1/vega-config
cp -r <TENDERMINT-HOME>/config <BACKUP-FOLDER>/v0.70.1/tendermint-config

# copy wallets
cp -r <VEGA-NETWORK-HOME>/data/node/wallets <BACKUP-FOLDER>/v0.70.1/wallets
cp <TENDERMINT-HOME>/node_key.json <BACKUP-FOLDER>/v0.70.1/wallets
cp <TENDERMINT-HOME>/priv_validator_key.json <BACKUP-FOLDER>/v0.70.1/wallets
cp <VEGA-NETWORK-HOME>/nodewallet-passphrase.txt <BACKUP-FOLDER>/v0.70.1/wallets  # filename and location might differ, depending on your setup

# copy network state
cp -r <VEGA-NETWORK-HOME>/state/node <BACKUP-FOLDER>/v0.70.1/core-state
cp -r <TENDERMINT-HOME>/data <BACKUP-FOLDER>/v0.70.1/tm-state

# copy vegavisor config if you are running Visor on your node
cp -r <VEGAVISOR-HOME>/current <BACKUP-FOLDER>/v0.70.1/vegavisor-current

# Check if backup has been successfully done*; check if all files has been copied correctly
tree <BACKUP-FOLDER>

# Backup PostgreSQL if you have been running data node**
pg_dump --host=localhost --port=5432 --username=<VEGA-DB-USER> --password -Fc -f <BACKUP-FOLDER>/v0.70.1/data_node_db.bak.sql <VEGA-DB-NAME>
```

**Notes**: 
* *The `tree` command needs to be installed (e.g. `apt-get install -y tree`) but it is the easiest way to see if backup files match the original files without going too deep into details.
*  **You might see some errors when running `pg_dump`. To learn if they can be safely ignored, see the [troubleshooting section in the official timescaledb docs ↗](https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/troubleshooting/).


### 3. Download new binaries
Download new binaries for the upgrade version from the [GitHub releases page ↗](https://github.com/vegaprotocol/vega/releases) and unzip them. Save them in the `<VEGA-BIN>` and the `<VISOR-BIN>` you chose. 

The binaries you need: 
* Vega binary: Also includes Tendermint and data node as binary subcommands
* Visor binary: Optional for setting up Visor for protocol upgrades (See the docs listed in [the previous migration guide](./upgrade-node.md#7-read-the-visor-documentation) for information on Visor.

See example commands for downloading below. You may need to update the version number depending on the version of the binaries you need to update to:

```bash
# Download archives
wget https://github.com/vegaprotocol/vega/releases/download/v0.70.1/vega-linux-amd64.zip
wget https://github.com/vegaprotocol/vega/releases/download/v0.70.1/visor-linux-amd64.zip

# Unzip downloaded archives
unzip vega-linux-amd64.zip
unzip visor-linux-amd64.zip

mv vega <VEGA-BIN>
mv visor <VISOR-BIN>
```

:::note  Manual update for binaries when running Visor
Visor cannot automatically restart (or upgrade) binaries because you are restarting the network with a `checkpoint`. Once you stop the Vega network, you must update the old binaries with the downloaded ones. You can find the binary path in the `<VEGAVISOR-HOME>/current/run-config.toml` file. Usually the path is `<VEGAVISOR-HOME>/current/vega`
:::


### 4. Reset and clear all data

:::warning Back up files before progressing
Ensure you have a backup of the network files because the steps below will remove data from your home.

You may also risk losing your wallets, so back them up as well.
:::

1. Call unsafe reset all for Tendermint: `<VEGA-BIN> tendermint unsafe-reset-all --home <TENDERMINT-HOME>`
2. Call unsafe reset all for Vega core: `<VEGA-BIN> unsafe_reset_all --home <VEGA-NETWORK-HOME>`

3. Remove the data node state directory: `rm -f <VEGA-NETWORK-HOME>/state/data-node`

4. If you have existing data, recreate the PostgreSQL database using the following commands in PostgreSQL terminal: 

    - `DROP DATABASE IF EXISTS <VEGA-DB-NAME>`
    - `CREATE DATABASE <VEGA-DB-NAME> WITH owner=<VEGA-DB-USER>`


:::note
If you have to set up PostgreSQL, follow instructions in the upgrading node guide to [Install/Upgrade PostgreSQL instance](./upgrade-node.md#15-installupgrade-postgresql-for-data-node).
:::

### 5. Prepare genesis file
We recommend doing this at the beginning of the upgrade procedure, but this can happen at any point before validators start the network. After the genesis is prepared, all the validators must use the same `genesis.json` file.

To load the checkpoint, find more information in the [restart network guide](../how-to/restart-network.md#load-checkpoint) 

1. One of the validators will adjust [the genesis file ↗](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) in the [Vega Protocol networks repository ↗](https://github.com/vegaprotocol/networks). You also may ask the vega team member to review it.
2. The person responsible for updating genesis needs to create a PR with changes.
3. All of the validators need to accept changes and approve the PR.
4. Approved PR must be merged by one of the validators.

:::note
Make sure, you have correct values for the following parameters in your genesis: `genesis_time`, `time_iota_ms`, `chain_id`, `network_parameters_checkpoint_overwrite`.
:::

:::note Checkpoint parameters overwrite

All of the network parameters will be taken from checkpoint except the following:

- Added since the previous released version
- Mentioned in the `network_parameters_checkpoint_overwrite` section
:::

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

There is no change required in the `vega core` config. If you have to prepare the `vega` config from scratch, use the instruction for [v0.68.2](./upgrade-to-0682.md#7-update-vega-core-config).

### 8. Update Tendermint config

There is no change required in the `tendermint` config. If you have to prepare the `tendermint` config from scratch, use the instruction for [v0.68.2](./upgrade-to-0682.md#8-update-tendermint-config).

### 9. Update data node config

If you were running a data node in version `v0.68.0+`, the only thing you have to update is the `chain_id` in the `data-node` config. If you need to set up data node from scratch, please follow documentation for [v0.68.0](./upgrade-to-0682.md#9-update-data-node-config).

:::caution Update `chain_id`
It is important to update the chain ID for your data node config, otherwise your data node will fail.
:::


### 10. Start the upgraded network

#### If you are running Visor

```bash
sudo systemctl start vegavisor
```

To verify the Vega node is working correctly, check the status of Visor with the `systemctl status vegavisor` command.

To check the network logs, you can run the following command: `journalctl -u vegavisor -n 10000 -f`

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
journalctl -u vega -n 5000 -f
journalctl -u data-node -n 5000 -f
```
