---
sidebar_position: 4
title: Asset bridge updates
hide_title: false
vega_network: TESTNET
ethereum_network: Ropsten
keywords:
  - proposal
  - governance
  - updateAsset
tags:
  - governance
  - asset
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import EthAddresses from '@site/src/components/EthAddresses';

# Update the asset bridge

Vega supports ERC20 assets, which can be deposited to and withdrawn from Vega through the asset bridge. When a governance proposal votes to add support for a new asset, or make changes to an existing asset, the bridge must also be updated. When a relevant proposal is voted in, Vega validators automatically create a multisig bundle - a collection of signatures indicating their approval of the update - but that bundle must be submitted to the bridge before the change takes place. This guide walks through that process.

## Requirements

You will need:

- An Ethereum wallet
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [assets at a protocol level](../../concepts/vega-protocol#assettoken-management), as well as how the [asset bridge](../../concepts/vega-protocol#assettoken-management) works on Ethereum.
- An asset proposal ([new asset](./new-asset-proposal.md) or an [asset update(./update-asset-proposal.md) that has passed a vote)

## Overview

When the validators have created a multisig bundle, it is available for anyone to submit to the bridge to complete the update. This 

## 1. Get the ID of the new/changing asset

## 2. Fetch the signature bundle for the change

## 3. Submit the update to Ethereum

Now that you have the signature bundle, it needs to be submitted to the smart contract to enact the changes:

<EthAddresses frontMatter={frontMatter} show={["erc20Bridge"]} />

:::tip Etherscan
You can use Etherscan's [Write to contract](https://www.web3.university/article/how-to-interact-with-smart-contracts) feature to submit the bundle, or create the transaction using your own wallet.
:::

* For listing an asset (with the signature bundle from a New Asset proposal), the correct method is [`list_asset`](../../api/bridge/contracts/ERC20_Bridge_Logic#list_asset)
* For updating an asset, the correct method is  [`set_asset_limits`](../../api/bridge/contracts/ERC20_Bridge_Logic#set_asset_limits)

In both cases, you will need to submit the values that were voted for, and the signature bundle you obtained in step 2. These must match the values that were voted on, or the update will fail. When the update transaction is finalised on Ethereum, the changes go in to effect. This means that users will be able to deposit the new asset, or the updated asset properties will be reflected on the contract.

:::note Verifying the bridge address
The bridge address is set by a network parameter. so to verify that this bridge address is correct you can check <NetworkParameter frontMatter={frontMatter} param="blockchains.ethereumConfig" hideValue={true} />
:::