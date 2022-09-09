---
sidebar_position: 2
title: Configure and run
hide_title: false
---

## Configuring the components and getting it up and running
Once you have all the executables you need, you must configure them to run correctly and to connect to the existing network.

First, generate the default configuration files for Vega and Tendermint. You can then alter those to the specific requirements.

vega init validator    ; This creates files in your `~/.config/vega/node folder`
vega tm init validator    ; This creates files in your `~/.tendermint folder`

Now you need to generate or import wallet information for tendermint, ethereum and vega

```
echo “yourpassword” > ~/password.txt
vega nodewallet generate --chain=ethereum --wallet-passphrase-file="password.txt"
vega nodewallet generate --chain=vega --wallet-passphrase-file="password.txt"
```

Look in your tendermint config `~/.tendermint/config/priv_validator_key.json` for your tendermint public key
`vega nodewallet import --chain=tendermint --tendermint-pubkey="YOUR_TENDERMINT_PUBKEY"`

Next you need either a local ethereum node or an infura account. Setting up an infura account can be achieved with the following steps:

Login to infura and go to the dashboard (create an account first if you need one)
Select the orange “CREATE NEW KEY” cutton from the top right of the page
Select the network as `Web3 API`

Enter anything as the Name and press “CREATE”

Under the Ethereum section there is a drop down from which you can select “Ropsten” for testnet or "Mainnet". 

The URL shown is the address you need for the next change.

Insert the URL into the [Ethereum]->RPCEndpoint key in `~/.config/vega/node/config.toml`

You now need to get the copy of the network genesis file from one of the existing validator nodes. This is a manual process and requires talking to an existing validator. Once you have that, copy it over your version in `~/.tendermint/config/genesis.json`

Next you need the tendermint ID and connection details for one or more validators on the network you are trying to join. This step has to be done manually and relies on existing validators publishing these details. Once you have them, enter them into the `persistent_peers` section in the file `~/.tendermint/config/config.toml`.

You can now start the your node by running the following commands:
```
vega node
vega tm node
```