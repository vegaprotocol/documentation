---
sidebar_position: 0
title: Vega Wallet versions 0.10-0.9.2
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To set up Vega Wallet version 0.10.0 or 0.9.2, follow the step-by-step instructions below. 

Note: If you are looking for instructions for connecting your hardware wallet to MetaMask, see [MetaMask's guide](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet).

## 1. Install and run Vega Wallet

**Important:** You will need to use Vega Wallet version 0.9.2 or above to connect to Vega Mainnet. **We recommend always using the [latest released version of Vega Wallet](../../latest/create-wallet).** These instructions cover versions 0.9.2 through 0.10.0.

These instructions are written to be used in command line. Below, you'll see commands in the code blocks for each operating system. Copy those instructions and paste them into your command line interface.

### Download file

**Download and save the zip file from [Vega Wallet releases](https://github.com/vegaprotocol/vegawallet/releases/)**. Keep track of where you've saved the file, because that's where the command line interface will look for it. **These instructions are only relevant for versions 0.9.2 through 0.10.0.**

:::note You may need to change your system preferences to run the file

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

## 2. Generate or import existing wallet

The steps below will guide you through initialising the wallet, and creating new key pairs or importing an existing wallet. To import an existing wallet, you'll need the mnemonic (recovery phrase) to hand.

:::info
 You'll need to run the commands from the directory you've saved the wallet file in. Use the command `pwd` to find out where your terminal is looking in the file system. Use the command `cd` and the path/to/wallet/directory to tell the command line where to find the file. 
:::

:::info
You can see a list of available commands by running  `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows.
:::

### Initialise the software

The `init` command (below) will initialise the Vega Wallet software. This creates the folder, the configuration files, and default networks needed by the software to operate. 

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

### Import existing wallet

Use your mnemonic (recovery phrase) to import a wallet you created in the past into a new version of the wallet software. If you were not provided with a mnemonic (recovery phrase) or have lost it, you will need to create a new wallet and generate new keys. Use the command below to import the plain-text file with your mnemonic in it. 

Once you import, you will need to create wallet credentials (below). 

:::info 
Because keys are generated in a deterministic way, when you import your wallet using the mnemonic, you will see the same key you had before. 
:::

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet import --wallet "YOUR_USERNAME" --mnemonic-file "PATH_TO_YOUR_MNEMONIC"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet import \
    --wallet "YOUR_USERNAME" \
    --mnemonic-file "PATH_TO_YOUR_MNEMONIC"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet import \
    --wallet "YOUR_USERNAME" \
    --mnemonic-file "PATH_TO_YOUR_MNEMONIC"
```
</TabItem>
</Tabs>

### Create wallet credentials

Next, **create a name and passphrase** for your Wallet, and **create a public and private key** and **mnemonic (recovery phrase).

Replace `YOUR_USERNAME` (below) with your chosen username:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet key generate --wallet "YOUR_USERNAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet key generate --wallet "YOUR_USERNAME"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet key generate --wallet "YOUR_USERNAME"
```
</TabItem>

</Tabs>

It will then prompt you to **input a passphrase**, and then **confirm that passphrase**. You'll use this username and passphrase to login to Vega Console. (Instructions on connecting to Console are below.)

The key generate command in that instruction will generate public and private keys as well as a mnemonic for the wallet, at the same time as creating a user name.

You’ll see a public and private key, as well as a mnemonic (recovery phrase).
:::warning
Keep your mnemonic (recovery phrase) safe and secret. You will need your mnemonic to import your keys. 

**Your mnemonic is only shown once, at key creation, and cannot be recovered. DO NOT SHARE YOUR PRIVATE KEY OR MNEMONIC.**
:::

## 3. Choose a network

To use Vega Wallet, you'll need to choose a network to connect to. 

### Import networks

To import the list of available mainnet networks provided by the validators, use the [`mainnet1.toml`](https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml) file on the networks repository.

#### Import networks from URL

Use the following command to import from the URL: 


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
You can override the imported network name using the `--with-name` flag.
:::

### List imported networks

If you want to view the list of available networks that you imported, plus those already available in the wallet configuration, run the following command: 


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

:::info 
If you connect to the mainnet network, the validator you connect to is chosen by a round-robin schedule, as defined in your network configuration. 
:::

#### Update networks

At times you may need to force the wallet to update the list of available networks. Below, choose between forcing an update via URL or file. 

#### Update network from URL

Run the following `--force` command to update to the latest available from your chosen URL.  

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network import --force --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network import  --force \
    --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import  --force \
     --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
</Tabs>

#### Update network from file

Run the following `--force` command to update to the latest available from your chosen file.  

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network import --force --from-file "PATH_TO_FILE"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network import --force --from-file "PATH_TO_FILE"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import --force --from-file "PATH_TO_FILE"
```
</TabItem>

</Tabs>


## 4. Run the wallet

To use your wallet with the Vega mainnet, connect your wallet to the network `mainnet`, which you imported in step 3. To use your wallet with Fairground, Vega's testnet, connect your wallet to the network `fairground`. 

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
