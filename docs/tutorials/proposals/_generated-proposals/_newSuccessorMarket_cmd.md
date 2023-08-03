
  ```bash
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
 "proposalSubmission": {
  "rationale": {
   "title": "Lorem Ipsum market successor",
   "description": "A successor to nnnnn"
  },
  "terms": {
   "newMarket": {
    "changes": {
     "successor": {
      "parent_market_id": "nnnnnnnn",
      "insurance_pool_fraction": "1"
     },
     "lpPriceRange": "10",
     "linearSlippageFactor": "0.001",
     "quadraticSlippageFactor": "0",
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
             "name": "prices.ORANGES.value",
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
             "name": "prices.ORANGES.timestamp",
             "type": "TYPE_INTEGER"
            },
            "conditions": [
             {
              "operator": "OPERATOR_GREATER_THAN",
              "value": "1648684800"
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
            "value": "1648684800"
           }
          ]
         }
        }
       },
       "dataSourceSpecBinding": {
        "settlementDataProperty": "prices.ORANGES.value",
        "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
       }
      }
     },
     "metadata": [
      "enactment:2023-08-23T17:28:46Z",
      "settlement:2023-08-22T17:28:46Z",
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
       "sigma": 0.15
      }
     }
    }
   },
   "closingTimestamp": 1692721726,
   "enactmentTimestamp": 1692808126
  }
 }
}'
```
  