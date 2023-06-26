---
sidebar_position: 2
title: Set up validator node
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';

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

Run the initialisation command to generate Visor’s home folder, with a generated home folder structure, to your provided `VISOR_HOME_PATH`:

**Vega only**

```shell
visor init --home VISOR_HOME_PATH
```

**With non-validator connected to data node**

```shell
visor init --home VISOR_HOME_PATH --with-data-node
```

## Configure Visor
Configure Visor in the configuration file `config.toml`, located at `VISOR_HOME_PATH/config.toml`. 

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
Prepare the first run configuration in `VISOR_HOME_PATH/genesis/run-config.toml`. The configuration allows you to specify what binaries and their arguments will be run in a specific upgrade. 

Be sure to check that you use the correct location for the relevant Vega binary, and include the specific arguments for your set-up.

Note: By default, Visor automatically links the genesis folder as the current folder, if the current folder does not exist.

Example of configuration to customise:
```toml
name = "genesis"

[vega]
  [vega.binary]
	path = "/path/vega-binary"
	args = ["node",
		"--home", "VEGA_HOME_PATH",
		"--tendermint-home", "TENDERMINT_HOME_PATH" ]
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
      ExecStart="visor" run --home "VISOR_HOME_PATH"
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

Once you have an Ethereum archive node, insert the URL in `YOUR_VEGA_HOME/config/node/config.toml`, in the section:

```toml
[Ethereum]
    Level = "Info"
    RPCEndpoint = "INSERT_ARCHIVE_NODE_URL_HERE"
    RetryDelay = "15s"
```

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

[Create a Vega Wallet](../../tools/vega-wallet/cli-wallet/latest/create-wallet.md) and public key, using the software version that matches the network's software version.

We recommend you use an isolated key. Read the guide on how to isolate Vega wallet keys: [Isolate keys](../../tools/vega-wallet/cli-wallet/latest/guides/isolate-keys.md)

Give the node access to the key using the following command: 
```
vega nodewallet import --chain=vega --home="YOUR_VEGA_HOME_PATH" --wallet-passphrase-file="file/containing/account/passphrase" --wallet-path="PATH_FOR_YOUR_WALLET_HOME"
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

