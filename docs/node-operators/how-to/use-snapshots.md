---
sidebar_position: 7
title: How to use snapshots
sidebar_label: Use snapshots
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import NetworkParameter from '@site/src/components/NetworkParameter';

This section will take you through using the state snapshots. These allow a node to be started without having to replay the whole chain in order to catch up with the current block height of the network.

A node can be started by using a local snapshot (state of the chain built by the current node). This can be useful when the node has been running with the network, has built their own state locally, but had to shutdown for maintenance or upgrade for example.

The snapshots can also be retrieved from the network without any previous local state. This would be useful when a node is joining the network after the bootstrap of the network.

All of the network's nodes will take a snapshot of the state at the same block height. This is configured globally using the following network parameter: <NetworkParameter frontMatter={frontMatter} param="snapshot.interval.length" hideValue={false} />

## List available snapshots
The vega toolchain offers a subcommand to list all snapshots available locally. Once your node has been running for a while, you should be able to see them using the following command:
```
vega tools snapshotdb --show=list --home="YOUR_VEGA_HOME"
Snapshots available: 2
	Height 901, version: 4, size 92, hash: 562414bb5be3ccc8403fbd030d06eebc799bfef5ca25b02ad360fec349cb4bc8
	Height 601, version: 3, size 92, hash: 72a2edd960cf3340ae94bf092991f923850738144789959124590675798fefd9
```
Here we can see that our node took two snapshots, at the block 901 and 601.

You can set how many blocks you want the note to retain through the Vega configuration:
```Toml
[Snapshot]
  ...
  KeepRecent = 10
  ...
```
With this setting a node will always keep the last 10 snapshots in its database.

## Using a local snapshot
Using the `vega snapshots` command line we can get a list of all snapshots available locally.

You can then start your node using a snapshot either directly from the command line or with the configuration file by specifying the block height.

If you don't specify a block height it will load from the latest local snapshot.

From the command line:
```
vega node --home=YOUR_VEGA_HOME --snapshot.load-from-block-height=901
```

Alternatively, add the block height in the configuration file in the Snapshot section:
```
[Snapshot]
  ...
  StartHeight = 901
  ...
```

## Snapshots from the network

:::note
When loading snapshots from the network, the steps described previously to load them locally are not necessary. You will need to get the snapshots information from another node operator in the network (e.g, at which block height a snapshot was taken).
:::

Tendermint offers the possibility to gossip about snapshots taken by other nodes. This can be enabled via the tendermint configuration. 

You will also need the hash of the block at the height you want to load the snapshot, but also a list of trusted tendermint RPC servers (the default port on the node should be 26657).

To get the current trust height and trust hash, you'll need to ask the validator community. See the [community page](./../requirements/community.md) for guidance.

Update the following Tendermint configuration section:
```Toml
[statesync]
enable = true # this default to false, set it to true
rpc_servers = "n01.testnet.vega.xyz:26657,n02.testnet.vega.xyz:26657" # a comma separated list of tendermint rpc
trust_height = 901 # the height of the block you want to join at
trust_hash = "5E1501B89463A9F23C454A58DB92913D960E47DCA76D1FC1EA03988A6C6D0C30" # the hash of the block
```

:::note
The previous example uses addresses from the Vega testnet (fairground) make sure to use an address of a node on the network you are willing to join.
:::

Other settings are available to configure snapshots, however, those described in this documentation are the only ones required to start the node from a given block. You can get more details on snapshots from the [Tendermint documentation](https://docs.tendermint.com/master/spec/abci/apps.html#state-sync).

Once you update the Tendermint config, restart the node by running:

```
vega start --home="YOUR_VEGA_HOME" --tendermint-home="YOUR_TENDERMINT_HOME" --network-url="NETWORK_URL"
```
If you need to reset the Tendermint and Vega nodes, use the following commands. They will remove all chain-related data and keep node wallets, private keys and saved config:

```
vega tendermint unsafe_reset_all --home="YOUR_TENDERMINT_HOME"
vega unsafe_reset_all --home="YOUR_VEGA_HOME"
```

## Inspect snapshots data using vegatools
 
:::note
This is not required to deploy / use the snapshots. This section shows how to use `vega tools` to inspect the data stored in the snapshot.
:::

Vega tools offer basic utilities to read the data from a snapshots and dump it into json format.

If you have `go` and `git` configured on your environment you can install vegatools like so:
```
git clone git@github.com:vegaprotocol/vegatools.git && cd vegatools && go install
```

Then using the vegatools command line you can inspect the state of the snapshot at a given height:
```
vega tools snapshotdb --db-path=/path/to/the/snapshot.db --block-height=901
```

:::note
In the previous example you will find the node snapshot database at the following path `YOUR_VEGA_HOME/state/node/snapshots/`
:::

## Example configuration

```Toml
[Snapshot]
  Level = "Info"
  KeepRecent = 10 # keeps the last 10 snapshots in the snapshot DB
  RetryLimit = 5
  Storage = "GOLevelDB" # Use the level db storage, recommended for production
  DBPath = "" # specify an optional database path, recommended not to change this for production and keep the default
  StartHeight = 0 # the height to start the chain from, -1 for latest block, 0 to start from genesis, or a block height from a recent snapshot
```
