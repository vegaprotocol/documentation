---
title: Upgrade to 0.72.14
sidebar_label: Upgrade to 0.72.14
sidebar_position: 1
---

This guide describes the steps to upgrade from v0.71.6 to v0.72.14 using the protocol upgrade mechanism. See the changelogs for [v0.72.0](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0) and [onwards](https://github.com/vegaprotocol/vega/releases/), for information about breaking changes and new features.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using a systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.71.0` or higher.

## Study the changes between versions
Before upgrading your node software, **review the changelogs** for [v0.72.0](https://github.com/vegaprotocol/vega/releases/tag/v0.72.0) and [onwards](https://github.com/vegaprotocol/vega/releases/) for a list of breaking API changes compared to the previously released version.

## Before you upgrade
This release has a long migration time, but how long it will be depends on the amount of data in the database. To prevent the node downtime, especially if you connect the data node to your validator node, we recommend you change the data node's retention policy to "standard" before the upgrade.

We have tested the migration time on a machine with 8vCPU, 32GB RAM, SSD disk and ZFS file system. 
Migration times were:
- archival node: ~2 hours
- standard node: ~5 minutes

When you connect the data node to the validator node, and migration takes very long time, your validator **will not start** before the data node. This may impact your performance score and increase penalties.

Changing the retention policy of your data node will minimise your validator node's downtime.

Execute this step at least a few hours before the mainnet upgrade.

Follow the below instructions:

1. Update the `<vega_home>/config/data-node/config.toml`: `SQLStore.RetentionPeriod = "standard"`
2. Restart your data node

Note: You are strongly recommended to only run a data node with a non-validator node, not a validator node.

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.