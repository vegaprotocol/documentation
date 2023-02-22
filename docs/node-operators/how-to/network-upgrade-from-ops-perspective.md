# Upgrade procedure from the OPS perspective

## Assumptions

**NOTE**: Below instruction is prepared for Debian-like Linux operating systems. We also assume you are already running a validator node.

Before you start, you have to prepare and keep in mind a few things:

- `<VEGA-USER>`; the Linux user that runs vega, e.g., `vega`
- `<USER-HOME>`; path to the `<VEGA-USER>` home directory, e.g., `/home/vega`
- `<VEGA-NETWORK-HOME>`; the home path to the vega network, e.g., `/home/vega/vega_home`
- `<DATA-NODE-HOME>`; the home path to the data-node, the home can be safely shared with vega core, e.g., `/home/vega/data_node_home`
- `<TENDERMINT-HOME>`; the tendermint home path, e.g., `/home/vega/tendermint_home`
- `<VEGAVISOR-HOME>`; the vegavisor home path, e.g., `/home/vega/vegavisor_home`
- `<BACKUP-FOLDER>`; the folder where you store backups, e.g., `/home/vega/backups`
- `<VISOR-BIN>`; the path to the vega visor binary, e.g., `/home/vega/bin/visor`
- `<VEGA-BIN>`; the path to the vega core binary, e.g., `/home/vega/bin/visor`
- `<CHAIN-ID>`; new chain id for network, it is required to pass as an argument for data-node, e.g., current chain id on mainnet is: `vega-mainnet-0009`

We will refer to the above paths in the following article. The sample paths given above are just examples. We recommend setting your paths that align with the conventions adopted in your company.

# Upgrade steps

## 1. Stop the network

At this point, validators choose the checkpoint, which will be loaded into the network during the next restart, and stop the network as soon as everyone agrees on the selected checkpoint. The reason to quickly stop the network is to avoid producing more checkpoints and missing transactions after restart(the transactions executed between selected checkpoint is produced, and the network is stopped)

1. Stop the `vega` node
2. Stop the `tendermint` node
3. Stop the `data-node` if running
4. Make sure `vega` and `tendermint` have been stopped.

**NOTE**: The new version of vega does not need to run tendermint as a separate service. Vega incorporates the tendermint process into the vega command at the moment.

If you run the network with the systemd service you may want to call the following commands to stop the network:

```bash
systemctl stop vega;
systemctl stop tendermint;
systemctl stop data-node;
```


## 2. Prepare genesis file

We recommend doing this at the beginning of the upgrade procedure, but this can happen at any point before validators start the network. After genesis is prepared, all the validators must use the same `genesis.json` file.

