---
title: Use oracle data
hide_title: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

An oracle is a system that allows external data to be represented on a blockchain. Oracles are used as data sources on Vega to provide specific data that will be submitted to settle and terminate markets. All markets need a data source.

The Vega network accepts three types of sources to provide data. Note, not all oracles provide the same type of data. 
* Open Oracle
* JSON data 
* Internal timestamp source that is provided by the network

## Choosing a data source when proposing a market
You need to specify details about the oracle in a market's governance proposal, including what data it can provide, before it's submitted. 

When configuring a market's instrument, you will need to select the data from one of the two sources. 

This is done by:
1. Defining an oracle spec binding for settlement price
2. Configuring an oracle spec for settlement price values
3. Defining an oracle spec binding for trading termination
4. Configuring an oracle spec for trading termination values

The **binding** tells the market which field contains the value. The **spec** defines which public keys to watch for data from, and which values to pass through to the binding.

When it's time for a market to settle, someone needs to submit the data that matches the oracle spec defined in the market.

Read more: 
[Market governance concepts:](../concepts/vega-protocol.md)
[Tutorial - proposing a market:](./proposals/new-market-proposal.md)

## Who can submit oracle data
Any Vega keypair can submit oracle data to the chain. In the configuration for a market, an oracle specification field dictates which data feeds it is interested in. In effect, it works as a filter. This specification means that the creator of an instrument for a market will choose in advance a price source, and which data fields the market requires to settle and terminate.

