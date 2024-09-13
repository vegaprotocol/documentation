---
sidebar_position: 3
title: Set up non validator node
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The main reason to run a non validator node is to support a data node. We strongly discourage you from running a data node with a validator node.

A non validator node is similar to a validator node except it does not take part in the consensus process and does not require staking. It will receive all the same blockchain events as the validator nodes and will process them in the same way but it does not affect how the network runs. 

## OS and software
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on the Vega testnet, and is the most widely tested so far.

See the [infrastructure requirements](../requirements/infrastructure.md) page for a full list of what you need to run various parts of the Vega toolchain.

There are 2 ways to start up a non validator node:
* Replay the full chain from the start
* Use a snapshot from the existing network to jumpstart the node at a point closer to the current block height

Replay the full chain if you want all history. Use a snapshot if you want to start running quickly and don't need the history.

## Start node from block 0

1. Download the required version of the [Vega executable](https://github.com/vegaprotocol/vega/releases) based on the version used when the network's mainnet was launched. Unzip this file and make sure it is in your command line path.

If you prefer to build the code yourself, the instructions can be found inside the code repo at [BUILDING ↗](https://github.com/vegaprotocol/vega/blob/develop/BUILDING.md).

2. Check it is working by trying:

```shell
user@veganode:~/vega/bin$ vega version
Vega CLI [version-number] (commit-hash)

```

3. Initialise the node 

```shell
vega init --home=$YOUR_VEGA_HOME_PATH --tendermint-home=$YOUR_COMETBFT_HOME_PATH full
```

This creates a set of configuration files which you then need to alter for your specific instance.

4. Edit the file `$YOUR_COMETBFT_HOME_PATH/config/config.toml`. Find the RPC address located in the configuration point `[rpc]->laddr`
 
5. Use this value to update the address in the file `$YOUR_VEGA_HOME_PATH/config/node/config.toml`

```toml
 [Blockchain.Tendermint]
    RPCAddr = <RPC address>
```
## Request peers

6. Build a list of CometBFT peers by reaching out to a network's existing node operators as they can provide the data. You'll need to format the peers data as a comma separated list.

7. Open the config file `$YOUR_COMETBFT_HOME_PATH/config/config.toml` and update the value `persistent_peers` with the list created above.

8. Then start the node with the following command:

```shell
vega start --home=$YOUR_VEGA_HOME_PATH --tendermint-home=$YOUR_COMETBFT_HOME_PATH --network-url=insert-genesis-file-link
```

## Start a node using a remote snapshot

1. Connect to the running network and see which snapshots are available using the snapshots endpoint `/api/v2/snapshots`. Record the latest `blockHash`, the `blockHeight` and the `coreVersion` for that `blockHeight`.

2. From the [Vega GitHub repo ↗](https://github.com/vegaprotocol/vega/releases), download the version of Vega that matches the `coreVersion`. Unzip the executable and make sure it is in the command path.

3. Test it works

```shell
user@veganode:~/vega/bin$ vega version
Vega CLI [version-number] (commit-hash)
```

4. Initialize the node 

```shell
vega init --home=$YOUR_VEGA_HOME_PATH --tendermint-home=$YOUR_COMETBFT_HOME_PATH full
```

This creates a set of configuration files which you then need to alter for your specific instance.

5. Edit the file `$YOUR_COMETBFT_HOME_PATH/config/config.toml` and find the RPC address located in the configuration point `[rpc]->laddr`

6. Use this value to update the address in the file `$VEGA_PATH/config/node/config.toml`

```toml
  [Blockchain.Tendermint]
    RPCAddr = <RPC address>
```
## Request peers

7. Build a list of CometBFT peers by reaching out to existing node operators as they can provide the data. You'll need to format the peers data as a comma separated list.

8. Open the config file `$TENDERMINT_PATH/config/config.toml` and update the value `[p2p] -> persistent_peers` with the list created above

9. Set the following values:

```toml
  [p2p]
    pex = true
    persistent_peers = "insert-network-peers-here"
  [mempool]
    broadcast = true
  [statesync]
    enable = true
    trust_height = blockHeight from step 1
    trust_hash = Blockhash from step 1
    rpc_servers = "insert-rpc-server-addresses"
```

10. Start the node with the following command:

```shell
vega start --home=$YOUR_VEGA_HOME_PATH --tendermint-home=$YOUR_COMETBFT_HOME_PATH --network-url=insert-genesis-file-link
```

## Upgrade your node using Visor

We strongly recommend using the tool `Visor` to start up the Vega node as it will transparently take care of upgrading the node as new versions of the software are required. Learn more about it on the [Visor page](../visor.md).

During the replay process, the node will require newer versions of the software at the same block height that the nodes were upgraded previously. As an example: If the chain was upgraded from version 0.12.3 to 0.12.4 at block 123456, everyone running this network would need to have version 0.12.3 when they process block 123456 and then have version 0.12.4 when they process block 123457.

1. Download the latest version of Visor from the [Vega releases page ↗](https://github.com/vegaprotocol/vega/releases/). Unzip it and make sure it is in your command path.

2. Test it with the command:

```script
user@veganode:~/vega/bin$ visor version
Vega Visor CLI [version-number] (commit-hash)
```
3.  Initialise Visor

```script
visor init --home=$YOUR_VISOR_HOME_PATH
```

4. Edit the `$YOUR_VISOR_HOME_PATH/config.toml` file to tune the startup parameters


```toml
...
...

[autoInstall]
  enabled = true
  [autoInstall.asset]
    name = "vega-linux-amd64.zip"
    binaryName = "vega"
```

5. Edit the `$YOUR_VISOR_HOME_PATH/genesis/run-config.toml` file to customize for your setup:

```toml
name = "genesis"

[vega]
  [vega.binary]
    path = "vega"
    args = ["start",
            "--home=$VEGA_PATH",
            "--tendermint-home=$YOUR_COMETBFT_HOME_PATH",
            "--network-url=insert-genesis-file-link"]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"
```

See the [Visor config documentation ↗](https://github.com/vegaprotocol/vega/blob/develop/visor/visor-config.md) for more details on what you can configure and why.

6. Copy the vega binary

```shell 
cp $PATH_TO_DOWNLOADED_VEGA_BINARY $YOUR_VISOR_HOMEPATH/genesis/vega
```

7. Link the genesis directory to the current - tell visor which folder to use

```shell
ln -s $YOUR_VISOR_HOMEPATH/genesis $YOUR_VISOR_HOMEPATH/current
```

8. Start the node by running the command

```script
visor --home=$YOUR_VISOR_HOME_PATH run
```