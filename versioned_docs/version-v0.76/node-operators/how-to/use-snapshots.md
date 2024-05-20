---
sidebar_position: 7
title: How to use snapshots
sidebar_label: Use snapshots
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';

Snapshots are a mechanism that allow a node be restarted, or join the network from an empty state, without having to replay the whole chain from genesis. A snapshot is taken by the network periodically after every <NetworkParameter frontMatter={frontMatter} param="snapshot.interval.length" hideName={true} /> blocks and contains all of a node's active state for that particular block. Every node participating in the network will produce identical snapshots and they will be stored locally on each node's machines.

There are two ways to start a node from a snapshot, either by using a local snapshot or a snapshot provided by the network. Which to use depends on whether you are a new node operator or a node with existing block data.

## Check locally for snapshot data

Before starting a node you should check whether any local snapshot data exists. This can be done using the following command
```shell
vega tools snapshot --home="YOUR_VEGA_HOME"
```

Any output listing available snapshots like that seen below, indicates that local snapshot data exists.

```shell
Snapshots available: 2
	Height 901, version: 4, size 92, hash: 562414bb5be3ccc8403fbd030d06eebc799bfef5ca25b02ad360fec349cb4bc8
	Height 601, version: 3, size 92, hash: 72a2edd960cf3340ae94bf092991f923850738144789959124590675798fefd9
```

This means you should follow the section for how to restart a node using a local snapshot.

If you have no snapshot data locally you may see an error such as:
```shell
failed to open database located at /vega/node/snapshots : file does not exist
```

This means you should follow the section for joining as a new node using a network snapshot.

## Start a new node using network snapshots

If you are a new node wanting to join the Vega network you can ask the network to provide snapshot data for a recent block. This will reduce the number of blocks that will need to be replayed, and completely avoid having to replay the entire chain from genesis.

To start a node from a network snapshot you will need the following:
- The block height and hash of a recent block
- The RPC server addresses of at least two nodes currently part of the network

A recent block height and block hash can be found by using the [Statistics](../../api/rest/core/core-service-statistics.api.mdx) API of a data node. Below is an example of the two relevant fields from the API response
```json
{
  "blockHeight": "569531",
  "blockHash": "13d9caa536cbc6d2f422840b631ef623ce5e188845030a6ac75a341433b2eed9"
}
```

To find the RPC addresses of exisiting nodes you will need to ask the validator community. See the [community page](./../requirements/community.md) for guidance.

Using these values the `statesync` section of the Tendermint configuration file can be updated
```Toml
[statesync]
enable = true # this default to false, set it to true
rpc_servers = "RPC_ADDRESS_1:RPC_PORT_1,RPC_ADDRESS_2:RPC_PORT_2" # a comma separated list of rpc addresses
trust_height = BLOCK_HEIGHT
trust_hash = "BLOCK_HASH"
```

And then the node can be started as usual, syncing into the network at a recent block height.

```
vega start --home="YOUR_VEGA_HOME" --tendermint-home="YOUR_TENDERMINT_HOME" --network-url="NETWORK_URL"

# if using visor
visor run --home "VISOR_HOME_PATH"
```

## Restart a node using local snapshots

The default action when starting a node is for it to load from the latest snapshot that exists locally. This means if you have stopped your node for any reason, and simply want to catch up with the network then there is nothing to do.

As an example, if the local snapshot list looks like the below:
```shell
Snapshots available: 2
	Height 901, version: 4, size 92, hash: 562414bb5be3ccc8403fbd030d06eebc799bfef5ca25b02ad360fec349cb4bc8
	Height 601, version: 3, size 92, hash: 72a2edd960cf3340ae94bf092991f923850738144789959124590675798fefd9
```

then starting a node as follows will mean that it will start processing from block height `901`
```
vega start --home="YOUR_VEGA_HOME" --tendermint-home="YOUR_TENDERMINT_HOME"
```

To start a node from a more historic snapshot the CLI option `--snapshot.load-from-block-height=` can be used. For example the following will start the node from a block height of `601`
```
vega start --snapshot.load-from-block-height=601 --home="YOUR_VEGA_HOME" --tendermint-home="YOUR_TENDERMINT_HOME"
```


## Restarting a node using a network snapshot

:::caution Avoid using network snapshots if local snapshots exist
Restarting a node from a network snapshot requires the removal of all existing Tendermint block data and Vega state data. This should only be done if **absolutely necessary**. Replaying from a local snapshot is always preferred.
:::

Restarting an existing node from a network snapshot requires removal of all existing local node data. This can be done by running the below commands and then following the above section for starting a new node using network snapshots. Note that there are very few reasons that a node operator will need to do this.

```
vega tendermint unsafe-reset-all --home="YOUR_TENDERMINT_HOME"
vega unsafe_reset_all --home="YOUR_VEGA_HOME"
```

:::caution Unsafe resets should not be used to fix configuration problems
Please consult a member of the Vega engineering team if you are unsure about resetting your node's local state.
:::

## Inspect the contents of a snapshot
 
A debug tool exists that allows the contents of a snapshot for a particular block to be written to a json file. This can contain useful information that can help to understand problems with the Vega network and something a member of the development team may ask for to help debug an issue.


The below command will create a file called `snapshot.json` containing all of the core state for the given block height.

``` shell
vega tools snapshot --snapshot-contents --output=snapshot.json --block-height=SNAPSHOT_BLOCK_HEIGHT
```

:::note
This section is not required to run a node.
:::
