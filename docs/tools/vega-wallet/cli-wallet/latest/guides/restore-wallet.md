---
sidebar_position: 1
title: Restore a wallet
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There are some situations in which you'll need to restore a wallet you previously created in order to access your keys:
* If you're on a new computer, or restored your machine
* If you deleted the wallet app
* If you are updating from release 0.9.0, (including 0.9.0-preN) or older

:::info
You can see a list of available commands by running `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows. Help is also available for every command, for example: `vegawallet import -h` will provide information about the `import` command.
:::

## Restore a wallet

Use your recovery phrase to restore a wallet with the `import` command. If you were not provided with a recovery phrase or have lost it, you will need to create a new wallet and generate new keys. Use the command below to import the plain-text file with your recovery phrase in it.

You can use your previous wallet name or choose a new one. You'll also need to choose a passphrase.

:::info
Because keys are generated in a deterministic way, when you restore your wallet, the first key from your previous wallet will be restored too. Other keys can be restored using `vegawallet key generate`.
:::

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet import --wallet "MY_WALLET_NAME" --recovery-phrase-file "PATH_TO_MY_RECOVERY-PHRASE"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet import \
    --wallet "MY_WALLET_NAME" \
    --recovery-phrase-file "PATH_TO_MY_RECOVERY_PHRASE"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet import \
    --wallet "MY_WALLET_NAME" \
    --recovery-phrase-file "PATH_TO_MY_RECOVERY_PHRASE"
```
</TabItem>
</Tabs>

It will then prompt you to **input a passphrase**, and then **confirm that passphrase**. You'll use this wallet name and passphrase to login to the token site and Vega Console.

Once you've imported your wallet, you can carry on with running it and interacting with the network.

## Common errors

### I restored my wallet but the generated keys are different.
* Make sure you used the right recovery phrase for that wallet. If your recovery phrase is incorrect, it will either fail or you will end up creating a new wallet with new keys.
* If your wallet is version 1, restore it using the `--version` flag. See the instructions below.

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet import --wallet "MY_WALLET_NAME" --recovery-phrase-file "PATH_TO_MY_RECOVERY-PHRASE" --version 1
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet import \
    --wallet "YOUR_WALLET_NAME" \
    --recovery-phrase-file "PATH_TO_MY_RECOVERY_PHRASE" --version 1
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet import \
    --wallet "YOUR_WALLET_NAME" \
    --recovery-phrase-file "PATH_TO_MY_RECOVERY_PHRASE" --version 1
```
</TabItem>
</Tabs>


More guidance: [Create a Wallet walkthrough - Step 3](../create-wallet#3-choose-a-network)
