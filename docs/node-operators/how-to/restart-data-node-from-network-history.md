---
sidebar_position: 11
title: How to restart data-node from the network history
sidebar_label: Restart data-node from the network history
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Why would you start/restart your data node from network history?

- Your data-node crashed
- You are starting a data node when the network has a lot of blocks, and replaying from block 0 is a long process (up to several days) 
- Your data-node state got corrupted.

## What is a network history?

A network history is a mechanism in the data node that allows sharing of parts of information between other data nodes in the network. For example, when you are interested in a specific period of data from the Vega network, you can use network history to download this data from other nodes **if they have it**. Usually, you are interested in the last few blocks required to start a new data node or a data node after a crash - in those cases, you do not need full the network history.

## What information do you need to restart the data node from the network history?

- Tendermint RPC servers for the state sync
- Trust block hash and height from one node you are going to sync with
- BootstraPeers for data node

We will learn, how to get the trust block hash and height later in the tutorial.

## Steps to start/restart node with network history

:::warning
You must have a data node already configured to work. If you do not have one, please see the [documentation, how to set up a data node](link to documentation)
:::

### 1. Stop the data node if it is running

You must stop the vegavisor if you use it to control your node otherwise, you must stop vega and data node processes.

Example:

```shell
# visor:
systemctl stop vegavisor;

# non-visor:
systemctl stop data-node;
systemctl stop vega;
```

### 2. Unsafe reset all the state

```shell
# remove data node state
rm -rf /home/vega/vega_home/state/data-node/

# remove vega state
vega unsafe_reset_all --home <vega-home>

# remove tendermint state
vega tm unsafe_reset_all --home <tendermint-home>
```

### 3. Update the config

#### a. The data node config

The config is located in the `<vega_home>/config/data-node/config.toml`. Update the following parameters in your `config.toml` file for the data node:


<Tabs groupId="network">
<TabItem value="mainnet" label="Mainnet">


```toml
AutoInitialiseFromNetworkHistory = true

[SQLStore]
  WipeOnStartup = true

[NetworkHistory]
  Enabled = true
  [NetworkHistory.Store]
    BootstrapPeers = BootstrapPeers = ["/dns/api1.vega.community/tcp/4001/ipfs/12D3KooWDZrusS1p2XyJDbCaWkVDCk2wJaKi6tNb4bjgSHo9yi5Q","/dns/api2.vega.community/tcp/4001/ipfs/12D3KooWEH9pQd6P7RgNEpwbRyavWcwrAdiy9etivXqQZzd7Jkrh","/dns/api0.vega.community/tcp/4001/ipfs/12D3KooWAHkKJfX7rt1pAuGebP9g2BGTT5w7peFGyWd2QbpyZwaw","/dns/api7.vega.community/tcp/4001/ipfs/12D3KooWBqVQPjJur5EvjrizCyKG2d6eyCX8hxkvVXeUQHMjbWj9"]


  [NetworkHistory.Initialise]
    TimeOut = "4h"
```

</TabItem>

<TabItem value="fairground" label="Fairground">

TBD for fairground

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

TBD for validators-testnet

</TabItem>

</Tabs>

#### b. The vega core config

The config is located in the `<vega_home>/config/node/config.toml`. Update the following parameters in your `config.toml` file for the vega core:

<Tabs groupId="network">

<TabItem value="mainnet" label="Mainnet">


```toml
[Snapshot]
  StartHeight = -1

[Broker]
  [Broker.Socket]
    DialTimeout = "4h"
```

</TabItem>

<TabItem value="fairground" label="Fairground">

TBD for fairground

</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

TBD for validators-testnet

</TabItem>

</Tabs>

#### c. Tendermint config

To update tendermint, you have to know the trust block and height. To collect the above information, please visit one of the following link:

- https://api0.vega.community/api/v2/snapshots
- https://api1.vega.community/api/v2/snapshots
- https://api2.vega.community/api/v2/snapshots
- https://api3.vega.community/api/v2/snapshots

Then select one of the latest pair for block height and hash

Once you have thrusted block, you can update the following parameters in the `<tendermint_home>/config/config.toml` file:

<Tabs groupId="network">

<TabItem value="mainnet" label="Mainnet">


```toml
[statesync]
enable = true
rpc_servers = "api0.vega.community:26657,api1.vega.community:26657,api2.vega.community:26657,api7.vega.community:26657"
trust_height = <height for collected block>
trust_hash = "<hash for collected block>"
```

Example config:

:::warning
Do not use below block. Please select newer block!
:::

```toml
[statesync]
enable = true
rpc_servers = "api0.vega.community:26657,api1.vega.community:26657,api2.vega.community:26657,api7.vega.community:26657"
trust_height = 3040600
trust_hash = "b4b500d8fc84cce3a42b141193db7ba23ff03cc80b70cc817f6536582ebd5eda"
```

</TabItem>

<TabItem value="fairground" label="Fairground">

```toml
[statesync]
enable = true
rpc_servers = "n00.testnet.vega.rocks:26657,n06.testnet.vega.rocks:26657,n07.testnet.vega.rocks:26657"
trust_height = &lt;height for collected block&gt;
trust_hash = "&lt;hash for collected block&gt;"
```

Example config:

:::warning
Do not use below block. Please select newer block!
:::

```toml
[statesync]
enable = true
rpc_servers = "api0.vega.community:26657,api1.vega.community:26657,api2.vega.community:26657,api7.vega.community:26657"
trust_height = 3040600
trust_hash = "b4b500d8fc84cce3a42b141193db7ba23ff03cc80b70cc817f6536582ebd5eda"
```



</TabItem>

<TabItem value="validators-testnet" label="Validator testnet">

TBD for validators-testnet

</TabItem>

</Tabs>

### 4. Start your node

:::warning
When you are not using visor. You MUST start your data node before the vega core.
:::

```shell
# with visor
systemctl start vegavisor;

# non-visor
systemctl start data-node;
systemctl start vega;
```

Your node should start in a several minutes.

:::info
If you use vegavisor, you may see the following messages in the logs; please ignore them. It is just visor checking if node has already started:

```log
Jun 16 22:21:10 vega visor[1876]: 2023-06-16T22:21:10.125Z        DEBUG        visor        visor/visor.go:171        failed to get upgrade status from API        {"error": "failed to call protocolupgrade.UpgradeStatus method: failed to post data \"{\\\"method\\\":\\\"protocolupgrade.UpgradeStatus\\\",\\\"params\\\":[null],\\\"id\\\":8485730894528034258}\": Post \"http://unix/rpc\": dial unix /tmp/vega.sock: connect: no such file or directory"}
Jun 16 22:21:10 vega visor[1883]: 2023-06-16T22:21:10.242Z        ERROR        core.protocol.broker.socket-client        broker/socket_client.go:182        failed to connect, retrying        {"error": "dial tcp 127.0.0.1:3005: connect: connection refused", "peer": "tcp://127.0.0.1:3005"}
```

:::

### 5. Revert required after your node has started

:::warning
This step is critical, and you may end with the corrupted node after next restart or protocol upgrade!!!
:::

#### a. Disable statesync in the tendermint config

Open the `<tendermint_home>/config/config.toml` file and update the following parameter:

```toml
[statesync]
enable = false
```

#### b. Disable wiping the data node database

Open the `<vega_home>/config/data-node/config.toml` file and update the following parmater:

```toml
[SQLStore]
  WipeOnStartup = false
```

:::info
Do not restart your node. Just update config to avoid issues in the future restarts.
:::
