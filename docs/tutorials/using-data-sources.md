---
title: Using data sources
sidebar_position: 8
hide_title: false
description: Include data source details in a proposal and submit data to settle and terminate a market
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Choosing a data source when proposing a market
A market proposal must specify details about the data it requires in the market creation governance proposal. When configuring a market's instrument, you will need to select the data sourcefor two events: settlement and trading termination. 

This is done by:
1. Defining a data source spec binding for settlement price
2. Configuring a data source spec for settlement price values
3. Defining a data source spec binding for trading termination
4. Configuring a data source spec for trading termination values

The **binding** tells the market which field contains the value. The **spec** defines where this data will come from, and which values to pass through to the binding.

:::note Read more: 
[Market governance concepts:](../concepts/governance.md#market-governance)
[Tutorial - proposing a market:](./proposals/new-market-proposal.md)
:::

## Ethereum oracles
Since version 0.73.0, settlement data can be sourced from Ethereum smart contracts. The following spec would read from the Ethereum contract at `0x1b4...e43` every 30 seconds, and fetch the Bitcoin price value from the returned object:

```javascript
"dataSourceSpecForSettlementData": {
    "external": {
        "ethOracle": {
            "address": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
            "abi": "[{\"inputs\":[],\"name\":\"latestAnswer\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"\",\"type\":\"int256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
            "method": "latestAnswer",
            "normalisers": [{
                  "name": "btc.price",
                  "expression": "$[0]"
              }],
            "requiredConfirmations": 3,
            "trigger": {
                "timeTrigger": {
                    "every": 30
                }
            },
            "filters": [{
                    "key": {
                        "name": "btc.price",
                        "type": "TYPE_INTEGER",
                        "numberDecimalPlaces": 8
                    },
                    "conditions": [
                        {
                            "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
                            "value": "0"
                        }
                    ]
                }
            ]
        }
    }
}
```

This will cause the network validators to read the result from the specified smart contract and submit the result to Vega. When the data is verified by enough validators, this price is accepted on to the network. This is unlike the other two Oracle types ([Open Oracle signed messages](#open-oracle-signed-messages) & [JSON signed message data](#json-signed-message-data)),which both rely on a third party submitting data to the network.

### ABI
The `address` field in the specification tells the spec above which address to interact with on Ethereum. The `abi` ([Application Binary Interface](https://docs.soliditylang.org/en/develop/abi-spec.html#json) & `method` field on the spec above tells the settlement spec **how** to interact with it. Ethereum Oracle settlement specifications use the JSON ABI of the smart contract to describe the method on the contract that will be called to fetch the data. The ABI will contain the function name, details of any paramters required, and the format of the response. 

For example, the [Chainlink BTC/USD oracle](https://data.chain.link/ethereum/mainnet/crypto-usd/btc-usd) has its JSON ABI [published on Etherscan](https://etherscan.io/address/0xf4030086522a5beea4988f8ca5b36dbc97bee88c#auditReportId). When defining the data source spec, you can populate the `abi` field with the full ABI, and then set the `method` to `latestAnswer`.

:::note Shrinking the ABI
When populating the `abi` field on your data source spec, you can remove the methods and other fields that are not required by the oracle. We've done that in the sample data source above - only the `latestAnswer` method and its inputs and outputs are in the `abi` field.
:::

### Time trigger
As it says above, with Ethereum data source specs the validators will read the specified smart contract and method detailed in the ABI. The `trigger` instructs the validators when to do this. In the smple above, it will be called every 30 seconds.

### Normaliser
Normalises data

## Open Oracle signed messages
Vega's Data Sourcing framework supports signed ABI-encoded [Open Oracle ↗](https://github.com/compound-finance/open-oracle) or JSON messages. ABI-encoded signed messages can be verified to have come from the public key that signed them, which allows markets on Vega to use pricing data sourced from Ethereum.

When it's time for a market to settle, someone needs to submit the data that matches the data source spec defined in the market. Any Vega keypair can submit the data. In the configuration for a market, a data source specification field dictates which data feeds it is interested in. In effect, it works as a filter. This specification means that the creator of an instrument for a market will choose in advance a price source, and which data fields the market requires to settle and terminate.

### Using Open Oracle signed messages in a market proposal
For the binding, use the `name` field of the data. In the case of Open Oracle messages, the price data will be availableas 'prices.currency-code.value', for example:`"prices.BTC.value"`.

For now this will focus on using the data for settlement price - both examples below use a Vega time data source to terminate the market.

```javascript
"dataSourceSpecBinding": {
  "settlementDataProperty": "prices.BTC.value",
  "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
}
```

The following spec would make the market use the BTC value from the [Coinbase Price Oracle ↗](https://blog.coinbase.com/introducing-the-coinbase-price-oracle-6d1ee22c7068) data that is submitted in a subsequent example:

```javascript
   "dataSourceSpecForSettlementData": {
        "signers": [{"ethAddress": { "address": "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC" } }],
        "filters": [{
            "key": {
                "name": "prices.BTC.timestamp",
                "type": "TYPE_INTEGER",
            },
            "conditions": [{
                "operator": "OPERATOR_GREATER_THAN",
                "value": "1649265840",
            }]
        }]
    }
```

The `signers: ethAddress` in this case is the Ethereum public key that **signed the data in the message**. 

### Submitting Open Oracle data
Use the command line to submit an Open Oracle message as a transaction that is signed by your Vega wallet and sent to the validators for consensus.

Below, find instructions on how to submit Open Oracle data as a signed message. Markets should be configured to only use the data at the relevant time, such as after a defined settlement date, in the [market proposal](./proposals/new-market-proposal.md).

When it's time for a market to settle, someone needs to submit the data that matches the data source spec defined in the market.

### 1. Obtain an Open Oracle message

```json
{
    "timestamp": "1649265840",
    "messages": ["0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000624dccb000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000a2e04f5f00000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000"],
    "signatures": ["0x8362a456997287a6b89e2de52e26c2aca423ab0ed401f9a23c81da2e2c56a5db27365adcb478d7b36558df58ca5dd240191a0f08a7f0ed79ee23cec77521e5c2000000000000000000000000000000000000000000000000000000000000001b"],
    "prices": {
        "BTC": "43721.75"
    }
}
```

### 2. Encode the Open Oracle message
<Tabs groupId="encodeOpenOracle">
  <TabItem value="cmd" label="Linux / OSX command line">

```bash
  echo '{"timestamp":"1649265840","messages":["0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000624dccb000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000a2e04f5f00000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000"],"signatures":["0x8362a456997287a6b89e2de52e26c2aca423ab0ed401f9a23c81da2e2c56a5db27365adcb478d7b36558df58ca5dd240191a0f08a7f0ed79ee23cec77521e5c2000000000000000000000000000000000000000000000000000000000000001b"],"prices":{"BTC":"43721.75"}}' | base64
```

It will return a payload string that will look something like this:

```
eyJ0aW1lc3RhbXAiOiIxNjQ5MjY1ODQwIiwibWVzc2FnZXMiOlsiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA2MjRkY2NiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYTJlMDRmNWYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjcwNzI2OTYzNjU3MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAzNDI1NDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJdLCJzaWduYXR1cmVzIjpbIjB4ODM2MmE0NTY5OTcyODdhNmI4OWUyZGU1MmUyNmMyYWNhNDIzYWIwZWQ0MDFmOWEyM2M4MWRhMmUyYzU2YTVkYjI3MzY1YWRjYjQ3OGQ3YjM2NTU4ZGY1OGNhNWRkMjQwMTkxYTBmMDhhN2YwZWQ3OWVlMjNjZWM3NzUyMWU1YzIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDFiIl0sInByaWNlcyI6eyJCVEMiOiI0MzcyMS43NSJ9fQo=
```

  </TabItem>
  <TabItem value="win" label="Windows command line">

Encoding an item as base64 isn't a one-liner on Windows. There are numerous online sites that can encode a string, or you can use your programming language of choice to do it. To do it locally, save the response to a file, `raw.txt`:

```json
{
  "timestamp":"1649265840","messages":["0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000624dccb000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000a2e04f5f00000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000"],"signatures":["0x8362a456997287a6b89e2de52e26c2aca423ab0ed401f9a23c81da2e2c56a5db27365adcb478d7b36558df58ca5dd240191a0f08a7f0ed79ee23cec77521e5c2000000000000000000000000000000000000000000000000000000000000001b"],"prices":{"BTC":"43721.75"}
}
```

Then run the following command:
```
certutil -encode raw.txt encoded.txt
```
`encoded.txt` will now contain your encoded message.

  </TabItem>
</Tabs>

### 3. Submit the message to the chain
When submitting the `OracleDataSubmission`, make sure to specify the `source` field as `ORACLE_SOURCE_OPEN_ORACLE`.

<Tabs groupId="submitOpenOracle">
  <TabItem value="cmd" label="Linux / OSX command line">

```bash
vegawallet transaction send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_OPEN_ORACLE", "payload":"INSERT_PAYLOAD_STRING" }}'
```

  </TabItem>
  <TabItem value="win" label="Windows command line">

```bash
vegawallet.exe transaction send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_OPEN_ORACLE", "payload":"INSERT_PAYLOAD_STRING" }}'
```

  </TabItem>
</Tabs>


You will be able to see this data by querying the API for `OracleData`. In the API response you will be able to check which markets had filters that matched this data.

### Querying the data
The [Oracle Data list REST endpoint](../api/rest/data-v2/trading-data-service-list-oracle-data) shows previous data submissions, which can be useful for confirming that data submission was sucessful, and/or determining the fields that a market's data source spec requires.

## JSON signed message data
[JSON ↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) messages are a simpler, more configurable alternative to Open Oracle data. They can be totally custom objects, as long as they are valid JSON. As they are not attested by any off-chain source in the way that Open Oracle messages are, and so it's generally advisable to check for an Open Oracle price source before choosing JSON data. The Vega key that signs the message will be referred to as the source for the data. 

When it's time for a market to settle, someone needs to submit the data that matches the data source spec defined in the market. Any Vega keypair can submit the data. In the configuration for a market, a data source specification field dictates which data feeds it is interested in. In effect, it works as a filter. This specification means that the creator of an instrument for a market will choose in advance a price source, and which data fields the market requires to settle and terminate.

### Using JSON signed message data in a market proposal
For the binding, use the `name` field of the data. In the following example, the market is settled based on the number of people who have walked on the moon.

```javascript
"dataSourceSpecBinding": {
  "settlementDataProperty": "moonwalkers",
  "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
}
```

The data source specification that would bind to the `moonwalkers` property would be as follows:

```javascript
   "dataSourceSpecForSettlementData": {
        "signers": [{ "pubKey":{ "key": "123abc" }}],
        "filters": [{
            "key": {
                "name": "moonwalkers",
                "type": "TYPE_INTEGER",
                "numberDecimalPlaces": "0"
            },
            "conditions": [{
                "operator": "OPERATOR_GREATER_THAN",
                "value": "12",
            }]
        }]
    }
```

### Submitting JSON data
Use the command line to submit a JSON message as a transaction that is signed by your Vega wallet and sent to the validators for consensus.

:::info API note
- Data should be encoded as strings. `true` should be `"true"`, `12` should be `"12"`
- In the API responses, the `pubKeys` field for JSON oracle data submissions is set to the VEGA public key of the submitter.
:::

### 1. Define your JSON structure
JSON data should be submitted as a single object of attributes and primitive values (i.e. no objects or arrays). Exactly what the attributes are called is up to the submitter of the data. Pick your structure in advance and ensure that it's well communicated. For this tutorial, we'll create a JSON data source for the number of humans that have walked on the moon:

```json
{
  "moonwalkers": "12"
}
```

### 2. Encode the message
All `OracleDataSubmission` data is `base64` encoded. Here's how to do that on Linux or OSX:

<Tabs groupId="encodeJsonOracle">
  <TabItem value="cmd" label="Linux / OSX command line">

```bash
echo '{"moonwalkers":"12"}' | base64
```

This will give you something like:
```
eyJtb29ud2Fsa2VycyI6IjEyIn0K
```


  </TabItem>
  <TabItem value="win" label="Windows command line">

Encoding an item as base64 isn't a one-liner on Windows. There are numerous online sites that can encode a string, or you can use your programming language of choice to do it. 

To do it locally, save `'{"moonwalkers":"12"}'` to a file, `raw.txt`. 

Then run the following command: 
```
certutil -encode raw.txt encoded.txt
```

`encoded.txt` now contains your encoded message.

  </TabItem>
</Tabs>

### 3. Submit the message to the chain
When submitting the `OracleDataSubmission`, make sure to specify the `source` field as `ORACLE_SOURCE_JSON`.

<Tabs groupId="submitJsonOracle">
  <TabItem value="cmd" label="Linux / OSX command line">

```bash title="Linux/OSX command line example"
vegawallet transaction send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_JSON", "payload":"RESPONSE_PAYLOAD" }}'
```

  </TabItem>
  <TabItem value="win" label="Windows command line">

```bash title="Linux/OSX command line example"
vegawallet.exe transaction send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_JSON", "payload":"RESPONSE_PAYLOAD" }}'
```

  </TabItem>
</Tabs>

### Querying an existing data source spec
The [Oracle Data list REST endpoint](../api/rest/data-v2/trading-data-service-list-oracle-data) shows previous data submissions, which can be useful for confirming that a data submission was successful, and/or determining the fields that a market's data source spec requires.

## Built-in data source
Vega provides a timestamp source, which is useful for terminating a market at a set date. `vegaprotocol.builtin.timestamp` provides a Unix timestamp of the Vega time, which is to say the time agreed via consensus.

As the name implies, a built in data source is generated inside Vega, and cannot be submitted by other keys.

### Using built-in data for trading termination
It's possible to settle on any data source field - for instance checking if a `boolean` is `true` - but time is a good starting point, and the [built-in time data source](#built-in-data-source) can be used for exactly that. 

When using the built-in time source, **use greater than or equals**, rather than solely equals. This will help to avoid missing the time if no event is emitted with the precise required timestamp.

```javascript
"dataSourceSpecForTradingTermination": {
    // pubKeys is empty as this is using a built in source
    "pubKeys": [],
    "filters": [{
        "key": {
            "name": "vegaprotocol.builtin.timestamp",
            "type": "TYPE_TIMESTAMP",
        },
        "conditions": [{
            "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
            "value": "1660826549",
        }]
    }]
}
```

This spec would make the market cease trading when the built-in time data source posted a Vega timestamp update that was on or after Thu Mar 31 2022 at 00:00:00.

