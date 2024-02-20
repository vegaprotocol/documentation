---
sidebar_position: 1
title: Create a wallet
hide_title: false
description: Set up your first wallet and keypair using the CLI wallet app
vega_network: MAINNET
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { NetworkConfigAddress, NetworkConfigAddressText } from '@site/src/components/NetworkConfigAddress';
import CodeBlock from '@theme/CodeBlock';
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

To download Vega Wallet and create your wallet, follow the step-by-step instructions below. 

:::caution Wallet version
These instructions cover Vega Wallet version 0.74.3, which is compatible with Vega network(s) that are on 0.74.3. If you need a Vega Wallet for testnet, see [Create a wallet (testnet)](https://docs.vega.xyz/docs/mainnet/tools/vega-wallet/cli-wallet/create-wallet).
:::

Note: If you are looking for instructions for connecting your hardware wallet to MetaMask, see [MetaMask's guide ↗](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

## 1. Install and run Vega Wallet

### Download file

**Download and save the `vegawallet` zip file from [Vega software releases ↗](https://github.com/vegaprotocol/vega/releases/)**. Keep track of where you've saved the file, because that's where the command line interface will look for it.

:::note You may need to change your system preferences to run the file. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

Download `vegawallet-windows-amd64.zip`

You may need to change your system preferences for this specific instance, in order to run Vega Wallet. If you open the file from downloads, you may get a message from Windows Defender saying it prevented an unrecognised app from starting.

Click on the (More info) text, which will reveal the option to "Run anyway".
</TabItem>
<TabItem value="mac" label="MacOS">

Download `vegawallet-darwin-amd64.zip`

For Macs with an M1 processor (released since November 2020): 

Download `vegawallet-darwin-arm64.zip`

When you open the file, you may need to change your system preferences for this specific instance, in order to run Vega Wallet. If you open the file from downloads, you may get a message saying "`vegawallet-darwin-amd64` cannot be opened because it is from an unidentified developer".

Click on the `(?)` help button, which will open a window that links you to the `System Preferences`, and instructs you how to allow this software to run.

You’ll need to go to `System Preferences` > `Security & Privacy` > `General`, and choose `Open Anyway`.

[Apple also provides instructions for opening unsigned apps ↗](https://support.apple.com/en-au/guide/mac-help/mh40616/mac)
</TabItem>

<TabItem value="linux" label="Linux">

Download `vegawallet-linux-amd64.zip`
</TabItem>
</Tabs>
:::

#### Antivirus software
If you are running antivirus software, you may need to 'allowlist' or 'whitelist' the Vega Wallet software, so that your antivirus provider doesn't quarantine the software and block you from using it.

## Command line guidance
Use the following instructions in command line. Below, you'll see commands in the code blocks for each operating system. Copy those instructions and paste them into your command line interface.

In your command line interface, you can view a list of available commands by running `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows. Help is also available for every command, for example: `vegawallet create -h` will provide information about the `create` command.

:::info
You'll need to run the commands from the directory you've saved the wallet file in. Use the command `pwd` to find out where your terminal is looking in the file system. Use the command `cd` and the path/to/wallet/directory to tell the command line where to find the file. 
:::

## 2. Generate new wallet

The steps below will guide you through initialising a wallet, and creating new key pairs or importing an existing wallet. 

:::info
To restore a wallet from your recovery phrase, see the [restore a wallet guide](./guides/restore-wallet).
:::

### Initialise the software

The `init` command will initialise the software the first time you use it. This creates the folders and the configuration files needed by the software to operate. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet init
```
</TabItem>

<TabItem value="mac" label="MacOS">

```bash
./vegawallet init
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet init
```
</TabItem>
</Tabs>

### Create your wallet

Next, create a wallet by giving it **a name and passphrase**. 

This step will: 
* create your first public and private key 
* show your wallet's recovery phrase (save this immediately)

Replace `MY_WALLET_NAME` (below) with your chosen wallet name:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet create --wallet "MY_WALLET_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet create --wallet "MY_WALLET_NAME"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet create --wallet "MY_WALLET_NAME"
```
</TabItem>

</Tabs>

It will then prompt you to **input a passphrase**, and then **confirm that passphrase**.

:::warning
Keep your recovery phrase safe and secret. You will need it to import your keys. 

**Your recovery phrase is only shown once ever and cannot be recovered. DO NOT SHARE YOUR RECOVERY PHRASE.**
:::

## 3. Choose a network
If you want to interact with the governance dApp or Vega Console, you'll need to import network configuration for the network(s) you want to connect to.

### Import networks

Import the following network configurations: 

* **Mainnet** network (run by validators): <NetworkConfigAddress frontMatter={frontMatter} label="mainnet1.toml" network="mainnet"/>
* **Fairground** network: <NetworkConfigAddress frontMatter={frontMatter} label="fairground.toml" network="fairground"/>

:::info
To update your networks list, see [manage networks](../cli-wallet/guides/manage-networks.md) for instructions.
::: 

#### Import networks from URL

Use the following command to import from URL. 

*The URL used below is for mainnet, update the URL if you want to import a different network.*

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

<CodeBlock language="bash">
vegawallet network import --from-url {NetworkConfigAddressText(frontMatter.vega_network)}
</CodeBlock>

</TabItem>
<TabItem value="mac" label="MacOS">

<CodeBlock language="bash">
./vegawallet network import \{'\n'}
&nbsp;&nbsp;--from-url {NetworkConfigAddressText(frontMatter.vega_network)}
</CodeBlock>

</TabItem>
<TabItem value="linux" label="Linux">
<CodeBlock language="bash">
./vegawallet network import \{'\n'}
&nbsp;&nbsp;--from-url {NetworkConfigAddressText(frontMatter.vega_network)}
</CodeBlock>


</TabItem>
</Tabs>

#### Import networks from file

Alternatively you can import a network list from a text file. You can use the '.toml' files linked above as a template for your networks list. Use the following command to import from file: 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network import --from-file "PATH_TO_FILE"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network import --from-file "PATH_TO_FILE"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import --from-file "PATH_TO_FILE"
```
</TabItem>

</Tabs>

:::info
Each network has a default name. You can rename the network using the `--with-name` flag. 
:::

### List imported networks

To see the names of the networks you imported, run the following command: 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network list
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network list
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network list
```
</TabItem>

</Tabs>

## 4. Run the wallet

For applications to be able to talk to your wallet, you will need to run the service. Every time you run the service, you will have to choose which network you need. Choose the network name from the list in step 3.

To choose a network and run the wallet, use the following command: 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet service run --network "NETWORK_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet service run --network "NETWORK_NAME"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet service run --network "NETWORK_NAME"
```
</TabItem>
</Tabs>

:::info
To terminate the process, if you want to run other commands in Vega Wallet for example, use `ctrl+c`.
:::

## 5. Approve transactions

You will need to use your wallet to approve any transactions that you create for the Vega network. You might create those transactions through the governance dApp or when using the APIs, for example. 

When a transaction is submitted, you will receive a prompt asking if you want to approve the transaction. 

Choose `y` to approve or `n` to reject the transaction.

### Pre-approve transactions

Alternatively, you can automatically approve all transactions that are created, by skipping the review, while the wallet is running with the auto-consent flag: 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet service run --network "NETWORK_NAME" --automatic-consent
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet service run --network "NETWORK_NAME" --automatic-consent
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet service run --network "NETWORK_NAME" --automatic-consent
```
</TabItem>
</Tabs>

## Wallet API
See the [Wallet API documentation](../../../api/vega-wallet/accessing-api.md) if you're looking to use the Vega Wallet with a script or trading bot, or want to integrate with the wallet software.