Set the address of your clef instance in the Vega configuration (`YOUR_VEGA_HOME/config/node/config.toml`):
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
vega nodewallet import --chain=ethereum --home="YOUR_HOME_PATH" --clef-account-address="0xYOUR_WALLET_ADDRESS"
```

#### Using a keystore account file
You can either import an existing keystore or create a new one. (Learn how to create a keystore [using geth ↗](https://geth.ethereum.org/docs/getting-started))

Import an existing keystore using the following command:

```shell
vega nodewallet import --chain=ethereum --home="YOUR_HOME_PATH" --wallet-passphrase-file="YOUR_PASSPHRASE_FILE_PATH" --wallet-path="YOUR_HOME_PATH"
```

## Modify Tendermint config
Vega being a decentralised network, you will need an entry point to join it. This is done by connecting to one or more nodes in the network when you start your node. 

This step needs to be done manually. You will first need to reach out to another node operator in the network, such as through [Discord ↗](https://discord.com/channels/720571334798737489/869236034116943903), or directly messaging, to get their node ID and the address of their node.

Use that node information to inform the persistent peers. The persistent peers field is a list of Node IDs and addresses of nodes separated by a `@` character.

Update the tendermint config located at `YOUR_TENDERMINT_HOME/config/config.toml` and set the `persistent_peers` field under the `[p2p]` section.

Here's an example:

```toml
[p2p]
persistent_peers = "55b8ac477ddd6c0c9bae411dfa6ebfb46e7b4022@veganodeoperator.com:26656,2d1bbf1229bd7f8e57e89c61346ab6928d61881b@127.0.0.1:26656"
```


Under `Mempool Configuration Option`, ensure that `broadcast = true`.

### Update Tendermint genesis
To start successfully, tendermint needs the genesis file from the network you will be trying to join. This file need to be located in `YOUR_TENDERMINT_HOME/config/genesis.json`. Download the genesis file and use it to replace the genesis in your config.

You can find genesis files in the [networks repository ↗](https://github.com/vegaprotocol/networks) for the mainnet and validator-run testnet networks. 

Note: For validator-run testnet, the genesis must be a URL to a remote file, not saved locally on disk.

For example, to join mainnet you will need the following [genesis file ↗](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json).

## Synchronise your node
You can either start the node from a snapshot (recommended, particularly for a long chain), or replay the full chain history to get up-to-date. If using Visor for protocol upgrades, follow the instructions below to start the node with Visor.

### Start node from a snapshot
[Snapshots](../how-to/use-snapshots.md): Use a recent network snapshot to start your node without having to replay the entire chain.

After you choose the snapshot you're starting from: 

**If you're using Visor**, start your node by running the service manager of your choice and use the following command:

```shell
visor run --home "VISOR_HOME_PATH"
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
visor run --home "VISOR_HOME_PATH"
```

Once your node is synchronised, you'll need to self-stake, and then announce the node to the network and then the community.

## Associate tokens to your Vega key
Before you announce your node, you will need to have <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens"/> Vega associated to your Vega key to self-stake (below).

Use the [Sepolia VEGA contract address on the governance dApp ↗](https://validator-testnet.governance.vega.xyz/) to call the contract and faucet tokens to your Ethereum key. 

The tokens that you want to use for self-staking must be available on an Ethereum wallet, and then associated to the same Vega public key you used to set up the node. 

You can do this by [importing the Vega Wallet](../../tools/vega-wallet/cli-wallet/latest/guides/restore-wallet) you created for your node wallet, onto your local computer using the Vega Wallet recovery phrase.

Once you have tokens, connect your Ethereum wallet and your Vega Wallet, and associate the tokens to your Vega public key using the [governance dApp ↗](https://validator-testnet.governance.vega.xyz/staking/). Below, you'll self-nominate (self-stake) to your node.

The association will need to be confirmed by both the Ethereum and Vega blockchains, and may take some time.

## Announce node on-chain
You'll need to know the [current epoch ↗](https://validator-testnet.governance.vega.xyz/staking), and have the following data to hand: the URL for your validator website, and the URL for the avatar that will show up on the governance dApp next to your node name.

```shell
vega announce_node --home="YOUR_VEGA_HOME_PATH" --info-url="YOUR_VALIDATOR_URL" --avatar-url="YOUR_AVATAR_URL" --country="UK" --name="YOUR_NODE_NAME" --from-epoch="CURRENT_EPOCH"
```

Setting the optional argument `--submitter-address` triggers the Vega network to automatically issue signature bundles that can be used to update signer set changes on the Multisig Control contract. This means if your node is promoted to a consensus validator it is easier for you to add your node's Ethereum key to the contract and to continue receiving rewards. See [maintaining the multisig contract](../how-to/maintain-multisig-contract.md) for more information.

## Nominate your node
To move on to self-staking, wait until you see your node on the validator list by querying the API or checking the [governance dApp ↗](https://validator-testnet.governance.vega.xyz/staking/).

Then, associate your tokens and nominate your node using the [governance dApp ↗](https://validator-testnet.governance.vega.xyz/staking/) or by interacting directly with the smart contract.

## Forwarding Ethereum events
Once your node is up and running, you'll need to maintain it, and ensure that it continues to take part in the network.

Every time a method is called successfully on the smart contracts, for example a deposit on the collateral bridge, an event is emitted by the smart contract. Your validator node will need to be monitoring all blocks created by Ethereum and look for these events, and be ready to forward them to the Vega chain if selected.

For your node to be eligible for promotion, it will need to forward a number of those Ethereum events. The number is set by a network parameter, with a value of <NetworkParameter frontMatter={frontMatter} param="network.validators.minimumEthereumEventsForNewValidator" />.

## Announce node off-chain
[Create a validator profile on the forum ↗](https://community.vega.xyz/c/mainnet-validator-candidates/23) describing the experience you have, security practices and policies, how you will ensure maximum uptime, how you'll meet suitable performance standards, your communication channels for questions and the role you intend to take in Vega's governance.

Share your profile with the community, for example in [the Validators Discord channel ↗](https://discord.com/channels/720571334798737489/869236034116943903), to attract stakers to nominate your node.

## Next steps
If your node is promoted into the consensus validator set then the Multisig Contract will need to be updated so that you and your nominators can continue to receive rewards. You may also need to upgrade the software, restart the network and rotate your keys (for security). 

See the following guides to learn how to: 

* [Propose and enact an upgrade](../how-to/upgrade-network.md)
* [Restart the network](../how-to/restart-network.md)
* [Rotate Ethereum keys](../how-to/rotate-ethereum-keys.md)
* [Rotate Vega keys](../how-to/rotate-vega-keys.md)
* [Use snapshots](../how-to/use-snapshots.md)
* [Maintain the multisig contract](../how-to/maintain-multisig-contract.md)
