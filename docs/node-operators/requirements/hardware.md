---
title: Hardware requirements
sidebar_label: Hardware
sidebar_position: 1
---

Validators need to run a set of executables each with their own resource requirements to enable the network to function under varying loads. 

For a validator running a node the following guidelines can be used when sizing up the hardware required.

| Resource    | Minimum     | Recommended |
| ----------- | ----------- | ----------- |
| CPU | 4 cores at >3Ghz | 6 cores at >= 4Ghz|
| RAM   | 8GB        | 16GB        |
| Storage   | 256GB SSD| 1TB NVMe SSD |

The impact of using fewer cores than recommended is that the critical parts (data node and non-validators) will be starved of CPU resources, which will reduce the maximum throughput of the network.

The impact of having slower cores than recommended (or older cores that have a reduced IPC rate compared to modern Zen3 cores) is that the maximum throughput will be reduced due to the bottlenecks being single threaded.