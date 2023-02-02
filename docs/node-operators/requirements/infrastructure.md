---
sidebar_position: 2
title: Infrastructure requirements
sidebar_label: Infrastructure
vega_network: TESTNET
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';

This page covers the minimum and recommended hardware requirements, and the software requirements for running a Vega node to be a validator candidate.

## Hardware requirements
Validators need to run a set of executables each with their own resource requirements to enable the network to function under varying loads. 

For a validator running a node the following guidelines can be used when sizing up the hardware required.

| Resource    | Minimum     | Recommended |
| ----------- | ----------- | ----------- |
| CPU | 6 cores at >= 3Ghz | 12 cores at >= 4Ghz|
| RAM   | 16GB            | 32GB        |
| Storage   | 1TB NVMe SSD| 2TB NVMe SSD |

The impact of using fewer cores than recommended is that the critical parts (data node and non-validators) will be starved of CPU resources, which will reduce the maximum throughput of the network.

The impact of having slower cores than recommended (or older cores that have a reduced IPC rate compared to modern Zen3 cores) is that the maximum throughput will be reduced due to the bottlenecks being single threaded.

## Software requirements

### Operating system 
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far. 

### Golang
You'll need 'go' version 1.19.1 or newer.

### Vega Wallet
You'll need a version of the Vega Wallet that matches with the version of software you're using to install your node. You can get this when you install Vega. 

### Data node PostgreSQL
After building, to run your data node, you will have to run a PostgreSQL server.

There are several ways to do this:
**From 0.54.x onwards:**
- As described in the [data node readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md). The simplest and recommended way to do this is [using docker](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md#using-docker), which is also described in the data node readme.

<!-- ### Block explorer PostgresSQL [WIP] -->
