---
title: Upgrade to 0.71.0
sidebar_label: Upgrade to 0.71.0
---

This guide describes the steps to upgrade to v0.71.0 using a checkpoint. See the [changelog for v0.71.0](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0710) for information about breaking changes and other details.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems. 

The guide uses systemd commands(`systemctl` and `journalctl`) to control binaries in the set-up. If you are using something different, your system's commands may vary.


This guide is specifically intended for those who are already running a validator node with version `v0.` or higher.

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
Before upgrading your node software, review the **[changelog](https://github.com/vegaprotocol/vega/blob/develop/CHANGELOG.md#0710)** for a list of breaking API changes for each version from the previously released version, and find links to each release's detailed changelog.

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
mkdir -p <BACKUP-FOLDER>/v0.70.3/wallets;
mkdir -p <BACKUP-FOLDER>/v0.70.3/core-state;
mkdir -p <BACKUP-FOLDER>/v0.70.3/tm-state;

# copy genesis
cp <TENDERMINT-HOME>/config/genesis.json <BACKUP-FOLDER>/v0.70.3/genesis.json

# copy config files
cp -r <VEGA-NETWORK-HOME>/config <BACKUP-FOLDER>/v0.70.3/vega-config
cp -r <TENDERMINT-HOME>/config <BACKUP-FOLDER>/v0.70.3/tendermint-config

# copy wallets
cp -r <VEGA-NETWORK-HOME>/data/node/wallets <BACKUP-FOLDER>/v0.70.3/wallets
cp <TENDERMINT-HOME>/node_key.json <BACKUP-FOLDER>/v0.70.3/wallets
cp <TENDERMINT-HOME>/priv_validator_key.json <BACKUP-FOLDER>/v0.70.3/wallets
cp <VEGA-NETWORK-HOME>/nodewallet-passphrase.txt <BACKUP-FOLDER>/v0.70.3/wallets  # filename and location might differ, depending on your setup

# copy network state
cp -r <VEGA-NETWORK-HOME>/state/node <BACKUP-FOLDER>/v0.70.3/core-state
cp -r <TENDERMINT-HOME>/data <BACKUP-FOLDER>/v0.70.3/tm-state

# copy vegavisor config if you are running Visor on your node
cp -r <VEGAVISOR-HOME>/current <BACKUP-FOLDER>/v0.70.3/vegavisor-current

# Check if backup has been successfully done*; check if all files has been copied correctly
tree <BACKUP-FOLDER>

# Backup PostgreSQL if you have been running data node**
pg_dump --host=localhost --port=5432 --username=<VEGA-DB-USER> --password -Fc -f <BACKUP-FOLDER>/v0.70.3/data_node_db.bak.sql <VEGA-DB-NAME>
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
wget https://github.com/vegaprotocol/vega/releases/download/v0.70.3/vega-linux-amd64.zip
wget https://github.com/vegaprotocol/vega/releases/download/v0.70.3/visor-linux-amd64.zip

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

1. One of the validators will adjust [the genesis file ↗](https://github.com/vegaprotocol/networks/blob/master/testnet2/genesis.json) in the [Vega Protocol networks repository ↗](https://github.com/vegaprotocol/networks). You also may ask the vega team member to review it.
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
wget https://raw.githubusercontent.com/vegaprotocol/networks/master/testnet2/genesis.json

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

### 9. Migrate tendermint data when using default home path

Vega has migrated from the tendermint to its fork, called the [CometBFT](https://cometbft.com). This change has been introduced in the previous version of the vega. If you are using the default home path for the Tendermint(`~/.tendermint`), we recommend migrating it to the default for the CometBFT(`~/.cometbft`). You can read more about the change and required steps in the [previous migration guide](./upgrade-to-0702.md#9-migrate-tendermint-data-when-using-default-home-path)

### 10. Update data node config

#### The Gateway Port settings

We have merged the `GraphQL` and the `REST` APIs into a single port. Now you must define the `Port` and `IP` in the `[Gateway]` section instead of its child. Remove the `Port` and `IP` from the `[Gateway.GraphQL]` and `[Gateway.REST]` sections.

```diff
  [Gateway]
+   Port = 443
+   IP = "0.0.0.0"
    [Gateway.GraphQL]
-     Port = 3008
-     IP = "0.0.0.0" 
      ...
    [Gateway.REST]
-     Port = 3008
-     IP = "0.0.0.0" 
      ...
```

#### Enable the TLS on the data node API

The data node can request the TLS certificate for you automatically. The only requirement is to use port 443 for the Gateway component and has this port open to the public internet. You can still use a custom port and some software like Apache or Nginx and proxy pass requests to the data node, but in this case, you are responsible for generating and renewing the certificate.

Below is an example certificate for the data node auto TLS:

```toml
[Gateway]
  Port = 443
  IP = "0.0.0.0"
  Level = "Info"
  Timeout = "5s"
  SubscriptionRetries = 3
  GraphQLPlaygroundEnabled = true
  MaxSubscriptionPerClient = 250
  HTTPSEnabled = true
  AutoCertDomain = "api.vega.example.com"
  CertificateFile = ""
  KeyFile = ""
  [Gateway.GraphQL]
    Enabled = true
    ComplexityLimit = 0
    Endpoint = "/graphql"
  [Gateway.REST]
    Enabled = true
    APMEnabled = true
  [Gateway.CORS]
    AllowedOrigins = ["*"]
    MaxAge = 7200
...
```

If the `api.vega.example.com` domain points to your data node, it will obtain the certificate from the Let's Encrypt.

:::note All the differences
To see all the differences, we recommend generating a new configuration and compare with your configuration on the node. The procedure is described [here](./upgrade-node.md#16-update-data-node-config)
:::

### 11. Update the vegavisor configuration

---
title: Upgrade to 0.71.0
sidebar_label: Upgrade to 0.71.0
---

We have planned to practice the protocol upgrade from version `v0.70.X` to version v0.71.0. The upgrade procedure is standard for upgrades described on [the protocol upgrade page](../how-to/upgrade-network.md). However, there are some changes to the configuration for the data node and the vegavisor.

Please follow [the standard protocol upgrade documentation](../how-to/upgrade-network.md). This document has only key points and suggested changes for the vega setup.

## The data node configuration changes

Once you have `voted` for the protocol upgrade, but `before the protocol upgrade happens`, please update the following sections in the data-node config:

### 1. The Gateway Port settings

We have merged the `GraphQL` and the `REST` APIs into a single port. Now you must define the `Port` and `IP` in the `[Gateway]` section instead of its child. Remove the `Port` and `IP` from the `[Gateway.GraphQL]` and `[Gateway.REST]` sections.

```diff
  [Gateway]
+   Port = 443
+   IP = "0.0.0.0"
    [Gateway.GraphQL]
-     Port = 3008
-     IP = "0.0.0.0" 
      ...
    [Gateway.REST]
-     Port = 3008
-     IP = "0.0.0.0" 
      ...
```

### 2. Enable the TLS on the data node API

The data node can request the TLS certificate for you automatically. The only requirement is to use port 443 for the Gateway component and has this port open to the public internet. You can still use a custom port and some software like Apache or Nginx and proxy pass requests to the data node, but in this case, you are responsible for generating and renewing the certificate.

Below is an example certificate for the data node auto TLS:

```toml
[Gateway]
  Port = 443
  IP = "0.0.0.0"
  Level = "Info"
  Timeout = "5s"
  SubscriptionRetries = 3
  GraphQLPlaygroundEnabled = true
  MaxSubscriptionPerClient = 250
  HTTPSEnabled = true
  AutoCertDomain = "api.vega.example.com"
  CertificateFile = ""
  KeyFile = ""
  [Gateway.GraphQL]
    Enabled = true
    ComplexityLimit = 0
    Endpoint = "/graphql"
  [Gateway.REST]
    Enabled = true
    APMEnabled = true
  [Gateway.CORS]
    AllowedOrigins = ["*"]
    MaxAge = 7200
...
```

If the `api.vega.example.com` domain points to your data node, it will obtain the certificate from the Let's Encrypt.

:::note All the differences
To see all the differences, we recommend generating a new configuration and compare with your configuration on the node. The procedure is described [here](./upgrade-node.md#16-update-data-node-config)
:::

## The vegavisor configuration change.

You can still use the old binary for the vegavisor and skip preparing the new configuration, but We recommend upgrading and preparing a new configuration for the vegavisor.


:::node Documentation
To read documentation for the vegavisor config visit [the vegavisor documentation page](https://github.com/vegaprotocol/vega/blob/develop/visor/visor-config.md)

The excample vegavisor config is:

```toml
maxNumberOfFirstConnectionRetries = 43200
maxNumberOfRestarts = 3
restartsDelaySeconds = 5
stopDelaySeconds = 3 
stopSignalTimeoutSeconds = 15

[upgradeFolders]
  "vX.X.X" = "vX.X.X"

[autoInstall]
  enabled = true
  repositoryOwner = "vegaprotocol"
  repository = "vega"
  [autoInstall.asset]
    name = "vega-linux-amd64.zip"
    binaryName = "vega"
```

#### Important changes for the vegavisor config

- `stopDelaySeconds` - Number of seconds that Visor waits before it sends a termination signal (SIGTERM) to running processes that are ready for an upgrade. After the time has elapsed, Visor stops the running binaries (SIGTERM).

- `[autoInstall.asset]` - This section has been renamed from `[autoInstall.assets]` and it has been restructured.

:::note Setry node use case

The `stopDelaySeconds` is a useful parameter for sentry nodes. Let's set it for a few seconds to allow the sentry node to forward all the data to other nodes.
:::

### 12. Start the upgraded network

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
