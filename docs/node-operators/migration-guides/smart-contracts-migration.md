---
sidebar_position: 9
title: Smart contracts migration
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


With the upgrade of the network to Vega protocol version v0.52.x will come an upgrade of the smart contracts. 

The multisig control contract and the collateral bridge will be upgraded in order to increase users' control over the funds they deposit (opt-out) and performance improvements, such as decreasing gas cost when using the bridge. The Vega asset pool contract will not be upgraded. Once the new contracts are properly set up on Ethereum, the validators will migrate the asset pool to use the new contracts.

This guide will explain, step-by-step, how the Vega team and the validators will upgrade the smart contracts.

You can find the updated code for the smart contracts on the [Multisig Control repo](https://github.com/vegaprotocol/MultisigControl/tree/a421bce980391c6c1509fc621185ca33810709fd).

:::info
The code for all contracts deployed by the Vega team will be uploaded to [etherscan](https://etherscan.io). All the methods to verify information from contracts can be called from there. The Vega team will provide links to the contracts on etherscan once they are deployed and the source code uploaded.
:::

## Deploy the new contracts

### Step 0: Deploy the new multisig control contract (Vega team)
The Vega team will deploy the new multsig control contract. Find the source code for it in the [multisig control solidity file](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol). This contract is used by the Vega network to authorise any action related to the collateral bridge or asset pool.

The deployer of the contract (an ethereum account managed by the Vega team) will, at first, be the only valid signer.

### Step 1: Set the multisig control contract threshold (Vega team)
In order to simplify the next steps, we will reduce the threshold required for each signature to the minimum. This will allow the Vega team to set up the contract properly (e.g: adding new signers) by only requiring a single signature. This will be updated again before the upgrade is finalised.

The [`set_threshold`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L32-L42) method will be used to update the threshold.

### Step 2: Add all existing validators to the multisig control contract (Vega team)
To set up the new contract in the same  way as the previous version, all current validators on the Vega network will be added to the new contract as valid signers. This will be done using the [`add_signer`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L50-L61) method.

### Step 3: Update the threshold to 667 (Vega team and validators)
At this point, with only validators in the validator set, we will need to set the multisig control to require at least 2/3 of validator signatures to authorise any action on the bridge. We will again use the [`set_threshold`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L32-L42) method to do this.

Each validator will need to provide a signature using the following command:
```
vega bridge erc20 set_threshold --home="/path/to/vega/home" --submitter="VEGA_ACCOUNT" --nonce="UNIQUE_NONCE" --threshold="667"
```
:::note
The `--submitter` and `--nonce` will be provided on Discord prior to the upgrade, as will the final command to be run by the validators.
:::

You can verify the new value of the threshold using the [`get_current_threshold`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L177-L179) method.

### Step 4: Remove the deployer from the signer set (Vega team)
Once all the validators have been added back to the signers set, the Vega account can be removed from the valid signers. This will be done using the [`remove_signer`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L69-L80) method.

You can verify that by calling the [`is_valid_signer`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L183-L185) method on the contract, using the Vega account address (the address will be shared at the time of the upgrade). The result should be `false`. Calling it with any current validator's address should return `true`.

You can also call the [`get_valid_signer_count`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L172-L174) method to get the number of valid signers on the contract. At the time of writing this should be `13` -- the number of validators on Vega.

### Step 5: Confirm the validators have control over the multisig control contract (Vega team and validators)
After the new multisig control has been fully set up, and the validators are the only signers recognised, we will make sure that only the validators can control it.

We will do so by calling the [`burn_nonce`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L87-L91) method on the new multisig control contract. By doing so, the validators will invalidate a nonce, making it impossible to use in the future. Only the current signers on the contract can successfully call this method. Doing so will prove that the validators control the contract exclusively.

First, the validators will need to generate the signature using the following command:
```
vega bridge erc20 burn_nonce --home="/path/to/vega/home" --submitter="0xSOME_ADDRESS" --nonce="SOME_NONCE"
```

:::note
The `--submitter` and `--nonce` parameters will be shared prior to the upgrade.
:::

The Vega team will then submit the signature to the contract. Anyone can call the [`is_nonce_used`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/MultisigControl.sol#L87-L91) method on the contract. Before the call, this should return `false`, and `true` after.

### Step 6: Deploy the collateral bridge contract (Vega team)
The Vega team will then deploy the updated version of the collateral bridge contract. The code can be found in [ERC20 Bridge Logic Restricted](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Bridge_Logic_Restricted.sol).

The contract will be deployed, pointing to the existing [asset pool](https://etherscan.io/address/0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f). This can be verified on [etherscan](https://etherscan.io) as part of the contract constructor arguments.

The address of the new contract will be shared publicly prior to finalising the upgrade.

:::info
At this point, all the new contracts will have been deployed. Validators will need to ensure all information provided and contracts deployed are correct, and notify the Vega team if anything seems incorrect.
:::

## Prepare the signature bundles
To apply the smart contracts, a [checkpoint upgrade](../network-restarts.md) of the network will be required. After the current Vega network is stopped and the upgraded network is started, the asset pool will need to be switched from the previous multisig control and collateral bridge to the new ones.

Before the network is stopped, validators will need to provide the required signature so the Vega team can call the contract as soon as possible, in order to minimise downtime.

### Step 7: Generate the list asset signatures (validators)
The newly deployed bridge will need to be aware of all assets already listed on Vega. The validators will need to provide signatures to allow this.
At this point, only the VEGA token is listed on the network. We will create the signature using the following command:

```
vega bridge erc20 list_asset --home="/path/to/vega/home" --token-address="0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e" --vega-asset-id="d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2" --nonce="UNIQUE_NONCE" --lifetime-limit="LIFETIME_LIMIT" --withdraw-threshold="WITHDRAW_THRESHOLD"
```

:::note
The `--nonce`, `--lifetime-limit` and `--withdraw-threshold` values will be shared prior to the upgrade
:::

### Step 8: Generate the asset pool signatures (validators)
The asset pool will need to be set up to point to the newly deployed bridge and multisig control. To do this, validators will need to provide new signatures.

The signatures will be created using the following commands:

```
vega bridge erc20 set_multisig_control --home="/path/to/vega/home" --new-address="0xNEW_MULTISIG_ADDRESS" --asset-pool-address="0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f" --nonce="UNIQUE_NONCE"

vega bridge erc20 set_bridge_address --home="/path/to/vega/home" --new-address="0xNEW_BRIDGE_ADDRESS" --asset-pool-address="0xf0f0fcda832415b935802c6dad0a6da2c7eaed8f" --nonce="UNIQUE_NONCE"
```

:::note
The `--new-address` and  `--nonce` details will be shared prior to the upgrade.
:::


## Restart the network
At this point, all preparatory work has been done and the following step will need to happen during the network restart, after the current version is shut down, and before the upgraded version is started. See [network checkpoint restarts](../network-restarts.md) for more info.

The validators will stop the network at this point.

:::note
For all the following steps, the Vega team will share the transactions they submitted through links to etherscan.
:::

### Step 9: Update the multisig control on the asset pool (Vega team)
Using the signature created by the validators in `Step 8`, the Vega team will update the multisig control contract used by the asset pool by calling the [`set_multisig_control`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Asset_Pool.sol#L38-L53) method.

The public [`multisig_control_address`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Asset_Pool.sol#L15) variable of the asset pool should be updated to the new address. **Make sure to verify it has been updated.**

### Step 10: Update the bridge on the asset pool (Vega team)
Using the signature created by the validators in `Step 8`, the Vega team will update the collateral bridge used by the asset pool by calling the [`set_bridge_address`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Asset_Pool.sol#L60-L72) method.

The public [`erc20_bridge_address`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Asset_Pool.sol#L18) variable of the asset pool should be updated to the new address. **Make sure to verify it has been updated.**

### Step 11: List the VEGA token on the collateral bridge (Vega team)
Using the signature created previously by the validators in `Step 8`, the Vega team will then list the VEGA token on the collateral bridge using the [`list_asset`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Bridge_Logic_Restricted.sol#L42-L70) method.

The correct execution of this method can be verified by calling the [`is_asset_listed`](https://github.com/vegaprotocol/MultisigControl/blob/a421bce980391c6c1509fc621185ca33810709fd/contracts/ERC20_Bridge_Logic_Restricted.sol#L301-L303) method on the collateral bridge using the token address. **Make sure to verify it is correct.**

### Step 12: Update the genesis file (Vega team and validators)
The Vega team will then submit a pull request on the [networks repository](https://github.com/vegaprotocol/networks) to update the network parameter `blockchain.ethereumConfig` from the genesis with the addresses of the new collateral bridge and multisig control contracts.

The validators can then proceed with restarting the network.
