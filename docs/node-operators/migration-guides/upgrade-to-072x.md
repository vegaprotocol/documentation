---
title: Upgrade to 0.72.x
sidebar_label: Upgrade to 0.72.x
---

This guide describes the steps to upgrade from v0.71.x to v0.72.x using a protocol upgrade mechanism. See the [changelogs for v0.72.x](https://github.com/vegaprotocol/vega/blob/release/v0.72.x/CHANGELOG.md), for information about breaking changes and other details.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems. 

The guide assumes, you are using a systemd commands(`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.71.0` or higher.

## Study the changes between versions
Before upgrading your node software, review the **[changelog](https://github.com/vegaprotocol/vega/blob/release/v0.72.x/CHANGELOG.md)** for a list of breaking API changes for each version from the previously released version, and find links to each release's detailed changelog.

## Upgrade steps
To upgrade the network follow the [protocol upgrade procedure documentation](../how-to/upgrade-network.md).

:::warning Long data-node migration

We have a long migration on the current upgrade. It may take up to 1 hour to run all the migrations - tested on 8vCPU 32 GB RAM, SSD disk.
:::

## Common issues
When you are having some issues, please refer to the [frequent problems in our documentation](../how-to/solve-frequent-issues.md)