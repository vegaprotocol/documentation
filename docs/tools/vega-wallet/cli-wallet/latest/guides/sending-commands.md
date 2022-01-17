---
sidebar_position: 4
title: Building transaction
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Only gRPC API is supported.

HTTP Rest and GraphQL commands are not supported.

## Sending commands

To build a Vega command in the command-line, refer the guide ["Building commands"](./building-transaction.md).

This will send the command to the first node configured in the network configuration, via its gRPC API.

```shell
vegawallet command send --network NETWORK --wallet WALLET --pubkey PUBKEY COMMAND
```

Can customize the number of retries (default to 5) using:
```shell
vegawallet command send --retries 10 ...
```

If don't want to rely on nodes defined in the network configuration, you can specify a node address:
```shell
vegawallet command send --node-address ADDRESS ...
```

More options:
```shell
vegawallet command send --help
```

## Send commands with air-gapped wallets

This is useful for validator that are signing validator commands using there root keys.

The workflow is:
1. Build a transaction on the air-gapped computer
2. Send the transaction on the online computer


### 1. On the air-gapped computer

This will build a transaction containing the specified command, its signature and additional protocol related data:

```shell
vegawallet command sign --wallet WALLET --pubkey PUBKEY --tx-height TX_HEIGH COMMAND
```

`TX_HEIGHT` should be should be close to the current block height when the transaction is applied, with a threshold of ~ - 150 blocks.

The resulting transaction is encoded using base64.

You can decode it using `base64` command line utility. First save the transaction in a file `result.txt`, then:
```shell
base64 --decode --input result.txt
```

The transaction will be decoded and displayed on screen.

### 2. On the online computer

Use any way to transfer the transaction from your air-grapped computer to the online one.

Then, send the transaction using:

```shell
vegawallet tx send --network NETWORK BASE64_TRANSACTION
```

:::info
You have to respect the block height that you set into you transaction with the command `vegawallet command sign`.

You should wait if the block height is higher than the blockchain one. Transactions set with a future block height will be rejected.

You should hurry if the block height is smaller than the blockchain one. If it's too small (~ > 150), it will get rejected by the replay protection mechanism.
:::
