---
sidebar_position: 10
title: Maintaining the Multisig Contract
sidebar_label: Maintaining Multisig Contract
hide_title: false
vega_network: TESTNET
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import EthAddresses from '@site/src/components/EthAddresses';


The [Multisig Control](../../api/bridge/interfaces/IMultisigControl.md) contract contains a set of signers whose signatures are required to complete actions on the Ethereum bridge. The set of signers on the contract should match the set of consensus validators in the network. As validators join or leave the network and the set of consensus validators on the Vega network changes, the signer set on the Multisig Control contract must be updated alongside those changes to maintain the security of the bridge.

## Identifying when to update the contract

The consensus set of validators on the Vega network can change because of the following:
* The amounts staked to validators change such that a consensus validator is demoted and replaced by a standby validator with more stake
* A consensus validator is showing poor performance and they are demoted and replaced by a more performant standby validator
* The value of the network parameter <NetworkParameter frontMatter={frontMatter} param="network.validators.tendermint.number" hideValue={true} /> changes causing the size of the consensus set to increase or decrease

Changes to the validator set only occur at the end of an epoch. Whether a node has moved into or out of the consensus set can be tracked using the [List Nodes](../../api/rest/data-v2/trading-data-service-list-nodes.api.mdx) API. The values of a node's `rankingScore.status` and `rankingScore.previousStatus` indicates whether it has been promoted or demoted, and what set it is now part of.

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

:::caution Rewards will be withheld
Seeing any validator with the above combination of ranking-score statuses means the Multisig Control must be updated to prevent rewards from being withheld by the network. If the contract is still not updated and further changes to the consensus set occur then identifying the nodes to add or remove becomes harder.
:::

## How to update the contract

To update the multisig contract by adding or removing a validator, there are two steps:
- Send an `IssueSignatures` transaction into the Vega network to prompt it to issue signatures to add/remove a signer. This signature bundle can be retrieved from a data node
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
KIND: a value that represents whether the node is to be added or removed. It can be either NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED or NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED
```

:::note 
This command *does not allow* the generation of arbitrary add and remove signatures. The Vega network is aware of which nodes need to be added or removed and the transaction will fail if submitted when it's not required.
:::

### Submit the signatures to the contract

After sending in the `IssueSignature` command the signatures will become available through a data node API and then can be submitted to Ethereum to update the Multisig Control contract.

#### Adding a signer

If you are trying to *add* a validator node to the contract and set `kind` to `NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED` in the previous step, then use [List ERC-20 multi-sig signer added bundles](../../api/rest/data-v2/trading-data-service-list-erc-20-multi-sig-signer-added-bundles.api.mdx).

An example repsonse is below, 
```json
{
  "bundles": {
    "edges": [
      {
        "cursor": "string",
        "node": {
          "epochSeq": "string",
          "nonce": "string",
          "newSigner": "string",
          "signatures": "string",
          "submitter": "string",
          "timestamp": "string"
        }
      }
    ],
    "pageInfo": {
      "endCursor": "string",
      "hasNextPage": true,
      "hasPreviousPage": true,
      "startCursor": "string"
    }
  }
}
```

where the values of the fields `newSigner`, `nonce` and `signatures` will be needed to submit the signatures to Ethereum. This can be done programatically in code using Web3 utilises and packages for your language of choice. 

Alternatively they can also be submitted through Etherscan by naviagating to the contract address <EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} /> and clicking on the tabs `Contract` followed by `Write Contract`, and then expanding then `add_signer` function. 

:::note
The Ethereum wallet you use to connect to Etherscan, or use to submit the transaction programatically, must have the address that matches the `submitter` fields returned by the data node's API
:::

#### Removing a signer

If you are trying to *remove* a validator node to the contract and set `kind` to `NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED` in the previous step, then use [List ERC-20 multi-sig signer removed bundles](../../api/rest/data-v2/trading-data-service-list-erc-20-multi-sig-signer-removed-bundles.api.mdx).

An example repsonse is below
```json
{
  "bundles": {
    "edges": [
      {
        "cursor": "string",
        "node": {
          "epochSeq": "string",
          "nonce": "string",
          "oldSigner": "string",
          "signatures": "string",
          "submitter": "string",
          "timestamp": "string"
        }
      }
    ],
    "pageInfo": {
      "endCursor": "string",
      "hasNextPage": true,
      "hasPreviousPage": true,
      "startCursor": "string"
    }
  }
}
```

where the values of the fields `oldSigner`, `nonce` and `signatures` will be needed to submit the signatures to Ethereum. This can be done programatically in code using Web3 utilises and packages for your language of choice. 

Alternatively they can also be submitted through Etherscan by naviagating to the contract address <EthAddresses frontMatter={frontMatter} show={["MultisigControl"]} /> and clicking on the tabs `Contract` followed by `Write Contract`, and then expanding then `remove_signer` function. 

:::note
The Ethereum wallet you use to connect to Etherscan, or use to submit the transaction programatically, must have the address that matches the `submitter` fields returned by the data node's API
:::
