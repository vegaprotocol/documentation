---
sidebar_position: 3
title: Propose & coordinate protocol upgrades
sidebar_label: Propose & coordinate upgrades
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The protocol upgrade feature allows the nodes running a network to automatically update to the latest version of the Vega protocol, without requiring manual intervention. This can be particularly useful in situations where the protocol is critical to the functioning of the system and any downtime or disruption needs to be minimised.

Protocol upgrades are possible by using Vega Visor, a process runner that manages the the processes of a Vega validator node and a data node. Visor starts and stops node processes, tells the node when to take a snapshot, and coordinates upgrades to the protocol. 

A protocol upgrade involves two main parts: 
* Submitting a transaction to initiate the upgrade on a specific block
* Using a process manager, Vega Visor, to coordinate the rollout of the upgrade

## Submit transaction to initiate upgrade
Any consensus validator can submit a proposal for a protocol upgrade. 

The proposal transaction needs to include details about the proposed version and the block height in which to stop the network and upgrade. Submitting the proposal triggers a vote among consensus validators.

Use the Vega Wallet CLI to submit the following command: 

```shell 
vega protocol_upgrade_proposal
``` 

Once the proposal has been submitted, it is reviewed by other validators who then can approve or reject it by voting on the proposal. 

## Visor coordinates upgrade 
If the upgrade proposal is approved (more than 2/3 of consensus validators have voted on the proposal), Visor is responsible for coordinating the rollout of the upgrade across all the nodes on the chosen block height. 

This includes stopping the currently running nodes, ensuring that the new binaries are the correct software version, and starting new nodes. Visor also includes features such as restart capability, which allows Visor to retry the start-up several times before failing. 

You can configure the number of restart attempts in the Visor config, located at `VISOR_HOME_PATH/config.toml`

## Read more about Visor
Read detailed information about Vega Visor, including how it works, how the config is set up and how you can edit it in the [full software description ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme).

You can also read the [architecture overview ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#architecture) and [upgrade flow ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#upgrade-flow) topics in the Visor readme.

## The API endpoints to help with the protocol upgrade


The data node exposes some endpoints for the protocol upgrade. You can see with them the number of proposals submitted and the protocol upgrade status for the network.

To see proposals submitted for a protocol upgrade, you can see the following API endpoint: 

- [Protocol upgrade proposals ↗](https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-list-protocol-upgrade-proposals)

To see if the network is ready for protocol upgrade, use the following endpoint: 

- [Protocol upgrade status ↗](https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-get-protocol-upgrade-status)

## The protocol upgrade procedure step by step

### 1. Select the upgrade block height and new vega version

This step is async and it involves all the validator into that. In the beginning, all validators have to agree on the following:

- The block height you want to upgrade at.
- The vega version you wish to upgrade to.

The block height should be in the future. Choosing the `upgrade block`, you should give all validators time to vote on the upgrade and prepare config for a new network.

:::info Example
If you select the `current block` + 1000 - it should give you 1000 blocks * 1.5 seconds (or whatever block time is) = 1500 secs - so you may have about 25 minutes - but it may not be enough for all of the validators to vote.

To predict the time you give for other validators to prepare configs and vote, you have to check the block time on the network. To do it, visit the `http://<YOUR-NODE-IP>:3003/statistics` endpoint. When there are no transactions, the block time is about 1.5 sec. Otherwise, it may be lower, for example, 0.8 sec.
:::

### 2. Manual steps required to do protocol upgrade

#### 1. Vote for an upgrade

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

#### 2. Prepare a network configuration

After you propose a protocol upgrade, you should prepare your configuration. 

1. The vega core configuration (`<VEGA-NETWORK-HOME>/config/node/config.toml`)- only if there were changes
2. The tendermint config (`<TENDERMINT-HOME>/config/config.toml`)  - only if there were changes
3. The data-node config (`<VEGA-NETWORK-HOME>/config/data-node/config.toml`) - only if there were changes and you are running data-node.

You can see the following link to track changes in the configuration: [Configuration changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes)

You must prepare the above configs whether you are running vega with a visor or not.

#### 3. Prepare the vegavisor configuration

You can skip this step if you are not running the vegavisor.

1. Create the new version folder in the `<VEGA-VISOR-HOME>`, e.g., for version `v0.68.1`, we must run the following command: `mkdir -p <VEGA-VISOR-HOME>/v0.68.1`.
2. Create the run configuration and put it in the folder created in the previous point (see example below)
3. Download the new version of the vega binary from the [releases page ↗](https://github.com/vegaprotocol/vega/releases)
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

- `name` - This must match to the  folder name created in `step 1`
- `vega.binary.path` - It may be an absolute path or a relative (to config folder) path. Change that path when you have unzipped the new binary into a different folder.
- `--nodewallet-passphrase-file` flag - Check if the path is correct for your nodewallet passphrase.
- `vega.rpc.socketPath` - Make sure the path to the vega unix sock is correct and matches the one in the vega config.

Once you have your visor run config and the network config, you have to wait for the upgrade block. Vegavisor should listen to the upgrade event and restart your binaries. 

### 4. Prepare an upgrade when you are not running vegavisor.

You should do that step only when you are not running the vegavisor.

1. Download the new version of the vega binary from the [releases page ↗](https://github.com/vegaprotocol/vega/releases)
2. Unzip the downloaded binary into your file system.
3. Update your systemd (or any other process manager) to use the new binary.
4. Reload a systemd service: `systemctl daemon-reload`.
5. Wait for the `upgrade block`, then restart the network with the new binary and config after the `upgrade block` is present.

:::info Check if vega core is ready restart
To check when your vega core node is read for protocol upgrade, you should check for the vega-core logs:

In the vega-core logs, you should see the following messages:

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
:::

:::info Check if data-node is ready for restart
To check when your data-node is read for protocol upgrade, you should check for the data-node logs:

```
2023-03-02T13:01:04.379+0100	INFO	datanode.service	service/protocol_upgrade.go:36	datanode is ready for protocol upgrade
```
:::