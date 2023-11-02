---
title: Upgrade to 0.73.0
sidebar_label: Upgrade to 0.73.0
---

This guide describes the steps to upgrade from v0.72.14 to v0.73.0 using the protocol upgrade mechanism. See the changelogs for [v0.73.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.73.0) and [onwards ↗](https://github.com/vegaprotocol/vega/releases/), for information about breaking changes and new features.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.72.14`.

## Study the changes between versions

Before upgrading your node software, **review the changelog** for [v0.73.0](https://github.com/vegaprotocol/vega/releases/tag/v0.73.0) for a list of breaking API changes compared to the previously released version.

## Before you upgrade

Please read the changelog to see all the changes. Below you can find a list of the changes you must perform before the upgrade to v0.73.0 in this document.

### When should I upgrade config?

You can update the config any time before the upgrade block happens.

We recommend you do it in the following way:

1. Make a copy of the original config.
2. Update the config in the copied files.
3. A few hours before the upgrade, replace the original config with updated one. 

:::caution Back up your original config files
Make sure you have a backup for the original config in case you need them in the future.
:::

We do not recommend you do it too early in case you have to restart your node with the current version for some reason, for example if your node fails or your server restarts, etc.

### Config changes

The default locations for configuration files:

- data-node: `YOUR_VEGA_HOME/config/data-node/config.toml`
- vega-core: `YOUR_VEGA_HOME/config/node/config.toml`

Add the following new parameters to the configuration files.

We recommend checking all of the changes on your own. Follow the below instructions to do it, and read through every description to understand the changes:

1. Download vega `v0.73.0`
2. Generate config files within the temp home directory
  - vega config
  -  tendermint config
  - data-node config
3. Compare the new generated file in the temp location and the old file to see the differences.

#### `EvtForward.EthCall`

- `config file`: vega-core
- `description`: The parameter allows you to define basic configurations like the call period to ethereum node.
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[EvtForward]
  [EvtForward.EthCall]
    Level = "Info"
    PollEvery = "20s"
```

#### `Vesting`

- `config file`: vega-core
- `description`: Manipulate the vesting engine configuration
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Vesting]
  Level = "Info"
```

#### `Broker.Socket.DialTimeout`

- `config file`: vega-core
- `description`: The below change(`Broker.Socket.DialTimeout`) is fundamental when you run the data node, but it also needs to be updated for a validator node. We recommend you update it to `96 hours` due to changes in the data node initialization mechanism. It now downloads and loads all the segments into the database by default. This process may take a day or more.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Broker]
  [Broker.Socket]
    DialTimeout = "96h0m0s"
```

#### `Snapshot.StartHeight`

- `config file`: vega-core
- `description`: The behaviour of the parameter `Snapshot.StartHeight` changed, and its default value has been updated from `-1` to `0`. **However, we DO NOT recommend changing this parameter before successfully migrating to version 0.73.0!** Prior 0.73, setting this parameter to `0` triggers the removal of the existing snapshots. If you start with the wrong binary or end up with a rollback, your node will use the old behaviour and remove existing snapshots. For the new logic to load a snapshot, see the below pseudocode block.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Snapshot]
  StartHeight = -1
```

```go title="Load snapshot pseudocode"
if localSnapshots { // so ignoring state-sync even if it's enabled

    if startHeight == 0 {
        // Loading from latest local snapshot,
    } else {
	    // Try reloading snapshot from specified height.
	    // Error -> No snapshot for version XXX
    }
} else {
    if startHeight == 0 || startHeight == -1 {
         // Replay the chain or state-sync if enabled. Up to tendermint to decide.
    } else {
	    // Wait for state-sync to offer expected snapshot for height
    }
}
```

#### `TrustedProxies`

- `config file`: data-node
- `description`: The parameter defines trusted proxies which can override the real user IP address with`X-Real-IP` or `X-Forward-For` headers. If the proxy address IP is not in the list of `TrustedProxies`, Vega ignores the above headers. You must repeat this parameter for the `gRPC API server` and the `Gateway server`.
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[API]
  [API.RateLimit]
    TrustedProxies = ["127.0.0.1"]

[Gateway]
  [Gateway.RateLimit]
    TrustedProxies = ["127.0.0.1"]
```

#### `NetworkHistory.GarbageCollectionInterval`

- `config file`: data-node
- `description`: The interval at which garbage collection should be run.
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[NetworkHistory]
    GarbageCollectionInterval = "24h0m0s"
```

#### `SQLStore.VerboseMigration`

- `config file`: data-node
- `description`: Enable verbose logging of SQL migrations. Logs shows only once when Vega executes the migration. We recommend enabling it in case of any issues.
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[SQLStore]
  VerboseMigration = true
```

#### `NetworkHistory.Initialise.TimeOut`

- `config file`: data-node
- `description`: We recommend you update it to `96 hours` due to changes in the data node initialization mechanism. It now downloads and loads all the segments into the database by default. This process may take a day or more.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[NetworkHistory]
  [NetworkHistory.Initialise]
    TimeOut = "96h0m0s"
```

#### `NetworkHistory.Initialise.MinimumBlockCount`

- `config file`: data-node
- `description`: The network history initialization process has been improved. Now the process is automated. The datanode should download all the history segments and put it into the database by default now.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[NetworkHistory]
  [NetworkHistory.Initialise]
    MinimumBlockCount = -1
```

#### `maxNumberOfFirstConnectionRetries`

- `config file`: vegavisor config
- `description`: You need to leave more time to wait on the data node for Visor. Increase it to a higher number. This is especially crucial for data nodes.
- `kind`: parameter change

```toml title="YOUR_VEGAVISOR_HOME/config.toml"
# Try every 2 seconds, 172800 retries is 96h
maxNumberOfFirstConnectionRetries = 172800
```

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.