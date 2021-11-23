---
sidebar_position: 2
title: CLI Commands
hide_title: false
---

The following list of commands, sub-commands, and flags will help you use [Vega Wallet](https://github.com/vegaprotocol/vegawallet/releases/). 

## Root flags

By default, the wallet will be stored at a specific location. These can stay as-is, but if you want to specify a different location for test or isolation purposes, use the `--home` flag to do so.

## List of available commands

There are 3 ways to list the available commands

```bash
vegawallet
vegawallet -h
vegawallet help
```

## Initialise the program

Before using the wallet, you need to initialise it with the following command:

```bash
vegawallet init
```

This creates the folders, the configuration file and RSA keys needed by the
wallet and its service to operate.

## Re-initialise the program 

To re-initialise the program without removing user data (for example, to import existing networks), use the following command:

```bash
vegawallet init --force
```

## Create a wallet

To create a new wallet, generate your first key pair using the following
command:

```bash
vegawallet key generate --wallet "YOUR_USERNAME"
```

The `--wallet` flag sets the name of your wallet.

It will then prompt you to input a passphrase, and then confirm that passphrase. You'll use this username and passphrase to login to Vega Console. You can also specify the passphrase with the `--passphrase` flag.

You can attach metadata to your key with the `--meta` flag (more on this below).

### Important

You’ll see an output with your public and private key, and your mnemonic. **Do not share your private key or mnemonic.** 

**You will need the mnemonic to restore your keys.**

## Import a wallet

If you want to restore your wallet, use the following command:

```bash
vegawallet import --wallet "YOUR_WALLET" \
    --mnemonic-file "PATH_TO_YOUR_MNEMONIC"
```

The flag `--mnemonic-file` is used to locate the file that contains the
mnemonic.

It will then prompt you to input a passphrase, and then confirm that passphrase.
You'll use this username and passphrase to login to Vega Console. You can also
specify the passphrase with the `--passphrase-file` flag.

This command is only able to import the wallet from which you can re-generate
your key pairs.

## List registered wallets

If you want to list all the registered wallets, use the following command:

```bash
vegawallet list
```

## Generate a key pair

To generate a key pair on the given wallet, use the following command:

```bash
vegawallet key generate --wallet "YOUR_USERNAME"
```

It will then prompt you to input a passphrase. You can also specify the
passphrase with the `--passphrase` flag.

If the wallet does not exist, it will automatically create one. See [Create a wallet](#create-a-wallet) for more information. 

You’ll see an output with your mnemonic, and public and private key. 

You can attach metadata to your key with the `--meta` flag (more on this below).

**Important**

**The mnemonic is very important as it acts as a backup key, from which the wallet can restore all your keys.** As a result, it has to be kept safe and secret. If lost, you won't be able to retrieve your keys. If stolen, the thief will be able to use your keys.

## Add metadata to your keys

For better key management, you may want to add metadata to your key pairs. This
is done with the following command:

```bash
vegawallet key annotate --wallet "YOUR_USERNAME" \
    --meta "key1:value1;key2:value2" \
    --pubkey "YOUR_HEX_PUBLIC_KEY"
```

An item of metadata is represented as a key-value property.

### Give an alias to a key

You can give to each key pair a nickname/alias with a meta `name`. For example:

```bash
vegawallet key annotate --wallet "YOUR_USERNAME" \
    --meta "name:my-alias" \
    --pubkey "YOUR_HEX_PUBLIC_KEY"
```

**Important**

This command does not insert the new metadata alongside existing metadata items, **it
replaces them**. If you want to keep the previous metadata, be sure to add them
to your update.

## Tainting a key pair

You can prevent the use of a key by "tainting" it with the following
command:

```bash
vegawallet key taint --wallet "YOUR_NAME" \
    --pubkey "YOUR_HEX_PUBIC_KEY"
```

It will then prompt you to input a passphrase. You can also specify the
passphrase with the `--passphrase` flag.

## Untainting a key pair

If you have tainted a key by mistake, you can untaint it using the command:

```bash
vegawallet key untaint --wallet "YOUR_WALLET" \
    --pubkey "YOUR_HEX_PUBIC_KEY"
```

It will then prompt you to input a passphrase. You can also specify the
passphrase with the `--passphrase-file` flag.

**Important**

If you tainted a key for security reasons, you should not untaint it.

## List the key pairs

To list your key pairs, use the following command:

```bash
vegawallet key list --wallet "YOUR_NAME"
```

It will then prompt you to input a passphrase. You can also specify the
passphrase with the `--passphrase` flag.

**Important**

This will also return your private key. **Never expose this command or its
contents to the outside world.**

## Sign and verify messages

To sign and verify any kind of base-64 encoded messages, use the following
commands:

```bash
vegawallet sign --wallet "YOUR_WALLET" \
    --pubkey "YOUR_HEX_PUBIC_KEY" \
    --message "c3BpY2Ugb2YgZHVuZQo="
vegawallet verify --pubkey "YOUR_HEX_PUBIC_KEY" \
     --message "c3BpY2Ugb2YgZHVuZQo=" \
     --signature "76f978asd6fa8s76f"
```

It will then prompt you to input a passphrase. You can also specify the
passphrase with the `--passphrase` flag.

## List available networks

During wallet initialisation, a set of default test networks are installed. You can list them
with the following command:

```bash
vegawallet network list
```

## Import a network configuration

You can also import a network configuration, for example, for a mainnet network, from a local file or via URL. 

To import from a local file, use the following command:

```bash
vegawallet network import --from-file "PATH_TO_FILE"
```

To import from a URL, use the following command:

```bash
vegawallet network import --from-url "URL_TO_FILE"
```

You can override the imported network name using the `--with-name` flag.

## Run the service

Once a wallet and a network have been set up, you can run the wallet with the
following command:

```bash
vegawallet service run --network "NETWORK_NAME"
```

To run the wallet and open up a local version of Vega Console, the trading UI,
use the following command:

```bash
vegawallet service run  --network "NETWORK_NAME" --console-proxy
```

To terminate the process, such as if you want to run other commands in Wallet,
use `ctrl+c`.

#### Ad-blockers

If you're running an ad/tracker blocker, and you're getting errors, it may be
blocking the node from connecting. Try allowlisting `lb.testnet.vega.xyz` and
refreshing.


## Send a command

Instead of sending a command through the API, you can send it through the
command line, use the following command:

```bash
vegawallet command --pubkey "YOUR_HEX_PUBIC_KEY" \
    --wallet "YOUR_WALLET" \
    --network "YOUR_NETWORK" '{"THE_COMMAND": {...}, "propagate": true}'
```

## Isolate a key pair for HD wallet

On HD (hierarchical deterministic) wallets, the wallet node is used to generate (and retrieve) key pairs. For security purposes, you may not want to store the wallet node on the machine running the node, because it can be compromised. 

You can isolate a single key pair, without the wallet node, in an "isolated wallet" with the following command:

```bash
vegawallet key isolate --pubkey "YOUR_HEX_PUBIC_KEY" \
    --wallet "YOUR_WALLET"
```
