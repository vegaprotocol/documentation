---
title: Deposit assets
sidebar_position: 2
hide_title: false
description: How to deposit assets from an Ethereum wallet to Vega.
vega_network: TESTNET
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';
import EthAddresses from '@site/src/components/EthAddresses';

## Manually depositing using Etherscan

### What you need
You'll need the following information available:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset

### Bridge address 
The ERC-20 bridge logic address shown is for the Ethereum network that is compatible with the Vega network these docs are pointing to. 

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Contract and bridge addresses for the **validator-run testnet networks**, and for **mainnet**, in the [networks repo on GitHub ↗](https://github.com/vegaprotocol/networks).

### Confirm asset
Ensure the token you want to deposit is listed:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Read Contract"
* Click "is_asset_listed"
* Paste in the ERC20 token address and click "Query"
* Ensure the result says "true"

### Approve spend
Approve bridge to 'spend' the token:

* Go to etherscan.io/address/[erc20_token_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "approve"
* Under "spender" paste the erc20_bridge_logic_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeroes to account for the asset's decimals)
* Click "Write" and follow the wallet prompts

### Run deposit function
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


## Code samples for depositing
If you want to build a UI or script for depositing, see the following code samples to get started with building your integration.

The code samples below use testnet networks on Vega and Ethereum.

:::warn Keep your keys safe
Don't save your private key in GitHub or any other publicly available place.
:::

### What you need
Collect the following information:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset
* Bridge smart contract ABI in JSON
* Chain ID - See the [wallet API instructions](../../api/vega-wallet/how-to/connect-to-local-service.md#3-verify-which-network-the-service-is-connected-to)

To get the contract ABI JSON
1. Visit the smart contract. Confirm you are using the correct smart contract.
* [Sepolia testnet]
* [Ethereum mainnet](https://etherscan.io/address/0x23872549cE10B40e31D6577e0A920088B0E0666a#code)
2. Scroll down to Contract ABI
3. Click on Export ABI and choose JSON Format

* how to find the chain ID

You'll also need to have set up an Infura, Pokt or another Ethereum rpc endpoint.

### JavaScript code samples 

### Approve spend

```
const { ethers, Contract, Wallet } = require("ethers");
const tokenABI = require("./abis/erc20.json");

// you'll need to get an ethereum rpc endpoint
const URL = "https://sepolia.infura.io/v3/<your infura key>";

// the chain you are interacting with
const CHAIN_ID = 11155111; // seplio

// ethereum wallet private key
const PRIVATE_KEY = "<your private key>";

// testnet VEGA
const ASSET_ADDRESS = "0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9";

// spender is the collateral bridge address
const SPENDER = "0xcC68d87cAEF9580E3F383d6438F7B3F2C71E3fe5";

// amount in lowest denomination this is is equivalient to
// 0.000000000000000001 VEGA
const AMOUNT = "1";

// create json rpc provider
const provider = new ethers.JsonRpcProvider(URL, CHAIN_ID);

// create signer
const signer = new Wallet(PRIVATE_KEY, provider);

// instantiate token contract
const tokenContract = new Contract(ASSET_ADDRESS, tokenABI, signer);

const tx = await tokenContract.approve(SPENDER, AMOUNT);

console.log("approve tx", tx);
```

### Run deposit

```
const { ethers, Contract, Wallet } = require("ethers");
const collateralABI = require("./abis/collateral-bridge.json");

// you'll need to get an ethereum rpc endpoint
const URL = "https://sepolia.infura.io/v3/<your infura key>";

// the chain you are interacting with
const CHAIN_ID = 11155111; // sepolia

// address of the Vega collateral bridge smart contract
const VEGA_COLLATERAL_BRIDGE_ADDRESS =
  "0xcC68d87cAEF9580E3F383d6438F7B3F2C71E3fe5";

// ethereum wallet private key
const PRIVATE_KEY = "<your private key>";

// testnet VEGA
const ASSET_ADDRESS = "0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9";

// amount in lowest denomination this is is equivalient to
// 0.000000000000000001 VEGA
const AMOUNT = "1";

// public key you wish to send assets to
const VEGA_PUBLIC_KEY =
  "a4b6e3de5d7ef4e31ae1b090be49d1a2ef7bcefff60cccf7658a0d4922651cce";

// create json rpc provider
const provider = new ethers.JsonRpcProvider(URL, CHAIN_ID);

// create signer
const signer = new Wallet(PRIVATE_KEY, provider);

// instantiate bridge contract
const bridgeContract = new Contract(
  VEGA_COLLATERAL_BRIDGE_ADDRESS,
  collateralABI,
  signer
);

// amount must be lowest denomination
// note you won't see the asset in your Vega account immediately because
//
// - you must wait for the necessary number of confirmations on the Ethereum
//   chain. This is set by the newtork parameter: blockChains.ethereumConfig.confirmations
// - you must wait for Vega to pick up the successful deposit and credit your account
const tx = await bridgeContract.deposit_asset(
  ASSET_ADDRESS,
  AMOUNT,
  "0x" + VEGA_PUBLIC_KEY
);

console.log("deposit tx", tx);
```
