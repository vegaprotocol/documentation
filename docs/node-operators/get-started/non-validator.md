# Running a non validator node

A non validator node is similar to a validator node except it does not take part in the consensus process and does not require staking or wallets. It will receive all the same blockchain events as the validator nodes and will process them in the same way but it does not affect how the network runs. The main reason to run a non validator node is to support a data node. It is strongly recommended not to run a data node with a validator node.

There are 2 ways to start up a non validator node, the first is to replay the full chain from the start. The second is to use a snapshot from the existing network to jump start the node at a point closer to the current block height. 

## Starting a node from block 0

1. Download the correct version of the Vega executable. The version used to replay the chain must be the same version used when the mainnet started. This is version 0.71.4 and can be found in github here ([vega](https://github.com/vegaprotocol/vega/releases/tag/v0.71.4%2Bfix)). Unzip this file and make sure it is in your command line path.
(If you prefer to build the code yourself, the instructions can be found inside the code repo at [BUILDING](https://github.com/vegaprotocol/vega/blob/develop/BUILDING.md))

2. Check it is working by trying

```
user@veganode:~/vega/bin$ vega version
Vega CLI v0.71.4 (8e5767b20902097c79e8c846cf37f2b5d01dbff8)

```



3. Initialise the node 

```
vega init --home=$VEGA_PATH --tendermint-home=$TENDERMINT_PATH full
```

This creates a set of configuration files which we now need to alter for our specific instance.

3. Edit the file $TENDERMINT_PATH/config/config.toml and find the RPC address located in the configuration point [rpc]->laddr
1. Use this value to update the address in the file $VEGA_PATH/config/node/config.toml [Blockchain.tendermint]->RPCAddr
1. Build a list of tendermint peers by loading the file located at ([peers](https://github.com/vegaprotocol/ansible/blob/master/inventories/mainnet.yaml)) and copying all the values under the `tendermint_extra_peers` section into a comma seperated list.
1. Open the config file $TENDERMINT_PATH/config/config.toml and update the value `persistent_peers` with the list created above
1. Set the option [p2p]->max_packet_msg_payload_size=16384
1. Set the option [Mempool Configuration Option]->broadcast = true
1. Now start the core with the command
```script
vega start --home=$VEGA_PATH --tendermint-home=$TENDERMINT_PATH --network-url=https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json
```



## Starting a node using a remote snapshot

1. Connect to the running network and look which snapshots are available ([snapshots](https://api.vega.community/api/v2/snapshots)). From here record the latest blockHeight, the blockHash and the coreVersion for that blockHeight.
2. Download the version of vega that matches the coreVersion from the github repo ([vega](https://github.com/vegaprotocol/vega/releases)). Unzip the executable and make sure it is in the command path.
3. Test it works
```script
user@veganode:~/vega/bin$ vega version
Vega CLI v0.71.6 (7a23f5e2f0fb4981c8318253142e2e23e3aa4f7c)
```
4. Initialise the node 

```script
vega init --home=$VEGA_PATH --tendermint-home=$TENDERMINT_PATH full
```

This creates a set of configuration files which we now need to alter for our specific instance.

5. Edit the file $TENDERMINT_PATH/config/config.toml and find the RPC address located in the configuration point [rpc]->laddr
1. Use this value to update the address in the file $VEGA_PATH/config/node/config.toml [Blockchain.tendermint].RPCAddr
1. Build a list of tendermint peers by loading the file located at ([peers](https://github.com/vegaprotocol/ansible/blob/master/inventories/mainnet.yaml)) and copying all the values under the `tendermint_extra_peers` section into a comma seperated list.
1. Open the config file $TENDERMINT_PATH/config/config.toml and update the value [p2p]->persistent_peers with the list created above
1. Set [p2p]->max_packet_msg_payload_size=16384
1. Set [Mempool Configuration Option]->broadcast = true
1. Set [statesync]->enable = true
1. Set [statesync]->trust_height = blockHeight from step 1
1. Set [statesync]->trust_hash = Blockhash from step 1
1. Set [statesync]->rpc_servers = "m3.vega.community:26657,api1.vega.community:26657"

1. Now start the core with the command
```script
vega start --home=$VEGA_PATH --tendermint-home=$TENDERMINT_PATH --network-url=https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json
```

## Using visor to control and upgrade your node
We strongly recommend using the tool `visor` to start up the vega node as it will transparently take care of upgrading the node as new versions of the software are required. During the replay process, the node will require newer versions of the software athte same block height that the nodes were upgraded previously.

1. Download the latest version of visor from here ([vega](https://github.com/vegaprotocol/vega/releases/)). Unzip it and make sure it is in your command path.
1. Test it with the command
```script
user@veganode:~/vega/bin$ visor version
Vega Visor CLI v0.72.10 (26afd41a2fe4cb20f3fffeae0d4cfe523fc35614)
```
3.  Initialise visor
```script
visor init --home=$VISOR_PATH
```
4. Edit the file $VISOR_PATH/genesis/run-config.toml

```toml
name = "genesis"

[vega]
  [vega.binary]
    path = "vega"
    args = ["start",
            "--home=$VEGA_PATH",
            "--tendermint-home=$TENDERMINT_PATH",
            "--network-url=https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json"]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"
```

5. Start the node by running the command
```script
visor --home=$VISOR_PATH run
```

