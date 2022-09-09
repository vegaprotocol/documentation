---
sidebar_position: 2
title: Set up server
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setting up the server and building the software

### Linux (ubuntu 22.04)
All commands are issued in the home folder of the current user.

First make sure your system is up to date
`sudo apt update && sudo apt upgrade -y`

Install git so you can pull down the source code
`sudo apt install git -y`

Install golang so you can build the source code

Fetch go 1.19
`wget https://go.dev/dl/go1.19.linux-amd64.tar.gz`

Remove any existing installation
`sudo rm -rf /usr/local/go`

Extract go 1.19
`sudo tar -C /usr/local -xzf go1.19.linux-amd64.tar.gz`

Make a bin folder
`mkdir -p ~/bin`

Set up the environment either directly in the command line or add to ~/.bashrc and source it with `source ~/.bashrc`
```bash
export GOROOT=/usr/local/go
export CGO_ENABLED=0
export GOBIN=~/bin
export PATH=$PATH:$GOROOT/bin:$GOBIN
```

Clone the Vega source code
`git clone -–branch v0.52.0 https://github.com/vegaprotocol/vega.git`

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

### Windows (10 and 11)
All commands should be run from a command prompt in the home folder of the current user `(C:\Users\<username>)`

Make sure your system is up to date by applying all Windows updates

Install git from Git - Downloading Package (git-scm.com)
Test by running `git version`

Install golang from Downloads - The Go Programming Language

Test by running `go version`

Create a folder for the executables to be installed to
`mkdir c:\Users\<username>\bin`

Set up the environment either by either using the `set` command on the command line (this only persists for the lifetime of the command line) or by going to the “Environment Variables…” settings in the control panel where there values will be permanent.

```bash
set CGO_ENABLED=0
set GOBIN=%USERPROFILE%\bin
set PATH=%PATH%:%GOBIN%
```

Check this has worked by running `set` and looking at the output

Get the Vega source code 
`git clone -–branch “v0.52.0” https://github.com/vegaprotocol/vega.git`

Move into the source folder and build the applications
```bash
cd vega
go install ./…
```

Check that everything was built correctly

```bash
vega version
vegawallet version
```

## Firewall advice
If you are running behind a firewall or other NAT based device you will need to set up some port forwarding from your router to the server. The 2 sets of ports you will need to forward are:

* TCP 3000-3010    ; Vega ports
* TCP 26656-26658    ; Tendermint ports