---
sidebar_position: 1
title: Create and use Vega Wallet
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To download Vega Wallet and create your wallet, follow the step-by-step instructions below. These instructions cover version 0.11, the latest release. You can refer to [documentation for 0.10.0 or earlier](/docs/tools/vega-wallet/CLI-wallet/versions/0.10/create-wallet-v0.10) if you need it. 

This software a work-in-progress and is frequently updated, and does not yet have a user interface. 

Note: If you are looking for instructions for connecting your hardware wallet to MetaMask, see [MetaMask's guide](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

:::caution
You must to use Vega Wallet version 0.9.2 or newer to connect to Vega Mainnet. We recommend always using the latest released version of Vega Wallet. 
::: 

Use the following instructions in command line. Below, in the snippets, you'll see commands in `highlighted text`. Copy those instructions and paste them into your command line interface.

## 1. Install and run latest Vega Wallet version (0.11)

### Download file

**Download and save the zip file from [Vega Wallet software releases](https://github.com/vegaprotocol/vegawallet/releases/)**. Keep track of where you've saved the file, because that's where the command line interface will look for it.

:::note You may need to change your system preferences to run the file. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

Download `vegawallet-windows-amd64.zip`

You may need to change your system preferences for this specific instance, in order to run Vega Wallet. If you open the file from downloads, you may get a message from Windows Defender saying "`vegawallet-windows-amd64` cannot be opened because it is from an unidentified developer".

Click on the (More info) text, which will reveal a button to "Run anyway".
</TabItem>
<TabItem value="mac" label="MacOS">

Download `vegawallet-darwin-amd64.zip`

For Macs with an M1 processor (released since November 2020): 

Download `vegawallet-darwin-arm64.zip`

When you open the file, you may need to change your system preferences for this specific instance, in order to run Vega Wallet. If you open the file from downloads, you may get a message saying "`vegawallet-darwin-amd64` cannot be opened because it is from an unidentified developer".

Click on the `(?)` help button, which will open a window that links you to the `System Preferences`, and instructs you how to allow this software to run.

You’ll need to go to `System Preferences` > `Security & Privacy` > `General`, and choose `Open Anyway`.

[Apple also provides instructions for opening unsigned apps (Apple support)](https://support.apple.com/en-au/guide/mac-help/mh40616/mac)
</TabItem>

<TabItem value="linux" label="Linux">

Download `vegawallet-linux-amd64.zip`
</TabItem>
</Tabs>
:::

:::info
You'll need to run the commands from the directory you've saved the wallet file in. Use the command `pwd` to find out where your terminal is looking in the file system. Use the command `cd` and the path/to/wallet/directory to tell the command line where to find the file. 
:::

## 2. Generate new wallet

The steps below will guide you through initialising a wallet, and creating new key pairs or importing an existing wallet. 

:::info
To restore a wallet from your recovery phrase, see the [restore wallet guide](docs/tools/vega-wallet/CLI-wallet/restore-wallet).
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

Replace `YOUR_WALLET_NAME` (below) with your chosen wallet name:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet create --wallet "YOUR_WALLET_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet create --wallet "YOUR_WALLET_NAME"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet create --wallet "YOUR_WALLET_NAME"
```
</TabItem>

</Tabs>

It will then prompt you to **input a passphrase**, and then **confirm that passphrase**. You'll use this wallet name and passphrase to login to the token site and Vega Console.

:::warning
Keep your recovery phrase safe and secret. You will need it to import your keys. 

**Your recovery phrase is only shown once ever and cannot be recovered. DO NOT SHARE YOUR RECOVERY PHRASE.**
:::

## 3. Choose a network

If you want to interact with the Token dApp or Vega Console, you'll need to import network configuration for the network(s) you want to connect to.

### Import networks

Import the following network configurations: 

* **Mainnet** network (run by validators): [`mainnet1.toml`](https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml)
* **Fairground** network: [`fairground.toml`](https://raw.githubusercontent.com/vegaprotocol/networks/master/fairground/fairground.toml)

:::info
To update your networks list, see [manage networks](docs/tools/vega-wallet/CLI-wallet/manage-networks/#update-networks) for instructions.
:::

#### Import networks from URL

Use the following command to import from URL. 

**The URL used below is for mainnet, update the URL if you want to import a different network.*

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network import --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network import \
    --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import \
     --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
</Tabs>

#### Import networks from file

Alternatively you can import a network list from a file. Use the following command to import from file: 

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

## 4a. Connect to Vega apps through the wallet 

In some cases, you'll need to run a Vega app via the wallet service, instead of directly in your browser. 

### Connect to Token dApp

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet service run --network "NETWORK_NAME" --with-token-dapp
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet service run --network "NETWORK_NAME" --with-token-dapp
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet service run --network "NETWORK_NAME" --with-token-dapp
```
</TabItem>
</Tabs>


### Connect to Vega Console 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet service run --network "NETWORK_NAME" --with-console
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet service run --network "NETWORK_NAME" --with-console
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet service run --network "NETWORK_NAME" --with-console
```
</TabItem>
</Tabs>