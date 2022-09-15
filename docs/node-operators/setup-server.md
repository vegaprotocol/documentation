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

Both nodes are built using bare Go and should run on most mainstream platforms (MacOS, Windows and Linux). 

The instructions below guide you on how to build from source code.

:::tip Setting home folder
The following commands use the default path for your operating system. You can list all the paths used by your Vega installation with the following command:
`vega paths list`

If you want to change the home folder, use the `--home` flag and specify a custom home for the configuration, state, and cache of your Vega node.

The XDG Base Directory standard is use to create the path, see: [XDG Base Directory spec ↗](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html).
:::

## MacOS (need macos instructions) [WIP]

## Linux (ubuntu 22.04)

First make sure your system is up to date
```
sudo apt update && sudo apt upgrade -y
```

Install git so you can pull down the source code
```
sudo apt install git -y
```

Install golang so you can build the source code

Fetch go 1.19
```
wget https://go.dev/dl/go1.19.linux-amd64.tar.gz
```

Remove any existing installation
```
sudo rm -rf /usr/local/go
```

Extract go 1.19
```
sudo tar -C /usr/local -xzf go1.19.linux-amd64.tar.gz
```

Make a bin folder
```
mkdir -p ~/bin
```

### Environment set-up: Linux
Set up the environment either directly in the command line or add to ~/.bashrc and source it with `source ~/.bashrc`. 

All binaries can be built without the CGO support. In the following command, it is disabled.

```bash
export GOROOT=/usr/local/go
export CGO_ENABLED=0
export GOBIN=~/bin
export PATH=$PATH:$GOROOT/bin:$GOBIN
```

Clone the Vega source code
```
git clone -b v0.54.0 https://github.com/vegaprotocol/vega.git
```

Move into the vega folder and build everything
```bash
cd vega
go install ./…
```

Check everything has been built and is available by running
```bash
vega version
vegawallet version
```

## Windows (10 and 11)
All commands should be run from a command prompt in the home folder of the current user `(C:\Users\<username>)`

Make sure your system is up to date by applying all Windows updates

Install git from [Git - Downloading Package (git-scm.com) ↗](https://git-scm.com/download/win)
Test by running `git version`

Install golang from [Downloads - The Go Programming Language ↗](https://go.dev/dl/)

Test by running `go version`

Create a folder for the executables to be installed to
```
mkdir c:\Users\<username>\bin
```

### Environment set-up: Windows
Set up the environment either by either using the `set` command on the command line (this only persists for the lifetime of the command line) or by going to the “Environment Variables…” settings in the control panel where there values will be permanent.

```bash
set CGO_ENABLED=0
set GOBIN=%USERPROFILE%\bin
set PATH=%PATH%:%GOBIN%
```

Check this has worked by running `set` and looking at the output

Get the Vega source code: 

```
git clone -b “v0.54.0” https://github.com/vegaprotocol/vega.git
```

Move into the source folder and build the applications (these commands build vega, data-node and wallet at the same time).

```bash
cd vega
go install ./…
```

Check that everything was built correctly using the following command:

```bash
vega version
vegawallet version
data-node version
```

## Data node PostgreSQL requirement
After building, to run your data node, you will have to run a PostgreSQL server (as of software v0.53).

There are several ways to do this:
**From 0.54.x onwards:**
- As described in the [data node readme](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md). The simplest and recommended way to do this is [using docker](https://github.com/vegaprotocol/vega/blob/develop/datanode/README.md#using-docker), which is also described in the data node readme.

## Firewall advice
If you are running behind a firewall or other NAT based device you will need to set up some port forwarding from your router to the server. The 2 sets of ports you will need to forward are:

* For Vega ports, allowlist: TCP 3000-3010
* For Tendermint ports, allowlist: TCP 26656-26658