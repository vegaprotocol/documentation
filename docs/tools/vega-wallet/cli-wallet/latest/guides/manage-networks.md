---
sidebar_position: 2
title: Manage networks
hide_title: false
description: Set up network details to connect your wallet, update network details, and list the available networks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkConfigAddress from '@site/src/components/NetworkConfigAddress';

You'll need to import and choose a network to use your wallet to interact with Vega. This page explains the network-related commands within Vega Wallet, and how to use them. 

:::info 
You can see a list of available commands by running `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows. Help is also available for every command, for example: `vegawallet network -h` will provide information about the `network` command, and `vegawallet network import -h` will describe importing a network.
:::

## Network URLs
You can use the following network URLs to connect to the mainnet or fairground network through your wallet: 

* **Mainnet** network (run by validators): <NetworkConfigAddress frontMatter={frontMatter} label="mainnet1.toml" network="mainnet"/>
* **Fairground** network: <NetworkConfigAddress frontMatter={frontMatter} label="fairground.toml" network="fairground"/>

## Update networks
At times you may need to force the wallet to update the list of available networks. Below, choose between forcing an update via URL or file. 

### Update network from URL
Run the following `--force` command to update to the latest available from your chosen URL, which needs to be a TOML file. See above for links to mainnet and fairground network files.

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network import --force --from-url "URL_OF_TOML_FILE"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network import --force \
    --from-url "URL_OF_TOML_FILE"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import --force \
     --from-url "URL_OF_TOML_FILE"
```
</TabItem>
</Tabs>

### Update network from file
Run the following `--force` command to update to the latest available from your chosen file, which needs to be saved as a .TOML. See the files linked in [Network URLs](#network-urls) for the structure.

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

## List networks
To see the names of the networks you've imported, run the following command: 

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

## Display network configuration 
You can display the information that the wallet uses to connect to a network. This includes the API and app hosts. 

You'll need to define the name of the network you want to describe.  Run the following command: 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network describe --network "NETWORK_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network describe --network "NETWORK_NAME"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network describe --network "NETWORK_NAME"
```
</TabItem>

</Tabs>

## Delete networks
If you don't want to connect to a specific network any longer, or you want to clear the configuration, you can delete that network from your computer. 

Use the following command to delete a network. You'll need to include the name of the network you want to delete. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet network delete --network "NETWORK_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet network delete --network "NETWORK_NAME"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network delete --network "NETWORK_NAME"
```
</TabItem>

</Tabs>
