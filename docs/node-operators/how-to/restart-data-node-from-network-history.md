---
sidebar_position: 11
title: How to restart data node from network history
sidebar_label: Restart data node from network history
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Why would you start/restart your data node from network history?

- Your data node crashed
- You are starting a data node when the network has a lot of blocks, and replaying from block 0 would be a long process (up to several days) 
- Your data node state got corrupted

## What is network history?

Network history is a mechanism in the data node software that allows for sharing chunks of information between other data nodes connected to the network. For example, when you are interested in a specific period of data from the Vega network, you can use network history to download this data from other nodes **if they have it**. Usually, you are interested in the last few blocks required to start a new data node or a data node after a crash - in those cases, you do not need the full network history.

## Requirements

Information you need to start or restart the data node from network history:
- Tendermint RPC servers for the state sync
- Trust block hash and height from one node you are going to sync with
- Bootstrap peers for data node

This guide will explain how to get the trust block hash and height further down.

## Start/restart node with network history

Follow the steps below to start up, or restart, your data node using network history.

:::warning Data node must be configured
You must have a data node already configured and running. If you do not have one already, see the guide on [setting up a data node](../get-started/setup-datanode.md).
:::

### 1. Stop data node if it is running

If you're using Visor, you must stop it to control your node. 

Otherwise, you must stop the Vega and data node processes.

Example commands:

```shell
# visor:
systemctl stop vegavisor;

# non-visor:
systemctl stop data-node;
systemctl stop vega;
```

### 2. Use unsafe reset all to clear the state

```shell
# remove data node state
rm -rf /home/vega/vega_home/state/data-node/

# remove Vega state
vega unsafe_reset_all --home <vega-home>

# remove Tendermint state
vega tm unsafe_reset_all --home <tendermint-home>
```

### 3. Update config

#### a. Data node config

Data node config is located in the `<vega_home>/config/data-node/config.toml` file. 

Update the following parameters in your `config.toml` file for the data node:


<Tabs groupId="network">
<TabItem value="fairground" label="Fairground">

```toml
AutoInitialiseFromNetworkHistory = true

[SQLStore]
  WipeOnStartup = true

[NetworkHistory]
  Enabled = true
  [NetworkHistory.Store]
    BootstrapPeers = ["/dns/n00.testnet.vega.rocks/tcp/4001/ipfs/12D3KooWNiWcT93S3P3eiHqGq4a6feaD2cUfbWw9AxgdVt8RzTHJ","/dns/n06.testnet.vega.rocks/tcp/4001/ipfs/12D3KooWMSaQevxg1JcaFxWTpxMjKw1J13bLVLmoxbeSJ5gpXjRh","/dns/n07.testnet.vega.rocks/tcp/4001/ipfs/12D3KooWACJuzchZQH8Tz1zNmkGCatgcS2DUoiQnMFaALVMo7DpC"]

  [NetworkHistory.Initialise]
    TimeOut = "4h"
```

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

```toml
AutoInitialiseFromNetworkHistory = true

[SQLStore]
  WipeOnStartup = true

[NetworkHistory]
  Enabled = true
  [NetworkHistory.Store]
    BootstrapPeers = ["/dns/n00.validators-testnet.vega.rocks/tcp/4001/ipfs/12D3KooWQbCMy5echT1sMKwRQh8GJJk5zmHmg6VNg1qEbpysNACN","/dns/n02.validators-testnet.vega.rocks/tcp/4001/ipfs/12D3KooWHffX2tdw2phH7ai8GCo2K3ehJfnLRATve5otVr4D3ggK","/dns/metabase00.validators-testnet.vega.rocks/tcp/4001/ipfs/12D3KooWKPDZ1s5FM8YewZVeRb9XwaQ7PdaoyD84hFnKmVbn94gN"]

  [NetworkHistory.Initialise]
    TimeOut = "4h"
```

</TabItem>

</Tabs>

#### b. Vega core node config

The config is located in the `<vega_home>/config/node/config.toml`. Update the following parameters in your `config.toml` file for the Vega core:

<Tabs groupId="network">
<TabItem value="fairground" label="Fairground">

```toml
[Snapshot]
  StartHeight = -1

[Broker]
  [Broker.Socket]
    DialTimeout = "4h"
```

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

