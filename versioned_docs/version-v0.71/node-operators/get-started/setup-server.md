---
sidebar_position: 1
title: Set up server
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setting up the server and building the software
The Vega node is the implementation of the Vega protocol. It secures the network using VEGA, the network's governance and staking token, and relies on a BFT consensus engine ([Tendermint ↗](https://tendermint.com/)).

The data node offers a set of APIs to query the state of the network. It works as a pair with a Vega node (started in non-validator mode) to reconcile the state of the application and serve rich APIs.

The Vega toolchain, which you'll install below, is the binary that provides everything you need to set up a Vega node, data node, Vega Wallet, block explorer, and tools for interacting with the protocol, and includes the Tendermint version compatible with the Vega software.

Both nodes are built using bare Go and should run on most mainstream platforms (MacOS, Windows and Linux). 

The instructions below guide you on how to build from source code.

:::tip Setting home folder
The following commands use the `--home` flag, to allow you to specify a custom home for the configuration, state, and cache of your Vega node. Remove it to use the default path. 

It's recommended that you use different folders for your Vega and Tendermint homes. Keep track of which home you're referring to as you progress.

You can list all the paths used by your Vega installation with the following command:
`vega paths list`
:::

## OS and software
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far.

See the [infrastructure requirements](../requirements/infrastructure.md) page for a full list of what you need to run various parts of the Vega toolchain.

## Use the pre-built binaries
One way to set up a Vega node is to use the pre-built binaries. You'll use 'Vega', as well as the following features that are subcommands of the Vega binary: Vega Wallet, Visor (optional - for easier protocol upgrades), and data node (optional - for storing and supplying data).

Find them under [Vega core releases ↗](https://github.com/vegaprotocol/vega/releases).

If the pre-built binaries don't work or are unavailable for your system, you will need to [**build the binaries from sources**](#build-from-sources).

:::note If you use the pre-built binaries and are using Linux or MacOS, you may need to prepend `./` to the commands in the instructions.
:::

## Build from sources 
This section will walk you through compiling the Vega toolchain yourself from the source code.

:::info
Before starting you will need both Git and Go 1.19+ installed on your system. 

Git should be available using the default package manager of your system, which you can check at [git-scm.com ↗](https://git-scm.com/). 
Download Go from the [official website ↗](https://go.dev/dl/).
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

2. Navigate to the vega folder you just cloned:

    ```Shell
    cd vega
    ```

3. Check out the release tag you want to build. Use the software version that's relevant for the network you're interacting with:

    ```Shell
    git checkout vX.XX 
    ```

4. Build the Vega binary by running the following command from the root of the cloned repository:

    ```shell
    go build -v ./cmd/vega
    ```

This should result in a Vega binary built at the root of the repository.

To ensure that the compilation was successful run the following command:

```shell
./vega version
```

This will print the version of the binary you just built.

:::note 
In order to run the `vega` command from any folder you should move the binary to a folder that is in your PATH.
:::

### Install Visor
Visor manages protocol upgrades, allowing the nodes running a network to automatically update to the latest agreed version of the Vega protocol, without requiring manual intervention at the upgrade time. Using Visor is optional, but recommended. 

Download and install the [Visor binary ↗](https://github.com/vegaprotocol/vega/releases) that matches the release version of Vega you built.
#### Prerequisite
Read detailed information about Vega Visor, including how it works, how the config is set up and how you can edit it in the [full software description ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme).

See the [architecture overview ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#architecture) and [upgrade flow ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#upgrade-flow) topics in the Visor readme before setting it up.

## Next Steps

#### Setting up a validator node
For instructions on how to set up a Vega node as a validator, see the [validator setup guide](setup-validator.md).

#### Setting up a data node
Instructions for setting up a data node can be found on the [data node setup guide](setup-datanode.md) page.
