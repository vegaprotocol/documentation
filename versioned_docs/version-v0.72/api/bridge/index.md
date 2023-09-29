---
title: Overview
vega_network: MAINNET
sidebar_position: 1
---

import EthAddresses from '@site/src/components/EthAddresses';

These are the smart contracts that make up the Vega <-> Ethereum interface

## [ERC20 Bridge Logic](./interfaces/IERC20_Bridge_Logic.md)
<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Contains the functions necessary to deposit, withdraw, list assets, etc. It is controlled by Multisig Control and controls Asset Pool.

To read more about how the bridge works, [see the Vega ERC20 bridge blog post](https://blog.vega.xyz/vega-erc20-bridge-331a5235efa2).

## ERC20 Asset Pool
<EthAddresses frontMatter={frontMatter} show={["ERC20AssetPool"]} />

Holds deposited assets and remits them to provided addresses based on orders from the assigned Bridge Logic. It is controlled by Bridge Logic and Multisig Control

## [Multisig Control](./interfaces/IMultisigControl.md)
<EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} />

Handles verification of transactions signed by a threshold of validators. Used to control the ownership of bridge contracts, allowing the validators of a Vega network to control which assets can be used with the bridge, and approve asset withdrawals.

## [Staking Bridge](./interfaces/IStake.md)
<EthAddresses frontMatter={frontMatter} show={["StakingBridge"]} />

Allows users to deposit and withdraw VEGA tokens for staking. The VEGA tokens are always controlled only by the tokenholder, even when on the Staking Bridge. Stake can be removed at any time by the tokenholder. Note that locked tokens are staked directly from the [vesting contract](#vesting), as they cannot be moved until they are unlocked and redeemed.

For an introduction to staking on Vega, [check out our Concepts section](../../concepts/vega-chain/proof-of-stake.md#bridges-used-for-staking) or for a higher level overview [see this blog post ↗](https://blog.vega.xyz/staking-on-vega-17f22113e3df).

## [ERC20 asset bridge](./interfaces/IERC20_Bridge_Logic.md)
<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

The ERC20 token smart contract for VEGA token.

## Vesting
<EthAddresses frontMatter={frontMatter} show={["VestingBridge"]} />

All VEGA tokens are issued through this. Handles the linear vesting of VEGA tokens and allows users to stake VEGA they hold within the vesting contract, regardless of whether they have already vested or not.

To read more about how the bridge works, [see this blog post ↗](https://blog.vega.xyz/vega-erc20-bridge-331a5235efa2).

## [Multisig Control](./interfaces/IMultisigControl.md)

<EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} />

Used to control the ownership of bridge contracts, allowing the validators of a Vega network to control which assets can be used with the bridge, and approve asset withdrawals.
