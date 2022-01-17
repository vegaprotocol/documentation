---
sidebar_position: 4
title: Building commands
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will teach you how to build a Vega command in the command-line.

Certain vegawallet commands allow you to work with Vega commands such as:
* `vegawallet command send`
* `vegawallet command sign`

:::info Commands and transactions are different things
Some other vegawallet commands allow you to work with Vega transactions (base64-encoded) such as `vegawallet tx send`.

A Vega transaction is a bundle containing a Vega command, a signature, plus other protocol related data.

Inserting a Vega command in `vegawallet tx send` will fail, as it requires a transaction, hence a bundled Vega command with its signature.
Inserting a Vega transaction in `vegawallet command sign` will fail, as it requires a Vega command only, without signature or any other data.
:::

## Warning

Only gRPC commands are supported.

## Reference

The supported commands can be found here:

* [Trading commands](https://docs.vega.xyz/protodocs/vega/commands/v1/commands.proto)
* [Validator commands](https://docs.vega.xyz/protodocs/vega/commands/v1/validator_commands.proto)
* [Oracle commands](https://docs.vega.xyz/protodocs/vega/commands/v1/oracles.proto)

## Format

The gRPC command should be formatted as a JSON payload, as follows:

```json
{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}
```

* `commandName` is the name of the command you want to submit, such as "voteSubmission", or "orderCancellation". It should be camel or snake cased.
* `someProperty` is the name of the properties that are required by the command, such as "proposalId" on "voteSubmission", or "price" on "orderSubmission". It should be camel or snake cased.
* If the command you want to send as nested fields, `anObject` is the name of the object that wraps them, such as "peggedOrder" on "orderSubmission". or "terms" on "proposalSubmission".

## Examples

### Vote submission

```json
{
  "voteSubmission": {
    "proposalId": "some-id",
    "value": "VALUE_YES"
  }
}
```


### Order submission

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

## Usage on the command-line

1. It should be on a single to avoid problem with terminals not properly handling multiple arguments.
2. Don't forget to wrap the JSON payload with single quotes in the command line to prevent the terminal interpreting the JSON command as a special command.

It should look like this:

```shell
vegawallet some-command '{"commandName": {"someProperty": "someValue", "anObject": {"nestedProperty":42}}}'
```
