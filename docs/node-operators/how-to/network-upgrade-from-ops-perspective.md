# Upgrade procedure from the OPS perspective

## 0. Assumptions

Before you start, you have to prepare and keep in mind a few things:

**NOTE**: Below instruction is prepared for Debian-like Linux operating systems.

- `<VEGA-USER>`; the Linux user that runs vega, e.g., `vega`
- `<USER-HOME>`; path to the `<VEGA-USER>` home directory, e.g., `/home/vega`
- `<VEGA-NETWORK-HOME>`; the home path to the vega network, e.g., `/home/vega/vega_home`
- `<TENDERMINT-HOME>`; the tendermint home path, e.g., `/home/vega/tendermint_home`
- `<VEGAVISOR-HOME>`; the vegavisor home path, e.g., `/home/vega/vegavisor_home`
- `<BACKUP-FOLDER>`; the folder where you store backups, e.g., `/home/vega/backups`
- `<VISOR-BIN>`; the path to the vega visor binary, e.g., `/home/vega/bin/visor`
- `<VEGA-BIN>`; the path to the vega core binary, e.g., `/home/vega/bin/visor`

We will refer to the above paths in the following article. The sample paths given above are just examples. We recommend setting your paths that align with the conventions adopted in your company.

# Upgrade steps

## 1. Prepare genesis file

We recommend doing this at the beginning of the upgrade procedure, but this can happen at any point before validators start the network. After genesis is prepared, all the validators must use the same `genesis.json` file.

1. As a first step, one of the validators or vega team member has to adjust [the genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) in the [vegaprotocol/networks](https://github.com/vegaprotocol/networks) repository.
2. The person responsible for updating genesis should create PR with changes.
3. All of the validators should accept changes and approve the PR.

## 2. Steps on your server

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

### 5. Prepare the visor config

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

### 6. Prepare visor run config

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

### 7. Prepare systemd service for vegavisor

Just create `/lib/systemd/system/vegavisor.service` file with the following content:

```toml
# /lib/systemd/system/vegavisor.service

[Unit]
Description=vegavisor
Documentation=https://github.com/vegaprotocol/vega
After=network.target network-online.target
Requires=network-online.target

[Service]
User=vega
Group=vega
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

### 10. Reload systemd services

We have to reload the systemd services to load the previously added vegavisor service. Use the following command: `sudo systemctl daemon-reload`

### 11. Stop the network

1. Stop the `vega` node
2. Stop the `tendermint` node
3. Stop the `data-node` if running
4. Make sure `vega` and `tendermint` have been stopped.

**NOTE**: The new version of vega does not need to run tendermint as a separate service. Vega incorporates the tendermint process into the vega command at the moment.

### 12. Unsafe reset all

**NOTE**: Ensure you have a backup of the network files because the steps below will remove data from your home. You may risk losing your wallets, so backup them as well.

1. Call unsafe reset all for tendermitn: `<VEGA-BIN> tendermint unsafe-reset-all --home <TENDERMINT-HOME>`
2. Call unsafe reset all for vega core: `<VEGA-BIN> unsafe_reset_all --home <VEGA-NETWORK-HOME>`

### 13. Start the network

```bash
sudo systemctl start vegavisor
```

***NOTE**: To verify vega node is working correctly, check the status of the vegavisor. You may do it with the `systemctl status vegavisor` command.


**NOTE**: To check the network logs, you may want to run the following command:
`journalctl -u vegavisor -n 10000`