1. As a first step, one of the validators or vega team member has to adjust [the genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) in the [vegaprotocol/networks](https://github.com/vegaprotocol/networks) repository.
2. The person responsible for updating genesis should create PR with changes.
3. All of the validators should accept changes and approve the PR.

## 3. Steps on your server before network started

### 1. Create backup

```bash
mkdir -p <BACKUP-FOLDER>/v0.53.0/core-wallets;
mkdir -p <BACKUP-FOLDER>/v0.53.0/core-state;
mkdir -p <BACKUP-FOLDER>/v0.53.0/tm-state;

# copy genesis
cp <TENDERMINT-HOME>/config/genesis.json <BACKUP-FOLDER>/v0.53.0/genesis.json
# copy config files
cp <VEGA-HOME>/config <BACKUP-FOLDER>/v0.53.0/vega-config
cp <TENDERMINT-HOME>/config <BACKUP-FOLDER>/v0.53.0/tendermint-config

# copy wallets
cp -r <VEGA-NETWORK-HOME>/data/node/wallets <BACKUP-FOLDER>/v0.53.0/core-wallets
# copy network state
cp -r <VEGA-NETWORK-HOME>/state/node <BACKUP-FOLDER>/v0.53.0/core-state
cp -r <TENDERMINT-HOME>/data <BACKUP-FOLDER>/v0.53.0/tm-state
```

### 2. Download a new binaries

Download new binaries from [the GitHub release](https://github.com/vegaprotocol/vega/releases)

The binaries you need: 

- vega binary
- visor binary (optional for non-visor setup)

### 3. Read the vegavisor documentation

- [Vegavisor on Github](https://github.com/vegaprotocol/vega/tree/develop/visor)
- [Official documentation for vegavisor](https://github.com/vegaprotocol/devops-infra/blob/master/docs/mainnet-mirror/restart-with-vegavisor.md)

### 4. Init visor node (optional for non-visor setup)

Generate visor configuration with the following command:

```bash
/home/vega/vegavisor_home/visor init --home <VEGAVISOR-HOME>
```

**NOTE**: The `<VEGAVISOR-HOME>` folder must not exist, as vegavisor is responsible for creating it.

The visor prepares the following structure:

```bash
├── config.toml
├── genesis
│   └── run-config.toml
└── vX.X.X
    └── run-config.toml

2 directories, 3 files
```

### 5. Prepare the visor config (optional for non-visor setup)

The config is located in the `<VEGAVISOR-HOME>/config.toml`

Use the following pages as a reference:

- [Official documentation for vegavisor](https://github.com/vegaprotocol/devops-infra/blob/master/docs/mainnet-mirror/restart-with-vegavisor.md)
- [Visor config documentation on Github](https://github.com/vegaprotocol/vega/blob/develop/visor/visor-config.md)

Example config is:

```toml
# <VEGAVISOR-HOME>/config.toml 

# Try every 2 seconds; 165 retries is 330sec
maxNumberOfFirstConnectionRetries = 165
maxNumberOfRestarts = 3
restartsDelaySeconds = 5
stopSignalTimeoutSeconds = 15

[upgradeFolders]
  "vX.X.X" = "vX.X.X"

[autoInstall]
  enabled = false
```

### 6. Prepare visor run config (optional for non-visor setup)

The visor `run-config` defines, commands to start the network. Run config resides in the `<VEGAVISOR-HOME>/genesis/run-config.toml` and it is called genesis because it is used to start the network first time, next time when you use protocol upgrade, other run-config may be used.

Use the following pages as a reference:

- [The official run-config documentation](https://docs.vega.xyz/testnet/node-operators/get-started/setup-validator#prepare-initial-visor-run)
- [Visor run-config documentation on Github](https://github.com/vegaprotocol/vega/blob/develop/visor/run-config.md)

Example config is:

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
      "--nodewallet-passphrase-file", "<VEGA-NETWORK-HOME>/all-wallet-passphrase.txt",
          ]
  [vega.rpc]
    socketPath = "<USER-HOME>/run/vega.sock"
    httpPath = "/rpc"
```


Pay attention that We have two critical parameters:

1. `--nodewallet-passphrase-file` - path to the file where you keep the passphrase for the vega node wallet.
2. `socketPath` - path to the Unix sock file vega creates for communicating with other network components running locally. 

**NOTE**: make sure the parent dir for the `sock` file exists.

### 7. Prepare systemd service for vegavisor (optional for non-visor setup)

Just create `/lib/systemd/system/vegavisor.service` file with the following content:

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

**NOTE**: If you are not using vegavisor, you have to prepare similar systemd configs for the following services:
- vega (tendermint is part of the vega process now)
- data-node (optional)

### 8. Update vega core config

There are a few ways to update your existing vega config. The practical way to see what changed in the vega config is as follows:

1. Generate the vega node in a temporary location: `<VEGA-BIN> init --home /tmp/vega-home validator`; when the terminal asks you about passphrases, type whatever. We are interested only in the `config.toml` file.
2. Compare the old config with the generated one: `diff <VEGA-HOME>/config/node/config.toml /tmp/vega-home/config/node/config.toml`
3. Update your `<VEGA-HOME>/config/node/config.toml` file based on the above diff

**NOTE**: We strongly recommend reading [documentation](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes) to understand config parameters.

### 9. Update tendermint config

The procedure is very similar to updating the vega config.

1. Generate tendermint node in a temporary location: `<VEGA-BIN> tm init --home /tmp/tendermint-home`
2. Compare the original tendermint config with the generated one: `diff /tmp/tendermint-home/config/config.toml <TENDERMINT-HOME>/config/config.toml`
3. Update your `<TENDERMINT-HOME>/config/config.toml` file based on the above diff

**NOTE**: I recommend discussing tendermint changes within the validators group as they may be essential for the network. It is also important to understand the tendermint configuration parameters on [the official tendermint docs](https://docs.tendermint.com/v0.33/tendermint-core/configuration.html)

### 10. Install PostgreSQL instance (optional for non-data-node setup)

The PostgreSQL must be on the same server as the data node, as the PostgreSQL does data-snapshot in the data-node location file space. The data node uses postgresql snapshots for the network-history feature.

We tested data-node with:
- PostgreSQL 14
- TimescaleDB: 2.8.0

The procedure for preparing postgresql is:

1. Install PostgreSQL. As a reference, use [the official documentation](https://www.postgresql.org/download/linux/ubuntu/)
2. Install TimescaleDB. As a reference, use [the official documentation](https://github.com/timescale/timescaledb/issues/1852)
3. Apply recommended timescale tunning unless you want to do it manually(and you know what you are doing): `timescaledb-tune --quiet --yes`
4. Create the `vega` user in postgresql
5. With the `vega` user create a `vega` database.
6. Grant the `SUPERUSER` permissions for the `vega` user.
7. Grant the following roles for the `vega` user:
  a. pg_write_server_files
  b. pg_signal_backend
8. Ensure you have access to the vega database with your credentials: `psql --host=127.0.0.1 --port=5432 --username=vega --password vega

### 11. Update data-node config (optional for non-data-node setup)

However, following the same procedure as for `vega` and `tendermint` is possible. There are a lot of changes in the data-node config. I recommend a different approach to that.

1. Initiate the data-node in the temporary location. `<VEGA-BIN> datanode init --lite /tmp/data-node`
2. Compare config, but move changes from the old config to the newly generated one, and then use this file as a data-node `config.toml`
3. Move your new data-node config into `<DATA-NODE-HOME>/config/data-node/config.toml` 

#### A bit about config

Important config keys We updates are: 

- `AutoInitialiseFromNetworkHistory` - We recommend setting it to `false` when you start the network from scratch(e.g., checkpoint restart), or there is no other data node available
- `ChainID` - Make sure it matches the new chain id for your network
- `Admin.Server.SocketPath` - Path for the Unix `sock` file; Ensure parent directory exists. Example may be `<DATA-NODE-HOME>/run/datanode.sock`
- `API.CoreNodeIP` - IP of the server where the vega core node is running. Usually, it is `127.0.0.1.` (localhost)
- `API.CoreNodeGRPCPort` - Port, you expose vega core GRPC node, By default: `3002`
- `SQLStore.wipe_on_startup` - Defines if data-node removes data from the postgresql after the restart. We recommend setting it to `false`.
- `SQLStore.UseEmbedded` - If true, internal(managed by binary itself) postgresql is used. I do not recommend setting it to true in production. The purpose of it is to use in tests.
- `SQLStore.ConnectionConfig` - Entire section, where you set PostgreSQL credentials.
- `NetworkHistory.Enabled` - Enables based on IPFS network history.


#### A bit about Network History

The network history feature allows you to get data into your data node (which acts as a rich API node) faster by fetching data from the other nodes instead replaying it.

There is an entire section called `NetworkHistory` in the data node's `config.toml`. To use it, you must provide at least one other data node that exposes the IPFS node in the `NetworkHistory.Store.BootstrapPeers` parameter. If you do not do it, you won't be able to use the IPFS-based network history.

Format of the `BootstrapPeers` is:

```
"/dns/<DATA-NODE-HOST>/tcp/<DATA-NODE-SWARM-PORT>/ipfs/<DATA-NODE-PEER-ID>"
```

### 12. Reload systemd services

We have to reload the systemd services to load the previously added vegavisor service. Use the following command: `sudo systemctl daemon-reload`

### 13. Unsafe reset all

**NOTE**: Ensure you have a backup of the network files because the steps below will remove data from your home. You may risk losing your wallets, so backup them as well.

1. Call unsafe reset all for tendermitn: `<VEGA-BIN> tendermint unsafe-reset-all --home <TENDERMINT-HOME>`
2. Call unsafe reset all for vega core: `<VEGA-BIN> unsafe_reset_all --home <VEGA-NETWORK-HOME>`
3. Remove data-node state. Required for older version of data node(before v0.68.0): `rm -r <DATA-NODE-HOME>/state/data-node`

### 14. Start the network

```bash
sudo systemctl start vegavisor
```

***NOTE**: To verify vega node is working correctly, check the status of the vegavisor. You may do it with the `systemctl status vegavisor` command.


**NOTE**: To check the network logs, you may want to run the following command:
`journalctl -u vegavisor -n 10000`