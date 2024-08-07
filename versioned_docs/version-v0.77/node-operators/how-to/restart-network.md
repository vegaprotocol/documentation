---
sidebar_position: 6
title: How to restart and upgrade a network with checkpoints
sidebar_label: Restart network with checkpoints
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vega networks support restarts using checkpoints. Checkpoints are a minimal save of the state of the network every N block, or, after funds are moved in or out of the network. They are both a way of restarting a clean chain with the current view of all accounts balances, and a security measure in order to not misplace any funds in case of a major issue that would require a restart of the chain.

:::note Using Visor
If you're using Visor for protocol upgrades, you'll need to use it to stop and start the node software. Read more:

* [Set up a node with Visor](../get-started/setup-validator#initialise-visor-for-smooth-protocol-upgrades)
* [Propose and execute a protocol upgrade](upgrade-network.md)
:::

## Verify your node wallet keys (do this first)

In a recent version of the Vega core, validation has been added at runtime to ensure the keys that validators have set up in the genesis block matches those saved in the node wallet.

Do this by by running the following command:
```
vega genesis new validator --tm-home="YOUR_TENDERMINT_HOME" --home="YOUR_VEGA_HOME" --country="any" --info-url="any" --name="any"
```

:::note
The 3 flags `--country, --info-url, --name` here are placeholders to run the command, only the output is important
:::

The output of the command should look similar to this:
```
Enter node wallet passphrase:
Info to add in genesis file under `validators` key
{
  "address": "B0CAF4EC9AAC7C256733E09471AC16700F973222",
  "pub_key": {
    "type": "tendermint/PubKeyEd25519",
    "value": "plmxJSjg5IC7r8yLWBQUFFTosvXC+rTpbXgf0kCoqoY="
  },
  "power": "10",
  "name": "V"
}
Info to add in genesis file under `app_state.validators` key
{
    "plmxJSjg5IC7r8yLWBQUFFTosvXC+rTpbXgf0kCoqoY=": {
      "id": "1da3c57bfc2ff8fac2bd2160e5bed5f88f49d1d54d655918cf0758585f248ef7",
      "vega_pub_key": "ec066610abbd1736b69cadcb059b9efdfdd9e3e33560fc46b2b8b62764edf33f",
      "vega_pub_key_index": 1,
      "ethereum_address": "0xDdF662BBb29EB7a42340E426A75dd13337E482fc",
      "tm_pub_key": "plmxJSjg5IC7r8yLWBQUFFTosvXC+rTpbXgf0kCoqoY=",
      "info_url": "some",
      "country": "FR",
      "name": "V",
      "avatar_url": "",
      "from_epoch": 0
    }
}
```

You should the verify that your validator information set in the [genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) matches the one from the output of the command. In particular, your Tendermint public key (`plmxJSjg5IC7r8yLWBQUFFTosvXC+rTpbXgf0kCoqoY=` here), Vega public key (`ec066610abbd1736b69cadcb059b9efdfdd9e3e33560fc46b2b8b62764edf33f` here) and Ethereum address (`0xDdF662BBb29EB7a42340E426A75dd13337E482fc` here) need to match.

Should there be a difference between the keys in the genesis file and those in the output of the command, this should be raised on Discord.

## Update configuration
You can prepare your configuration but you may not want to update your mainnet node with the configuration before it's stopped.

### Add the Tendermint public key to your node wallet
The node wallet now requires your Tendermint public key. You can save this key by running the following Vega command:
```
vega nodewallet --home="YOUR_VEGA_HOME" import --chain=tendermint --tendermint-pubkey="YOUR_TENDERMINT_PUBKEY"
```

### Update the Vega configuration
New fields have been added to the Vega configuration. We recommend you generate a new default config and ensure that no sections are missing from the configuration if the default is not as required for your specific configuration.

The configuration must specify if a node is running as a validator or not. If you are running a Vega validator node (taking part in Tendermint consensus) add the following line to the Vega configuration:
```
NodeMode = "validator"
```

#### Update the data node configuration
For the Vega configuration, new fields have been added in the data node configuration. We recommend you generate a default one to compare with what you used.

The Vega node connected to the data node should add the following line to its config:
```
NodeMode = "full"
```

The data node configuration supports SSL for the HTTP connection. It is highly recommended that SSL is setup on the data node as this enables GraphQL subscriptions, which are used by frontend dApps.

This can be set up in the following section of the data node:
```
[Gateway]
  Level = "Info"
  Timeout = "5s"
  SubscriptionRetries = 3
  GraphQLPlaygroundEnabled = true
  [Gateway.Node]
    Port = 3007
    IP = "0.0.0.0"
  [Gateway.GraphQL]
    Port = 3008
    IP = "0.0.0.0"
    Enabled = true
    ComplexityLimit = 0
    HTTPSEnabled = false                # from here
    AutoCertDomain = ""
    CertificateFile = ""
    KeyFile = ""                        # to there
  [Gateway.REST]
    Port = 3009
    IP = "0.0.0.0"
    Enabled = true
    APMEnabled = true
```

If you do not want to enable SSL, ensure `HTTPSEnabled` is set to false or the data node will not start properly.

### Stop the network
Wait for a new checkpoint file to be produced, then stop all the nodes of the network (Vega, data node and Tendermint). Once stopped, back up all Tendermint chain data and Vega data.

Save the selected checkpoint file in **a safe location**. You will need to reuse it later.

:::info
You can locate all your nodes' checkpoint files under: `YOUR_VEGA_HOME/vega/node/checkpoints`
You can also get a list of all paths used by your node using `vega paths list`. The checkpoints folder path is `CheckpointStateHome` within this list.
:::

You can now remove all previous states of the chain by running the reset commands separately or together.

:::caution Reset clears all data
Ensure that your Vega and Tendermint config homes are different, as this command will delete everything within the home folder. If, for example, you reset Tendermint and everything is in the same folder or choose the Vega home path rather than Tendermint, it will also delete your Vega config and saved keys.
:::


```
vega unsafe_reset_all --home="YOUR_VEGA_HOME"
vega tm unsafe_reset_all --home="YOUR_TENDERMINT_HOME"
rm -rf "YOUR_DATANODE_HOME/vega/data-node/storage/"
```

:::info
The exact path of the data node folder to remove can be found using `vega paths list`. The required path is `DataNodeStorageHome` in the list.
:::

### Load checkpoint

The loaded checkpoint is part of genesis in the current version of vega. To load a new `checkpoint`, you need the following things:
`vega` - the binary version you will be starting a new version of the network
`checkpoint` - you selected to load into the genesis
`genesis.json` - you are going the `checkpoint` to 

To load a checkpoint into genesis you have to execute the following command:

```bash
vega genesis load_checkpoint --genesis-file=<path-to-genesis.json-file> --checkpoint-path=<path-to-checkpoint-file>

#example:
# vega genesis load_checkpoint --genesis-file=./genesis.json --checkpoint-path=./20230125112555-522765-3ece638a9eba5771c392b323ca7e0134198009a84c60700ec04dd888f5b60521.cp
```

### Update the genesis file
One of the validators will now need to update the [genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) with the following information:
- The new start date of the network
- The new network ID
- Load checkpoint (see above section)

This should be done via a pull request on the [networks](https://github.com/vegaprotocol/networks) repo and ideally approved by 2/3+1 of all validators.

### Restart the network

Each validator then needs to restart their node with the latest release of the software. Download the version you are upgrading to from the [release repo](https://github.com/vegaprotocol/vega/releases).
