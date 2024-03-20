---
sidebar_position: 1
title: Get help
hide_title: false
description: How to get help to use the commands.
---

**If you need help using the wallet software, use the Vega Wallet `--help` (or `-h`) flag.**

## For general guidance

For general guidance, use `vega wallet -h`. You will get the description of the available commands and sub-commands.

**Example of output:**

```bash
> vega wallet --help

The Vega wallet

Usage:
  wallet [command]

Examples:
  # Specify a custom Vega home directory
  vega wallet --home PATH_TO_DIR COMMAND
  
  # Change the output to JSON
  vega wallet --output json COMMAND
  
  # Disable colors on output using environment variable
  NO_COLOR=1 vega wallet COMMAND

Available Commands:
  api-token       Manage the API tokens
  completion      Generate the autocompletion script for the specified shell
  create          Create a wallet
  delete          Delete the specified wallet and its keys
  describe        Describe the specified wallet
  help            Help about any command
  import          Import a wallet using the recovery phrase
  init            Initialise the software
  key             Manage Vega wallets' keys
  list            List all registered wallets
  message         Sign and verify messages
  network         Manage networks
  passphrase      Manage the wallet passphrase
  permissions     Manage permissions of a given wallet
  raw_transaction Provides utilities for interacting with raw transactions
  rename          Rename the specified wallet
  service         Manage the Vega wallet's service
  shell           Manage the shell integration of the software
  software        Retrieve the technical details of the software
  transaction     Provides utilities for interacting with transactions

Flags:
  -h, --help            help for wallet
      --home string     Specify the location of a custom Vega home
  -o, --output string   Specify the output format: [interactive json] (default "interactive")

Use "wallet [command] --help" for more information about a command.
```

## On a sub-command

The vega wallet CLI is complex software. To improve its structure, it has nested commands, also called sub-commands.

Example of such sub-commands are `key`, `network`, `api-token`, etc.

To know which actions are available on sub-commands, use `vega wallet <SUB-COMMAND> --help`, where `<SUB-COMMAND>` is the name of the sub-command you are interested in.

**Example of output for `key`:**

```bash
> vega wallet key -h

Manage Vega wallets' keys

Usage:
  wallet key [command]

Available Commands:
  annotate    Add metadata to a key pair
  describe    Describe the specified key pair
  generate    Generate a new key pair in a given wallet
  isolate     Extract the specified key pair into an isolated wallet
  list        List the keys of a given wallet
  rotate      Build a signed key rotation transaction
  taint       Mark a key pair as tainted
  untaint     Remove the taint from a key pair

Flags:
  -h, --help   help for key

Global Flags:
      --home string     Specify the location of a custom Vega home
  -o, --output string   Specify the output format: [interactive json] (default "interactive")

Use "wallet key [command] --help" for more information about a command.
```

## For command parameters

All commands document their parameters and provide usage examples. To access the list of parameters, use `vega wallet <COMMAND> --help`.

**Example of output for `key generate`:**

```bash
> vega wallet key generate -h

Generate a new Ed25519 key pair in the specified wallet.

Usage:
  wallet key generate [flags]

Examples:
  # Generate a key pair
  vega wallet key generate --wallet WALLET
  
  # Generate a key pair with additional metadata (name = my-wallet and type = validation)
  vega wallet key generate --wallet WALLET --meta "name:my-wallet,type:validation"
  
  # Generate a key pair with custom name
  vega wallet key generate --wallet WALLET --meta "name:my-wallet"

Flags:
  -h, --help                     help for generate
  -m, --meta strings             Metadata to add to the generated key-pair: "my-key1:my-value1,my-key2:my-value2"
  -p, --passphrase-file string   Path to the file containing the wallet's passphrase
  -w, --wallet string            The wallet where the key is generated in

Global Flags:
      --home string     Specify the location of a custom Vega home
  -o, --output string   Specify the output format: [interactive json] (default "interactive")
```
