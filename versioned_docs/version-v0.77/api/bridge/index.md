---
title: Overview
vega_network: MAINNET
sidebar_position: 1
---

import EthAddresses from '@site/src/components/EthAddresses';


## Ethereum
These are the smart contracts that make up the Vega <-> Ethereum interface

### [ERC20 Bridge Logic](./interfaces/IERC20_Bridge_Logic.md)
<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Contains the functions necessary to deposit, withdraw, list assets, etc. It is controlled by Multisig Control and controls Asset Pool.

### ERC20 Asset Pool
<EthAddresses frontMatter={frontMatter} show={["ERC20AssetPool"]} />

Holds deposited assets and remits them to provided addresses based on orders from the assigned Bridge Logic. It is controlled by Bridge Logic and Multisig Control

### [Multisig Control](./interfaces/IMultisigControl.md)
<EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} />

Handles verification of transactions signed by a threshold of validators. Used to control the ownership of bridge contracts, allowing the validators of a network to control which assets can be used with the bridge, and approve asset withdrawals.

### [Staking Bridge](./interfaces/IStake.md)
<EthAddresses frontMatter={frontMatter} show={["StakingBridge"]} />

Allows users to deposit and withdraw VEGA tokens for staking. The VEGA tokens are always controlled only by the tokenholder, even when on the Staking Bridge. Stake can be removed at any time by the tokenholder.

### [ERC20 asset bridge](./interfaces/IERC20_Bridge_Logic.md)
<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

The ERC20 token smart contract for VEGA token.

### [Multisig Control](./interfaces/IMultisigControl.md)

<EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} />

Used to control the ownership of bridge contracts, allowing the validators of a network to control which assets can be used with the bridge, and approve asset withdrawals.

## Arbritrum
Assets can also be bridged from [Arbitrum ↗](https://arbitrum.io/). The following contracts make up the Vega <-> Arbitrum interface.

### [Bridge Logic](./interfaces/IERC20_Bridge_Logic.md)
<EthAddresses frontMatter={frontMatter} show={["ArbitrumBridge"]} />

Contains the functions necessary to deposit, withdraw, list assets, etc. 

### [Multisig Control](./interfaces/IMultisigControl.md)

<EthAddresses frontMatter={frontMatter} show={["ArbitrumMultisigControl"]} />

Used to control the ownership of bridge contracts, allowing the validators of a network to control which assets can be used with the bridge, and approve asset withdrawals.
