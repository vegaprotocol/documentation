---
title: Upgrade network with the protocol upgrade
sidebar_label: Upgrade network with protocol Upgrade
sidebar_position: 1
---


In the beginning, all validators have to agree on the following:

- The block height you want to upgrade at.
- The vega version you wish to upgrade to.

The block height should be in the future. Choosing the `upgrade block`, you should give all validators time to vote on the upgrade and prepare config for a new network.

:::info Example
If you select the `current block` + 1000 - it should give you 1000 blocks * 1.3 seconds (or whatever block time is) - so you may have about 20 minutes - but it may not be enough for all of the validators to vote.
:::

## Manual steps required to do protocol upgrade

### 1. Vote for an upgrade

All of the validators must execute this step, no matter if you are running vegavisor or not.

After all the validators agree on `upgrade block height` and the `desired version` of vega, you should vote on an upgrade. To vote, you call the following command:

```bash
vega protocol_upgrade_proposal \
	--home <VEGA-NETWORK-HOME> \
	--passphrase-file <NODE-WALLET-PASSPHRASE-FILE> \
	--vega-release-tag <VEGA-TAG-YOU-AGREED-ON> \
	--height <BLOCK-HEIGHT-YOU-AGREED-ON> \
	--output "json"
```

Example:

```bash
vega protocol_upgrade_proposal \
	--home /home/vega/vega_home \
	--passphrase-file /home/vega/vega_home/nodewallet_passphrase.txt \
	--vega-release-tag v0.68.1 \
	--height 1034000 \
	--output "json"
```

### 2. Prepare a network configuration

After you propose a protocol upgrade, you should prepare your configuration. 

1. The vega core configuration (`<VEGA-NETWORK-HOME>/config/node/config.toml`)- only if there were changes
2. The tendermint config (`<TENDERMINT-HOME>/config/config.toml`)  - only if there were changes
3. The data-node config (`<VEGA-NETWORK-HOME>/config/data-node/config.toml`) - only if there were changes and you are running data-node.

You can see the following link to track changes in the configuration.

You must prepare the above configs whether you are running vega with a visor or not.


### 3. Prepare the vegavisor configuration

You can skip this step if you are not running the vegavisor.

1. Create the new version folder in the `<VEGA-VISOR-HOME>`, e.g., for version `v0.68.1`, we must run the following command: `mkdir -p <VEGA-VISOR-HOME>/v0.68.1`.
2. Create the run configuration and put it in the folder created in the previous point (see example below)
3. Download the new version of the vega binary from the [releases page](https://github.com/vegaprotocol/vega/releases)
4. Unzip the downloaded binary into the `<VEGA-VISOR-HOME>/v0.68.1` directory.

Example config for the new version of vegavisor:

```toml
name = "v0.68.1"

[vega]
  [vega.binary]
    path = "vega"
    args = [
      "start",
      "--home", "<VEGA-NETWORK-HOME>",
      "--tendermint-home", "<TENDERMINT-HOME>",
      "--nodewallet-passphrase-file", "<NODE-WALLET-PASSPHRASE-FILE-PATH>",
          ]
  [vega.rpc]
    socketPath = "<SOCKET-FOLDER-PATH>/vega.sock"
    httpPath = "/rpc"

[data_node]
  [data_node.binary]
    path = "vega"
    args = [
      "datanode", "start",
      "--home", "<VEGA-NETWORK-HOME>",
    ]
```

Check the following parameters.

- `name` - This must match to the folder name
- `vega.binary.path` - It may be an absolute path or a relative (to config folder) path. Change that path when you have unzipped the new binary into a different folder.
- `--nodewallet-passphrase-file` flag - Check if the path is correct for your nodewallet passphrase.
- `vega.rpc.socketPath` - Make sure the path to the vega unix sock is correct and matches the one in the vega config.

Once you have your visor run config and the network config, you have to wait for the upgrade block. Vegavisor should listen to the upgrade event and restart your binaries. 


### 4. Prepare an upgrade when you are not running vegavisor.

You should do that step only when you are not running the vegavisor.

1. Download the new version of the vega binary from the [releases page](https://github.com/vegaprotocol/vega/releases)
2. Unzip the downloaded binary into your file system.
3. Update your systemd (or any other process manager) to use the new binary.
4. Reload a systemd service: `systemctl daemon-reload`.
5. Wait for the `upgrade block`, then restart the network with the new binary and config after the `upgrade block` is present