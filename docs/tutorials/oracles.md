
# Oracles

## Who can submit Oracle Data
Any Vega keypair can submit oracle data to the chain. In the configuration for a market, an Oracle Specification field dictates which oracle data feeds it is interested in. This specification mean that a market creator will choose in advance a price source, and which fields are required for the market to operate.

## Choosing an oracle

## Submitting Oracle Data

## Open Oracle
- In the API responses, the `pubKeys` field for Open Oracle data submissions is set to the Open Oracle signing key

## JSON Oracle
- In the API responses, the `pubKeys` field for JSON Oracle data submissions is set to the VEGA public key

[JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) oracles are an alternative to Open Oracle data. The advantage is that they can be totally custom objects, as long as they are valid JSON. The disadvantage is that they are not attested by any off-chain source in the way that Open Oracle messages are. Due to this constraint, it's generally advisable to find an Open Oracle price source before resorting to JSON data.
