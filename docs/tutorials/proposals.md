---
title: Proposals by example
hide_title: false
keywords:
- proposal
- governance
- newFreeform
- updateNetworkParameter
- newAsset
- newMarket
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Update a network parameter
<Tabs groupId="updateNetworkParameter">
<TabItem value="annotated" label="Annotated example">

```javascript
{
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1652006675440,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1652093075440,
    updateNetworkParameter:  {
      changes: {
        // The unique key (string) 
        key: "governance.proposal.freeform.minVoterBalance",
        // The value for the network parameter (string) 
        value: "0.8285523254321492"
      }
    }
 }
```
</TabItem>
<TabItem value="json" label="JSON example">

```json
{
  "closingTimestamp": 1652006675440,
  "enactmentTimestamp": 1652093075440,
  "updateNetworkParameter": {
    "changes": {
      "key": "governance.proposal.freeform.minVoterBalance",
      "value": "0.8285523254321492"
    }
  }
}
```
</TabItem>
<TabItem value="cmd" label="Command line example">

```bash
vegawallet command send --wallet your_username --pubkey your_key --network mainnet '{"proposalSubmission":{"reference":"test-updateNetworkParameter","terms":{"closingTimestamp":1652006675440,"enactmentTimestamp":1652093075440,"updateNetworkParameter":{"changes":{"key":"governance.proposal.freeform.minVoterBalance","value":"0.8285523254321492"}}}}}'
```
</TabItem>
</Tabs>

## New asset (ERC20)
<Tabs groupId="newAsset">
<TabItem value="annotated" label="Annotated example">

```javascript
{
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1652006675440,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1652093075440,
    newAsset:  {
        changes: {
          // Name of the asset (e.g: Great British Pound) (string) 
          name: "BNB",
          // Symbol of the asset (e.g: GBP) (string) 
          symbol: "BNB",
          // Total circulating supply for the asset (string) 
          totalSupply: "19010568",
          // Number of decimal / precision handled by this asset (string) 
          decimals: "5",
          // The minimum economically meaningful amount in the asset (string) 
          quantum: "1",
          // An Ethereum ERC20 asset
          erc20: {
            // The address of the contract for the token, on the ethereum network (string)
            contractAddress: "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e",
          }
       }
    }
 }
```
</TabItem>
<TabItem value="json" label="JSON example">

```json
{
  "closingTimestamp": 1652006675440,
  "enactmentTimestamp": 1652093075440,
  "newAsset": {
    "changes": {
      "name": "BNB",
      "symbol": "BNB",
      "totalSupply": "19010568",
      "decimals": "5",
      "quantum": "1",
      "erc20": {
        "contractAddress": "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e"
      }
    }
  }
}
```
</TabItem>
<TabItem value="cmd" label="Command line example">

```bash
vegawallet command send --wallet your_username --pubkey your_key --network mainnet '{"proposalSubmission":{"reference":"test-newAsset","terms":{"closingTimestamp":1652006675440,"enactmentTimestamp":1652093075440,"newAsset":{"changes":{"name":"BNB","symbol":"BNB","totalSupply":"19010568","decimals":"5","quantum":"1","erc20":{"contractAddress":"0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e"}}}}}}'
```
</TabItem>
</Tabs>

## New Freeform Proposal
<Tabs groupId="newFreeform">
<TabItem value="annotated" label="Annotated example">

```javascript
{
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string}) 
    closingTimestamp: 1652006675441,
    newFreeform:  {
        changes: {
          // The URL containing content that describes the proposal (string) 
          url: "https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si",
          // A short description of what is being proposed (string)
          description: "A proposal that demonstrates freeform proposals",
          // The hash on the content of the URL (string)
          hash: "bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si"
       }
    }
}
```
</TabItem>
<TabItem value="json" label="JSON example">

```json
{
  "closingTimestamp": 1652006675441,
  "newFreeform": {
    "changes": {
      "url": "https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si",
      "description": "A proposal that demonstrates freeform proposals",
      "hash": "bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si"
    }
  }
}
```
</TabItem>
<TabItem value="cmd" label="Command line example">

```bash
vegawallet command send --wallet your_username --pubkey your_key --network mainnet '{"proposalSubmission":{"reference":"test-newFreeform","terms":{"closingTimestamp":1652006675441,"newFreeform":{"changes":{"url":"https://dweb.link/ipfs/bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si","description":"A proposal that demonstrates freeform proposals","hash":"bafybeigwwctpv37xdcwacqxvekr6e4kaemqsrv34em6glkbiceo3fcy4si"}}}}}'
```
</TabItem>
</Tabs>

## New market
<Tabs groupId="newMarket">
<TabItem value="annotated" label="Annotated example">

