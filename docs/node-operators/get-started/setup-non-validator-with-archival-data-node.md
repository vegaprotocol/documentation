---
sidebar_position: 5
title: Set up a non validator with an archival data node and security https access
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This set up guide is to help users to install and run a non validator node along with an archival data node which will be configured with valid SSL details to allow it to work with the console front end. The two Vega applications will be controlled by Visor to allow for automatic upgrades.

This guide assumes you are running Linux on a AMD64 based architecture.

The first step is to download and configure Visor. The latest version can be downloaded from the releases page on github [Visor](https://github.com/vegaprotocol/vega/releases/download/v0.71.6/visor-linux-amd64.zip). Once downloaded it should be extracted to a folder that is listed in the PATH for the current user.

```shell
wget https://github.com/vegaprotocol/vega/releases/download/v0.71.6/visor-linux-amd64.zip
unzip visor-linux-amd64.zip
rm unzip visor-linux-amd64.zip
```

 Below is the command to initialise the configuration files into the location specified by the `VISOR_HOME_PATH` directory.

```shell
visor init --home VISOR_HOME_PATH --with-data-node
```

We then need to set up the config files required to start the applications. First we set up the `current` symlink. This tells Visor which folder to use when starting the applications.

```shell
ln -s <VISOR_HOME_PATH>/genesis <VISOR_HOME_PATH>/current
```

Then we update the run-config.toml file with the following settings:

```shell
name = "genesis"

[vega]
  [vega.binary]
    path = "vega"
    args = ["start", "--home", "<VEGA_HOME_PATH>",
           "--tendermint-home", "<TENDERMINT_HOME_PATH>",
           "--network-url",
           "https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json"]
  [vega.rpc]
    socketPath = "/tmp/vega.sock"
    httpPath = "/rpc"

[data_node]
  [data_node.binary]
    path = "vega"
    args = ["datanode", "start", "--home", "<DATA_NODE_HOME_PATH>"]

```

We are replaying the full chain to build up the archival historic data so we must download the same version of vega that was used when the blockchain was started (0.71.4). This can be downloaded from the [release page](https://github.com/vegaprotocol/vega/releases/download/v0.71.4). The files should be extracted into the genesis folder that was created when you initialised Visor.

```shell
cd VISOR_HOME_PATH/genesis
wget https://github.com/vegaprotocol/vega/releases/download/v0.71.4/vega-linux-amd64.zip
unzip vega-linux-amd64.zip
rm vega-linux-amd.zip
```

We initialise the vega core with the following command:

```shell
vega init --home=VEGA_HOME_PATH --tendermint-home=TENDERMINT_HOME_PATH full
```

Find the tendermint RPC address
```shell
nano TENDERMINT_HOME_PATH/tendermint/config/config.toml

[rpc]
  laddr = <RPC-ADDRESS>
```

Add it to the vega config so it can communicate to tendermint, and turn on the data node broker socket.
```shell
nano VEGA_HOME_PATH/config/node/config.toml

[Blockchain.tendermint]
  RPCAddr = <RPC-ADDRESS>

[Broker.Socket]
  Enabled = true
```

Now we need to add in the list of tendermint peers from which we can get the historic blocks to rebuild our chain. We also update the max packet size to allow larger messages to be transferred and we make sure the mempool is set up to broadcast any changes.

```shell
nano TENDERMINT_HOME_PATH/config/config.toml

persistent_peers="b0db58f5651c85385f588bd5238b42bedbe57073@13.125.55.240:26656,
                  da2c4771f2aec1749cbc8db545b2af89099cdcb7@168.119.147.148:40656,
                  13ce7373381072bc575566e702fabef0db64ffdb@20.82.255.140:26656,
                  5d02699874ea6a1e14df948b2e9f1198d23b95a7@51.222.80.128:26656,
                  abe207dae9367995526812d42207aeab73fd6418@18.158.4.175:26656,
                  198ecd046ebb9da0fc5a3270ee9a1aeef57a76ff@144.76.105.240:26656,
                  80fda55eeaa6036e5b61c11b423b073681a2b6b4@3.25.100.39:26656,
                  211e435c2162aedb6d687409d5d7f67399d198a9@65.21.60.252:26656,
                  c5b11e1d819115c4f3974d14f76269e802f3417b@34.88.191.54:26656,
                  e2379bca600a528de55e845b77de5ff480c9631c@185.146.148.107:26656,
                  0a972d61a57532ea8b521b01238bdf125fcd52b1@141.94.162.118:26656,
                  9bcebff7664a3310bf4b31a76e5547f44ffb94cc@80.190.132.234:26656,
                  61051c21f083ee30c835a34a0c17c5d1ceef3c62@51.178.75.45:26656"

max_packet_msg_payload_size=16384

[mempool]
  broadcast = true
```

We initialise the data node with the following steps:

Find out the CHAIN_ID from the genesis file in the [network repository](https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/genesis.json)

```shell
vega datanode init –-home=DATA_NODE_HOME_PATH <CHAIN_ID> --archive
```

For the data node to work we must have a postgres instance running. The easiest way to achieve that is through docker

```shell
docker run -d \
    --rm \
    --name vega_postgresql \
    -e POSTGRES_USER=vega \
    -e POSTGRES_PASSWORD=vega \
    -e POSTGRES_DB=vega \
    -p 5432:5432 \
    -v DATA_NODE_HOME_PATH:/var/lib/postgresql/data \
    timescale/timescaledb:2.8.0-pg14 &
```


The non-validator Vega node will send the events it receives from the network and the events it creates to the data node, which will then store them in a database. An API is provided to query the data stored by the data node.

```shell
visor run --home "VISOR_HOME_PATH"
```

## Configure data node SSL certificate
You will need your data node to be reachable over the internet with a proper fully qualified domain name, and a valid signed certificate. You may provide data node with a path to an existing signed certificate and corresponding private key

```toml
  [Gateway]
    HTTPSEnabled = true
    CertificateFile = "/path/to/certificate/file"
    KeyFile = "/path/to/key/file"
```

Many administrators prefer to use a tool called `certbot` for generating and signing free certificates via `LetsEncrypt`. To obtain a signed certificate with this method:
* [Install certbot ↗](https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/)
* Run `certbot certonly --standalone` to generate certificate
* Place the generated `fullchain.pem` into the `Gateway.CertificateFile` location and corresponding `privkey.pem` to `Gateway.KeyFile`.

**It is a hard requirement of the `LetsEncrypt` validation process that the tool answering its challenge is running on the standard HTTPS port (443). Therefore if you are running behind a fireway you should port forward 443 to the machine generating the certificate for the duration of the creation process** 

