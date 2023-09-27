---
sidebar_position: 5
title: Transfer assets
hide_title: false
description: Transfers are used to move assets between keys or to accounts.
---

import NetworkParameter from '@site/src/components/NetworkParameter';

## Transfer assets to keys or accounts
Standard transfers can be used to move assets from one Vega key to another, or from a Vega key to a specific account, such as a reward pool used for the on-chain network treasury.

Transfers from certain account types must be proposed through [governance](#governance-initiated-transfers), as they affect network-managed accounts and moving assets to/from those accounts needs to be agreed by the community.

Anyone with a Vega public key and assets (such as the VEGA token) can set up a standard transfer. Those transfers can only be done from a general account the party has control of, using their own funds. Anyone with a Vega public key and enough VEGA tokens can propose assets be transferred from those specific network accounts.

**Each transfer incurs a fee.** The fee is paid to the validators who run the network. The amount of the fee is set with the network parameter <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" />, which defines the proportion of each transfer that's taken as a fee. The fee's subtracted immediately on execution, and is taken on top of the transfer amount.

Transfers can be set up to happen only once, or can happen repeatedly.

:::tip Try it out
* **[Transfers tutorial](../../tutorials/assets-tokens/transferring-assets.md)**: Set up transfers with your Vega wallet using the command line.
:::

### Transfer limits
* Each party has a max number of transfers per epoch that they can send, set by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" />. Once the max transfers limit is reached for a key, any subsequent transactions are rejected until the epoch switches over.
* A minimum transfer amount is controlled by the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />, which is dependent on the quantum (smallest possible amount) specified for the asset. To calculate the smallest a transfer can be, multiply the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" hideValue={true} /> by the asset's quantum.

## One-off transfers
A one-off transfer can happen immediately (as soon as it is validated), or be set to happen at a specific time. When you set a delay, the transfer funds are removed from the account immediately and stored in a pool, and then distributed to the destination account once the time you chose is reached.

## Recurring transfers
A party can also set up, or depending on the account [propose via governance](#governance-initiated-transfers), recurring transfers that will happen at the end of each epoch, and before the next one starts.

A recurring transfer transaction needs to contain the following:
* How much is available to transfer
* The starting epoch for the transfer
* Optionally, the end epoch when the transfers should stop. If it's not specified, the transfer run until cancelled
* The percentage of the full amount to pay each epoch, which is defined using the factor - a decimal
  - The amount paid at the end of each epoch is calculated using the following formula: `amount = start amount x factor ^ (current epoch - start epoch)`

### Recurring transfer limits
While a party (public key) can have multiple transfers set up to move assets to different accounts, each party can only have one recurring transfer between two given accounts at the same time. For example, a party can transfer from their general account to Public Key A and Public Key B, but they cannot set up two recurring transfers of different amounts both going to Public Key B.

## Cancel or amend transfers
It's possible to cancel a recurring transfer, but not to amend. If you want to change your transfer, you'll need to cancel the existing transfer and submit a new one. Transfers initiated by governance will need to be cancelled by submitting a proposal to cancel the transfer.

If the asset used to fund a recurring transfer is depleted, either because the funds have run out or it's less than the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />` x quantum`, then the transfer is cancelled automatically. You'll have to set up a new transfer if you want to keep funding the key/account.

## Governance-initiated transfers
Governance-initiated transfers can be one-off or recurring. A recurring transfer can only be cancelled when a governance proposal to cancel it is submitted and passes the governance vote.

The table below highlights which types of transfers can be done through a governance proposal and vote.

| Source account | Destination account | Proposal required |
| --- | --- | --- |
| Network treasury | Party general account(s) | Yes |
| Network treasury | Party other account types | No |
| Network treasury | Market insurance pool account | Yes |
| Network treasury | Asset insurance pool account | Yes |
| Network treasury | Network treasury | No  |
| Network treasury | Any other account | No |
| Asset insurance pool account | Party general account(s) | Yes  |
| Asset insurance pool account | Network treasury | Yes  |
| Asset insurance pool account | Market insurance pool account | Yes |
| Asset insurance pool account | Reward account | Yes |
| Asset insurance pool account | Any other account | No |
| Market insurance pool account | Party general account(s) | Yes  |
| Market insurance pool account | Network treasury | Yes  |
| Market insurance pool account | Asset insurance pool account | Yes |
| Market insurance pool account | Market insurance pool account | Yes |
| Market insurance pool account | Any other account | No |
| Party account (any type) | Any | No |
| Any other account | Any | No |

:::note Read more
* **[Transfers initiated by governance](../governance.md#transferring-assets)**: Learn about the governance mechanics involved in transfers.
* **[Tutorial: Asset transfer proposal](../../tutorials/proposals/asset-transfer-proposal.md)**: Learn how to propose transferring assets and get a template.
:::