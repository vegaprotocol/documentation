---
title: Overview
vega_network: TESTNET
sidebar_position: 1
---

import EthAddresses from '@site/src/components/EthAddresses';

There are three main components to the Vega <-> Ethereum bridge

## [Staking bridge](./interfaces/IStake.md)

<EthAddresses frontMatter={frontMatter} show={["StakingBridge"]} />

Allows users to stake locked or unlocked Vega tokens.

For an introduction to staking on Vega, [check out our Concepts section](../../concepts/vega-chain/proof-of-stake.md#bridges-used-for-staking) or for a higher level overview [see this blog post ↗](https://blog.vega.xyz/staking-on-vega-17f22113e3df).

## [ERC20 asset bridge](./interfaces/IERC20_Bridge_Logic.md)

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Used for depositing ERC-20 tokens in to a Vega network.


To read more about how the bridge works, [see this blog post ↗](https://blog.vega.xyz/vega-erc20-bridge-331a5235efa2). If you're looking for a way to deposit tokens from Sepolia on to the Fairground testnet, head over to [Fairground Console ↗](https://console.fairground.wtf).

## [Multisig Control](./interfaces/IMultisigControl.md)

<EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} />

Used to control the ownership of bridge contracts, allowing the validators of a Vega network to control which assets can be used with the bridge, and approve asset withdrawals.