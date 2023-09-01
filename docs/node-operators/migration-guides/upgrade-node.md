---
title: Upgrade to 0.72.14
sidebar_label: Upgrade to 0.72.14
---

This guide describes the steps to upgrade from v0.71.6 to v0.72.14 using the protocol upgrade mechanism. See the changelogs for [v0.72.0](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0) and [onwards](https://github.com/vegaprotocol/vega/releases/), for information about breaking changes and new features.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using a systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.71.0` or higher.

## Study the changes between versions
Before upgrading your node software, **review the changelogs** for [v0.72.0](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0) and [onwards](https://github.com/vegaprotocol/vega/releases/) for a list of breaking API changes compared to the previously released version.

## Before upgrade
There is a long migration in the current release. The duration of the migration depending on the amount of data in the database. To prevent the node downtime (especially if you connect the data-node to the validator core), We should change retenrion policy to "standard".

We have tested migration duration on machine with 8vCPU, 32GB RAM, SSD disk and ZFS file system. Times are the following:

- archival node: ~2 hours
- standard node: ~5 minutes

When you connects the data-node to the validator core, and migration takes very long time, your validator won't start before the data node. It may impact your performance score and increase penalties.

To minimize the downtime of your node, you should change the configuration of your data-node.

You should to execute this step at least a few hours before the mainnet upgrade to be safe.

Follow the below instructions:

1. Update the `<vega_home>/config/data-node/config.toml`: `SQLStore.RetentionPeriod = "standard"`
2. Restart your node

## Upgrade steps
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

:::warning Long data-node migration

This software upgrade has a long migration time. It may take up to 1 hour to run all the migrations. This was tested on 8vCPU 32 GB RAM, SSD disk. Your system setup may mean the migration takes longer.
:::

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.