---
title: Overview
---

The source for the Vega bridge to Ethereum is available [in this repository](https://github.com/vegaprotocol/MultisigControl).

There are three main components to the Vega <-> Ethereum bridge

## [Multisig Control](./interfaces/IMultisigControl)
Used to control the ownership of bridge contracts, allowing the validators of a Vega network to control which assets can be used with the bridge, and approve asset withdrawals. To read more about how the bridge works, [see this blog post](https://blog.vega.xyz/vega-erc20-bridge-331a5235efa2).

## [Staking bridge](./interfaces/IStake)
Allows users to stake locked or unlocked Vega tokens

For an introduction to staking on Vega, [see this blog post](https://blog.vega.xyz/staking-on-vega-17f22113e3df).

## [ERC20 asset bridge](./interfaces/IERC20_Bridge_Logic)
Used for depositing ERC20 tokens in to a Vega network.

# Testnet addresses

These contracts are deployed on Ropsten:


