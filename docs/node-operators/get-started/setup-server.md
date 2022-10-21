---
sidebar_position: 2
title: Set up server
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setting up the server and building the software
The Vega node is the implementation of the Vega protocol. It secures the network using VEGA, the network's governance and staking token, and relies on a BFT consensus engine ([Tendermint](https://tendermint.com/)).

The data node offers a set of APIs to query the state of the network. It works as a pair with a Vega node (started in non-validator mode) to reconcile the state of the application and serve rich APIs.

The Vega toolchain, which you'll install below, is the binary that provides everything you need to set up a Vega node, data node, Vega Wallet, block explorer, and tools for interacting with the protocol.

Both nodes are built using bare Go and should run on most mainstream platforms (MacOS, Windows and Linux). 

The instructions below guide you on how to build from source code.

:::tip Setting home folder
The following commands use the `--home` flag, to allow you to specify a custom home for the configuration, state, and cache of your Vega node. Remove it to use the default path.

 You can list all the paths used by your Vega installation with the following command:
`vega paths list`
:::

## OS and software
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far.

See the [infrastructure requirements](../requirements/infrastructure.md) page for a full list of what you need to run various parts of the Vega toolchain.

## Use the pre-built binaries
One way to set up a Vega node or data node is to use the pre-built binaries. 

* [Vega core releases](https://github.com/vegaprotocol/vega/releases)
* [Data node releases](https://github.com/vegaprotocol/data-node/releases)

If the pre-built binaries don't work or are unavailable for your system, you will need to [**build the binaries from sources**](#build-from-sources).

## Build from sources 
This section will walk you through compiling the Vega toolchain yourself from the source code.

:::info
Before starting you will need both Git and Go 1.19+ installed on your system. 

Git should be available using the default package manager of your system, which you can check at [git-scm.com](https://git-scm.com/). 
Download Go from the [official website](https://go.dev/dl/).
:::

### Environment set-up
Set up the environment variables required to build both node binaries.

Linux is the operating system used to complie the node in this example.

```Shell
export GOOS=linux 
```
Amd64 is the architecture targeted. 

```Shell
export GOARCH=amd64
```
:::note
A full list of compatible GOOS/GOARCH pairs is available when running the following command, make sure to use the one required for your system:
```
go tool dist list
```
:::

Both binaries can be built without the CGO support. Disable it with the following command:
```
export CGO_ENABLED=0
```

### Build the Vega node
1. Clone the Vega repository:
```Shell
git clone https://github.com/vegaprotocol/vega
```

2. Build the Vega binary by running the following command from the root of the cloned repository:
```
go build -v ./cmd/vega
```

This should result in a Vega binary built at the root of the repository. 

To ensure that the compilation was successful run the following command:
```
./vega version
```
This will print the version of the binary you just built.