---
sidebar_position: 9
title: Smart contracts migration
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


With the upgrade of the network to the vega protocol version v0.52.x will come an upgrade of the smart contracts. The Multisig control contract and the collateral bridge will be upgraded in order to increase users controls other the funds they deposits (opt-out) and performance improvement (decrease gas cost when using the bridge). The vega asset pool contract will not be upgrade, once the new contracts are properly setup on ethereum, the validators will migrate the asset pool to use the new contracts.

This guide will explain steps by steps how the vega team and the validators will proceed in order to upgrade the smart contracts.

You can find the updated code for the smart contracts [here](https://github.com/vegaprotocol/MultisigControl).

:::info
For all contract deployed by the vega team, the code of the contracts will be uploaded to [etherscan](https://etherscan.io). All the method to verify information from contracts can be called from there. The vega team will provide links to the contracts on etherscan once they are deployed and the source code uploaded.
:::

# Deploy the new contracts

## Step 0: Deploy the new multisig control contract (vega team)
The vega team to deploy the new multig control contract, you can find the source code for it [there](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol). This contract is used by the vega network to authorize any action related to the collateral bridge or asset pool.

The deployer of the contract (an ethereum account own by the vega team) will be at first the only valid signer.

## Step 1: Set the multisig control contract threshold (vega team)
In order to simplify the next steps, we will reduce the threshold required for each signatures to the minimum. This will allow the vega team to setup the contract properly (e.g: adding new signers) with only requiring a single signature, this will be updated again by the end, before the upgrade is finalized.

The [set_threshold](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L32-L42) method will be used in order to update the threshold.

## Step 2: Add all existing validators to the multisig control contract (vega team)
In order to setup the new contract as the previous version, all current validators on the vega network will be added back as allowed signer with the new contract. This will be done using the [add_signer](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L50-L61) method.

## Step 4: Remove the deployer from the signer set (vega team)
Now that all the validators have been added back to the signers set, we can remove the vega account from the valid signers. This will be done using the [remove_signer](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L69-L80) method.

You can verify that by calling the following [is_valid_signer](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L183-L185) method on the contract, using the vega account address (the address will be shared at the time of the upgrade) and the result should be false. Calling it with any current validators address should return true.

You can also call the [get_valid_signer_count](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L172-L174) method to get the number of valid signers on the contract, at the time of writting this should be 13 (as the number of validators on vega).

## Step 5: Update the threshold to 667 (vega team and validators)
At this point only validators should be part of the validator set, we will need to set the multisig control to require at least 2/3 validators signature in order to authorize any action on the bridge. We will use again the [set_threshold](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L32-L42) method to do this.

Each validators will need to provide a signature using the following command:
```
vega bridge erc20 set_threshold --home="/path/to/vega/home" --submitter="VEGA_ACCOUNT" --nonce="AN_UNIQUE_NONCE" --threshold="667"
```
:::note
The `--submitter` and `--nonce` will be provide prior to the upgrade as well as the final command to be run by the validators on discord.
:::

You can verify the new value of the threshold using the [get_current_threshold](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L177-L179) method.

## Step 6: Confirm the validators have control over the multisig control contract (vega team and validators)
Now that the multisig control have been fully setup, and that the validators are the only signers recognised by the bridge we will make sure that the validators can control it.
We will do so by call the [burn_nonce](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L87-L91) method on the bridge. By doing so the validators will invalid an nonce, making it impossible to use in the future. Only the current signers on the contract can successfully call this method, doing so will prove that the validators are controlling the contract exclusively.

The validator will first need to generate the signature using he following command:
```
vega bridge erc20 burn_nonce --home="/path/to/vega/home" --submitter="0xSOME_ADDRESS" --nonce="SOME_NONCE"
```

:::note
The `--submitter` and `--nonce` parameters will be shared prior to the upgrade.
:::

The vega team will then submit the signature to the contract. Anyone can call the [is_nonce_used](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/MultisigControl.sol#L87-L91) method on the contract, before the call this should return false and true after.

## Step 7: Deploy the collateral bridge contract (vega team)
The vega team will now deploy the updated version of the collateral bridge contract, the code can be found at [there](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Bridge_Logic_Restricted.sol).

The contract will be deployed, pointing to the existing [asset pool](https://etherscan.io/address/0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f), this can be verified on [etherscan](https://etherscan.io) as part of the contract constructor arguments.

The address of the new contract will be shared publicly prior to finalizing the upgrade.


:::info
At this point all the new contracts have been deployed. Validators will need to ensure all information provided and contracts deployed are correct, and notify the vega team if anything seems incorrect.
:::

# Prepare the signatures bundles
In order to apply the smart contracts, a [checkpoint upgrade](./network-restarts.md) of the network will be required. After the current vega network is stopped and the upgrade network is started, the asset pool will need to be switched from the previous multisigcontrol and collateral bridge to the new ones.

Before the network is stopped, validators will then provide the required signature so the vega team can call the contract as soon as possible in orde to minimize downtime.

## Step 8: Generate the ListAsset signature (validators)
The newly deployed bridge will need to be aware of all asset already listed on vega, the validators will need to provide signature to allow this.
As of now only the vega token is listed on the network, we will create the signature using the following command:
```
vega bridge erc20 list_asset --home="/path/to/vega/home" --token-address="0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e" --vega-asset-id="d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2" --nonce="NONCE" --lifetime-limit="LIFETIME_LIMIT" --withdraw-threshold="WITHDRAW_THRESHOLD"
```

:::note
The `--nonce`, `--lifetime-limit` and `--withdraw-threshold` arguments values will be shared prior to the upgrade
:::

## Step 9: Generate the asset pool signatures (validators)
The asset pool will need to be setup to point to the newly deployed bridge and multisig control, to do this we will need new signatures from the validators.
The signature will be created using the following commands:
```
vega bridge erc20 set_multisig_control --home="/path/to/vega/home" --new-address="0xNEW_MULTISIG_ADDRESS" --asset-pool-address="0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f" --nonce="NONCE"

vega bridge erc20 set_bridge_address --home="/path/to/vega/home" --new-address="0xNEW_BRIDGE_ADDRESS" --asset-pool-address="0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f"
   --nonce="NONCE"
```

:::note
For both commands, the `--new-address` and  `--nonce` details will be shared prior to the upgrade.
:::


# Restart the network

At this point, all preparatory work has been done and following step will happen during the restart of the network (after the current version is shutdown, before the upgrade version is started). See [network checkpoint restarts](./network-restarts.md) for more info.

:::info
The validators are stopping the network now
:::

:::note
For all following steps, the vega team will share the transactions they submitted through links to etherscan.
:::

## Step 10: Update the multisig control on the asset pool (vega team)
Using the signature created previously by the validators in `Step 9` the vega team will update the multisig control contract used by the asset pool by calling the [set_multisig_control](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Asset_Pool.sol#L38-L53) method.

The public [multisig_control_address](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Asset_Pool.sol#L15) variable of the asset pool should be updated to the new address. Please make sure to verify.

## Step 11: Update the bridge on the asset pool (vega team)
Using the signature created previously by the validators in `Step 9` the vega team will update the collateral bridge used by the asset pool by calling the [set_bridge_address](hhttps://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Asset_Pool.sol#L60-L72) method.

The public [erc20_bridge_address](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Asset_Pool.sol#L18) variable of the asset pool should be updated to the new address. Please make sure to verify.

## Step 12: List the vega asset on the collateral bridge (vega team)
Using the signature created previously by the validators in `Step 8` the vega team will then list the vega token on the collateraly bridge the using [list_asset](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Bridge_Logic_Restricted.sol#L42-L70) method.

The correct execution of this method can be verified by calling the [is_asset_listed](https://github.com/vegaprotocol/MultisigControl/blob/develop/contracts/ERC20_Bridge_Logic_Restricted.sol#L301-L303) method on the collateral bridge using the token address. Please make sure to verify.

## Step 13: Update the genesis file (vega team and validators)
The vega team will now submit a pull request on the [networks repository](https://github.com/vegaprotocol/networks) in order to update the network parameter `blockchain.ethereumConfig` from the genesis with the addresses of the new collateral bridge and multisig control contracts.

:::info
The validators can now proceed with restarting the network
:::
