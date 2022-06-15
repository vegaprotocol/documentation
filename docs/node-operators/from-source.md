---
sidebar_position: 2
title: Building from sources
hide_title: false
---

This section will walk you through building a Vega node and data node from the source code.

The Vega node is the implementation of the Vega protocol. It secures the network using VEGA, the network's governance and staking token, and relies on a BFT consensus engine ([Tendermint](https://tendermint.com/)).

The data node offers a set of API to query the state of the network. It works as a pair with a Vega node (started in non-validator mode) to reconcile the state of the application and serve rich APIs.

Both nodes are built using bare Go and should run on most mainstream platforms (MacOS, Windows and Linux).

:::info
Before starting you will need both Git and Go 1.18 installed on your system. Git should be available using the default package manager of your system, which you can check at [git-scm.com](https://git-scm.com/). Download Go from the [official website](https://go.dev/dl/).
:::

## Environment set-up
Set up the environment variables required to build both node binaries.
```Shell
export GOOS=linux # The operating system we are compiling the node for in this example.
```
```Shell
export GOARCH=amd64 # The architecture targeted.
```
:::note

The previous step assumes that you are building on linux/amd64. A full list of compatible GOOS/GOARCH pairs is available when running the following command, make sure to use the one required for your system:
```
go tool dist list
```
:::

Both binaries can be build without the CGO support. Disable it with the following command:
```
export CGO_ENABLED=0
```

## Build the Vega node

1. Clone the Vega repository:
```Shell
git clone https://github.com/vegaprotocol/vega
```

2. Build the Vega binary by running the following command from the root of the cloned repository:
```
go build -v -ldflags "-X main.CLIVersion=`git describe --tags 2>/dev/null` -X main.CLIVersionHash=`git log -n 1 --pretty=format:"%H"`" ./cmd/vega
```

This should result in a Vega binary built at the root of the repository. 

To ensure that the compilation was successful run the following command:
```
./vega version
```
This will print the version of the binary you just built.


## Build the data node

1. Clone the data node repository:
```Shell
git clone https://github.com/vegaprotocol/data-node
```

2. Build the data node binary by running the following command from the root of the cloned repository:
```
go build -v -ldflags "-X main.CLIVersion=`git describe --tags 2>/dev/null` -X main.CLIVersionHash=`git log -n 1 --pretty=format:"%H"`" ./cmd/data-node
```

This will result in a Vega binary built at the root of the repository. 

To ensure that the compilation was successful, run the following command:
```
./data-node version
```
This will print the version of the binary you just built.
