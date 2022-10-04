---
sidebar_position: 9
title:  How to rotate Ethereum keys
sidebar_label: Rotate Ethereum keys
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Ethereum-Key-Rotation is a safety feature that allows validator nodes to manage their Ethereum keys. Every validator node in the network needs three keys: Ethereum, Tendermint and Vega. This section described to how to dynamically rotate a node's Ethereum key.

Key-rotation is a cryptographic best practise that allows a current in-use key to be replaced by a new, different key. It is an activity that should be performed regularly to guard against an in-use key being unknowingly compromised.

Rotating a Node's Ethereum Key can be done by following the below steps:
1. [Generate a new Ethereum key](#generate-a-new-ethereum-key)
2. [Submit a Ethereum key rotation transaction to the network](#submit-ethereum-key-rotation-transaction-to-the-network)
3. [Reload the node's Ethereum wallet](#reload-ethereum-wallet-in-vega-validator-node)
4. [Confirm the key rotation with a datanode](#confirm-a-successful-key-rotation)
5. [Resolve the key rotation on the MultisigControl Bridge](#resolve-the-key-rotation-on-the-multisig-control-bridge)

## Prerequisites:
* An installed [Vega binary ↗](https://github.com/vegaprotocol/vega)
* A running validator node with its admin server enabled
* The nodewallet passphrases

## Terminology:

* **ETH_ADDR** - The Ethereum address being rotated from
* **ETH_NEW_ADDR** - The Ethereum address being rotated to
* **TARGET_BLOCK** - The block in which the Ethereum key rotation will take place
* **SUBMITTER_ADDR** - An Ethereum address that will submit signatures to the [MultisigControl Bridge](./../../api/bridge/interfaces/IMultisigControl)
* **DATA_NODE_REST_ADDR** - The REST API address of any data node
* **CLEF_ADDR** - If rotating to a Clef Wallet, the address of the custom Clef instance

## Generate a new Ethereum key

Vega supports both local key-store wallets and [Clef](https://geth.ethereum.org/docs/clef/introduction) Wallets. Ethereum key rotation can be performed between wallets of any type. For example you can rotate from an key in a local key-store wallet, to a key generated in a Clef wallet.


### Using the nodewallet local key-store
The below command will generate a new Ethereum key in the local key-store:

```
vega nodewallet generate --chain ethereum --force
```

It will prompt for both the nodewallet's passphrase and the blockchain wallet's passphrase. The output from this command will look as follows:
```
walletFilePath:
VEGA_HOME/node/wallets/ethereum/UTC--2022-09-30T13-38-37.768971000Z--0a2f0f6d4c1daad69193b5816aa6c3ba2ea5d483
registryFilePath:
VEGA_HOME/node/wallets.encrypted
```

**ETH_NEW_ADDR** can be inferred from the `walletFilePath`. 

For example the above case the new Ethereum address will be `0x0a2f0f6d4c1daad69193b5816aa6c3ba2ea5d483`


### Using a Clef Wallet
The below command will generate a new Ethereum key inside a clef instance: 

 ```bash
 clef newaccount
 ```
The output of the command will print **ETH_NEW_ADDR**. This wallet and key can then be imported into the nodewallet using the below command:

 ```bash
 vega nodewallet import -c ethereum --ethereum-clef-address http://$CLEF_ADDR  --ethereum-clef-account $ETH_NEW_ADDR --force
 ```

## Submit Ethereum key rotation transaction to the network

The below command will send an Ethereum Key Rotation transaction into the network:

```
vega rotate_eth_key --target-block=$TARGET_BLOCK --submitter=$SUBMITTER_ADDR --rotate-from=$ETH_ADDR
```

**TARGET_BLOCK** is the block-height at which the key-rotation will occur in the Vega network and must be a block in the future. It is advised to choose a block-height that will be at a time where the below steps can be completed, and one that will not be close to an epoch boundary.
## Reload Ethereum wallet in Vega validator node
Once the network reaches **TARGET_BLOCK** it will rotate the keys associating **ETH_NEW_ADDR** with the node. It is at this time that the following command needs to be run to rotate the key on the node itself:
```
vega nodewallet reload -c ethereum
```

:::warning
Whereas it is not necessary to reload the nodewallet exactly at **TARGET_BLOCK** doing so significantly early or significantly late may affect the nodes performance scores and therefore the reward payout to that node
:::

## Confirm a successful key rotation

To confirm that the key rotation occurred and to see that **ETH_NEW_ADDR** is now acknowledged by the network as the node's new Ethereum key, there are two end-points on a datanode that can be used:

```
# this will show the details of all key rotations that have happened
$DATA_NODE_REST_ADDR/api/v2/vega/keys/ethereum/rotations`

# this will show the Ethereum key of each node and should now show ETH_NEW_ADDR
$DATA_NODE_REST_ADDR/api/v2/nodes`
```

Now that the Ethereuem key rotation is complete the node will produce signatures bundles using the new Ethereum Key from the new Ethereum nodewallet. 

## Resolve the key-rotation on the MultisigControl bridge

This section only applies if you are a Consensus Validator and your original Ethereum key is listed as a signer on the MultisigControl contract.

As a result of the key rotation process the network emits signature bundles that can be used to update the keys on the MultisigControl bridge. You need to notify the [MultisigControl Bridge](./../../api/bridge/interfaces/IMultisigControl) about the change by submitting signature bundles to remove **ETH_ADDR** and add **ETH_NEW_ADDR**

:::warning
Failure to remove **ETH_ADDR** or add **ETH_NEW_ADDR** before the end of the epoch will result in no reward payout for the node
:::

### Retrieving the signature bundles from a datanode

The below two commands will return a signature bundle that will remove **ETH_ADDR** from the bridge and add **NEW_ETH_ADDR**, respectively:
```
curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/removed/bundles?submitter=$SUBMITTER_ADDR

curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/added/bundles?submitter=$SUBMITTER_ADDR
```

These signature bundles must be submitted to the MultisigControl bridge, and are cryptographically tied to **SUBMITTER_ADDR**. They can only be submitted to the contract using **SUBMITTER_ADDR**.

### Requesting new signature bundles

If there is a reason that the signature bundles emitted for **SUBMITTER_ADDR** cannot be used, for example the wallet containing **SUBMITTER_ADDR** has been lost, it is possible to request from the network more signature bundles for a different **SUBMITTER_ADDR**.

Using the node's Vega wallet, the below command can be sent to the network to prompt the generation of new signature bundles: 
```
{
    "issueSignatures": 
        {
            "submitter": "'$SUBMITTER_ADDR'", 
            "validatorNodeId": "'$NODE_ID'", 
            "kind": "REMOVE"
        }
}
```

These can then also be retrieved from a datanode.