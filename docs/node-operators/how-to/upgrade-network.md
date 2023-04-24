---
sidebar_position: 3
title: Propose & execute protocol upgrades
sidebar_label: Propose & execute upgrades
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Protocol Upgrade feature allows the Node Operators to synchronously update nodes to the next version of the Vega Protocol.

A protocol upgrade has three steps: 
1. Submit a transaction to initiate the upgrade on a specific block (validators only)
2. Prepare a node for protocol upgrade
3. Execute an upgrade at the agreed block

Smooth execution of a protocol upgrade is critical to the Vega network, and any downtime or disruption must be minimised. Using Vega Visor is recommended and will automatically prepare and execute a protocol upgrade. Alternatively, a node operator can manually perform an upgrade at an agreed block height for an agreed Vega software version.

To help with protocol upgrades, the following endpoints can provide relevant information:
* To view submitted proposals use the **[protocol upgrade proposals](../../api/rest/data-v2/trading-data-service-list-protocol-upgrade-proposals.api.mdx) endpoint**
* To see if the network is ready for upgrade use the **[protocol upgrade status](../../api/rest/data-v2/trading-data-service-get-protocol-upgrade-status.api.mdx) endpoint**.


## 1. Submit a transaction to initiate the upgrade on a specific block

This step can only be done by consensus validators.

### 1.1 Select upgrade block height and new Vega version

This step is async, and it involves all validators. First, all validators have to agree on the following:

* The block height to upgrade at
* The Vega version to upgrade to

The block height must be in the future. When choosing the `upgrade block`, you should give all validators enough time to vote on the upgrade and then prepare the config for a new network.

:::info Example
Selecting the `current block` + 1000 - should allow for 1000 blocks * 0.9 seconds (or whatever the average block time is) = 900 secs. That means there will be about 15 minutes for all validators to vote and prepare, which might not be enough.

To check the block time on the network, visit the `http://<YOUR-NODE-IP>:3003/statistics` endpoint. Currently, the block time is around ~0.9 seconds, though it may be higher around ~1.5 seconds when there are not many transactions or some validators are missing.
:::

### 1.2 Vote for an upgrade

All validators must execute this step, regardless of whether or not they are running Vega Visor.

After all the validators agree on the `upgrade block height` and the `desired version` of Vega, vote on an upgrade. To vote, use the following command, as an example. Be sure to confirm the release tag and height before you continue:

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
	--vega-release-tag v0.71.0 \
	--height 1034000 \
	--output "json"
```

The protocol upgrade proposal is approved if more than 2/3 of consensus validators have voted on it.

Anyone can observe how the voting goes using the **[protocol upgrade proposals](../../api/rest/data-v2/trading-data-service-list-protocol-upgrade-proposals.api.mdx) endpoint**.

## 2. Prepare node for protocol upgrade

All node operators must perform these steps, regardless of whether or not they are using Vega Visor.

### 2.1 Prepare network configuration (all)

Each node operator needs to check if their config needs updating. That includes:

1. The Vega core configuration (`<VEGA-NETWORK-HOME>/config/node/config.toml`)- only if there were changes
2. The Tendermint configuration (`<TENDERMINT-HOME>/config/config.toml`)  - only if there were changes
3. The data node configuration (`<VEGA-NETWORK-HOME>/config/data-node/config.toml`) - only if there were changes and you are running data-node.

Track changes in the configuration between versions in the upgrading readme: [Configuration changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes)

### 2.2 Prepare Visor configuration, if using Visor

You can skip this step if:
* You are not using Vega Visor (go to step 2.3)
* Your node has internet access (Vega Visor will do this step)

If your node does **not** have internet access and you are using Visor, do the following:

1. Create the new version folder in the `<VEGA-VISOR-HOME>`, e.g., for version `v0.71.0`, run the following command: `mkdir -p <VEGA-VISOR-HOME>/v0.71.0`.
2. Download the new version of the Vega binary from the [releases page ↗](https://github.com/vegaprotocol/vega/releases)
3. Unzip the downloaded binary into the created directory, e.g. `<VEGA-VISOR-HOME>/v0.71.0/vega` binary
4. Create the run configuration and put it in the created directory, e.g. `<VEGA-VISOR-HOME>/v0.71.0/run-config.toml` run config file (see example below)

Example config for the new version with Visor:

```toml
name = "v0.71.0"

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

# skip the following if you do not run a data node ```
[data_node]
  [data_node.binary]
    path = "vega"
    args = [
      "datanode", "start",
      "--home", "<VEGA-NETWORK-HOME>",
    ]
