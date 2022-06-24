
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Add Lorem Ipsum market"
  },
  "terms": {
   "newMarket": {
    "changes": {
     "decimalPlaces": "18",
     "positionDecimalPlaces": "5",
     "instrument": {
      "name": "Apples Yearly (2022)",
      "code": "APPLES.22",
      "future": {
       "settlementAsset": "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
       "quoteName": "tEuro",
       "settlementPriceDecimals": 18,
       "oracleSpecForSettlementPrice": {
        "pubKeys": [
         "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC"
        ],
        "filters": [
         {
          "key": {
           "name": "prices.BTC.value",
           "type": "TYPE_INTEGER"
          },
          "conditions": [
           {
            "operator": "OPERATOR_GREATER_THAN",
            "value": "0"
           }
          ]
         }
        ]
       },
       "oracleSpecForTradingTermination": {
        "pubKeys": [],
        "filters": [
         {
          "key": {
           "name": "vegaprotocol.builtin.timestamp",
           "type": "TYPE_TIMESTAMP"
          },
          "conditions": [
           {
            "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
            "value": "1648684800000000000"
           }
          ]
         }
        ]
       },
       "oracleSpecBinding": {
        "settlementPriceProperty": "prices.BTC.value",
        "tradingTerminationProperty": "vegaprotocol.builtin.timestamp"
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
      "riskAversionParameter": 0.0001,
      "params": {
       "mu": 0,
       "r": 0.016,
       "sigma": 1.25
      }
     }
    },
    "liquidityCommitment": {
     "commitmentAmount": "7562706",
     "fee": "0.46",
     "buys": [
      {
       "offset": "90",
       "proportion": 8,
       "reference": "PEGGED_REFERENCE_BEST_BID"
      },
      {
       "offset": "99",
       "proportion": 8,
       "reference": "PEGGED_REFERENCE_BEST_BID"
      },
      {
       "offset": "46",
       "proportion": 7,
       "reference": "PEGGED_REFERENCE_BEST_BID"
      }
     ],
     "sells": [
      {
       "offset": "35",
       "proportion": 4,
       "reference": "PEGGED_REFERENCE_BEST_ASK"
      },
      {
       "offset": "54",
       "proportion": 4,
       "reference": "PEGGED_REFERENCE_BEST_ASK"
      },
      {
       "offset": "80",
       "proportion": 3,
       "reference": "PEGGED_REFERENCE_BEST_ASK"
      }
     ]
    }
   },
   "closingTimestamp": 1657714005,
   "enactmentTimestamp": 1657800405
  }
 }
}'
```
  