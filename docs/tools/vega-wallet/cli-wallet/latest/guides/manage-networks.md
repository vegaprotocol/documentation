---
sidebar_position: 3
title: Manage networks
hide_title: false
description: Set up network details to connect your wallet, update network details, and list the available networks
vega_network: TESTNET
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { NetworkConfigAddress, NetworkConfigAddressText } from '@site/src/components/NetworkConfigAddress';
import CodeBlock from '@theme/CodeBlock';

You'll need to import and choose a network to use your wallet to interact with Vega. This page explains the network-related commands within Vega Wallet, and how to use them. 

:::info 
You can see a list of available commands by running `./vegawallet -h` on MacOS and Linux, or `vegawallet -h` on Windows. Help is also available for every command, for example: `vegawallet network -h` will provide information about the `network` command, and `vegawallet network import -h` will describe importing a network.
:::

## Network URLs
You can use the following network URLs to connect to the mainnet or fairground network through your wallet: 

* **Mainnet** network (run by validators): <NetworkConfigAddress frontMatter={frontMatter} label="mainnet1.toml" network="mainnet"/>
* **Fairground** network: <NetworkConfigAddress frontMatter={frontMatter} label="fairground.toml" network="fairground"/>
* **Validator testnet** network: [testnet2.toml ↗](https://raw.githubusercontent.com/vegaprotocol/networks/master/testnet2/testnet2.toml)

## Update networks
At times you may need to force the wallet to update the list of available networks. Below, choose between forcing an update via URL or file. 

### Update network from URL
Run the following `--force` command to update to the latest available from your chosen URL, which needs to be a TOML file. See above for links to mainnet and fairground network files.

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

<CodeBlock language="bash">
vegawallet network import --force --from-url "{NetworkConfigAddressText(frontMatter.vega_network)}"
</CodeBlock>

</TabItem>
<TabItem value="mac" label="MacOS">

<CodeBlock language="bash">
./vegawallet network import --force \{'\n'}
&nbsp;&nbsp;--from-url "{NetworkConfigAddressText(frontMatter.vega_network)}"
</CodeBlock>
</TabItem>
<TabItem value="linux" label="Linux">

<CodeBlock language="bash">
./vegawallet network import --force \{'\n'}
&nbsp;&nbsp;--from-url "{NetworkConfigAddressText(frontMatter.vega_network)}"
</CodeBlock>
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

## Connecting to stable nodes
You can change the list of data nodes in your network configuation to control how many nodes the wallet tries to connect to. The wallet connects to a data node in order to communicate with the network, and uses it to forward transactions to the consensus validator nodes.

The number of nodes that you have in the config list depends on how reliable you believe the nodes are, and how sensitive you are to the speed of your transactions being sent.

A shorter list of stable nodes will lead to the fastest transaction experience. If you think the nodes are unreliable, a longer list of nodes will provide diversity and more likelihood that the wallet will cycle through to find a connected node. 

A balanced set up for one’s network configuration would be around 10 stable and trusted nodes, If any of them isn't able to connect, there are plenty of others for the wallet to connect through.

### Configure the node list
To configure the node list your wallet uses, you'll need to be able to edit the .TOML file you're using. Unless you have self-hosted or cloned a network's config list, you will need to save it locally and [update network from file](#update-network-from-file).

See the files linked in [Network URLs](#network-urls) for the structure of the network config file.

