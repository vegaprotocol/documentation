---
sidebar_position: 9
title: Visor overview
description: Running Visor allows for automatic software upgrades.
---

## What is Vega Visor?
Vega Visor is a tool to help run all the parts of a validator or non validator node with data node in a standardised way allowing for automatic upgrades of the software.

## Why would you use Visor?
As the protocol develops, bugs are fixed and new features are added, the development team will release new versions of the software on [GitHub ↗](https://github.com/vegaprotocol/vega). 

Without Visor, each node operator would need to be prompted to stop their nodes and upgrade their software when required. This is an error prone and tricky process as not all node operators work on the same time zone, and data node operators may not even be actively aware of an upgrade. Validator node operators who need to restart their nodes manually can lead to a delay in getting the network back up again. 

Two things have been added to improve this process:

First, a vote takes place among consensus node operators to set a block height on which the network should be upgraded. 

Second, Visor constantly monitors the node's status. If a protocol upgrade is proposed, Visor takes care of the process automatically. It will shut down the node, install the new version, and restart the node with the updated version. As a result, node operators don't have to do anything to ensure nodes are up-to-date.

Learn more about this process in the [upgrade network guide](./how-to/upgrade-network.md).

## How does Visor watch the core node?
When the core node is configured, a socket port is set along with a URL, which together give it an admin endpoint that Visor can connect to and query. When a node is ready to be shut down for an upgrade, Visor will know this from the details shared on this admin endpoint.

The part of the config.toml file that is used by the core node to specify the admin endpoint is here:

```
[Admin]
  Level = "Info"
  [Admin.Server]
    SocketPath = "/tmp/vega.sock"
    HTTPPath = "/rpc"
```

## How does Visor get the correct version?
The information set in the [proposal for a protocol upgrade](./how-to/upgrade-network.md) includes the block at which the upgrade should happen along with the version of the software that will be used for the upgrade. 

When Visor queries the core node and sees the state of the node is ready for an upgrade, the version required will be available there. Visor then uses that information to generate a URL that is used to collect the assets from GitHub.

## Does using Visor put any restrictions on how a node is run?
All of the command line options passed to the validator, non-validator, or data node can be passed in the same way using Visor. 

Therefore, you are still able to set the different home paths if you wish to override the defaults and use better optimised storage for each set of data. 

Using embedded Postgres for testing purposes is not supported with Visor, and will result in upgrades failing. 

## Does Visor help in running the Postgres DB used by the data node?
A data node requires an underlying Postgres instance that needs to be running before the data node is started, and Postgres does not need to be shut down during a protocol upgrade. 

It is recommended that the user runs the Postgres instance using their own scripts.

## How do I run Visor?
If you have easy access to your server you can start the Visor process manually and it will remain running until you need to reboot the machine. Output can be redirected to a file so that it can be checked and grepped if you have any issues. 

If you require a more complete solution, you can add the process as a systemd service where it can automatically start when the machine boots up and restart if the process dies. This way the user has nothing to do to keep it running.