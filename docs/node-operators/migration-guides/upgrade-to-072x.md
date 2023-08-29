---
title: Upgrade to 0.72.x
sidebar_label: Upgrade to 0.72.x
---

This guide describes the steps to upgrade from v0.71.6 to v0.72.x using the protocol upgrade mechanism. See the [changelogs for v0.72.x](https://github.com/vegaprotocol/vega/blob/release/v0.72.x/CHANGELOG.md), for information about breaking changes and other details.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using a systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.71.0` or higher.

## Study the changes between versions
Before upgrading your node software, review the **[changelogs](https://github.com/vegaprotocol/vega/blob/release/v0.72.x/CHANGELOG.md)** for a list of breaking API changes for each version compared to the previously released version.

## Upgrade steps

1. You will need to update the timeout defaults for this release. This will allow the nodes more time to upgrade before timing out.

a. If using Visor change the following config to:

```
maxNumberOfFirstConnectionRetries = 43200
```

b. For your core node, change the config to:

```
[Broker.Socket]
  DialTimeout = "24h0m0s"
```

2. To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

:::warning Long data-node migration

This software upgrade has a long migration time. It may take up to 1 hour to run all the migrations. This was tested on 8vCPU 32 GB RAM, SSD disk. Your system setup may mean the migration takes longer.
:::

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.