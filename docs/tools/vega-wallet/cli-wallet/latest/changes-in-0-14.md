---
sidebar_position: 2
title: Breaking change when upgrading to 0.14
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

From version 0.14 onwards, you will need to approve transactions with your Vega Wallet, through the command line. This security measure ensures that only someone with direct access to the wallet can allow transactions to be sent.
 
**Below, find an explanation of changes between the versions.**

:::info
It's recommended that you keep your wallet app updated to the latest version. 
:::

## Submitting a transaction

**Up to version 0.14** 
Submitting transactions did not require any explicit approval from the person managing the Vega wallet when interacting with, for example, the token dApp or APIs.

**Version 0.14.0 onwards**
For every transaction submitted, the wallet will prompt with details of the transaction, and ask if you approve the transaction.

![Prompt for approving a transaction on testnet](/img/software-prompt-images/wallet-approve-transaction-prompt.png)

:::info
You can use the flag `--automatic-consent` to approve all transactions that are submitted while your wallet is running. Once you terminate the wallet process, that consent is withdrawn. 
:::