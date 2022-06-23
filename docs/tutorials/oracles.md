
# Oracles

## Who can submit Oracle Data
Any Vega keypair can submit oracle data to the chain. In the configuration for a market, an Oracle Specification field dictates which oracle data feeds it is interested in. This specification mean that the creator of an instrument for a market will choose in advance a price source, and which fields are required for the market to operate.

## Choosing an Oracle for a market instrument

## Submitting Oracle Data

## Open Oracle
[Open Oracle](https://github.com/compound-finance/open-oracle) is a standard for encoding price data and signatures for the price messages.

### API Notes
- In the API responses, the `pubKeys` field for Open Oracle data submissions is set to the Open Oracle signing key
- 

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

```bash title="Linux/OSX command line example"
echo '{"timestamp":"1649265840","messages":["0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000624dccb000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000a2e04f5f00000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000"],"signatures":["0x8362a456997287a6b89e2de52e26c2aca423ab0ed401f9a23c81da2e2c56a5db27365adcb478d7b36558df58ca5dd240191a0f08a7f0ed79ee23cec77521e5c2000000000000000000000000000000000000000000000000000000000000001b"],"prices":{"BTC":"43721.75"}}' | base64
```

Will return:
```
eyJ0aW1lc3RhbXAiOiIxNjQ5MjY1ODQwIiwibWVzc2FnZXMiOlsiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA2MjRkY2NiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYTJlMDRmNWYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjcwNzI2OTYzNjU3MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAzNDI1NDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJdLCJzaWduYXR1cmVzIjpbIjB4ODM2MmE0NTY5OTcyODdhNmI4OWUyZGU1MmUyNmMyYWNhNDIzYWIwZWQ0MDFmOWEyM2M4MWRhMmUyYzU2YTVkYjI3MzY1YWRjYjQ3OGQ3YjM2NTU4ZGY1OGNhNWRkMjQwMTkxYTBmMDhhN2YwZWQ3OWVlMjNjZWM3NzUyMWU1YzIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDFiIl0sInByaWNlcyI6eyJCVEMiOiI0MzcyMS43NSJ9fQo=
```

### 3. Submit the message to the chain
When submitting the `OracleDataSubmission`, make sure to specify the `source` field as `ORACLE_SOURCE_OPEN_ORACLE`.

```bash title="Linux/OSX command line example"
vegawallet command send \
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_OPEN_ORACLE", "payload":"eyJ0aW1lc3RhbXAiOiIxNjQ5MjY1ODQwIiwibWVzc2FnZXMiOlsiMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA2MjRkY2NiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwYTJlMDRmNWYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjcwNzI2OTYzNjU3MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAzNDI1NDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJdLCJzaWduYXR1cmVzIjpbIjB4ODM2MmE0NTY5OTcyODdhNmI4OWUyZGU1MmUyNmMyYWNhNDIzYWIwZWQ0MDFmOWEyM2M4MWRhMmUyYzU2YTVkYjI3MzY1YWRjYjQ3OGQ3YjM2NTU4ZGY1OGNhNWRkMjQwMTkxYTBmMDhhN2YwZWQ3OWVlMjNjZWM3NzUyMWU1YzIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDFiIl0sInByaWNlcyI6eyJCVEMiOiI0MzcyMS43NSJ9fQo=" }}'
```

You will be able to see this data by querying the API for `OracleData`. In the API response you will be able to check which markets had filters that matched this data.

## JSON Oracle
### API Notes
- Data should be encoded as strings. `true` should be `"true"`, `12` should be `"12"`
- In the API responses, the `pubKeys` field for JSON Oracle data submissions is set to the VEGA public key

[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) oracles are an alternative to Open Oracle data. The advantage is that they can be totally custom objects, as long as they are valid JSON. The disadvantage is that they are not attested by any off-chain source in the way that Open Oracle messages are. Due to this constraint, it's generally advisable to find an Open Oracle price source before resorting to JSON data.

### 1. Define your JSON structure
JSON oracles can contain arbitrary JSON data - but to be useful for market creators, they'll need to know what the structure is ahead of time. So pick a data model and ensure that it's well communicated. For this tutorial, we'll create a JSON oracle for the number of humans that have walked on the moon:

```json
{
  "moonwalkers": "12"
}
```

### 2. Encode the message
All OracleDataSubmission data is base64 encoded. Here's how to do that on a Linux o
```bash title="Linux/OSX command line example"
echo '{"moonwalkers":"12"}' | base64
```

Gives us:
```
eyJtb29ud2Fsa2VycyI6IjEyIn0K
```

### 3. Submit the message to the chain
When submitting the `OracleDataSubmission`, make sure to specify the `source` field as `ORACLE_SOURCE_JSON`.

```bash title="Linux/OSX command line example"
vegawallet command send \ 
    --wallet oracle-wallet \
    --pubkey 123abc \
    --network fairground \
    '{"oracleDataSubmission": { "source": "ORACLE_SOURCE_JSON", "payload":"eyJtb29ud2Fsa2VycyI6IjEyIn0K" }}'
```

## Writing an OracleSpec to match data
The following GraphQL query shows previous Oracle Data submissions, which can be useful for determining the fields that a market's Oracle Spec requires
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

Assuming the two sources defined above had submitted data, the result would be something like this:
```javascript
{
  "data": {
    "oracleData": [
      // This is the Open Oracle data message 
      {
        "pubKeys": [
          // This is the Ethereum public key of the Coinbase oracle, the original signer of the Open Oracle message
          // we submitted above
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
      },
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

When configuring a market's instrument, we will need to select the data from these two sources. This is done by:
1. Defining an Oracle Spec binding for settlement price
2. Configuring an Oracle Spec for settlement price values
3. Defining an Oracle Spec binding for trading termination
4. Defining an Oracle Spec for trading termination values

The **binding** tells the market which field contains the value. The **spec** defines which public keys to watch for data from, and which values to pass through to the binding.

### Open Oracle spec
For the binding, use the `name` field of the data. In the case of our example above, this would be `"prices.BTC.value"`.

```javascript
"oracleSpecBinding": {
  "settlementPriceProperty": "prices.BTC.value",
  "tradingTerminationProperty": "?"
}
```

### JSON Oracle spec
For the binding, use the `name` field of the data. In the case of our example above, this would be `"moonwalkers"`.

```javascript
"oracleSpecBinding": {
  "settlementPriceProperty": "moonwalkers",
  "tradingTerminationProperty": "?"
}
```
