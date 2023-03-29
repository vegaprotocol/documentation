# Restart vega from remote snapshot

### Let's assume the following things:

You have configured the vega core & data-node
You can access one of the data nodes to collect its network history.
You can get trusted block details (I will describe how to do it later)


### 1. Stop the network

```shell
systemctl stop vega;
systemctl stop datanode

# or vegavisor
systemctl stop vegavisor
```

### 2. Update bootstrap peers in the data node config.

You have to do it to be able to fetch the data node snapshots.

- `NetworkHistory.Enabled` - update this value to `true`
- `NetworkHistory.Store.BootstrapPeers` - provide at least one valid bootstrap peer

You have to ask someone who is already running data-node to get BootstrapPeers.

### 3. Collect trusted block info from someone's data node

To do it, visit the `https://<DATA-NODE-URL>/api/v2/snapshots` page and get the following information about one block:
- `blockHeight` 
- `blockHash`

We recommend getting one of the newest blocks but not the last one. It can be any existing block on one of your validators mentioned in the tendermint config. It does not determine the block height you want to load.

### 4. Update tendermint config
Update the `statesync` section in the <<tendermint_home>>/config/config.toml

```toml
[statesync]
enable = true
trust_height = <<blockHeight>>
trust_hash = "<<blockHash>>"
rpc_servers = "<<rpcServers>>"
```

:::note
You have to ask someone for tendermint RPC server. The best server is the one you collected trusted block height and hash. But it can be any server which has trusted block.
:::

### 5. Enable network sync from network history and update network history init timeout

Update the <<home_vega>/config/data-node/config.toml file:

```toml
AutoInitialiseFromNetworkHistory = true


[NetworkHistory]
  Enabled = true
...
[NetworkHistory.Initialise]
    TimeOut = "4h"
```

### 6. Check the vega core config

Check if you have `StartHeight` set to `-1` in <<vega_home>>/config/node/config.toml

```toml
[Snapshot]
  StartHeight = -1

[Broker.Socket]
    DialTimeout = "4h" # increase this value. Otherwise, it may fail.
```

### 7. Call unsafe reset all

```shell
vega unsafe_reset_all --home <<vega_home>>
vega tm unsafe-reset-all --home <<tendermint_home>>
rm -r <<vega_home>>/state/data-node/*
```

### 8. Start your node

```shell
systemctl start vega
systemctl start datanode

# or visor
systemctl start vegavisor
```

### 9. Revert config

When your node started correctly you may want to revert changes you made to

- vegavisor config
- vega config
- tendermint config
- data node config

We recommend to do it to avoid starting from snapshot next time. Usually when your node is not too far behind, it is faster to reply missing block than load everything from network.

### Update visor timeout

Only when you are running vegavisor. Modify the <<vegavisor_home>>/config.toml

Visor tries to connect every 2 sec. Just put some big value like `7200` -  (7200*2 sec = 4h)

```toml
maxNumberOfFirstConnectionRetries = 7200
```
