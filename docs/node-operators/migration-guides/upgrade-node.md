---
title: Upgrade node to 0.68
sidebar_label: Upgrade to 0.68
sidebar_position: 1
---

To upgrade your validator node from version 0.53 to version 0.68, follow the steps below. 

## Study the changes between versions
Before upgrading your node software from version 0.53 to 0.68.0, read the upgrading file in the Vega repo for a full list of the changes between the two versions, and review the breaking API changes.

The **[release notes](../../releases/overview.md)** have a list of breaking API changes for each version from 0.54 onwards.

The **[upgrading readme ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md)** has details on major updates.

The readme includes what's updated for the following three categories:

* [Repository changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#repository-changes)
* [Configuration changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#configuration-changes)
* [Command line changes ↗](https://github.com/vegaprotocol/vega/blob/develop/UPGRADING.md#command-line-changes)

## Review genesis file updates 
The project team will raise a PR in the [networks repo ↗](https://github.com/vegaprotocol/networks/pulls) to update the genesis file to include new network parameters required for 0.67.3 and the start of trading. Once this is done, someone from the team will let you know, and you'll need to review this PR.

## Upgrade and restart network
It's strongly recommended that you set up Visor for automatic protocol upgrades. Visor enables you to upgrade to future versions without needing to coordinate with all validators. If you have Visor enabled, a validator can propose a block for an upgrade, your node can agree to that proposal, and the upgrade will happen at the pre-determined block height without intervention.

You'll need to set up the Visor config to support your node's requirements.

If you have questions about Visor, or would like to suggest enhancements, please raise them in the Validators Discord channel, or as issues on the [Vega repo ↗](https://github.com/vegaprotocol/vega/issues).

INSERT INSTRUCTIONS FROM DANIEL HERE 