```toml
[Snapshot]
  StartHeight = -1

[Broker]
  [Broker.Socket]
    DialTimeout = "4h"
```

</TabItem>

</Tabs>

#### c. Tendermint config

To update Tendermint, you need to know the trust block and height. To collect the above information, please visit one of the following links:

<Tabs groupId="network">
<TabItem value="fairground" label="Fairground">

- https://api.n00.testnet.vega.rocks/api/v2/snapshots
- https://api.n06.testnet.vega.rocks/api/v2/snapshots
- https://api.n07.testnet.vega.rocks/api/v2/snapshots

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

- https://api.n00.validators-testnet.vega.rocks/api/v2/snapshots
- https://api.n02.validators-testnet.vega.rocks/api/v2/snapshots

</TabItem>

</Tabs>

Then select one of the latest pairs for block height and hash.

Once you have the trusted block, you can update the following parameters in the `<tendermint_home>/config/config.toml` file:

<Tabs groupId="network">
<TabItem value="fairground" label="Fairground">

```toml
[statesync]
enable = true
rpc_servers = "n00.testnet.vega.rocks:26657,n06.testnet.vega.rocks:26657,n07.testnet.vega.rocks:26657"
trust_height = <height for collected block>
trust_hash = "<hash for collected block>"
```

Example config:

:::warning Sample data
Do not use the below block. Select a newer block!
:::

```toml
[statesync]
enable = true
rpc_servers = "n00.testnet.vega.rocks:26657,n06.testnet.vega.rocks:26657,n07.testnet.vega.rocks:26657777777"
trust_height = 5103884
trust_hash = "ac6670c5e37a3b8f90e1380d03fe83c3021bab77acf93c203d26152693877732"
```

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

```toml
[statesync]
enable = true
rpc_servers = "n00.validators-testnet.vega.rocks:26657,n02.validators-testnet.vega.rocks:26657"
trust_height = <height for collected block>
trust_hash = "<hash for collected block>"
```

Example config:

:::warning
Do not use the below block. Select a newer block!
:::

```toml
[statesync]
enable = true
rpc_servers = "n00.validators-testnet.vega.rocks:26657,n02.validators-testnet.vega.rocks:26657"
trust_height = 3896400
trust_hash = "9edf8b5779aa79e96ac95256a7c671b855990be518a9c7cbb98eb8694918b004"
```

</TabItem>

</Tabs>

### 4. Start your node

:::caution Start data node first
If you are not using Visor, you MUST start your data node before starting the Vega core.
:::

```shell
# with Visor
systemctl start vegavisor;

# without Visor
systemctl start data-node;
systemctl start vega;
```

Your node should start in a several minutes.

:::info
If you use Visor, you may see the following messages in the logs; please ignore them. It is just Visor checking if node has already started:

```log
Jun 16 22:21:10 vega visor[1876]: 2023-06-16T22:21:10.125Z        DEBUG        visor        visor/visor.go:171        failed to get upgrade status from API        {"error": "failed to call protocolupgrade.UpgradeStatus method: failed to post data \"{\\\"method\\\":\\\"protocolupgrade.UpgradeStatus\\\",\\\"params\\\":[null],\\\"id\\\":8485730894528034258}\": Post \"http://unix/rpc\": dial unix /tmp/vega.sock: connect: no such file or directory"}
Jun 16 22:21:10 vega visor[1883]: 2023-06-16T22:21:10.242Z        ERROR        core.protocol.broker.socket-client        broker/socket_client.go:182        failed to connect, retrying        {"error": "dial tcp 127.0.0.1:3005: connect: connection refused", "peer": "tcp://127.0.0.1:3005"}
```

:::

### 5. Revert required after your node has started

:::warning Critical step to avoid corrupted node
This step is critical, otherwise you may end with a corrupted node after next restart or protocol upgrade.
:::

#### a. Disable statesync in Tendermint config

Open the `<tendermint_home>/config/config.toml` file and update the following parameter:

```toml
[statesync]
enable = false
```

#### b. Disable wiping the data node database

Open the `<vega_home>/config/data-node/config.toml` file and update the following parmater:

```toml
AutoInitialiseFromNetworkHistory = false

[SQLStore]
  WipeOnStartup = false
```

**Do not restart your node.** You only need to update the config to avoid having issues in future restarts.
