---
title: Upgrade to 0.74.0
sidebar_label: Upgrade to 0.74.0
---

This guide describes the steps to upgrade from v0.73.13 to v0.74.0 using the protocol upgrade mechanism. See the changelogs for [v0.74.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.74.0) for information about breaking changes and new features.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.73.13`.

## Study the changes between versions

Before upgrading your node software, **review the changelog** for [v0.74.0](https://github.com/vegaprotocol/vega/releases/tag/v0.74.0) for a list of breaking API changes compared to the previously released version.

## Before you upgrade

Please read the changelog to see all the changes. Below you can find a list of the changes you must perform before the upgrade to v0.73.4 in this document.

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
- comet BFT: `YOUR_COMET_BFT_HOME/config/config.toml`

Add the following new parameters to the configuration files.

We recommend checking all of the changes on your own. Follow the below instructions to do it, and read through every description to understand the changes:

1. Download vega `v0.74.0`
2. Generate config files within the temp home directory
  - vega config
  - comet BFT config
  - data-node config
3. Compare the new generated file in the temp location and the old file to see the differences.

#### `fast_sync`

- `config file`: comet BFT
- `description`: The parameter has been removed
- `kind`: removed parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
- fast_sync = true
...
```

#### `p2p.upnp`

- `config file`: comet BFT
- `description`: The parameter has been removed
- `kind`: removed parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
[p2p]
  ...
-   upnp = false
```

#### `mempool.version`

- `config file`: comet BFT
- `description`: The parameter has been removed
- `kind`: removed parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
[mempool]
  ...
-   version = "v0"
```

#### `mempool.ttl-duration`

- `config file`: comet BFT
- `description`: The parameter has been removed
- `kind`: removed parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
[mempool]
  ...
-   ttl-duration = "0s"
```

#### `mempool.ttl-num-blocks`

- `config file`: comet BFT
- `description`: The parameter has been removed
- `kind`: removed parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
[mempool]
  ...
-   ttl-num-blocks = 0
```

#### `mempool.type`

- `config file`: comet BFT
- `description`: The type of mempool to use.
- `kind`: new parameter

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
[mempool]
  ...
+  type = "flood"
```

#### `blocksync`

- `config file`: comet BFT
- `description`: The `fastsync` section was renamed to the `blocksync`
- `kind`: section rename

```diff title="YOUR_COMET_BFT_HOME/config/config.toml"
- [fastsync]
+ [blocksync]
```

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.
