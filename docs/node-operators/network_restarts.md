---
sidebar_position: 5
title: Network restart (checkpoints)
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vega networks support restarts using checkpoints. Checkpoints are a minimal save of the state of the network every N block, or, after funds are moved in or out of the network. They are both, a way of restarting a clean chain with the current view of all accounts balances, and a security measure in order to not misplace any funds in case of a major issue that would require a restart of the chain.

:::note
This guide is valid for a network restart with the version 0.51.x
:::


### Step -1: Verify your nodewallet keys (to do before any following steps)

In a recent version of the vega core, validation has been added at runtime to ensure the keys that validators have setup in the genesis block matches those saved in the nodewallet.

We can do this by by running the following command:
```
vega genesis new validator --tm-home=/path/to/tendermint/home --home=/path/to/vega/home --country="any" --info-url="any" --name="any"
```

:::note
The 3 flags `--country, --info-url, --name` here are just placeholder to run the command, we are only interested in the output
:::

The output of the command should look like something like this:
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

You should the verify that your validator information set in the [genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) matches the one from the output of the command, mainly your tendermint public key (`plmxJSjg5IC7r8yLWBQUFFTosvXC+rTpbXgf0kCoqoY=` here), vega public key (`ec066610abbd1736b69cadcb059b9efdfdd9e3e33560fc46b2b8b62764edf33f` here) and ethereum address (`0xDdF662BBb29EB7a42340E426A75dd13337E482fc` here).

If any differs please mention it on discord.

### Step 0: Edit configuration

You can prepare your configuration but you may not want to update your mainnet node with the configuration before it's stopped.

#### Add the tendermint public key to your nodewallet

The nodewallet now requires to know the tendermint public key. You can save this key by running the following vega command:
```
vega nodewallet --home=/path/to/vega/home import --chain=tendermint --tendermint-pukey=YOUR_TENDERMINT_PUBEY
```

#### Update the vega configuration

New fields have been added to the vega configuration. We recommand you generate a new default config and ensure that no sections are missing from the configuration if the default are not correct for you.

The configuration needs now to specify if a node is running as a validator or not, in the case of a vega validator node (taking part of tendermint consensus) we will want to add the following line to the vega configuration:
```
NodeMode = "validator"
```

#### Update the data-node configuration

As for the vega configuration, new fields have been added in the data-node configuration, we recommend you generate a default one to compare with what you used today.

The vega node connected to the data-node should add the following line to its config:
```
NodeMode = "validator"
```

The data-node configuration also support ssl for the http connection. We recommend that you setup ssl on your node as it enabled graphql subscriptions which are used by the frontend.
This can be setup in the following section of the data-node:
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

If you do not want to enable ssl make sure to set `HTTPSEnabled` to false or the data-node would not start properly.

### Step 1: Stop the network

Wait for a new checkpoint file to be produce then stop all the nodes of the network (vega, data-node and tendermint). Then backup all tendermint chain data and vega data.
Save the selected checkpoint file in a safe location you will need to reuse it later.

:::info
You can locate all your node checkpoint under: `/path/to/vega/home/vega/node/checkpoints`
You also can get a list of all path used by your node using `vega paths list`, the checkpoints folder path is `CheckpointStateHome` under this list.
:::

You can now remove all previous state of the chain by doing:
```
vega --home=/path/to/vega/home unsafe_reset_all
vega tm --home=/path/to/tendermint/home unsafe_reset_all
rm -rf /path/to/data-node/home/vega/data-node/storage/
```

:::info
The exact path of the data-node folder to remove can be found using `vega paths list`, this path is `DataNodeStorageHome` under this list.
:::

### Step 2: Update the genesis file

One of the validators will now need to update the [genesis file](https://github.com/vegaprotocol/networks/blob/master/mainnet1/genesis.json) with the following information:
- the new start date of the network
- the new network ID
- the hash of the checkpoint file to be used.

This should be done via a pull request on the [networks](https://github.com/vegaprotocol/networks) repo and ideally approved by 2/3+1 of all validators.

### Step 3: Restart the network

:::note
This is a critical part which needs to be done with all validator synchronously (this will not be needed in future updates).
:::

All validators needs to restart their node in a synchronous way. The reason is that the network needs to synchronise it's state with the ethereum state of vega token delegation to the vega network. This is done during the bootstrapping period which happend during the N first block of the chain (this can be configured in the genesis file).

During the bootstraping no transaction from users can be emitted apart from the transaction to submit the checkpoint. This should be done only once by one of the validators using the following command:
```
vega checkpoint restore --home=/path/to/vega/home --passphrase-file=YOUR_NODEWALLET_PASSPHRASE_FILE --checkpoint-file=/path/the/
checkpoint/file
```

Once this is done, we will need to monitor the network to make sure all delegation are recovered properly by the end of the bootstraping period

### Misc

The ethereum event forwarder is now not required anymore, this should be removed from your infrastructure and not started. This service have been re-written and is not integrated in the vega core node.
