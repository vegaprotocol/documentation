
  ```json
{
  "rationale": {
    "title": "Update Lorem Ipsum market",
    "description": "A proposal to update Lorem Ipsum market"
  },
  "terms": {
    "updateMarket": {
      "marketId": "123",
      "changes": {
        "lpPriceRange": "11",
        "instrument": {
          "code": "APPLES.22",
          "future": {
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
        "logNormal": {
          "tau": 0.0001140771161,
          "riskAversionParameter": 0.001,
          "params": {
            "mu": 0,
            "r": 0.016,
            "sigma": 1.25
          }
        }
      }
    },
    "closingTimestamp": 1678708127000,
    "enactmentTimestamp": 1678794527000
  }
}
```
  