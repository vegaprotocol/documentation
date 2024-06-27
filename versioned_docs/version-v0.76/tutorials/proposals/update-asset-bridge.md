---
sidebar_position: 6
title: Update asset bridge
hide_title: true
vega_network: MAINNET
keywords:
  - proposal
  - governance
  - updateAsset
tags:
  - governance
  - asset
---

import EthAddresses from '@site/src/components/EthAddresses';

# Update the asset bridge
Vega supports adding ERC-20 assets, which can be deposited to and withdrawn from Vega through the ERC-20 asset bridge. 

When a governance proposal to add support for a new asset, or make changes to an existing asset is enacted, the bridge must also be updated.

Vega validators automatically create a multisig bundle - a collection of signatures indicating their approval of the update. That bundle must be submitted to the bridge before the change takes place. This guide walks through that process.

## Requirements
You will need:
* An Ethereum wallet
* Familiarity with [asset governance](../../concepts/governance/asset.md), as well as how the [asset bridge](../../concepts/assets/asset-framework.md#asset-bridges) works on Ethereum.

As an alternative to making the transaction yourself, Etherscan provides a simple interface that can be used to submit updates to the bridge. You can access it by visiting the relevant contract page, under 'Contract' > 'Write contract'.

## Listing an asset
When the validators have created a multisig bundle, it is available for anyone to submit to the bridge to complete the update. 

### 1. Confirm asset proposal has passed
First, you must have the change approved by the network through governance, using a [new asset proposal](./new-asset-proposal.md)

### 2. Get the ID of the new asset
The asset for a new ID will be the same as the ID of the proposal that created it.

### 3. Fetch the signature bundle for the change
* REST: [List asset bundles](../../api/rest/data-v2/trading-data-service-get-erc-20-list-asset-bundle)
* GRPC: [List asset bundles](../../api/grpc/data-node/api/v2/trading_data.proto#geterc20listassetbundlerequest)

Use one of the API calls to fetch the signature bundle from the network. This string contains the approval of the validator nodes of the network for the changes, and is checked by the bridge smart contract. Take a note of the signature bundle and the `nonce`, both of which you will submit to the contract.

### 4. Submit the update to Ethereum
Once you have all the details required, they need to be submitted to the smart contract to enact the changes:

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

* For listing an asset the correct method is [`list_asset`](../../api/bridge/contracts/ERC20_Bridge_Logic#list_asset)

These values you submit here must match the values that were voted on, or the transaction will fail. When the update transaction is finalised on Ethereum, the changes go in to effect. This means that users will be able to deposit the new asset.

## Updating an asset
Most properties on an asset cannot be changed at creation. There are two limits in place that can be changed, and this wallet assumes that you are changine either the `lifetimeLimit` or `threshold`.

### 1. Confirm asset proposal has passed
First, you must have the change approved by the network through governance, using an ([update asset proposal](./update-asset-proposal.md). Unlike New Asset proposals, the asset ID doesn't change as a result, so you already have the asset ID you need in step 3.

### 2. Fetch the signature bundle for the change
* REST: [Set asset limit bundle](../../api/rest/data-v2/trading-data-service-get-erc-20-set-asset-limits-bundle)
* GRPC: [Set asset limit bundle](../../api/grpc/data-node/api/v2/trading_data.proto#geterc20setassetlimitsbundlerequest)

Use one of the API calls to fetch the signature bundle from the network. This string contains the approval of the validator nodes of the network for the changes, and is checked by the bridge smart contract. Take a note of the signature bundle and the `nonce`, both of which we will submit to the contract.

### 3. Submit the update to Ethereum
Now that you have all the details required, they need to be submitted to the smart contract to enact the changes:

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

The correct method for updating the asset is  [`set_asset_limits`](../../api/bridge/contracts/ERC20_Bridge_Logic#set_asset_limits)

These must match the values that were voted on, or the update will fail. When the update transaction is finalised on Ethereum, the changes go in to effect. This means that the new limits will be reflected on the contract.