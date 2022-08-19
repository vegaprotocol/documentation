---
sidebar_position: 4
title: Isolate keys
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you want to move a key pair from a standard wallet into a wallet that can only sign and verify transactions, use the `key isolate` command. Isolating a key pair will extract a chosen key pair from one wallet and create an isolated wallet with only that key pair.

This optional step creates an extra layer of security, particularly for validators and others who are concerned about their wallets being compromised. 

An isolated wallet can only contain a single key pair that has been stripped from its cryptographic node. If a wallet without a cryptographic node is compromised, the damage is minimised as it is impossible to generate keys or retrieve any keys other than the isolated one.

## Isolate key pair

### 1. Identify the key pair to isolate

Take note of the public key that you want to move to an isolated wallet, as well as the name of the wallet the key pair is in. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vega wallet key isolate --wallet="MY_WALLET_NAME" --pubkey="MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vega wallet key isolate --wallet="MY_WALLET_NAME" --pubkey="MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vega wallet key isolate --wallet="MY_WALLET_NAME" --pubkey="MY_PUBLIC_KEY"
```
</TabItem>
</Tabs>

### 2. Enter passphrase

You will be prompted to enter the passphrase for your wallet.

### 3. Wait for response with wallet location

Once your key has been isolated in a new wallet, you'll receive the following response

```
✓ Key pair has been isolated in wallet ISOLATED_WALLET_NAME at: FILE_PATH.isolated
✓ Key isolation succeeded
```

:::info 
The new wallet will use the same passphrase as your original wallet.
:::

### 4. Confirm wallet has been created 

To confirm the new isolated wallet has been created and that both wallets have the same validator ID (if relevant), use the following commands for each wallet. 

You'll be asked to enter your wallet passphrase again. 

#### For your new isolated wallet:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vega wallet info --wallet="ISOLATED_WALLET_NAME"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vega wallet info --wallet="ISOLATED_WALLET_NAME"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vega wallet info --wallet="ISOLATED_WALLET_NAME"
```

</TabItem>
</Tabs>

#### Response 

You'll receive the following information as a response. 

```
Type:
HD wallet (isolated)
Version: 
"1" or "2" 
ID:
"VALIDATOR_ID"
```

#### For your original wallet:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vega wallet info --wallet="MY_WALLET_NAME"
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vega wallet info --wallet="MY_WALLET_NAME"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vega wallet info --wallet="MY_WALLET_NAME"
```

</TabItem>
</Tabs>

#### Response 

You'll receive the following information as a response. 

```
Type:
HD wallet
"1" or "2" 
ID:
"VALIDATOR_ID"
```

## Use isolated key in node wallet

Validators who have isolated a key pair will then need to import that key to their node wallet. 

You'll be prompted to enter passphrases for the node wallet and the blockchain wallet.
  
### 1. Import key to node wallet

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vega nodewallet import --force --chain=vega --wallet-path="ISOLATED_WALLET_PATH"
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vega nodewallet import --force --chain=vega --wallet-path="ISOLATED_WALLET_PATH"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vega nodewallet import --force --chain=vega --wallet-path="ISOLATED_WALLET_PATH"
```

</TabItem>
</Tabs>

#### Response

You'll receive the following information as a response for a successful import. 

```
import successful:
walletFilePath:
"FILE_PATH"
registryFilePath:
"FILE_PATH"
```

### 2. Generate payload
Then, generate the validator payload to be used on the Tendermint genesis file.

You'll be prompted to enter the node wallet passphrase. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vega genesis new validator --country="XX" --info-url="VALIDATOR_URL" --name="NODE_NAME"
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vega genesis new validator --country="XX" --info-url="VALIDATOR_URL" --name="NODE_NAME"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vega genesis new validator --country="XX" --info-url="VALIDATOR_URL" --name="NODE_NAME"
```

</TabItem>
</Tabs>

### 3. Add details to genesis file

Add the following information to the genesis file under `validators` key:
```
{
  "address": "TENDERMINT_ADDRESS",
  "pub_key": {
    "type": "tendermint/PubKeyEd25519",
    "value": "TENDERMINT_PUBLIC_KEY"
  },
  "power": "10",
  "name": ""
}
```

Add the following information into the genesis file under `app_state.validators` key:

```
{
    "TENDERMINT_PUBLIC_KEY": {
      "id": "VALIDATOR_ID",
      "vega_pub_key": "ISOLATED_PUBLIC_KEY",
      "ethereum_address": "MY_ETHEREUM_ADDRESS",
      "tm_pub_key": "TENDERMINT_PUBLIC_KEY",
      "info_url": "VALIDATOR_URL",
      "country": "XX",
      "name": "NODE_NAME",
      "avatar_url": ""
    }
  }
```
