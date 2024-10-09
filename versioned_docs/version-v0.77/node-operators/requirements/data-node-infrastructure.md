---
sidebar_position: 2
title: Data node infrastructure
sidebar_label: Data node infrastructure
vega_network: MAINNET
hide_title: false
---

import Topic from '/docs/topics/\_topic-data-nodes.mdx';

<Topic />

This page covers the minimum and recommended hardware requirements, and the software requirements for running a data node connecting to a network.

The best hardware may vary depending on how you set up your node and database service, and how you intend to use the data node.

Data node operators who are running a data node to support their own needs can run a leaner setup depending on their own requirements.

Those data node operators running archive nodes, which retain all chain information, will need a more robust setup.

## Hardware recommendations

### System architecture requirements

| Resource | Minimum            | Recommended         |
| -------- | ------------------ | ------------------- |
| CPU      | 6 cores at >= 3Ghz | 12 cores at >= 4Ghz |
| RAM      | 16GB               | 32GB                |
| Storage  | 1TB NVMe SSD       | 2TB NVMe SSD        |

The impact of using fewer cores than recommended is that the critical parts (data node and non-validators) will be starved of CPU resources, which will reduce the maximum throughput of the network.

The impact of having slower cores than recommended (or older cores that have a reduced IPC rate compared to modern Zen3 cores) is that the maximum throughput will be reduced due to the bottlenecks being single threaded.

### File system performance testing

In benchmark testing using the default Ubuntu file system of EXT4 against ZFS with zstd compression turned on, it was determined that ZFS has an impact on performance when using NVMe drives, while the opposite is seen in SATA drives. More blocks per minute (bpm) is better.

|                      | NVMe SSD (bpm) | Service Time | SATA SSD (bpm) | Service Time |
| -------------------- | -------------- | ------------ | -------------- | ------------ |
| Core EXT4            | 1415           | 15%          | 851            | 60%          |
| Core ZFS             | 1210           | 15%          | 886            | 55%          |
| Core + Datanode EXT4 | 1216           | 35%          | 607            | 90%          |
| Core + Datanode ZFS  | 993            | 25%          | 729            | 65%          |

### Cores performance testing

Benchmark testing shows that ZFS with zstd helps reduce the amount of data stored on the drives, but has a negative impact on the amount of CPU resources required. This is due to the compression/decompression of the data as it is written and read from disk.

Below are results of replay tests showing how different amounts of available CPU cores change the average block processing rate. More blocks per minute (bpm) is better.

| Cores | EXT4 (bpm) | ZFS + zstd (bpm) |
| ----- | ---------- | ---------------- |
| 1     | 496        | 326              |
| 2     | 853        | 604              |
| 3     | 1003       | 751              |
| 4     | 1439       | 856              |
| 5     | 1471       | 1014             |
| 6     | 1466       | 1164             |
| 7     |            | 1172             |

## Software requirements

### Operating system

For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far.

We also recommend ensuring that the `noatime` flag is set for mounted drives, as not having it set can cause performance issues and deadlocking in the database, leading to panics in Postgres and the data node.

### Golang

You'll need 'go' version 1.19.1 or newer.

### Data node PostgreSQL

If you plan to run a data node, you will also need to run a PostgreSQL server.

There are several ways to do this:

- As described in the [data node readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md).
- The simplest and recommended way to do this is [using docker](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md#using-docker), which is also described in the data node readme.

<!-- ### Block explorer PostgresSQL [WIP] -->
