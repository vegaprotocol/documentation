---
sidebar_position: 2
title: Set up validator node
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';

The Vega node is the implementation of the Vega protocol. It secures the network using VEGA, the network's governance and staking token, and relies on a BFT consensus engine now known as CometBFT, formerly Tendermint.

## OS and software
For production use, we recommend using the Linux binary on Ubuntu as this is the platform used by nodes on Fairground, the Vega testnet, and is the most widely tested so far.

See the [infrastructure requirements](../requirements/infrastructure.md) page for a full list of what you need to run various parts of the Vega toolchain.

There are 2 ways to start up a validator node:
* Replay the full chain from the start
* Use a snapshot from the existing network to jumpstart the node at a point closer to the current block height

Replay the full chain if you want all history. Use a snapshot if you want to start running quickly and don't need the history.

## Start node from block 0

1. Download version 0.71.4 of the Vega executable. You can find it on its release page in the [Vega GitHub repo ↗](https://github.com/vegaprotocol/vega/releases/tag/v0.71.4%2Bfix). Unzip this file and make sure it is in your command line path.

If you prefer to build the code yourself, the instructions can be found inside the code repo at [BUILDING ↗](https://github.com/vegaprotocol/vega/blob/develop/BUILDING.md).

2. Check it is working by trying:

```
user@veganode:~/vega/bin$ vega version
Vega CLI v0.71.4 (8e5767b20902097c79e8c846cf37f2b5d01dbff8)

```

3. Initialise the node 

```
vega init --home=$YOUR_VEGA_HOME_PATH --tendermint-home=$YOUR_TENDERMINT_HOME_PATH full
```

This creates a set of configuration files which you then need to alter for your specific instance.

4. Edit the file `$YOUR_TENDERMINT_HOME_PATH/config/config.toml`. Find the RPC address located in the configuration point `[rpc]->laddr`
 
5. Use this value to update the address in the file `$YOUR_VEGA_HOME_PATH/config/node/config.toml`

```toml
 [Blockchain.tendermint]
    RPCAddr = <RPC address>
```

## Configure the components and run it
Once you have all the executables you need, you must configure them to run correctly and to connect to the existing network. 

This will also initiate the node wallet software, which you'll be prompted to create a password for. You'll need to set another passphrase for the wallet itself, in the next section.

First, generate the default configuration files for Vega and Tendermint. You can then alter those to the specific requirements.

The below command will create home paths (if they don't already exist) and generate the configuration in the homes you chose. **It's recommended that you use different folders for your Vega and Tendermint homes. Keep track of which home you're referring to as you progress.**

```
vega init --home=YOUR_VEGA_HOME_PATH --tendermint-home=YOUR_TENDERMINT_HOME_PATH validator
```

To update your node configuration, such as to set up ports for the APIs, edit the config file:

```
YOUR_VEGA_HOME_PATH/config/node/config.toml
```

## Initialise Visor for smooth protocol upgrades
Visor manages protocol upgrades, allowing the nodes running a network to automatically update to the latest version of the Vega protocol, without requiring manual intervention. Using Visor is optional, but recommended. 

* Get a quick overview of Visor, and what it does on the [Visor overview](../visor.md) page.
* See instructions for how to [upgrade your node](../how-to/upgrade-network.md).

The command to initialise Visor will vary depending on whether you want to use Visor with a validator node or with non-validator connected to a data node. 

Run the initialisation command to generate Visor’s home folder, with a generated home folder structure, to your provided `YOUR_VISOR_HOME_PATH`:

**Vega only**

```shell
visor init --home YOUR_VISOR_HOME_PATH
```

## Configure Visor
Configure Visor in the configuration file `config.toml`, located at `YOUR_VISOR_HOME_PATH/config.toml`. 

This configuration allows you to modify Visor functionality. See the [Visor config documentation](https://github.com/vegaprotocol/vega/blob/develop/visor/visor-config.md) for more details on what you can configure and why.
    
Example of configuration you may want to customise: 
```toml
  maxNumberOfRestarts = 1
  maxNumberOfFirstConnectionRetries = 100
  stopSignalTimeoutSeconds = 60
  restartsDelaySeconds = 10
  
  [autoInstall]
	  enabled = false
```
### Prepare initial Visor run
Prepare the first run configuration in `YOUR_VISOR_HOME_PATH/genesis/run-config.toml`. The configuration allows you to specify what binaries and their arguments will be run in a specific upgrade. 

Be sure to check that you use the correct location for the relevant Vega binary, and include the specific arguments for your set-up.

Note: By default, Visor automatically links the genesis folder as the current folder, if the current folder does not exist.

Example of configuration to customise:
```toml
name = "genesis"

[vega]
  [vega.binary]
	path = "/path/vega-binary"
	args = ["node",
		"--home", "YOUR_VEGA_HOME_PATH",
		"--tendermint-home", "YOUR_TENDERMINT_HOME_PATH" ]
[vega.rpc]
	socketPath = "VEGA_ADMIN_SOCKET_PATH/vega.sock"
	httpPath = "/rpc"
```

### Visor service manager
Use a service manager (for example Systemd) to run Visor. While you can use any service manager for running Visor, below is an example of Systemd service definition.

```toml
[Unit]
      Description=vegavisor
      Documentation=https://github.com/vegaprotocol/vega
      After=network.target network-online.target
      Requires=network-online.target
  [Service] User=vega Group=vega
      ExecStart="visor" run --home "YOUR_VISOR_HOME_PATH"
      TimeoutStopSec=10s
      LimitNOFILE=1048576
      LimitNPROC=512
      PrivateTmp=true
      ProtectSystem=full
      AmbientCapabilities=CAP_NET_BIND_SERVICE
  [Install]
      WantedBy=multi-user.target
```

## Modify Vega config
When announcing your node (below), the node will need to be pointing to a Tendermint node. Set that in your Vega config based on information in the Tendermint config file. 

Find the address for the RPC server in your Tendermint config `YOUR_TENDERMINT_HOME_PATH/config/config.toml`, under the heading `TCP or UNIX socket address for the RPC server to listen on`. 

Use that address in your node's Vega config `YOUR_VEGA_HOME_PATH/config/node/config.toml`

```toml
[Blockchain]
  ...
  [Blockchain.Tendermint]
    Level = "Info"
    RPCAddr = "tcp://your.rpc.address"
```

### Point to Ethereum node
In order to validate events happening on the Ethereum bridge, each Vega validator node needs to be connected to an **Ethereum archive node** (not a full node). The core software connects to the `eth_getLogs` endpoint, which is only available on archive nodes. This allows the Vega node to verify that an event happened on Ethereum (e.g: a deposit or a withdrawal).

The Ethereum node address for the RPC endpoint is set in the configuration. 

Once you have an Ethereum archive node, insert the URL in `YOUR_VEGA_HOME_PATH/config/node/config.toml`, in the section:

```toml
[Ethereum]
    Level = "Info"
    RPCEndpoint = "INSERT_ARCHIVE_NODE_URL_HERE"
    RetryDelay = "15s"
```

When a Vega validator node is watching for Ethereum events it will call the `eth_getLogs` endpoint over a set of Ethereum blocks for particular contracts. By default, the maximum block span Vega will use when making this call is 10,000 blocks. The maximum block span allowed by some Ethereum node providers can be less than this. The configuration option `MaxEthereumBlocks` can be used to reduce the block span used by Vega so that it does not exceed the maxmimum limit imposed by an Ethereum node provider:

```
[EvtForward.Ethereum]
  Level = "Info"
  MaxEthereumBlocks = 10000
  PollEventRetryDuration = "20s"
```

## Support EVM chains for oracle data
To support markets receiving oracle data from EVM chains, your node **must** specify RPC credentials in the Vega config for *Gnosis* and *Arbitrum One* chains.

Some RPC providers include:

- [Blast ↗](https://blastapi.io/) - 40 calls/sec(12,000,000 calls/month)
- [OnFinality ↗](https://onfinality.io/) - 500,000 calls/day (15,000,000 calls/month)
- [Ankr ↗](https://ankr.com/) - 30 calls/sec
- [Chainnodes ↗](https://chainnodes.org/) - 25 calls/sec (12,500,000 calls/month)

```title="YOUR_VEGA_CONFIG/config/node/config.toml"
[Ethereum]
  ...
  ...
  
  [[Ethereum.EVMChainConfigs]]
    ChainID = "100"
    RPCEndpoint = "YOUR_RPC_ENDPOINT_FOR_GNOSIS"
  [[Ethereum.EVMChainConfigs]]
    ChainID = "42161"
    RPCEndpoint = "YOUR_RPC_ENDPOINT_FOR_ARBITRUM_ONE"
...
```

### Point to Arbitrum node
In order to validate events happening on the Arbitrum bridge, each Vega validator node needs to be connected to an **Arbitrum archive node** (not a full node). This allows the Vega node to verify that an event happened on Arbitrum.

The Arbitrum node address for the RPC endpoint is set in the configuration. 

Once you have an Arbitrum archive node, insert the URL in `YOUR_VEGA_HOME_PATH/config/node/config.toml`, in the section:

```toml
[Ethereum]
  Level = "Info"
  RPCEndpoint = "ETH-RPC-ENDPOINT"
  RetryDelay = "15s"

  [[Ethereum.EVMBridgeConfigs]]
    ChainID = "42161" << use this chain ID
    RPCEndpoint = "ARBITRUM_RPC" <<< set your archival node RPC endpoint here
```

When a Vega validator node is watching for Ethereum events it will call the `eth_getLogs` endpoint over a set of Ethereum blocks for particular contracts. By default, the maximum block span Vega will use when making this call is 10,000 blocks. The maximum block span allowed by some Ethereum node providers can be less than this. The configuration option `MaxEthereumBlocks` can be used to reduce the block span used by Vega so that it does not exceed the maxmimum limit imposed by an Ethereum node provider:

```
[EvtForward.Ethereum]
  Level = "Info"
  MaxEthereumBlocks = 10000
  PollEventRetryDuration = "20s"
```


:::warning
You must select a big enough value for the `MaxEthereumBlocks` because Arbitrum produces about five blocks per second. If the range is too small, your node will not keep up with the rest of the network.
:::

:::note Find blocks spam for your RPC provider
You must check how big the span of the blocks you can use with your provider. Otherwise, your validator won't be able to validate events from the Arbitrum network.

The default value(10000) is usually more than enough. If your provider limits it, you should use the maximum allowed range. 

To find the block span allowed by your RPC provider call the following query:

```
curl https://RPC_URL_FOR_ARBITRUM \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getLogs","params":[{"address": "0xE4D5c6aE46ADFAF04313081e8C0052A30b6Dd724", "fromBlock": "207349352", "toBlock": "207349392"}],"id":1,"jsonrpc":"2.0"}'
```

Manipulate the `fromBlock` and `toBlock` values to find the correct allowed block range.
:::



## Set up the node wallet
Each validator node requires two cryptographic wallets to operate properly:
* Ethereum wallet: Used to sign transactions going through the ERC20 bridge
* Vega wallet: Used to sign transaction sent by validators in the Vega network

The public key of the Tendermint node also needs to be saved in the node wallet.

All this information needs to be checked in properly before starting the node. When the network starts or a node is added to the validator set, this information will be checked against the transaction used to register the node on the network. Any incorrect set-up will stop the node from joining the network.

You need to generate or import the wallet information for Tendermint, Vega and Ethereum. See below for [Ethereum wallet instructions](#ethereum-wallet).

:::note
You will be asked for a passphrase for your node wallet, which you created when you initialised Vega. Make sure to save this passphrase in a text file, somewhere secure, as it allows you to unlock the node wallet.
:::

### Set up the Vega wallet
To use your Vega Wallet for staking with the governance dApp (below), you will need to either: 
a. use a browser running on your server to access the governance dApp, and Ethereum wallet, and connect locally to the wallet
b. regenerate the wallet on your local machine using the recovery phrase. If you do regenerate the wallet locally, consider removing that wallet from your local machine once you've self-staked, to keep your keys as secure as possible.

[Create a Vega Wallet](../../tools/vega-wallet/cli-wallet/create-wallet.md) and public key, using the software version that matches the network's software version.

We recommend you use an isolated key. Read the guide on how to isolate Vega wallet keys: [Isolate keys](../../tools/vega-wallet/cli-wallet/guides/isolate-keys.md)

Give the node access to the key using the following command: 
```
vega nodewallet import --chain=vega --home="YOUR_VEGA_HOME_PATH" --wallet-passphrase-file="file/containing/account/passphrase" --wallet-path="YOUR_WALLET_HOME_PATH"
```

:::info
You can verify the information saved in your node wallet using the following command:
```
vega nodewallet --home="YOUR_VEGA_HOME_PATH" show 
```
:::

### Save your Tendermint public key
To save the Tendermint public key in your node wallet, look in your tendermint config `YOUR_TENDERMINT_HOME_PATH/config/priv_validator_key.json` for your tendermint public key, and import it.

```
vega nodewallet import --chain=tendermint --tendermint-pubkey="YOUR_TENDERMINT_PUBKEY" --home=YOUR_VEGA_HOME_PATH
```

If your Tendermint node is set up to use `tmkms`, then refer to the [tmkms documentation ↗](https://github.com/iqlusioninc/tmkms) to get your public key.

:::note
If you are not using tmkms (e.g: the default software keys generated by tendermint, run the following command instead:
```
vega nodewallet import --chain=tendermint --home="YOUR_VEGA_HOME_PATH" --tendermint-home="YOUR_TENDERMINT_HOME_PATH"
```
This will read the Tendermint keys from the configuration path, and set up your node wallet properly.
:::

### Set up your Ethereum wallet
Vega supports two types of Ethereum wallet: you can either register a wallet available from a clef instance or import a keystore file (e.g: create with `geth account`).

#### Using clef
To set up your clef instance please refer to the [clef documentation ↗](https://geth.ethereum.org/docs/tools/clef/introduction).

Set the address of your clef instance in the Vega configuration (`YOUR_VEGA_HOME_PATH/config/node/config.toml`):
```Toml
[NodeWallet]
  Level = "Info"
  [NodeWallet.ETH]
    Level = "Info"
    Address = ""
    ClefAddress = "http://your.clef.instance.network:3334"
```

Alternatively you can run the following command and specify the flag:
```
--eth.clef-address="http://your.clef.instance.network:3334"
```

Then run the following command:

```shell
vega nodewallet import --chain=ethereum --home="YOUR_VEGA_HOME_PATH" --clef-account-address="0xYOUR_WALLET_ADDRESS"
```

#### Using a keystore account file
You can either import an existing keystore or create a new one. (Learn how to create a keystore [using geth ↗](https://geth.ethereum.org/docs/getting-started))

Import an existing keystore using the following command:

```shell
vega nodewallet import --chain=ethereum --home="YOUR_VEGA_HOME_PATH" --wallet-passphrase-file="YOUR_PASSPHRASE_FILE_PATH" --wallet-path="YOUR_WALLET_HOME_PATH"
```

## Modify Tendermint config
Vega being a decentralised network, you will need an entry point to join it. This is done by connecting to one or more nodes in the network when you start your node. 

This step needs to be done manually. You will first need to reach out to another node operator in the network, such as through [Discord ↗](https://discord.com/channels/720571334798737489/869236034116943903), or directly messaging, to get their node ID and the address of their node.

Use that node information to inform the persistent peers. The persistent peers field is a list of Node IDs and addresses of nodes separated by a `@` character.

Update the tendermint config located at `YOUR_TENDERMINT_HOME_PATH/config/config.toml` and set the `persistent_peers` field under the `[p2p]` section.

Here's an example:

```toml
[p2p]
persistent_peers = "55b8ac477ddd6c0c9bae411dfa6ebfb46e7b4022@veganodeoperator.com:26656,2d1bbf1229bd7f8e57e89c61346ab6928d61881b@127.0.0.1:26656"
```

Under `Mempool Configuration Option`, ensure that `broadcast = true`.

### Update Tendermint genesis
To start successfully, tendermint needs the genesis file from the network you will be trying to join. This file need to be located in `YOUR_TENDERMINT_HOME_PATH/config/genesis.json`. Download the genesis file and use it to replace the genesis in your config.

You can find genesis files in the [networks repository ↗](https://github.com/vegaprotocol/networks) for mainnet and for testnet, visit [networks internal ↗](https://github.com/vegaprotocol/networks-internal). 

Note: For testnet, the genesis must be a URL to a remote file, not saved locally on disk.

For example, to join mainnet you will need the following [genesis file ↗](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json).

## Synchronise your node
You can either start the node from a snapshot (recommended, particularly for a long chain), or replay the full chain history to get up-to-date. If using Visor for protocol upgrades, follow the instructions below to start the node with Visor.

### Start node from a snapshot
[Snapshots](../how-to/use-snapshots.md): Use a recent network snapshot to start your node without having to replay the entire chain.

After you choose the snapshot you're starting from: 

**If you're using Visor**, start your node by running the service manager of your choice and use the following command:

```shell
visor run --home "YOUR_VISOR_HOME_PATH"
```

**If you're not using Visor**, start your node by running the following command e.g. for the validator-run testnet:

```shell
vega start --home="YOUR_VEGA_HOME_PATH" --nodewallet-passphrase-file="YOUR_PASSPHRASE_FILE_PATH" --network=testnet2
```

### Replay from genesis
To replay all history from genesis: 

You can set a genesis file when starting the node with the following command, e.g. for the validator-run testnet:

```shell
vega start --home="YOUR_VEGA_HOME_PATH" --nodewallet-passphrase-file="YOUR_PASSPHRASE_FILE_PATH" --network=testnet2
```

If using Visor, configure the node with Visor, including the required args (flags) for network, etc, and then start Visor with the service manager of your choice using the following command:

```shell
visor run --home "YOUR_VISOR_HOME_PATH"
```

Once your node is synchronised, you'll need to self-stake, and then announce the node to the network and then the community.

## Associate tokens to your Vega key
Before you announce your node, you will need to have <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens"/> Vega associated to your Vega key to self-stake (below).

Use the [Sepolia VEGA contract address on the governance dApp ↗](https://governance.fairground.wtf/) to call the contract and faucet tokens to your Ethereum key. 

The tokens that you want to use for self-staking must be available on an Ethereum wallet, and then associated to the same Vega public key you used to set up the node. 

You can do this by [importing the Vega Wallet](../../tools/vega-wallet/cli-wallet/guides/restore-wallet) you created for your node wallet, onto your local computer using the Vega Wallet recovery phrase.

Once you have tokens, connect your Ethereum wallet and your Vega Wallet, and associate the tokens to your Vega public key using the [governance dApp ↗](https://governance.fairground.wtf/validators). 

The association will need to be confirmed by both the Ethereum and Vega blockchains, and may take some time.

Below are the instructions to self-nominate (self-stake) to your node.

## Announce node on-chain
You'll need to know the [current epoch ↗](https://governance.fairground.wtf/validators), and have the following data to hand: the URL for your validator website, and the URL for the avatar that will show up on the governance dApp next to your node name.

```shell
vega announce_node --home="YOUR_VEGA_HOME_PATH" --info-url="YOUR_VALIDATOR_URL" --avatar-url="YOUR_AVATAR_URL" --country="UK" --name="YOUR_NODE_NAME" --from-epoch="CURRENT_EPOCH"
```

Setting the optional argument `--submitter-address` triggers the Vega network to automatically issue signature bundles that can be used to update signer set changes on the Multisig Control contract. This means if your node is promoted to a consensus validator it is easier for you to add your node's Ethereum key to the contract and to continue receiving rewards. See [maintaining the multisig contract](../how-to/maintain-multisig-contract.md) for more information.

## Nominate your node
To move on to self-staking, wait until you see your node on the validator list by [querying the API](../../api/rest/data-v2/trading-data-service-list-nodes.api.mdx).

Then, associate your tokens and nominate your node using the governance dApp: `https://governance.fairground.wtf/validators/<NODE'S_VEGA_PUBKEY>`. Alternatively you can interact directly with the smart contract.

Your node will be visible on the governance dApp in the epoch after you self-stake.

## Forwarding Ethereum events
Once your node is up and running, you'll need to maintain it, and ensure that it continues to take part in the network.

Every time a method is called successfully on the smart contracts, an event is emitted by the smart contract. One example is a deposit on the collateral bridge. Your validator node will need to monitor all blocks created by Ethereum and look for these events, and be ready to forward them to the Vega chain if selected.

For your node to be eligible for promotion, it will need to forward <NetworkParameter frontMatter={frontMatter} param="network.validators.minimumEthereumEventsForNewValidator" hideName={true} /> of those Ethereum events. The number is set by a network parameter.

## Announce node off-chain
[Create a validator profile on the forum ↗](https://community.vega.xyz/c/mainnet-validator-candidates/23) describing the experience you have, security practices and policies, how you will ensure maximum uptime, how you'll meet suitable performance standards, your communication channels for questions and the role you intend to take in Vega's governance.

Share your profile with the community, for example in [the Validators Discord channel ↗](https://discord.com/channels/720571334798737489/869236034116943903), to attract stakers to nominate your node.

## Update multisig contract
If your node is promoted into the consensus validator set, then the multisig contract **must be updated**, or you and your nominators will not receive rewards. 

If you have replaced another validator at the end of an epoch, then failure to add your node **and** remove the node yours has replaced means rewards will be withheld from all consensus validators and their nominators until this is resolved.

Read the guide on how to [maintain the multisig contract](../how-to/maintain-multisig-contract.md).

## Next steps
Once your validator node is up and running, you will eventually need to upgrade the software, restart the network and rotate your keys (for security).

See the following guides to learn how to: 

* [Propose and enact an upgrade](../how-to/upgrade-network.md)
* [Restart the network](../how-to/restart-network.md)
* [Rotate Ethereum keys](../how-to/rotate-ethereum-keys.md)
* [Rotate Vega keys](../how-to/rotate-vega-keys.md)
* [Use snapshots](../how-to/use-snapshots.md)