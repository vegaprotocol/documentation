---
sidebar_position: 4
title: Assets
vega_network: MAINNET
hide_title: false
description: Add assets or move network-held funds.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

Assets need to be proposed and pass a governance vote before they can be used on the Vega network.

The protocol currently supports adding ERC-20 assets. Those ERC-20 assets that are successfully validated and pass a governance vote are can be enabled via the Vega bridge. In practice, that means that assets on Vega are deposited from and withdrawn to an external chain.

After a new asset vote passes, the change has to be submitted to the asset bridge on Ethereum. Until it has been submitted, no one can start depositing that asset. 

Certain asset details can also be changed through a governance proposal. While the [contract-level details](../assets/asset-framework.md#contract-level-details) are immutable, the [protocol-level details](../assets/asset-framework.md#protocol-level-details) can be changed.

:::note Learn more
See the tutorials to: 
* [Propose a new asset](../../tutorials/proposals/new-asset-proposal.md)
* [Propose an update to an asset](../../tutorials/proposals/update-asset-proposal.md)
:::

### ERC-20 asset validation
When adding an ERC-20 asset to the bridge, the key details are compared to the smart contract on Ethereum. 

Specifically:
* The contract must be an ERC-20 asset
* The name and symbol must match the contract
* There cannot be multiple assets on a Vega network for the same ERC-20 asset

### Transferring assets
For assets that are held in certain accounts - those with pooled assets, the community determines if the assets should be moved, and how they should be used. Generally speaking, those accounts have accumulated assets from settled markets, market protection movements, or are entirely funded by community members that transfer assets into them.

These proposals give community members a chance to determine what they think the assets should be spent on, whether that's to fund [trading or validator rewards](../trading-on-vega/discounts-rewards.md#trading-rewards), to move money from [insurance pools](../assets/accounts.md#insurance-pool-accounts) into [network treasury accounts](../assets/accounts.md#network-treasury-accounts), or for other purposes.

Transferring assets from network-managed account types can only be initiated by on-chain governance proposals. 

The transfers from those asset pools can be one-off or recurring. A recurring transfer that's initiated by governance can only be cancelled when a governance proposal to cancel it is submitted and passes the governance vote.

To see a full table of which types of transfers can only be initiated through governance, see the [transfers page](../assets/transfers.md#governance-initiated-transfers).

:::info Read more
* [Transfers](../assets/transfers.md)
* [Tutorial: Propose transferring assets](../../tutorials/proposals/asset-transfer-proposal.md)
:::

### Propose an asset transfer
Tokenholders can propose asset transfers from certain accounts, which then need to be voted on by other tokenholders. Not all transfers need to be proposed by governance.

The proposer will need to have at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the market, and staked to a validator. Note, this amount is set through the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideValue={true} />.

If the proposal gets a <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" hideName={true} formatter="percent"/> majority of tokenholder support, then it will be enacted. The required majority is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" hideValue={true} />. It would also need to pass the required participation threshold: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredParticipation" hideName={true} formatter="percent" />.

To propose assets be transferred, you'll need to provide the details required for the transfer to be successful. While some of the fields are free-text, others are constrained by a range set through network parameters, to ensure that the values provided are fit for purpose.

Proposal fields include:
* Source account type: The type of account that the assets are to be transferred from, such as the network treasury
* Source: The actual account ID. For network treasury, leave it blank.
* Asset: Asset to transfer
* Transfer type, which can be 'all or nothing' or 'best effort'
  * All or nothing: Transfers the specified amount, or nothing 
  * Best effort: Transfers the specified amount or the max allowable amount if it's less than the specified amount
* Amount: Maximum amount to transfer; can be used to add an upper limit the fractional amount described below
* Fraction of balance: Maximum fraction of the source account's balance to transfer, submitted as a decimal (i.e. 0.1 = 10% of the balance)
* Destination type: Type of account to transfer to, such as reward pool, individual party, market insurance pool
* Destination: Specific account to transfer to, using an ID or public key. For network treasury, leave it blank.
* If the proposal is for a one-off transfer, it can optionally define a time, based on Vega time, for delivery. If there is no delivery time, it will execute immediately
* If the proposal is for a recurring transfer, it must include a start epoch. It can optionally include an end epoch for the last transfer

#### Calculating amount to be transferred
The final amount transferred is determined based on the inputs into the proposal as well as the values of the relevant network parameters:
* <NetworkParameter frontMatter={frontMatter} param="governance.transfer.max.amount" /> specifies the maximum amount that can be transferred from a source account in a proposal
* <NetworkParameter frontMatter={frontMatter} param="governance.transfer.max.fraction" /> specifies the maximum fraction of the balance that can be transferred from a source account.

The final amount is calculated with the following formula:

```
  transfer_amount = min(
    proposal.fraction_of_balance * source.balance,
    proposal.amount,
    governance.transfer.max.amount,
    governance.transfer.max.fraction * source.balance )
```
