---
title: Overview
---


There are three main components to the Vega <-> Ethereum bridge

## [Staking bridge](./interfaces/IStake)
Allows users to stake locked or unlocked Vega tokens.

* Source & ABIs: [vegaprotocol/Staking_Bridge](https://github.com/vegaprotocol/Staking_Bridge)
* Ropsten: `0xF5A3830F002BE78dd801214F5316b677E0355c60` ([View on Etherscan](https://ropsten.etherscan.io/address/0xF5A3830F002BE78dd801214F5316b677E0355c60))

For an introduction to staking on Vega, [see this blog post](https://blog.vega.xyz/staking-on-vega-17f22113e3df).

## [ERC20 asset bridge](./interfaces/IERC20_Bridge_Logic)
Used for depositing ERC20 tokens in to a Vega network.

* Source: [vegaprotocol/MultisigControl](https://github.com/vegaprotocol/MultisigControl).
* Ropsten: `0xF009C66c6afC9661143fD7cE1eDb02c1961a6510` ([View on Etherscan](https://ropsten.etherscan.io/address/0xF009C66c6afC9661143fD7cE1eDb02c1961a6510))

To read more about how the bridge works, [see this blog post](https://blog.vega.xyz/vega-erc20-bridge-331a5235efa2). If you're looking for a way to deposit tokens from Ropsten on to the Fairground testnet, head over to [Fairground Console](https://console.fairground.wtf).

## [Multisig Control](./interfaces/IMultisigControl)
Used to control the ownership of bridge contracts, allowing the validators of a Vega network to control which assets can be used with the bridge, and approve asset withdrawals.

* Source: [vegaprotocol/MultisigControl](https://github.com/vegaprotocol/MultisigControl).