```javascript
{
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1652006675442,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1652093075442,
    newMarket:  {
      changes: {
        // Decimal places used for the new market (uint64 as string) 
        decimalPlaces: "5",
        // Decimal places for order sizes (uint64 as string) 
        positionDecimalPlaces: "5",
        // New market instrument configuration
        instrument: {
        // Instrument name
        name: "Apples Yearly (2022)",
        // Instrument code
        code: "APPLES.22",
        // Future
        future: {
          // Product settlement asset identifier (string)
          settlementAsset: "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
          // Product quote name (string)
          quoteName: "tEuro",
          // the number of decimal places implied by the settlement price emitted by the settlement oracle (int64 as integer)
          settlementPriceDecimals: 5,
          // The oracle spec describing the oracle data of settlement price (object)
          oracleSpecForSettlementPrice: {
            // pubKeys is the list of authorized public keys that signed the data for this
            // oracle. All the public keys in the oracle data should be contained in these
            // public keys. (array of strings)
            pubKeys: ["0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"] 
            // filters describes which oracle data are considered of interest or not for
            // the product (or the risk model).
            filters: [
                {
                  // key is the oracle data property key targeted by the filter.
                  key: {
                    // name is the name of the property. (string)
                    name: "prices.AAPL.value",
                    // type is the type of the property. (string)
                    type: "TYPE_INTEGER",
                  }
                }
              ],
              // conditions are the conditions that should be matched by the data to be
              // considered of interest.
              conditions: [
                {
                  // comparator is the type of comparison to make on the value. (string)
                  operator: "OPERATOR_EQUALS",
                  // value is used by the comparator. (string)
                  value: "1",
                }
              ]
            }
          ],
          // The oracle spec describing the oracle data of trading termination (object)
          oracleSpecForTradingTermination: {
            // pubKeys is the list of authorized public keys that signed the data for this
            // oracle. All the public keys in the oracle data should be contained in these
            // public keys. (array of strings)
            pubKeys: ["0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"] 
            // filters describes which oracle data are considered of interest or not for
            // the product (or the risk model).
            filters: [
                {
                  // key is the oracle data property key targeted by the filter.
                  key: {
                    // name is the name of the property. (string)
                    name: "prices.AAPL.value",
                    // type is the type of the property. (string)
                    type: "TYPE_INTEGER",
                  }
                }
              ],
              // conditions are the conditions that should be matched by the data to be
              // considered of interest.
              conditions: [
                {
                  // comparator is the type of comparison to make on the value. (string)
                  operator: "OPERATOR_EQUALS",
                  // value is used by the comparator. (string)
                  value: "1",
                }
              ]
            }
          ],
          // The binding between the oracle spec and the settlement price (object)
          oracleSpecBinding: {
            // settlement_price_property holds the name of the property in the oracle data
            // that should be used as settlement price.
            // If it is set to "prices.BTC.value", then the Future will use the value of
            // this property as settlement price. (string) 
            settlementPriceProperty: "prices.AAPL.value",
            // the name of the property in the oracle data that signals termination of trading (string) 
            tradingTerminationProperty: "prices.AAPL.value"
          }
      },
        // Optional new market meta data, tags
        metadata: ["sector:tech","source:docs.vega.xyz"],
        // Price monitoring parameters
        priceMonitoringParameters: {
          // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
          triggers: [
            {
            // Price monitoring projection horizon τ in seconds (int64 as string)
            horizon: "43200",
            // Price monitoring probability level p (string)
            probability: "0.9999999",
            // Price monitoring auction extension duration in seconds should the price
            // breach it's theoretical level over the specified horizon at the specified
            // probability level (int64 as string)
            auctionExtension: "600",
            }
        ]
      },
        // Liquidity monitoring parameters
        liquidityMonitoringParameters: {
        // Specifies parameters related to target stake calculation
        targetStakeParameters: {
          // Specifies length of time window expressed in seconds for target stake calculation (string)
          timeWindow: "3600",
          // Specifies scaling factors used in target stake calculation (number)
          scalingFactor: 10
        },
        // Specifies the triggering ratio for entering liquidity auction (double as number) 
        triggeringRatio: "0.7",
        // Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction (int64 as string) 
        auctionExtension: "1",
      }},
        // Log normal risk model parameters, valid only if MODEL_LOG_NORMAL is selected
        logNormal: {
        // Tau (number) 
        tau: 0.0001140771161,
        // Risk Aversion Parameter (double as number) 
        riskAversionParameter: "0.001",
        // Risk model parameters for log normal
        params: {
          // Mu param (double as number) 
          mu: 0,     
          // R param (double as number) 
          r: 0.016,     
          // Sigma param (double as number) 
          sigma: 1.25,     
        }
      },
       }
    }
 }
```
</TabItem>
<TabItem value="json" label="JSON example">

