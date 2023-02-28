
  ```json
{
  "rationale": {
    "title": "Add Lorem Ipsum market",
    "description": "An example proposal to add Lorem Ipsum market"
  },
  "terms": {
    "newMarket": {
      "changes": {
        "lpPriceRange": "10",
        "decimalPlaces": "5",
        "positionDecimalPlaces": "5",
        "instrument": {
          "name": "Oranges Daily",
          "code": "ORANGES.24h",
          "future": {
            "settlementAsset": "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
            "quoteName": "tEuro",
            "dataSourceSpecForSettlementData": {
              "external": {
                "oracle": {
                  "signers": [
                    {
                      "ethAddress": {
                        "address": "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
                      }
                    }
                  ],
                  "filters": [
                    {
                      "key": {
                        "name": "prices.BTC.value",
                        "type": "TYPE_INTEGER",
                        "numberDecimalPlaces": "5"
                      },
                      "conditions": [
                        {
                          "operator": "OPERATOR_GREATER_THAN",
                          "value": "0"
                        }
                      ]
                    },
                    {
                      "key": {
                        "name": "prices.BTC.timestamp",
                        "type": "TYPE_TIMESTAMP"
                      },
                      "conditions": [
                        {
                          "operator": "OPERATOR_GREATER_THAN",
                          "value": "1648684800000000000"
                        }
                      ]
                    }
                  ]
                }
              }
            },
            "dataSourceSpecForTradingTermination": {
              "internal": {
                "time": {
                  "conditions": [
                    {
                      "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
                      "value": "1648684800000000000"
                    }
                  ]
                }
              }
            },
            "dataSourceSpecBinding": {
              "settlementDataProperty": "prices.BTC.value",
              "tradingTerminationProperty": "vega.builtin.timestamp"
            }
          }
        },
        "metadata": [
          "enactment:2023-03-20T11:26:01Z",
          "settlement:2023-03-19T11:26:01Z",
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
          "triggeringRatio": "0.7",
          "auctionExtension": "1"
        },
        "logNormal": {
          "tau": 0.0001140771161,
          "riskAversionParameter": 0.01,
          "params": {
            "mu": 0,
            "r": 0.016,
            "sigma": 0.5
          }
        }
      }
    },
    "closingTimestamp": 1679225161000,
    "enactmentTimestamp": 1679311561000
  }
}
```
  