---
sidebar_position: 4
title: Build and send commands
hide_title: false
description: Build a Vega command to include in a transaction
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will teach you how to build a Vega command to include in a transaction. Once you create a command, to create a transaction you will need to sign it, and include your public key and the block height you are targeting.

## Build commands

A command is an action you want to issue to the network. To submit that command to the network, you will need to sign it to verify it, and add in other data. 

Vega Wallet allows you to send and sign commands to the Vega network by using the following wallet commands:
* `vegawallet command send`: turns a command into a transaction and send it
* `vegawallet command sign`: turns a command into a transaction (base64-encoded) without sending it

:::info Commands and transactions are different
A Vega transaction is a bundle containing a Vega command, a signature, a public key and target block height.

There are other Vega Wallet commands that allow you to work with Vega transactions (base64-encoded), such as `vegawallet tx send`.

Inserting a Vega command in `vegawallet tx send` will fail, as it requires a transaction, hence a bundled Vega command with its signature.
Inserting a Vega transaction in `vegawallet command sign` will fail, as it requires a Vega command only, without signature or any other data.
:::

:::warning
Only gRPC commands are supported.

HTTP REST and GraphQL commands are not supported.
:::

### gRPC reference documentation for commands

The supported commands can be found here:

* [Trading commands](/docs/testnet/grpc/vega/commands/v1/commands.proto)
* [Validator commands](/docs/testnet/grpc/vega/commands/v1/validator_commands.proto)
* [Oracle commands](/docs/testnet/grpc/vega/commands/v1/oracles.proto)

### Command format

The gRPC command needs to be formatted as a JSON payload, as follows:

```json
{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}
```

* `commandName` is the name of the command you want to submit, such as "voteSubmission", or "orderCancellation". It should be camel or snake case.
* `someProperty` is the name of the property or properties that are required by the command, such as "proposalId" on "voteSubmission", or "price" on "orderSubmission". It should be camel or snake case.
* If the command you want to send has nested fields, `anObject` is the name of the object that wraps them, such as "peggedOrder" on "orderSubmission", or "terms" on "proposalSubmission".

### Example commands

#### Submit vote for governance proposal

```json
{
  "voteSubmission": {
    "proposalId": "some-id",
    "value": "VALUE_YES"
  }
}
```

#### Submit order on a market

This is a _partial_ example for order submission

```json
{
  "orderSubmission": {
    "marketId": "1234", 
    "price": "42", 
    "size":10, 
    "side": "SIDE_BUY", 
    "timeInForce": "TIME_IN_FORCE_FOK"
  }
}
```

## Send commands 

**Tips for sending commands**

1. Write the command on a single line to prevent problems with the CLI not properly handling multiple arguments.
3. Wrap the JSON payload with single quotes in the command line to prevent the CLI from interpreting the JSON command as a special command.


**Command structure**
```bash
vegawallet command-name '{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}'
```


**Send the command to the first node configured in the network configuration, via its gRPC API using:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet command send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet command send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet command send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
</Tabs>


**Customise the number of retries (default to 5) using:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet command send --retries 10
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet command send --retries 10
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet command send --retries 10

```
</TabItem>
</Tabs>


**If you don't want to rely on the nodes defined in the network configuration, you can specify a node address:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet command send --node-address "ADDRESS"
```
</TabItem>
<TabItem value="mac" label="MacOS">
```bash
./vegawallet command send --node-address "ADDRESS"
```
</TabItem>

<TabItem value="linux" label="Linux">

```bash
./vegawallet command send --node-address "ADDRESS"
```
</TabItem>
</Tabs>


**See more options by using the help flag:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet command send --help
```
</TabItem>
<TabItem value="mac" label="MacOS">
```bash
./vegawallet command send --help
```
</TabItem>

<TabItem value="linux" label="Linux">

```bash
./vegawallet command send --help
```
</TabItem>
</Tabs>


### Create transactions with air-gapped wallets

This is useful for validators that are signing validator commands using their root keys.

The workflow is:
1. Build and sign a Vega command on an air-gapped computer to get a base64 encoded transaction
2. Send that transaction using an online computer


#### 1. Build transaction on an air-gapped computer

This will build a transaction containing the specified command, its signature and additional protocol related data:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet command sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "COMMAND"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet command sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "COMMAND"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet command sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "COMMAND"
```
  
</TabItem>
</Tabs>

`TRANSACTION_BLOCK_HEIGHT` must be close to the current block height when the transaction is applied, with a threshold of approximately 150 blocks. Note: If it is higher than the blockchain's block height, it will be rejected.

The resulting transaction is encoded using base64.

You can decode it using `base64` command line utility. First save the transaction in a file `result.txt`, then use:

```bash
base64 --decode --input result.txt
```

The transaction will be decoded and displayed on screen.

#### 2. Send transaction with an online computer

Use any way to transfer the transaction from your air-grapped computer to the online one.

Then, send the transaction using:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet tx send --network "NETWORK" "BASE64_TRANSACTION"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet tx send --network "NETWORK" "BASE64_TRANSACTION"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet tx send --network "NETWORK" "BASE64_TRANSACTION"
```
  
</TabItem>
</Tabs>

:::info Block height 
You will need to respect the block height that you set in you transaction with the command `vegawallet command sign`.

You must wait if the block height you define is higher than the blockchain's block height. Transactions set with a future block height will be rejected.

If the block height you set is smaller than the blockchain's block height, you should send your transaction ASAP. If it's too small (~ > 150), it will be rejected by the replay protection mechanism.

If the current height is 200:

* a transaction with block height 10 is rejected because 200 - 10 = 190 and 190 > 150
* a transaction with block height 60 is accepted because 200 - 60 = 140 and 140 < 150
* a transaction with block height 201 is rejected because 200 - 201 = -1 and -1 is in the future
:::
