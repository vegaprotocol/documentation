---
sidebar_position: 9
title: Visor overview
sidebar_label: Visor overview
---

## What is Vega Visor?

Vega Visor is a tool to help run all the parts of a validator or non validator node with data node in a standardised way allowing for automatic upgrades of the software.


## Why would you use Visor?
As the protocol develops, bugs are fixed and new features are added, the development team will release new versions of the software on the github page. Originally the team manually asked each of the validators to stop their nodes and upgrade their software when required. This was an error prone and tricky process as not all the validators work on the same time zone so there would often be a delay in getting the network back up again. Two things have been added to solve this issue. First a governance vote can take place to set a block height on which the network should be upgraded. Secondly Visor watches the status of a node and when it sees it flag an upgrade it automatically shutting it down, downloading the correct new version and restarting the node with the new version. This allows the node to be kept up to date without any need for user interaction.

## How does Visor watch the core node?

When the core node is configured, a socket port is set along with a URL which together give it an admin point that Visor can connect to and query. When a node is ready to be shutdown for an upgrade, Visor will know this from the details shared on this admin point.

The part of the config.toml file that is used by the core node to specify the admin point is here:

[Admin]
  Level = "Info"
  [Admin.Server]
    SocketPath = "/tmp/vega.sock"
    HTTPPath = "/rpc"


## How does Visor get the correct version?

The information set in the governance proposal for a protocol upgrade includes the block at which the upgrade should happen along with the version of the software that should be used for the upgrade. When Visor queries the core node and sees the state of the node is ready for an upgrade, the version we require will be available here. Visor then uses that information to generate a URL which is used to pull the assets down from GitHub.

## Does using Visor put any restrictions on how we run the core and data node?

All of the command line options passed to the core and data node can be passed in the same way using Visor. Therefore you are still able to set the different home paths if you wish to override the defaults and use better optimised storage for each set of data. Using embedded postgres is not supported under Visor.

## Does Visor help in running the Postgres DB used by the data node?

The data node requires an underlying Postgres instance which needs to be running before the data node is started. Postgres does not need to be shutdown during a protocol upgrade. Although the data node does support running an embedded postgres instance, this is not supported by Visor and will result in upgrades failing. Therefore it is recommended the user runs the postgres instance using their own scripts.

## Who takes care of running Visor?

If you have easy access to your server you can start the Visor process manually and it will remain running until you need to reboot the machine. Output can be redirected to a file so that it can be checked and grepped if you have any issues. If you require a more complete solution you can add the process as a systemd service where it can automatically start when the machine boots up and restart if the process dies. This way the user has nothing to do to keep it running.