```json
{
  "closingTimestamp": 1652006675442,
  "enactmentTimestamp": 1652093075442,
  "newMarket": {
    "changes": {
      "decimalPlaces": "5",
      "positionDecimalPlaces": "5",
      "instrument": {
        "name": "Apples Yearly (2022)",
        "code": "APPLES.22",
        "future": {
          "settlementAsset": "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
          "quoteName": "tEuro",
          "settlementPriceDecimals": 5,
          "oracleSpecForSettlementPrice": {
            "pubKeys": [
              "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
            ],
            "filters": [
              {
                "key": {
                  "name": "prices.AAPL.value",
                  "type": "TYPE_INTEGER"
                },
                "conditions": [
                  {
                    "operator": "OPERATOR_EQUALS",
                    "value": "1"
                  }
                ]
              }
            ]
          },
          "oracleSpecForTradingTermination": {
            "pubKeys": [
              "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
            ],
            "filters": [
              {
                "key": {
                  "name": "prices.AAPL.value",
                  "type": "TYPE_INTEGER"
                },
                "conditions": [
                  {
                    "operator": "OPERATOR_EQUALS",
                    "value": "1"
                  }
                ]
              }
            ]
          },
          "oracleSpecBinding": {
            "settlementPriceProperty": "prices.AAPL.value",
            "tradingTerminationProperty": "prices.AAPL.value"
          }
        }
      },
      "metadata": [
        "sector:tech",
        "source:docs.vega.xyz"
      ],
      "priceMonitoringParameters": {
        "triggers": [
          {
            "horizon": "43200",
            "probability": "0.9999999",
            "auctionExtension": "600"
          }
        ]
      },
      "liquidityMonitoringParameters": {
        "targetStakeParameters": {
          "timeWindow": "3600",
          "scalingFactor": 10
        },
        "triggeringRatio": 0.7,
        "auctionExtension": "1"
      },
      "logNormal": {
        "tau": 0.0001140771161,
        "riskAversionParameter": 0.001,
        "params": {
          "mu": 0,
          "r": 0.016,
          "sigma": 1.25
        }
      }
    },
    "liquidityCommitment": {
      "commitmentAmount": "4612145",
      "fee": "0.53",
      "buys": [
        {
          "offset": "24",
          "proportion": 3,
          "reference": "PEGGED_REFERENCE_BEST_BID"
        },
        {
          "offset": "52",
          "proportion": 8,
          "reference": "PEGGED_REFERENCE_BEST_BID"
        },
        {
          "offset": "21",
          "proportion": 1,
          "reference": "PEGGED_REFERENCE_BEST_BID"
        }
      ],
      "sells": [
        {
          "offset": "82",
          "proportion": 3,
          "reference": "PEGGED_REFERENCE_BEST_ASK"
        },
        {
          "offset": "73",
          "proportion": 10,
          "reference": "PEGGED_REFERENCE_BEST_ASK"
        },
        {
          "offset": "22",
          "proportion": 1,
          "reference": "PEGGED_REFERENCE_BEST_ASK"
        }
      ]
    }
  }
}
```
</TabItem>
<TabItem value="cmd" label="Command line example">

```bash
vegawallet command send --wallet your_username --pubkey your_key --network mainnet '{"proposalSubmission":{"reference":"test-newMarket","terms":{"closingTimestamp":1652006675442,"enactmentTimestamp":1652093075442,"newMarket":{"changes":{"decimalPlaces":"5","positionDecimalPlaces":"5","instrument":{"name":"Apples Yearly (2022)","code":"APPLES.22","future":{"settlementAsset":"8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4","quoteName":"tEuro","settlementPriceDecimals":5,"oracleSpecForSettlementPrice":{"pubKeys":["0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"],"filters":[{"key":{"name":"prices.AAPL.value","type":"TYPE_INTEGER"},"conditions":[{"operator":"OPERATOR_EQUALS","value":"1"}]}]},"oracleSpecForTradingTermination":{"pubKeys":["0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"],"filters":[{"key":{"name":"prices.AAPL.value","type":"TYPE_INTEGER"},"conditions":[{"operator":"OPERATOR_EQUALS","value":"1"}]}]},"oracleSpecBinding":{"settlementPriceProperty":"prices.AAPL.value","tradingTerminationProperty":"prices.AAPL.value"}}},"metadata":["sector:tech","source:docs.vega.xyz"],"priceMonitoringParameters":{"triggers":[{"horizon":"43200","probability":"0.9999999","auctionExtension":"600"}]},"liquidityMonitoringParameters":{"targetStakeParameters":{"timeWindow":"3600","scalingFactor":10},"triggeringRatio":0.7,"auctionExtension":"1"},"logNormal":{"tau":0.0001140771161,"riskAversionParameter":0.001,"params":{"mu":0,"r":0.016,"sigma":1.25}}},"liquidityCommitment":{"commitmentAmount":"4612145","fee":"0.53","buys":[{"offset":"24","proportion":3,"reference":"PEGGED_REFERENCE_BEST_BID"},{"offset":"52","proportion":8,"reference":"PEGGED_REFERENCE_BEST_BID"},{"offset":"21","proportion":1,"reference":"PEGGED_REFERENCE_BEST_BID"}],"sells":[{"offset":"82","proportion":3,"reference":"PEGGED_REFERENCE_BEST_ASK"},{"offset":"73","proportion":10,"reference":"PEGGED_REFERENCE_BEST_ASK"},{"offset":"22","proportion":1,"reference":"PEGGED_REFERENCE_BEST_ASK"}]}}}}}'
```
</TabItem>
</Tabs>