```

Check the following parameters.

- `name` - This must match the created directory
- `vega.binary.path` - It may be an absolute path or a relative (to config folder) path. Change that path when you have unzipped the new binary into a different folder.
- `--nodewallet-passphrase-file` flag - Check if the path is correct for your node wallet passphrase.
- `vega.rpc.socketPath` - Make sure the path to the Vega Unix sock is correct and matches the one in the Vega config.

Once you have performed steps `2.1 Prepare network configuration (all)` and `2.2 Prepare Visor configuration, if using Visor`, you don't have to do anything else. Visor will automatically restart the node once the core and data node (if you run one) report they are ready for the protocol upgrade.

### 2.3 Prepare for an upgrade if not using Visor

You should perform these steps only if you are NOT running Visor.

1. Download the new version of the Vega binary from the [releases page ↗](https://github.com/vegaprotocol/vega/releases)
2. Unzip the downloaded binary into your file system.
3. Update your systemd (or any other process manager) to use the new binary.
4. Reload a systemd service: `systemctl daemon-reload`, or use your own preferred.

Now you are ready for the protocol upgrade. Move onto the next step,`3. Execute an upgrade at the agreed block (non-Visor only)` for the next steps.

## 3. Execute an upgrade at the agreed block (non-Visor only)

You should perform these steps only if you are NOT running Visor. If you use Visor, it will perform these steps for you automatically.

**Important:** Smooth execution of the Protocol Upgrade is critical to the Vega Network, and any downtime or disruption must be minimised.

The below steps cover two use cases: for those running a core node only (marked `a`) and those running a core and data node (marked `b`).

### 3.1 Wait for the protocol upgrade block

`(a)`: Monitor the `http://<YOUR-NODE-IP>:3003/statistics` endpoint until `blockHeight` reaches the `upgrade block` and stops increasing
`(b)`: Monitor the `http://<YOUR-NODE-IP>:3003/statistics` for your data node's REST instance, until both `blockHeight` from the response body and `x-block-height` response header, both hit `upgrade block`.

:::note 
Both the core and data node will automatically stop processing blocks at the protocol upgrade block. Both will process any remaining data and prepare for the protocol upgrade by creating a snapshot and network history segment. 

Depending on your hardware, it might take 2-3 seconds or longer. The core and data node process will not exit. Instead, they both will mark themselves as ready for the upgrade. As a node operator, you need to check if core is ready to restart for the protocol upgrade. Core waits for data node before marking itself as ready. Then you can safely restart the core and date node (if running) processes.
:::

### 3.2 Verify from logs if it is safe to restart services

`(a)` and `(b)`: In the Vega core logs, you will see the following messages:

```
2023-03-02T13:01:04.242+0100	INFO	core.protocol.processor	processor/abci.go:821	waiting for data node to get ready for upgrade
2023-03-02T13:01:04.242+0100	INFO	tendermint	service/service.go:176	service stop	{"msg": "Stopping Node service", "impl": "Node"}
2023-03-02T13:01:04.242+0100	INFO	tendermint	node/node.go:1010	Stopping Node
...
...
2023-03-02T13:01:04.380+0100	INFO	core.protocol.protocolupgrade	protocolupgrade/engine.go:356	marking vega core and data node as ready to shut down
2023-03-02T13:01:05.380+0100	INFO	core.protocol.processor	processor/abci.go:845	application is ready for shutdown
2023-03-02T13:01:06.380+0100	INFO	core.protocol.processor	processor/abci.go:845	application is ready for shutdown
2023-03-02T13:01:07.381+0100	INFO	core.protocol.processor	processor/abci.go:845	application is ready for shutdown
...
```

`(b)`: In the data node logs, you will see the following message:

```
2023-03-02T13:01:04.379+0100	INFO	datanode.service	service/protocol_upgrade.go:36	datanode is ready for protocol upgrade
```

### 3.3 Restart services

`(a)`: Restart your `core` process
`(b)`: When you run both core and data node, you must stop both first, and then you can start both, in any order.

### 3.4 Automate

Visor is designed to perform a protocol upgrade automatically, but you can automate it yourself. The key is to check if core is ready for a restart for a protocol upgrade. As described above, it might take several seconds between the node reaches the protocol upgrade block and marks itself as ready to be restarted. Do not solely rely on block height, e.g. from the `/statistics` endpoint.

Instead, query core using the admin JSON-RPC endpoint, as this is what Visor does. Note: This might change in the future, so please keep an eye on the release notes for changes to Visor.

In your `core` config (`<VEGA-NETWORK-HOME>/config/node/config.toml`), you will find:
```toml
[Admin]
  [Admin.Server]
    SocketPath = "/path/to/vega.sock"
    HTTPPath = "/my-rpc"
```
Then you can send the following request:
```bash
# Run it from a user that has access to /path/to/vega.sock
sudo -u vega \
    curl http://localhost/my-rpc \
        --unix-socket /path/to/vega.sock \
         -H 'Content-Type: application/json' \
        --data '{"jsonrpc": "2.0", "method": "protocolupgrade.UpgradeStatus", "params": [], "id": "id"}'
```

Example response:
```json
{
    "result": {
        "AcceptedReleaseInfo": {
            "VegaReleaseTag":"",
            "UpgradeBlockHeight":0
        },
        "ReadyToUpgrade":false
    },
    "error":null,
    "id":"id"
}
```

`ReadyToUpgrade` tells you if `core` is ready for shutdown for `Protocol Upgrade`.


## Benefits of using Visor to coordinate upgrades

If an upgrade proposal is approved (more than 2/3 of consensus validators have voted on it), those using Visor can rely on it to coordinate the upgrade rollout across all the nodes on the chosen block height. 

This includes stopping the currently running nodes, ensuring the new binaries are the correct software version, and starting new nodes. Visor also includes features such as restart capability, which allows Visor to retry the start-up several times before failing. 

You can configure the number of restart attempts in the Visor config, located at `VISOR_HOME_PATH/config.toml`

### Read more about Visor
Read detailed information about Vega Visor, including how it works, how the config is set up and how to edit it in the [full software description ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme).

You can also read the [architecture overview ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#architecture) and [upgrade flow ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#upgrade-flow) topics in the Visor readme.
