---
sidebar_position: 4
title: Asset bridge updates
hide_title: false
vega_network: TESTNET
keywords:
  - proposal
  - governance
  - updateAsset
tags:
  - governance
  - asset
---

# Update the asset bridge

Vega supports ERC20 assets, which can be deposited to and withdrawn from Vega through the asset bridge. When a governance proposal votes to add support for a new asset, or make changes to an existing asset, the bridge must also be updated. When a relevant proposal is voted in, Vega validators automatically create a multisig bundle - a collection of signatures indicating their approval of the update - but that bundle must be submitted to the bridge before the change takes place. This guide walks through that process.

## Requirements

You will need:

- An Ethereum wallet
- Familiarity with [governance on Vega](../../concepts/vega-protocol.md#governance), particularly [assets at a protocol level](../../concepts/vega-protocol#assettoken-management), as well as how the [asset bridge](../../concepts/vega-protocol#assettoken-management) works on Ethereum.

## Overview

When the validators have created a multisig bundle, it is available for anyone to submit to the bridge to complete the update. 

