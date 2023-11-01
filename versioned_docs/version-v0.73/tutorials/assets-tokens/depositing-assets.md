---
title: Deposit assets
sidebar_position: 2
hide_title: false
description: How to deposit assets from an Ethereum wallet to Vega.
vega_network: MAINNET
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';
import EthAddresses from '@site/src/components/EthAddresses';

## What you need
You'll need the following information available:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset

### Bridge address 
The ERC-20 bridge logic address shown is for the Ethereum network that is compatible with the Vega network these docs are pointing to. 

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Contract and bridge addresses for the **validator-run testnet networks**, and for **mainnet**, in the [networks repo on GitHub ↗](https://github.com/vegaprotocol/networks).

## Confirm asset
Ensure the token you want to deposit is listed:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Read Contract"
* Click "is_asset_listed"
* Paste in the ERC20 token address and click "Query"
* Ensure the result says "true"

## Approve spend
Approve bridge to 'spend' the token:

* Go to etherscan.io/address/[erc20_token_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "approve"
* Under "spender" paste the erc20_bridge_logic_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeroes to account for the asset's decimals)
* Click "Write" and follow the wallet prompts

## Run deposit function
Run the deposit asset function:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "deposit_asset"
* Under "asset_source" paste in erc20_token_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeroes)
* Under "vega_public_key" paste in your Vega wallet public key
* Click "Write" and follow the wallet prompts

✅ Your deposit is then complete and your assets will be available to use on Vega.