# Running a data node

A data node gives the users a way to query the state of the network and included historic information about the objects over the lifetime of the blockchain. A data node connects to a non validator node and receives a stream of events as state is altered in the node. The data node stores these events and uses them to generate rich information which can be queried via APIs.

A data node can be started in 2 ways, first it can be connected to a node which is replaying the chain from block 0. Secondly it can connect to a node which is starting from a specific snapshot in the chains history. The advantage of performing a full replay of the chain is that the data node can contain all historic information from the beginning of chain, however it takes a considerable amount of time to replay and process the chain. As a rough estimate it can take around 1 full day to replay the blocks generated over a 2 month period. The advantage of the second option is that the data node can be started up very quickly to allow clients to access the current live information within an hour but the historic information will not be available.

# Running the backend database
The data node relies on the postgres database with a timescaledb plugin to hold all it's information. The easiest way to run this is using docker. Here is an example script that will start up the database in a way we can use it

```script
docker run -d \
    --rm \
    --name vega_postgresql \
    -e POSTGRES_USER=vega \
    -e POSTGRES_PASSWORD=vega \
    -e POSTGRES_DB=vega \
    -p 5432:5432 \
    -v $POSTGRES_PATH/data:/var/lib/postgresql/data \
    timescale/timescaledb:2.8.0-pg14 \
        -c "max_connections=50" \
        -c "log_destination=stderr" \
        -c "work_mem=5MB" \
        -c "huge_pages=off" \
        -c "shared_memory_type=sysv" \
        -c "dynamic_shared_memory_type=sysv" \
        -c "shared_buffers=256MB" \
        -c "temp_buffers=5MB"
```
Make sure this is working correctly before continuing with the later steps.

```
user@veganode:~/vega$ psql -U vega -h localhost
Password for user vega:
psql (14.9 (Ubuntu 14.9-0ubuntu0.22.04.1), server 14.5)
Type "help" for help.

vega=#
```




## Starting a data node from block 0

If a data node is going to be started from block zero, the non validator node must also be starting from block 0. We assume here that the non validator node is already configured (follow the instructions here **non validator instruction**).

1. Edit the vega config file at $VEGA_PATH/config/node/config.toml and set the value at [Broker]->[Broker.Socket]->Enabled = true
2. Initialise the data node config files
```
vega datanode init --home=$DATANODE_PATH "vega-mainnet-0011" --archive
```
3. Start the data node
```
vega datanode start --home=/vega/datanode
```
4. Now start the node and confirm that both apps are running and you can see the block height increasing on both.


## Starting the data node from network history

If network history is to be used to get the current state of the data node, we need to start the non validator node using a snapshot. Follow the instructions here (link to instructions for **non validator snapshots**)

1. Edit the vega config file at $VEGA_PATH/config/node/config.toml and set the value at [Broker]->[Broker.Socket]->Enabled = true
2. Initialise the data node config files
```
vega datanode init --home=$DATANODE_PATH "vega-mainnet-0011" --archive
```
3. Edit the data node configuration file at $DATANODE_PATH/config/data-node/config.toml and set `AutoInitialiseFromNetworkHistory` = true
4. Find out the list of network history bootstrap nodes by going to a URL like this (https://api.vega.community/api/v2/networkhistory/bootstrap)
5. Paste the list into the section [NetworkHistory]->[NetworkHistory.Store]->BootstrapPeers
6. Start the data node
```
vega datanode start --home=/vega/datanode
```
7. Now start the node and confirm that both apps are running and you can see the block height increasing on both.

## Using visor to control and upgrade your data node

We strongly recommend using the tool `visor` to start up the data node as it will transparently take care of upgrading the node as new versions of the software are required. Follow the instructions for visor in the non validator node docs to get the tool downloaded and set up for the vega core (linky **here**)

1. Edit the configuration file in $VISOR_PATH/genesis/run-config.toml and add the follow section to the bottom of the file
```toml
[data_node]
  [data_node.binary]
    path = "vega data-node"
    args = ["start", "--home=$DATANODE_PATH"]
```
2. Start visor with the command
```
visor --home=$VISOR_PATH run
```

## Configure the data node SSL certificate
You will need your data node to be reachable over the internet with a proper fully qualified domain name, and a valid signed certificate. You may provide data node with a path to an existing signed certificate and corresponding private key

```toml
  [Gateway]
    HTTPSEnabled = true
    CertificateFile = "/path/to/certificate/file"
    KeyFile = "/path/to/key/file"
```

Many administrators prefer to use a tool called `certbot` for generating and signing free certificates via `LetsEncrypt`. To obtain a signed certificate with this method:
* [Install certbot](https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/)
* Run `certbot certonly --standalone` to generate certificate
* Place the generated `fullchain.pem` into the `Gateway.CertificateFile` location and corresponding `privkey.pem` to `Gateway.KeyFile`.

**It is a hard requirement of the `LetsEncrypt` validation process that the tool answering its challenge is running on the standard HTTP/HTTPS ports(80, 443). Therefore if you are running behind a firewall you should port forward 80+443 to the machine generating the certificate for the duration of the creation process** 