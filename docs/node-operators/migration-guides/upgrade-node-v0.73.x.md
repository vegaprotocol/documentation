---
title: Upgrade to 0.73.0
sidebar_label: Upgrade to 0.73.0
---

This guide describes the steps to upgrade from v0.72.14 to v0.73.0 using the protocol upgrade mechanism. See the changelogs for [v0.73.0](https://github.com/vegaprotocol/vega/releases/tag/v0.73.0) and [onwards](https://github.com/vegaprotocol/vega/releases/), for information about breaking changes and new features.

## Assumptions for the guide

The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using a systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.72.14`.

## Study the changes between versions

Before upgrading your node software, **review the changelogs** for [v0.73.0](https://github.com/vegaprotocol/vega/releases/tag/v0.73.0) and [onwards](https://github.com/vegaprotocol/vega/releases/) for a list of breaking API changes compared to the previously released version.

## Before you upgrade

Please read the change log to see all the changes. However, you can find a list of the changes you must perform before the upgrade to v0.73.0 in this document.

### Config changes

The default locations for configuration files:

- data-node: `YOUR_VEGA_HOME/config/data-node/config.toml`
- vega-core: `YOUR_VEGA_HOME/config/node/config.toml`

Please add a new parameters to the configuration files.

We recommend checking all of the changes on your own. Follow the below instruction to do it:

1. Download vega `v0.73.0`
2. Generate config files within the temp home directory
  - vega config
  -  tendermint config
  - data-node config
3. Compare new generated file in the temp location and the old file to see the differences.

#### `EvtForward.EthCall`

- `config file`: vega-core
- `description`: The parameter allows you to define basic configuratino like the call period to eth node.
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
- `description`: The below change(`Broker.Socket.DialTimeout`) is fundamental when you run the data-node, but please update it also when you have the validator node. We recommend to update it to `96 hours` due to changes in the data-node initialization mechanism. It now downloads and loads all the segments into the data-base by default. This proces may take up to a few dozens of hours.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Broker]
  [Broker.Socket]
    DialTimeout = "96h0m0s"
```

#### `Snapshot.StartHeight`

- `config file`: vega-core
- `description`: There is change in the snapshot mechanism. The default value for the `Snapshot.StartHeight` parameter changed from `-1` to `0`. The value `-1` is no longer valid, and your node will fail to start when it sees the negative value. For a new logic for snapshot load, see the below pseudocode block.
- `kind`: parameter change

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Snapshot]
  StartHeight = 0
```

```go title="Load snapshot pseudocode"
if localSnapshots { // so ignoring state-sync
    if startHeight == 0 {
        // Loading from latest local snapshot,
    } else {
	    // Try reloading snapshot from specified height.
	    // Error -> No snapshot for version XXX
    }
} else {
    if startHeight == 0 {
         // Replay the chain or state-sync if enabled. Up to tendermint to decide.
    } else {
	    // Wait for state-sync to offer expected snapshot for height
    }
}
```

#### `TrustedProxies`

- `config file`: data-node
- `description`: The parameter defines trusted proxies which can override the real user IP address with`X-Real-IP` or `X-Forward-For` headers. If the proxy address IP is not in the list of `TrustedProxies`, vega ignores the above headers. You must repeat this parameter for `GRPC API server` and `Gateway server`.
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
- `description`: Enable verbose logging of SQL migrations. Logs shows only once when vega executes the migration. We recommends to enable it in case of any issues.
- `kind`: new parameter

```toml title="YOUR_VEGA_HOME/config/data-node/config.toml"
[SQLStore]
  VerboseMigration = true
```

#### `NetworkHistory.Initialise.TimeOut`

- `config file`: data-node
- `description`: We recommend to update it to `96 hours` due to changes in the data-node initialization mechanism. It now downloads and loads all the segments into the data-base by default. This proces may take up to a few dozens of hours.
- `kind`: parameter change

```toml
[NetworkHistory]
  [NetworkHistory.Initialise]
    TimeOut = "96h0m0s"
```

#### `NetworkHistory.Initialise.MinimumBlockCount`

- `config file`: data-node
- `description`: We improved the network history initialization process. Now process is automated. The data-node should download all the history segments and put it into the database by default now.
- `kind`: parameter change

```toml
[NetworkHistory]
  [NetworkHistory.Initialise]
    MinimumBlockCount = -1
```

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.