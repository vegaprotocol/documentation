---
sidebar_position: 3
title: Manage networks
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage networks

You'll need to import and choose a network to use your wallet to interact with Vega. This page explains the network-related commands within Vega Wallet, and how to use them. 

## Update networks

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
./vegawallet network import --force \
    --from-url https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet network import --force \
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

### List networks 

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

### Display network configuration 

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

### Delete networks 

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
