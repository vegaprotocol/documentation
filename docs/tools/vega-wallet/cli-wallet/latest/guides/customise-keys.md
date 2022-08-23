---
sidebar_position: 3
title: Customise key details
hide_title: false
description: Add metadata to your keys to help you identify each key pair
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Use metadata to help identify your keys, or add other details for your key management. 

:::info 
You can see a list of available commands by running `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows. Help is also available for every command, for example: `vegawallet key -h` will provide information about the `key` command, and `vega wallet key annotate -h` will describe the `annotate` subcommand.
:::

## Give a name to a key pair

Use the metadata field `name` to give your key a label that means something to you. This name will be displayed by Vega interfaces like the token dApp and Vega Console. 

To give your key a name, use the following command:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet key annotate --wallet "MY_WALLET_NAME" --meta "name:MY_KEY_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>

<TabItem value="mac" label="MacOS">

```bash
./vegawallet key annotate --wallet "MY_WALLET_NAME" 
/ --meta "name:MY_KEY_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>

<TabItem value="linux" label="Linux">

```bash
./vegawallet key annotate --wallet "MY_WALLET_NAME" 
/ --meta "name:MY_KEY_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
</Tabs>

 
## Add metadata to your keys

For better key management, you may want to add other metadata to your key pairs. Metadata is a list of key-value pairs. A key-value is colon-separated, and the key-values are comma-separated. 

Examples: 
* If you wanted to add an item to remind you that you use a specific key pair for staking, you could create a key of `purpose`, with a value of `staking`. In that case, you would annotate your key pair with `--meta "purpose:staking"`. 
* If you wanted two metadata on your key, format them as such: `--meta "key1:value1;key2:value2"`. Adding a name and purpose would be formatted as: `--meta "name:my_key;purpose:staking"`. 

:::info
This command does not insert the new metadata alongside existing metadata items, **it
replaces them**. If you want to keep the previous metadata, be sure to add them
to your update.
:::

Note: Your metadata must be formatted with " ". 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet key annotate --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --meta "key:value" 
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet key annotate --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --meta "key1:value1;key2:value2" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet key annotate --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --meta "key1:value1;key2:value2" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
</Tabs>

## Remove all metadata

You can remove all the metadata from a key pair using the following command:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet key annotate --wallet "MY_WALLET" --pubkey "MY_PUBLIC_KEY" --clear
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet key annotate --wallet "MY_WALLET" --pubkey "MY_PUBLIC_KEY" --clear
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet key annotate --wallet "MY_WALLET" --pubkey "MY_PUBLIC_KEY" --clear
```
</TabItem>
</Tabs>