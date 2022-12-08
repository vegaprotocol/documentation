---
sidebar_position: 1
title: Install node binaries
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Vega node is the implementation of the Vega protocol. It secures the network using VEGA, the network's governance and staking token, and relies on a BFT consensus engine ([Tendermint](https://tendermint.com/)).

The data node offers a set of API to query the state of the network. It works as a pair with a Vega node (started in non-validator mode) to reconcile the state of the application and serve rich APIs.

Both nodes are built using bare Go and should run on most mainstream platforms (MacOS, Windows and Linux).

You can either use the pre-built binaries or build from source code.

## Use the pre-built binaries 
One way to set up a Vega node or data node is to use the pre-built binaries. 

:::info 
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far. 
:::

The releases pages offer binaries for MacOS, Windows and Linux. 

* [Vega core releases](https://github.com/vegaprotocol/vega/releases/latest)
* [Data node releases](https://github.com/vegaprotocol/data-node/releases/latest)

If the pre-built binaries don't work or are unavailable for your system, you will need to [**build the binaries from sources**](#build-from-sources).

## Build from sources
This section will walk you through compiling a Vega node and data node yourself from the source code.

:::info
Before starting you will need both Git and Go 1.18 installed on your system. Git should be available using the default package manager of your system, which you can check at [git-scm.com](https://git-scm.com/). Download Go from the [official website](https://go.dev/dl/).
:::

### Environment set-up
Set up the environment variables required to build both node binaries.

Linux is the operating system we are compiling the node for in this example.

```Shell
export GOOS=linux 
```
Amd64 is the architecture targeted. 

```Shell
export GOARCH=amd64
```
:::note

The previous step assumes that you are building on linux/amd64. A full list of compatible GOOS/GOARCH pairs is available when running the following command, make sure to use the one required for your system:
```
go tool dist list
```
:::

Both binaries can be built without the CGO support. Disable it with the following command:
```
export CGO_ENABLED=0
```

### Build the Vega node
1. Clone the Vega repository for the specific branch of the relevant release:
```Shell
git clone --branch <tag_name> https://github.com/vegaprotocol/vega
```

For example, for version v0.53, replace `tag_name` with v0.53

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


### Build the data node
1. Clone the data node repository:
```Shell
git clone --branch <tag_name> https://github.com/vegaprotocol/vega
```

For example, for version v0.53.1, replace `tag_name` with v0.53.1

2. Build the data node binary by running the following command from the root of the cloned repository:
```
go build -v ./cmd/data-node
```

This will result in a Vega binary built at the root of the repository. 

3. To ensure that the compilation was successful, run the following command:
```
./data-node version
```
This will print the version of the binary you just built.

### Update data node config.toml
In the data node config, ensure that the `WebUIEnabled` field is set to `true`. You can choose to change the `WebUIPort` to suit your set-up, or leave it as the default. 

```toml
[API]
    ...
  WebUIPort = 3006
  WebUIEnabled = true
```

You'll need a data node running in order to get the signature bundle to add your node to the multsig signers list, when setting up your validator node.

Once your data node is set up, you can access the gRPC Web UI for your node at `http://YOUR_NODE_DOMAIN:3006/`

### Data node requirement as of 0.53
After building the data node, you will have to run a PostgreSQL server (starting with version 0.53). 

There are several ways to do this, as described in the [data node readme](https://github.com/vegaprotocol/data-node/blob/develop/README.md). The simplest and recommended way to do this is **[using docker](https://github.com/vegaprotocol/data-node#using-docker)**, which is also described in the data node readme.
