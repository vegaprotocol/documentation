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

### Storage recommendations 
Performance testing on NVMe SSD, SATA SSD and traditional HDD (5400rpm) storage devices was done to see how they handled the workload of running a validator node. The testing included running the node for an hour and measuring the number of blocks it replayed, and the service time of the storage device.

|     | NVMe SSD  | SATA SSD | HDD 5400 rpm | 
| Blocks Per Minute | 1415 | 851 | 68 |  
| Blocks Per Second | 24  | 14 | 1 |
| Drive Service Time | 15% | 60% | 99% |

Traditional HDDs are not a good fit for this workload. They would be unable to catch up with a live blockchain as they cannot handle processing blocks faster than real time.

SATA attached SSDs perform well and have the advantage of supporting larger sizes and also more devices per server.

NVMe devices are the fastest and best option if available. Their very low service time means other processes can be run on the same server without impacting the performance of the core. 

## Software requirements

### Operating system 
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far. 

### Golang
You'll need 'go' version 1.19.1 or newer.

### Vega Wallet
You'll need a version of the Vega Wallet that matches with the version of software you're using to install your node. You can get this when you install Vega.