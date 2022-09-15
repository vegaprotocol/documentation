# Ethereum Key Rotation

This feature allows to rotate from one Ethereum key associated with validator to another one.
It can be used as a safety feature (when current key has been compromised, or for rotated for a good measure) or for migrating from 
one Ethereym wallet to another (for example from local key store wallet to 	[Clef](https://geth.ethereum.org/docs/clef/introduction)).

Rotation to the new Ethereum key is done in these steps:

1. Generate a new key - either by using nodewallet or Clef (with Vega nodewallet CLI and Clef)
2. Create and submit Ethereum key rotation transaction to the network (with Vega Wallet CLI)
3. Reload Ethereum wallet in Vega validator node (with Vega nodewallet CLI)
4. Fetch add/remove key signature for and submit them to the [MultisigControl bridge](https://docs.vega.xyz/docs/mainnet/api/bridge/interfaces/IMultisigControl)

## Prerequisites:

1. Installed Vega binary
2. Running validator node with admin server enabled
3. Access to wallet with current Vega nodewallet

**Info**
```
NODE_ID - ID of the node who is subject to Ethereum key rotation

VEGA_PUB_KEY - Vega public key of the node who is subject to Ethereum key rotation

ETH_ADDR - Current Ethereum address to rotate from

ETH_NEW_ADDR - Newly generated Ethereum address to rotate to

TARGET_BLOCK - a block where the Ethereum key rotatio will take place

WALLET_NAME - Name of wallet that we want to submit the transaction with

SUBMITTER_ADDR = Ethereum address of a submitter of produced signatures for [MultisigControl bridge](https://docs.vega.xyz/docs/mainnet/api/bridge/interfaces/IMultisigControl). This should be an Ethereum account with some gas.

NODE_RPC_ADDR - RPC address of any validator node in network (example: host-address:3002)

NODE_REST_ADDR - REST API address of any validator node in network (example: host-address:3003)

DATA_NODE_REST_ADDR - Rest API address of any data node (example: host-address:3009)

CLEF_ADDR - Address of custom running Clef instance. Required only if Clef wallet is used (example: host-address:8550)
```

## Step 1. Generate a new key - either by using nodewallet or Clef

### Using regular local store from node wallet

```
vega nodewallet generate --chain ethereum --force
```

The command will output:
```
walletFilePath:
path-to-wallet/UTC--2022-09-15T16-44-18.243348000Z--01236c6afa74d90817d939682215907484cacd05
```
where the last bit of the file `01236c6afa74d90817d939682215907484cacd05` is the new account address.
So to set the **ETH_NEW_ADDR** we take the generated address a prefix it with 0x like so: `0x01236c6afa74d90817d939682215907484cacd05`.

### Using Clef
1. Firstly generate new account in Clef. This step will produce a new account address refer to as **ETH_NEW_ADDR**. The newly generated account address will be printed to stdout.

```bash
clef newaccount
```

2. Secondly import the newly generated account in Clef to node wallet.

```bash
vega nodewallet import -c ethereum --eth.clef-address http://$CLEF_ADDR  --clef-account-address $ETH_NEW_ADDR --force
```

## Step 2. Create and submit Ethereum key rotation transaction to the network

```
vega wallet command send --wallet $WALLET_NAME --node-address $NODE_RPC_ADDR --pubkey $VEGA_PUB_KEY '{"ethereumKeyRotateSubmission": {"targetBlock": "'$TARGET_BLOCK'", "newAddress": "'$ETH_NEW_ADDR'", "currentAddress": "'$ETH_ADDR'", "submitterAddress": "'$SUBMITTER_ADDR'"}}'
```

## Step 3. Reload Ethereum wallet in Vega validator node

When the current block height is getting closer to $TARGET_BLOCK Vega is signalled to use the $ETH_NEW_ADDR.

**PLEASE NOTE**: this should be done aproximatly 5 blocks before $TARGET_BLOCK. It can be earlier or later but always before $TARGET_BLOCK). This is because the network will produce at the time of the rotation a new signature bundle to add a new signer to [MultisigControl bridge](https://docs.vega.xyz/docs/mainnet/api/bridge/interfaces/IMultisigControl) and it HAS TO BE signed with the $ETH_NEW_ADDR key.

The currect block height can be check on with `curl -s $NODE_REST_ADDR/statistics`.

```
vega nodewallet reload -c ethereum
```

## Step 4. Fetch add/remove key signature for and submit them to the

At this point the Ethereum key rotation inside of Vega network took place though we still have to notify the [MultisigControl bridge](https://docs.vega.xyz/docs/mainnet/api/bridge/interfaces/IMultisigControl) about the change.

Firstly it can be validated that the key was actually rotated by calling: `curl -s $NODE_REST_ADDR/validators`. The Ethereum key rotation history can be also accessed via data node by calling: `curl -s $DATA_NODE_REST_ADDR/api/v2/vega/keys/ethereum/rotations`.

### Remove signature bundle

Remove signature bundle will make sure that the old Ethereum address is no longer valid.
The remove signature bundle can be located here: `curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/removed/bundles`

### Add signature bundle

Add signature bundle will make the new Ethereum valid on the bridge.
The add signature bundle can be located here: `curl -s $DATA_NODE_REST_ADDR/api/v2/erc20/multisigcontrol/signer/added/bundles`


### Apply signature bundles

Collected signature bundles has to be submitted from $SUBMITTER_ADDR using Etherscan.
