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

Please read the change log to see all the changes. You can see the changed/added parameters you MUST update below.

### Changes for the validator

Usually the vega config is located at `YOUR_VEGA_HOME/config/node/config.toml`.

Please add a new parameters to the vega config. 

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[EvtForward]
  [EvtForward.EthCall]
    Level = "Info"
    PollEvery = "20s"

[Vesting]
  Level = "Info"
```

The below change(`Broker.Socket.DialTimeout`) is fundamental when you run the data-node, but please update it also when you have the validator node.

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Broker]
  [Broker.Socket]
    DialTimeout = "96h0m0s"
```

There is change in the snapshot mechanism. The default value for the `Snapshot.StartHeight` parameter changed from `-1` to `0`. The value `-1` is no longer valid, and your node will fail to start when it sees the negative value.

```toml title="YOUR_VEGA_HOME/config/node/config.toml"
[Snapshot]
  StartHeight = 0
```

### Changes for the data-node

New params for data-node

```toml

  [API.RateLimit]
    TrustedProxies = ["127.0.0.1"]

  [Gateway.RateLimit]
    TrustedProxies = ["127.0.0.1"]

[NetworkHistory]
    GarbageCollectionInterval = "24h0m0s"

[SQLStore]
  VerboseMigration = false
```

Recommended changes for data-node:

```toml
  [NetworkHistory.Initialise]
    TimeOut = "96h0m0s"
```

TODO: Add note, you can see all details by generating new config and comparing old and new one.

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.