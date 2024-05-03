---
title: Upgrade to 0.76
sidebar_label: Upgrade to 0.76
---

This guide describes the steps to upgrade from v0.75.6 to v0.76.1 using the protocol upgrade mechanism. See the changelog for  [v0.76.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.76.0) and v0.76.1 (coming soon) for information about breaking changes and new features.

## Assumptions for the guide
The instructions below are written for Debian-like Linux operating systems.

The guide assumes you are using systemd commands (`systemctl` and `journalctl`) to control binaries. If you are using something different, your system's commands may vary.

This guide is specifically intended for those who are already running a validator node with version `v0.75.6`.

## Study the changes between versions

Before upgrading your node software, **review the changelog** for [v0.76.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.76.0) for a list of breaking API changes compared to the previously released version. Version 0.76.1 will include the new bridge address for validator testnet.

## Required changes
To support the new bridge you must run an **archival** Arbitrum node. We recommend setting this up in advance of your intended upgrade time so you are prepared.

Ahead of the upgrade, insert the URL for your Arbitrum archive node in `YOUR_VEGA_HOME_PATH/config/node/config.toml`, in the section:

```toml title="YOUR_VEGA_HOME_PATH/config/node/config.toml"
[Ethereum]
  Level = "Info"
  RPCEndpoint = "ETH-RPC-ENDPOINT"
  RetryDelay = "15s"

  [[Ethereum.EVMBridgeConfigs]]
    ChainID = "42161" << use this chain ID
    RPCEndpoint = "ARBITRUM_RPC" <<< set your archival node RPC endpoint here

  [EvtForward.Ethereum]
  ...
  ...
  [[EvtForward.EVMBridges]]
    Level = "Info"
    PollEventRetryDuration = "500ms"
    MaxEthereumBlocks = 500
    ChainID = "42161"
```

:::warning Max blocks
You must select a big enough value for the `MaxEthereumBlocks` because Arbitrum produces about five blocks per second. If the range is too small, your node will not keep up with the rest of the network.
:::

:::note Find blocks span for your RPC provider
You must check how big the span of the blocks is that you can use with your provider. Otherwise, your validator won't be able to validate events from the Arbitrum network.

The default value(500) is usually more than enough. If your provider limits it, you should use the maximum allowed range. 

To find the block span allowed by your RPC provider call the following query:

```
curl https://RPC_URL_FOR_ARBITRUM \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getLogs","params":[{"address": "0xE4D5c6aE46ADFAF04313081e8C0052A30b6Dd724", "fromBlock": "207349352", "toBlock": "207349392"}],"id":1,"jsonrpc":"2.0"}'
```

Manipulate the `fromBlock` and `toBlock` values to find the correct allowed block range.
:::

## Before you upgrade

Please read the changelogs to see all the changes. Below you can find a list of the changes you must perform before the upgrade to [v0.76.0 ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.76.0).

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

Add the following new parameter to the configuration file.

We recommend checking all of the changes on your own. Follow the below instructions to do it, and read through every description to understand the changes:

1. Download vega `v0.75.6`
2. Generate config files within the temp home directory
  - vega config
  - comet BFT config
  - data-node config
3. Compare the new generated file in the temp location and the old file to see the differences.

## Upgrade your node
To upgrade the network follow the [protocol upgrade documentation](../how-to/upgrade-network.md).

## After you upgrade

1. There is a new network parameter for `blockchains.evmBridgeConfigs`. This value is hard-coded as it needs to be available when your node starts up.
Once your node starts, map the network ID to the config as seen in the [bridge mapping file ↗](https://github.com/vegaprotocol/vega/blob/develop/core/netparams/bridge_mapping.go). This includes the contracts that will be deployed. 

2. After upgrading, one of the validator set will need to remove the party that deployed the bridge from the signer set. 

## Common issues
If you come across any problems, please refer to the [frequent issues](../how-to/solve-frequent-issues.md) solutions before requesting help.
