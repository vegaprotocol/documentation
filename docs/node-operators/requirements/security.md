---
sidebar_position: 3
title: Running a secure validator
sidebar_label: Validator security
hide_title: false
---
Validators are the most important part of the Vega network. Without them, the network is unable to generate new blocks and thus process any transactions. It is therefore important that the validator nodes are protected so that they can run correctly and perform their designated tasks.

There are two particular areas in which security needs to be addressed:
* The node software must be run on a secure server which has maximum available up time and connectivity
* The blockchain addresses and private keys used for validator-related transfers must be held securely so that external parties cannot get hold of them

## Creating a secure server
A secure server needs to meet the following requirements:

1. Must be either a secure VM or a bare metal machine in which physical access is protected and controlled by the validator. A bare metal machine that is not physically protected can be rebooted, turned off or manipulated by a third party which at best can reduce the rewards times for a validator and at worst can allow malicious software to be installed and potentially stealing of assets and tokens.
2. Firewall controlled remote access to prevent unknown third parties from logging into the server and performing malicious tasks. Ideally the server will be solely used to run the validator software and would only have the ports required for this to run open to the outside World. The firewall could also be set up to restrict access to a known set of IP addresses to further reduce the chance of a rogue user gaining access to it.
3. The Vega core node contains a gRPC API that can be used by the operator. Remote access to this API should be restricted, or disabled all together. This API is meant to be used by the node operator, or trusted parties of the operator, and should not be open to the public.

## Planning for maximum uptime and connectivity

While computers are often built to very high standards, this does not mean they cannot crash or suffer hardware faults during use. The best approach is to assume something will go wrong and have a plan to cope with it. 
Such ideas include:
* Power cuts: Install a UPS to allow the server to keep running even if the power fails. This UPS should also be used to power any networking hardware required for the validator node to communicate with the rest of the network.Most good cloud providers already have backup power systems which will keep things running for you.
* Hardware faults: These can range from a broken hard drive, memory errors, failing power supplies to blown motherboards and broken cooling which causes overheating. If you are controlling the server yourself, you need to either buy from a supplier that has a replacement service, or keep spare machines or parts available for you to replace yourself. Backing up your system plays a big part here as the quicker you can restore your data, the quicker you can bring a repaired system back online.
* Internet outage: Excluding internet issues in major backbones which will be impossible for a normal user to fix, most problems occur between the ISP and the client server. In most cases if you get a second internet connection installed it will connect back to the same ISP which does not offer you much of an improvement in reliability. An option is you setup or install a different type of connectivity as a backup second failover plan. Such connections include 4g wireless, leased lines or radio/satellite internet. Having a good router in place to automatically switch over is a good plan but remember the second connection will have a different IP address associated with it which might prevent your node communicating with the existing network.

## Hardening the operating system
By default the initial installations of server operating systems do not give the user the most secure set of options. This is true for self hosted servers as well as VM running in the cloud. Following good online guides for the particular OS you are using is a good first step to reduce the attack surface of your server.

* [Linux](https://www.cyberciti.biz/tips/linux-security.html)
* [Windows](https://www.socinvestigation.com/windows-server-security-best-practices)

## Monitoring the server and software
Once everything is up and running it is important to monitor the server to make sure everything is acting as expected. The node software will consume resources on the server and checking metrics for things like disk, RAM and CPU usage will indicate if the machine needs to be upgraded or reconfigured. Using software such as prometheus and grafana can allow a user to display in real time the state of a server and running processes. 

Over time a user will be able to understand when things are running inside normal parameters and when things are behaving differently at which point further investigation can take place to ensure the system remains up and functioning.

## Exposing APIs

We do not recommend to expose any API from the validator. If you wish to expose the Vega API, please consider starting the separate non-validator vega-core and data node. You can expose the API from the data node. To securely expose the data node APIs, please read the [Secure data node documentation](./data-node-security.md)

## Best practices for Tendermint
Read about the best practices for using Tendermint with your node. 

* [Running tendermint in production](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html)
* [Guidance on how to set up a tendermint validator](https://docs.tendermint.com/v0.34/tendermint-core/validators.html)
