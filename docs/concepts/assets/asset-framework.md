---
sidebar_position: 2
title: Asset framework
vega_network: TESTNET
hide_title: false
description: Vega supports ERC-20 assets that are added through governance.
---

Vega currently supports using ERC-20 tokens for markets on Vega. Those assets must be [proposed through governance](../governance/asset.md) and pass the voting threshold, and be enabled on the Vega bridge. ERC-20 tokens originate on the Ethereum chain, not the Vega chain. Inter-chain asset interactions between Vega and Ethereum are facilitated through the Ethereum and Arbitrum bridges. 

The assets on Vega are used for margining and settling positions, paying fees, and supplying liquidity on markets. Assets can also be transferred between keys and accounts.

Assets need to be deposited using a bridge contract, and can be withdrawn back into a web3 wallet if they are not being used for margin or a liquidity bond.

## Asset definition
Each asset has a set of defined fields: those that are validated against the origin contract and cannot be changed, and those that provide extra settings specifically for use with Vega.

### Contract-level details
The following fields come from the asset's smart contract. When proposing an asset, what's described in the proposal must match the originating contract.

* **Name**: Asset name, such as Wrapped Ether.
* **Symbol**: Short code for the asset, such as WETH.
* **Total supply**: Total amount of the asset as described on the contract.
* **Decimal places**: Number of decimal places used by the ERC-20 asset on its originating chain. 
* **Contract address**: Token contract's address on the Ethereum network.

### Protocol-level details
These fields are all set in the asset's governance proposal, and can also be changed by governance.

* **Maximum lifetime deposit**: The lifetime deposit limit per public key.
* **Withdrawal delay threshold**: The maximum that someone with the asset can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay, which can be seen on the Ethereum and Arbitrum bridges, per asset. For an asset with a threshold of 1 (the lowest possible decimal amount for the asset), all withdrawals will be subject to the delay.

#### Quantum 
An asset's quantum is a loose approximation of the smallest 'meaningful' amount of that asset. For example the quantity of the asset that would approximately match the value of 1 USD. 

An asset's quantum is set in the governance proposal that enabled the asset for use on Vega. A quantum should be set to a round value.

When a quantum is used, it will rely on a configurable multiplier so that an asset's volatility doesn't negatively impact the relevant feature.

## Asset bridges 
There are thousands of tokens, coins, and assets that could potentially be used to settle markets created on Vega. However, because none of them are native to the Vega chain, there needs to be a mechanism for allowing at least a subset of those assets to be used with Vega.

Asset bridges facilitate using assets from blockchains that aren't Vega. Bridges allow for managing assets in a fully decentralised and extensible way.

When an asset has successfully been proposed and approved through governance, the asset bridge will then need to be updated. Vega validators automatically create a multisig bundle - a collection of signatures indicating their approval of the update. That bundle is then submitted to the bridge before the asset can be deposited and used.

Assets from other chains can also be swapped for assets that are enabled on Vega using Squid router. These assets 

### ERC-20 tokens
The Vega asset bridges target the ERC-20 token standard.

ERC-20 is a ubiquitous smart contract interface that allows users to mint, issue, and transfer tokens safely and easily between users, exchanges, and protocols. Vega users can propose using assets like Tether, USDC, Wrapped BTC, Wrapped ETH, and thousands of other ERC-20 assets.

### Diagram: ERC-20 asset bridge

![ERC-20 asset bridge diagram](/img/concept-diagrams/erc-20-bridge.jpg)

## Asset governance
Assets need to be proposed and pass a governance vote before they can be used on the Vega network. After a new asset vote passes, the change has to be submitted to the asset bridge on Ethereum. Until it has been submitted, no one can start depositing that asset. 

:::note Read more
* [Concept: Asset governance](../governance/asset.md)
* [Tutorial: Proposing an asset](../../tutorials/proposals/new-asset-proposal.md)
* [Tutorial: Proposing a change to an asset](../../tutorials/proposals/update-asset-proposal.md)
:::

## Margin, settlement, and liquidity provision
See the [positions and margin](../trading-on-vega/margin.md) page for details on how margining works. 

See the [settlement](../trading-on-vega/settlement.md) page for information on how settlement is handled.

See the section on [liquidity provision](../liquidity/index.md) for details on the liquidity provision mechanics.


## On-chain network treasury 
Some of the rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens.

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.
