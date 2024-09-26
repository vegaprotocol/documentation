---
sidebar_position: 5
title: Build and send transactions
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will teach you how to build, sign, and send a Vega transaction using Vega's CLI wallet app.

A transaction is an action you want to issue to the network, usually encoded in JSON. For example, a transaction to indicate an affirmative vote for a governance proposal might look like this:

```json
{
    "voteSubmission": {
        "proposalId": "eb2d3902fdda9c3eb6e369f2235689b871c7322cf3ab284dde3e9dfc13863a17",
        "value": "VALUE_YES"
    }
}
```

Before the transaction is submitted to a network, it must be bundled up with a few pieces of metadata and signed. That metadata includes:

- your public key
- a small proof-of-work calculation
- the block height you are targeting

The signed transaction bundle can then either be:
- immediately submitted by the wallet to a node in the network
- base64 encoded into a `raw_transaction` and output to the screen or a file for later submission.

The former is the most convenient way to sign & submit a transaction, but the latter is required if you have a 'cold' wallet that is not connected to the internet.

## Build transactions

Send and sign transactions to a network by using the following wallet commands:
* `vegawallet transaction sign`: takes your transaction, bundles it with the metadata discussed above, signs it and returns an base64 encoded representation of the `raw_transaction`
* `vegawallet transaction send`:  as above, but immediately send the transaction to the network rather then displaying the base64 encoded `raw_transaction`
* `vegawallet raw_transaction send`: forward the base64-encoded output of `transaction sign` and submits it to the network.

:::info Transactions and raw transactions are different
A Vega raw transaction is a base64 encoded bundle containing a Vega transaction, a signature, a public key and target block height.

Inserting a Vega transaction in `vegawallet raw_transaction send` will fail, as it requires a encoded transaction bundle.
Inserting a Vega raw transaction in `vegawallet transaction sign` will fail, as it requires a Vega transaction only, without signature or any other data.
:::

:::warning gRPC only
Only gRPC commands are supported.

HTTP REST and GraphQL commands are not supported.
:::

### gRPC reference documentation for commands

The supported commands can be found here:

* [Trading commands](../api/grpc/vega/commands/v1/commands.proto.mdx)
* [Validator commands](../api/grpc/vega/commands/v1/validator_commands.proto.mdx)
* [Oracle commands](../api/grpc/vega/commands/v1/data.proto.mdx)

### Transaction format

The gRPC transaction needs to be formatted as a JSON payload, as follows:

```json
{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}
```

* `commandName` is the name of the command you want to submit in your transaction, such as "voteSubmission", or "orderCancellation". It should be camel or snake case.
* `someProperty` is the name of the property or properties that are required by the command, such as "proposalId" on "voteSubmission", or "price" on "orderSubmission". It should be camel or snake case.
* If the command you want to send has nested fields, `anObject` is the name of the object that wraps them, such as "peggedOrder" on "orderSubmission", or "terms" on "proposalSubmission".

You will need to include the external `chainID` in your transaction if you're submitting a transaction for:

* New asset governance proposal
* Issuing signatures to update signers on the MultisigControl contract

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
    "timeInForce": "TIME_IN_FORCE_FOK",
    "type": "TYPE_LIMIT"
  }
}
```

## Send transactions

**Tips for sending transactions**

1. Write the transactions on a single line to prevent problems with the CLI not properly handling multiple arguments.
3. Wrap the JSON payload with single quotes in the command line to prevent the CLI from interpreting the JSON transactions as a special command.


**Command structure**
```bash
vegawallet transaction sign '{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}'
vegawallet transaction send '{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}'
vegawallet raw_transaction send 'ChwIxZXB58qn4K06EMC2BPI+CwoHc29tZS1pZ....'
```


**Send the transaction to the first node configured in the network configuration, via its gRPC API using:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet transaction send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet transaction send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet transaction send --network "NETWORK" --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY"
```
</TabItem>
</Tabs>


**Customise the number of retries (default to 5) using:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet transaction send --retries 10
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet transaction send --retries 10
```
</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet transaction send --retries 10

```
</TabItem>
</Tabs>


**If you don't want to rely on the nodes defined in the network configuration, you can specify a node address:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet transaction send --node-address "ADDRESS"
```
</TabItem>
<TabItem value="mac" label="MacOS">
```bash
./vegawallet transaction send --node-address "ADDRESS"
```
</TabItem>

<TabItem value="linux" label="Linux">

```bash
./vegawallet transaction send --node-address "ADDRESS"
```
</TabItem>
</Tabs>


**See more options by using the help flag:**
<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet transaction send --help
```
</TabItem>
<TabItem value="mac" label="MacOS">
```bash
./vegawallet transaction send --help
```
</TabItem>

<TabItem value="linux" label="Linux">

```bash
./vegawallet transaction send --help
```
</TabItem>
</Tabs>


### Create transactions with air-gapped wallets

This is useful for validators that are signing validator transaction using their root keys.

The workflow is:
1. Build and sign a Vega transaction on an air-gapped computer to get a base64 encoded transaction
2. Send that raw_transaction using an online computer


#### 1. Build raw transaction on an air-gapped computer

This will build a raw_transaction containing the specified transaction, its signature and additional protocol related data:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet transaction sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "TRANSACTION"
```
</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet transaction sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "TRANSACTION"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet transaction sign --wallet "MY_WALLET_NAME" --pubkey "MY_PUBLIC_KEY" --tx-height "TRANSACTION_BLOCK_HEIGHT" "TRANSACTION"
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

#### 2. Send raw transaction with an online computer

Use any way to transfer the transaction from your air-grapped computer to the online one.

Then, send the transaction using:

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

```bash
vegawallet raw_transaction send --network "NETWORK" "BASE64_TRANSACTION"
```

</TabItem>
<TabItem value="mac" label="MacOS">

```bash
./vegawallet raw_transaction send --network "NETWORK" "BASE64_TRANSACTION"
```

</TabItem>
<TabItem value="linux" label="Linux">

```bash
./vegawallet raw_transaction send --network "NETWORK" "BASE64_TRANSACTION"
```
  
</TabItem>
</Tabs>

:::info Block height 
You will need to respect the block height that you set in you transaction with the command `vegawallet transaction sign`.

You must wait if the block height you define is higher than the blockchain's block height. Transactions set with a future block height will be rejected.

If the block height you set is smaller than the blockchain's block height, you should send your transaction ASAP. If it's too small (~ > 150), it will be rejected by the replay protection mechanism.

If the current height is 200:

* a transaction with block height 10 is rejected because 200 - 10 = 190 and 190 > 150
* a transaction with block height 60 is accepted because 200 - 60 = 140 and 140 < 150
* a transaction with block height 201 is rejected because 200 - 201 = -1 and -1 is in the future
:::
