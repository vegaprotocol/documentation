---
sidebar_position: 9
title:  Ethereum key rotation
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This is a safety related feature specifically for validators to manage their Ethereum keys. To run the Vega network, validators need three keys: Ethereum, Tendermint and Vega. This section is specifically about the Ethereum key.

There is a mechanism available to rotate from one Ethereum key associated with a validator to another one. It can be used as a safety feature (such as if the current key has been compromised, or rotated for good measure) or for migrating from one Ethereum wallet to another (for example from local key store wallet to [Clef](https://geth.ethereum.org/docs/clef/introduction)).

Rotating to the new Ethereum key is done in the following steps:
1. [Generate a new key](#1-generate-a-new-key---either-by-using-node-wallet-or-clef) - either by using node wallet or Clef (uses Vega node wallet CLI and Clef)
2. [Create and submit Ethereum key rotation transaction](#2-create-and-submit-ethereum-key-rotation-transaction-to-the-network) to the network (uses Vega Wallet CLI)
3. [Reload Ethereum wallet](#3-reload-ethereum-wallet-in-vega-validator-node) in Vega validator node (uses Vega node wallet CLI)
4. [Fetch add/remove key signature](#4-fetch-addremove-key-signature-for-and-submit-them-to-the-network) and submit them to the [MultisigControl bridge](./../api/bridge/interfaces/IMultisigControl)

## Prerequisites:
* Installed [Vega binary ↗](https://github.com/vegaprotocol/vega)
* Running validator node with admin server enabled
* Access to wallet with current Vega node wallet

## Terminology

* **NODE_ID** - ID of the node that is subject to Ethereum key rotation
* **VEGA_PUB_KEY** - Vega public key of the node who is subject to Ethereum key rotation
* **ETH_ADDR** - Current Ethereum address to rotate from
* **ETH_NEW_ADDR** - Newly generated Ethereum address to rotate to
* **TARGET_BLOCK** - The block in which the Ethereum key rotation will take place
* **WALLET_NAME** - Name of wallet that to submit the transaction with
* **SUBMITTER_ADDR** - Ethereum address of the submitter of produced signatures for [MultisigControl bridge](./../api/bridge/interfaces/IMultisigControl). This needs to be an Ethereum account with some Ethereum to pay gas
* **NODE_RPC_ADDR** - RPC address of any validator node in network (example: host-address:3002)
* **NODE_REST_ADDR** - REST API address of any validator node in network (example: host-address:3003)
* **DATA_NODE_REST_ADDR** - REST API address of any data node (example: host-address:3009)
* **CLEF_ADDR** - Address of custom running Clef instance. Required only if Clef wallet is used (example: host-address:8550)

## 1. Generate a new key - either by using node wallet or Clef

### Using regular local store from node wallet

```
vega nodewallet generate --chain ethereum --force
```

The command will output the response below, where the last bit of the file `01236c6afa74d90817d939682215907484cacd05` is the new account address.

To set the **ETH_NEW_ADDR**, take the generated address and prefix it with 0x like so: `0x01236c6afa74d90817d939682215907484cacd05`.

```
walletFilePath:
path-to-wallet/UTC--2022-09-15T16-44-18.243348000Z--01236c6afa74d90817d939682215907484cacd05
```

### Using Clef
First, generate new account in Clef. This step will produce a new account address, referred to as **ETH_NEW_ADDR**. The newly generated account address will be printed to `stdout`.

 ```bash
 clef newaccount
 ```

Next, import the newly generated account in Clef to node wallet.

 ```bash
 vega nodewallet import -c ethereum --eth.clef-address http://$CLEF_ADDR  --clef-account-address $ETH_NEW_ADDR --force
 ```

## 2. Create and submit Ethereum key rotation transaction to the network

```
vega wallet command send --wallet $WALLET_NAME --node-address $NODE_RPC_ADDR --pubkey $VEGA_PUB_KEY '{"ethereumKeyRotateSubmission": {"targetBlock": "'$TARGET_BLOCK'", "newAddress": "'$ETH_NEW_ADDR'", "currentAddress": "'$ETH_ADDR'", "submitterAddress": "'$SUBMITTER_ADDR'"}}'
```

## 3. Reload Ethereum wallet in Vega validator node
When the current block height is getting closer to $TARGET_BLOCK Vega is signalled to use the $ETH_NEW_ADDR. Note: the target block needs to chosen far enough in advance that you can complete the steps before that block height is reached by the chain. 

:::warn 
**PLEASE NOTE**: Reload the wallet approximately 5 blocks before $TARGET_BLOCK. It must be done before $TARGET_BLOCK). This is because the network will produce at the time of the rotation a new signature bundle to add a new signer to [MultisigControl bridge](./../api/bridge/interfaces/IMultisigControl) and it **must** signed with the $ETH_NEW_ADDR key.
:::

Check the currect block height using `curl -s $NODE_REST_ADDR/statistics`.

```
vega nodewallet reload -c ethereum
```

## 4. Fetch add/remove key signature and submit them to the network
Once the Ethereum key rotation inside of Vega network has been done, you need to notify the [MultisigControl bridge](./../api/bridge/interfaces/IMultisigControl) about the change.

First, validate that the key was actually rotated by calling: `curl -s $NODE_REST_ADDR/validators`. The Ethereum key rotation history can be also accessed via data node by calling: `curl -s $DATA_NODE_REST_ADDR/api/v2/vega/keys/ethereum/rotations`.

### Remove signature bundle
Removing the signature bundle will make sure that the old Ethereum address is no longer valid.

The remove signature bundle can be located here: 
```
curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/removed/bundles
```

### Add signature bundle
Add signature bundle will make the new Ethereum valid on the bridge.

The add signature bundle can be located here: 
```
curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/added/bundles
```

### Apply signature bundles
Collected signature bundles have to be submitted from $SUBMITTER_ADDR using Etherscan.
