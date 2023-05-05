---
sidebar_position: 10
title: Maintaining the Multisig Contract
sidebar_label: Maintaining Multisig Contract
hide_title: false
vega_network: TESTNET
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


The [Multisig Control](../../api/bridge/interfaces/IMultisigControl.md) contract contains a set of signers whose signatures are required to complete actions on the Ethereum Bridge. The set of signers on the contract should match the set of consensus validators in the network. As validators join or leave the network and the set of consensus validators on the Vega network changes, the signer set on the Multisig Control contract must be updated to alongside those changes to maintain the security of the bridge.

## Identifying when to update the contract

The consensus set of validators on the Vega network can change because of the following:
* The amounts staked to validators change such that a consensus validator is demoted and replaced by a standby validator with more stake
* A consensus validator is showing poor performance and they are demoted and replaced by a more performant standby validator
* The value of the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.tendermint.number" hideValue={true} /> changes causing the size of the consensus set to increase or decrease

Changes to the validator set only occur at the end of an epoch. Whether a node has moved into or out of the consensus set can be tracked using this datanode endpoint https://api.n08.testnet.vega.xyz/api/v2/nodes. The values of a node's `rankingScore.status` and `rankingScore.previousStatus` indicates whether it has been promoted or demoted, and what set it is now part of.


A validator with the following ranking score values will have been *promoted* to a consensus validator and will need to be *added* to the multisig control
```
rankingScore.status == VALIDATOR_NODE_STATUS_TENDERMINT
rankingScore.previousStatus != VALIDATOR_NODE_STATUS_TENDERMINT
```

A validator with the following ranking score values will have been *demoted* to a consensus validator and will need to be *removed* to the multisig control
```
rankingScore.status != VALIDATOR_NODE_STATUS_TENDERMINT
rankingScore.previousStatus == VALIDATOR_NODE_STATUS_TENDERMINT
```

Seeing any validator with the above combination of ranking-score statuses means that action must be taken to prevent rewards from being withheld by the network. If the contract is still not updated and further changes to the consensus set occur then identifying the nodes to add or remove becomes harder.

## How to update the contract

To update the multisig contract by adding or removing a validator, there are two steps:
- Send an `IssueSignatures` transaction into the Vega network to prompt it to issue signatures to add/remove a signer. This signature bundle can be retrieve from a data node
- Submit that signaure bundle to the Multisig Control contract on Ethereum to update the contract


:::note
If you are a node operator and supplied a `--submitter-address` when announcing your node to the network, then signature bundles will be issued automatically and the first step can be skipped.
:::

### Getting the Vega network to issue signatures

To get the Vega network to generate a signature bundle that can be used to add/remove a validator from the multisig contract the following CLI command can be used
```shell
vega wallet transaction send --network NETWORK --wallet WALLET --pubkey PUBKEY TRANSACTION
'{"issueSignatures": {"submitter": "ETH_ADDRESS", "validator_node_id": "NODE_ID", "kind": "NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED"}}'
```

where `TRANSACTION` will be of the following form
```
'{"issueSignatures": {"submitter": "ETH_ADDRESS", "validator_node_id": "NODE_ID", "kind": "KIND"}}'

NODE_ID: the identifier of the node that needs to be added or removed from the Multisig Control contract
ETH_ADDRESS: the Ethereum address that will be used to submit the signature bundle to the Multisig Control contract
KIND: a value that represents whether the node is to be added or remove. It can be either NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED or NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED
```

:::note 
This command *does not allow* the generation of arbitrary add and remove signatures. The Vega network is aware of which nodes need to be added or removed and the transaction will fail if submitted when it's not required.
:::

### Submitting the signature bundles to update the contract

The next step involves submitting the issued signature bundle to the Multisig Control to perform the updates. This can be done using the [multisig signer tool ↗](https://validator-testnet.tools.vega.xyz/). For the transaction to be successful, the Ethereum wallet that you use to connect to the tool *must* must have the same address as the value of `ETH_ADDRESS` used in the previous step.
