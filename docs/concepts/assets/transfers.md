---
sidebar_position: 5
title: Transfer assets
hide_title: false
description: Transfers are used to move assets between keys or to accounts.
---

### Transfer assets to keys or accounts
Transfers can be used to move assets from one Vega key to another, or from a Vega key to a specific account, such as a reward pool used for the on-chain network treasury.

Anyone with a Vega public key and assets (such as the VEGA token) can set up a transfer. Those transfers can only be done from a general account the party has control of, using their own funds.

**Each transfer incurs a fee.** The fee is paid to the validators who run the network. The amount of the fee is set with the network parameter <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" />, which defines the proportion of each transfer that's taken as a fee. The fee's subtracted immediately on execution, and is taken on top of the transfer amount.

Transfers can be set up to happen only once, or can happen repeatedly.

:::tip Try it out
Set up transfers with your Vega wallet using the command line. Find out how in the **[transfers guide](../../tutorials/transferring-assets.md)**.
:::

#### Transfer limits
* Each party has a max number of transfers per epoch that they can send, set by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" />. 
* A minimum transfer amount is controlled by the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />, which is dependent on the quantum (smallest possible amount) specified for the asset. To calculate the smallest a transfer can be, multiply the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" hideValue={true} /> by the asset's quantum.

### One-off transfers
A one-off transfer can happen immediately (as soon as it is validated), or be set to happen at a specific time. When you set a delay, the transfer funds are removed from your account immediately and stored in a pool, and then distributed to the destination account once the time you chose is reached.

### Recurring transfers
A party can also set up recurring transfers that will happen at the end of each epoch, and before the next one starts.

A recurring transfer transaction needs to contain the following:
* How much is available to transfer
* The starting epoch for the transfer
* Optionally, the end epoch when the transfers should stop. If it's not specified, the transfer run until cancelled
* The percentage of the full amount to pay each epoch, which is defined using the factor - a decimal
  - The amount paid at the end of each epoch is calculated using the following formula: `amount = start amount x factor ^ (current epoch - start epoch)`

#### Recurring transfer limits
While a party (public key) can have multiple transfers set up to move assets to different accounts, each party can only have one recurring transfer between two given accounts at the same time. For example, a party can transfer from their general account to Public Key A and Public Key B, but they cannot set up two recurring transfers of different amounts both going to Public Key B.

### Cancel or amend transfers
It's possible to cancel a recurring transfer, but not to amend. If you want to change your transfer, you'll need to cancel the existing transfer and submit a new one.

If the asset used to fund a recurring transfer is depleted, either because the funds have run out or it's less than the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />` x quantum`, then the transfer is cancelled automatically. You'll have to set up a new transfer if you want to keep funding the key/account.