## Open Oracle
[Open Oracle](https://github.com/compound-finance/open-oracle) is a standard for encoding price data and signatures for price messages.

### Using Open Oracle data in a market proposal
For the binding, use the `name` field of the data. In the case of our example above, this would be `"prices.BTC.value"`.

For now this will focus on using the data for settlement price - both examples below use a Vega time data source to terminate the market.

```javascript
"oracleSpecBinding": {
  "settlementPriceProperty": "prices.BTC.value",
  "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
}
```

The following oracle spec would make the market use the BTC value from the Open Oracle data submitted above:

```javascript
   "oracleSpecForSettlementPrice": {
        "pubKeys": ["0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"],
        "filters": [{
            "key": {
                "name": "price.BTC.value",
                "type": "TYPE_INTEGER",
            },
            "conditions": [{
                "operator": "OPERATOR_GREATER_THAN",
                "value": "0",
            }]
        }]
    }
```

### Submitting Open Oracle data
Use the command line to submit an Open Oracle message as a transaction that is signed by your Vega wallet and sent to the validators for consensus.

Below, find instructions on how to submit Open Oracle data. Anyone can submit Open Oracle data, at any time. Markets should be configured to only use the data at the relevant time, such as after a defined settlement date.

:::info API note
When looking at market data using the API, the `pubKeys` field in the response for Open Oracle data submissions is set to the Open Oracle signing key.
:::

### 1. Get an Open Oracle message

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
    vegawallet command send \
        --wallet oracle-wallet \
        --pubkey 123abc \
        --network fairground \
        '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_OPEN_ORACLE", "payload":"INSERT_PAYLOAD_STRING" }}'
    ```

  </TabItem>
  <TabItem value="win" label="Windows command line">

    ```bash
    vegawallet.exe command send \
        --wallet oracle-wallet \
        --pubkey 123abc \
        --network fairground \
        '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_OPEN_ORACLE", "payload":"INSERT_PAYLOAD_STRING" }}'
    ```

  </TabItem>
</Tabs>


You will be able to see this data by querying the API for `OracleData`. In the API response you will be able to check which markets had filters that matched this data.

### Querying the data
The following GraphQL query shows previous oracle data submissions, which can be useful for confirming that data submission was sucessful, and/or determining the fields that a market's oracle spec requires.

```graphql
{
  oracleData {
    pubKeys
    data {
      name
      value
    }
    broadcastAt
    matchedSpecIds
  }
}
```

The data we submitted in step three will be returned as follows:
```javascript
{
  "data": {
    "oracleData": [
      // This is the Open Oracle data message
      {
        "pubKeys": [
          // This is the Ethereum public key of the Coinbase oracle, the original signer of the Open Oracle message
          // submitted above
          "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
        ],
        "data": [
          {
            "name": "prices.BTC.value",
            "value": "43721750000"
          },
          {
            "name": "prices.BTC.timestamp",
            "value": "1649265840"
          }
        ],
        "broadcastAt": "",
        "matchedSpecIds": null
      }
    ]
  }
}
```

## JSON oracle
[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) oracles are an alternative to Open Oracle data. The advantage is that they can be totally custom objects, as long as they are valid JSON. The disadvantage is that they are not attested by any off-chain source in the way that Open Oracle messages are. Due to this constraint, it's generally advisable to find an Open Oracle price source before resorting to JSON data.

### Using JSON oracle spec in a market proposal
For the binding, use the `name` field of the data. In the case of our example above, this would be `"moonwalkers"`.

```javascript
"oracleSpecBinding": {
  "settlementPriceProperty": "moonwalkers",
  "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
}
```

The Oracle Specification that would bind to the `moonwalkers` property would be as follows:

```javascript
   "oracleSpecForSettlementPrice": {
        "pubKeys": ["123abc"],
        "filters": [{
            "key": {
                "name": "moonwalkers",
                "type": "TYPE_INTEGER",
            },
            "conditions": [{
                "operator": "OPERATOR_GREATER_THAN",
                "value": "12",
            }]
        }]
    }
```

### Submitting JSON oracle data
Use the command line to submit a JSON message as a transaction that is signed by your Vega wallet and sent to the validators for consensus.

:::info API note
- Data should be encoded as strings. `true` should be `"true"`, `12` should be `"12"`
- In the API responses, the `pubKeys` field for JSON oracle data submissions is set to the VEGA public key of the submitter.
:::

### 1. Define your JSON structure
JSON oracles can contain arbitrary JSON data - but to be useful for market creators, they'll need to know what the structure is ahead of time. Pick a data model and ensure that it's well communicated. For this tutorial, we'll create a JSON data source for the number of humans that have walked on the moon:

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
vegawallet command send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_JSON", "payload":"RESPONSE_PAYLOAD" }}'
```

  </TabItem>
  <TabItem value="win" label="Windows command line">

```bash title="Linux/OSX command line example"
vegawallet.exe command send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_JSON", "payload":"RESPONSE_PAYLOAD" }}'
```  

  </TabItem>
</Tabs>

### Querying an existing oracle spec
The following GraphQL query shows previous oracle data submissions, which can be useful for confirming that a data submission was successful, and/or determining the fields that a market's oracle spec requires.

```graphql
{
  oracleData {
    pubKeys
    data {
      name
      value
    }
    broadcastAt
    matchedSpecIds
  }
}
```
Assuming someone submitted JSON oracle data, the result would be something like this:

```javascript
{
 {
  "data": {
    "oracleData": [
      // This is the JSON Oracle data message
      {
        "pubKeys": [
          // For JSON Oracles, the public key is the vega key that submitted the message
          "123abc"
        ],
        "data": [
          {
            "name": "moonwalkers",
            "value": "12"
          }
        ],
        "broadcastAt": "",
        "matchedSpecIds": null
      }
    ]
  }
}
```

## Built-in data source
Vega provides a timestamp source, which is useful for terminating a market at a set date. `vegaprotocol.builtin.timestamp` provides a Unix timestamp of the Vega time, which is to say the time agreed via consensus.

As the name implies, a built in data source is generated inside Vega, and cannot be submitted by other keys.

### Using built-in oracle data for trading termination
It's possible to settle on any data source field - for instance checking if a `boolean` is `true` - but time is a good starting point, and the [built-in time data source](#built-in-data-source) can be used for exactly that:

```javascript
"oracleSpecForTradingTermination": {
    // pubKeys is empty as this is using a built in oracle
    "pubKeys": [],
    "filters": [{
        "key": {
            "name": "vegaprotocol.builtin.timestamp",
            "type": "TYPE_TIMESTAMP",
        },
        "conditions": [{
            "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
            "value": "1648684800000000000",
        }]
    }]
}
```

This spec would make the market cease trading when the built-in time data source posted a Vega timestamp update that was on or after Thu Mar 31 2022 at 00:00:00.

