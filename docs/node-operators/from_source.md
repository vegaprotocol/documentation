---
sidebar_position: 2
title: Building from sources
hide_title: false
---

This section will walk you through building the vega node and the data node from sources.

The vega node is the implementation of the vega protocol, it secures the network using the vega staking token and is relying on a BFT consensus engine ([tendermint](https://tendermint.com/)).

The data node offer a set of API to query the state of the network, it works in pair with a vega node (started in a non-validator mode) to reconcile the state of the application and serve rich APIs.

Both nodes are built using bare Go and should run on most strealine platforms (MacOS, Windows and Linux).

:::info
Before starting you will need both Git and Go 1.18 installed on your system git should be available using the default package manager of your system, for Go you can download from the [official website](https://go.dev/dl/)
:::

## Common steps
First we start by setting up a couple of environment variable require to build both binaries.
```Shell
export GOOS=linux # The operating system we are compiling the node for.
```
```Shell
export GOARCH=amd64 # The archicture targeted.
```
:::note
The previous steps assume that you are building on linux/amd64, a full list of compatible GOOS/GOARCH pairs is available when running the following command, make sure to use the one require for your system:
```
go tool dist list
```
:::

Finally both binaries can be build without the CGO support, we can disable it like so too:
```
export CGO_ENABLED=0
```

## Build the vega node

We start first by cloning the vega repository:
```Shell
git clone https://github.com/vegaprotocol/vega
```

Now we can build the vega binary by running the following command from the root of the repository we cloned previously:
```
go build -v -ldflags "-X main.CLIVersion=`git describe --tags 2>/dev/null` -X main.CLIVersionHash=`git log -n 1 --pretty=format:"%H"`" ./cmd/vega
```

This should result in a vega binary built at the root of the repository, to ensure that the compilation was successful run the following command:
```
./vega version
```
This should print the version of the binary we just built.


## Build the data node

We start first by cloning the data-node repository:
```Shell
git clone https://github.com/vegaprotocol/data-node
```

Now we can build the data node binary by running the following command from the root of the repository we cloned previously:
```
go build -v -ldflags "-X main.CLIVersion=`git describe --tags 2>/dev/null` -X main.CLIVersionHash=`git log -n 1 --pretty=format:"%H"`" ./cmd/data-node
```

This should result in a vega binary built at the root of the repository, to ensure that the compilation was successful run the following command:
```
./data-node version
```
This should print the version of the binary we just built.
