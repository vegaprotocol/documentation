
  ```bash
  ./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{\ 
 "proposalSubmission": {\ 
  "rationale": {\ 
   "description": "Add Lorem Ipsum market"\ 
  },\ 
  "terms": {\ 
   "newMarket": {\ 
    "changes": {\ 
     "decimalPlaces": "5",\ 
     "positionDecimalPlaces": "5",\ 
     "instrument": {\ 
      "name": "Apples Yearly (2022)",\ 
      "code": "APPLES.22",\ 
      "future": {\ 
       "settlementAsset": "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",\ 
       "quoteName": "tEuro",\ 
       "settlementPriceDecimals": 5,\ 
       "oracleSpecForSettlementPrice": {\ 
        "pubKeys": [\ 
         "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"\ 
        ],\ 
        "filters": [\ 
         {\ 
          "key": {\ 
           "name": "prices.AAPL.value",\ 
           "type": "TYPE_INTEGER"\ 
          },\ 
          "conditions": [\ 
           {\ 
            "operator": "OPERATOR_GREATER_THAN",\ 
            "value": "1"\ 
           }\ 
          ]\ 
         }\ 
        ]\ 
       },\ 
       "oracleSpecForTradingTermination": {\ 
        "pubKeys": [\ 
         "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"\ 
        ],\ 
        "filters": [\ 
         {\ 
          "key": {\ 
           "name": "prices.AAPL.value",\ 
           "type": "TYPE_BOOLEAN"\ 
          },\ 
          "conditions": []\ 
         }\ 
        ]\ 
       },\ 
       "oracleSpecBinding": {\ 
        "settlementPriceProperty": "prices.AAPL.value",\ 
        "tradingTerminationProperty": "prices.AAPL.value"\ 
       }\ 
      }\ 
     },\ 
     "metadata": [\ 
      "sector:materials",\ 
      "sector:energy",\ 
      "sector:food",\ 
      "source:docs.vega.xyz"\ 
     ],\ 
     "priceMonitoringParameters": {\ 
      "triggers": [\ 
       {\ 
        "horizon": "43200",\ 
        "probability": "0.9999999",\ 
        "auctionExtension": "600"\ 
       }\ 
      ]\ 
     },\ 
     "liquidityMonitoringParameters": {\ 
      "targetStakeParameters": {\ 
       "timeWindow": "3600",\ 
       "scalingFactor": 10\ 
      },\ 
      "triggeringRatio": 0.7,\ 
      "auctionExtension": "1"\ 
     },\ 
     "logNormal": {\ 
      "tau": 0.0001140771161,\ 
      "riskAversionParameter": 0.0001,\ 
      "params": {\ 
       "mu": 0,\ 
       "r": 0.016,\ 
       "sigma": 0.8\ 
      }\ 
     }\ 
    },\ 
    "liquidityCommitment": {\ 
     "commitmentAmount": "6267070",\ 
     "fee": "0.34",\ 
     "buys": [\ 
      {\ 
       "offset": "64",\ 
       "proportion": 4,\ 
       "reference": "PEGGED_REFERENCE_BEST_BID"\ 
      },\ 
      {\ 
       "offset": "11",\ 
       "proportion": 8,\ 
       "reference": "PEGGED_REFERENCE_BEST_BID"\ 
      },\ 
      {\ 
       "offset": "96",\ 
       "proportion": 4,\ 
       "reference": "PEGGED_REFERENCE_BEST_BID"\ 
      }\ 
     ],\ 
     "sells": [\ 
      {\ 
       "offset": "82",\ 
       "proportion": 7,\ 
       "reference": "PEGGED_REFERENCE_BEST_ASK"\ 
      },\ 
      {\ 
       "offset": "75",\ 
       "proportion": 2,\ 
       "reference": "PEGGED_REFERENCE_BEST_ASK"\ 
      },\ 
      {\ 
       "offset": "40",\ 
       "proportion": 5,\ 
       "reference": "PEGGED_REFERENCE_BEST_ASK"\ 
      }\ 
     ]\ 
    }\ 
   },\ 
   "closingTimestamp": 1657381811,\ 
   "enactmentTimestamp": 1657468211\ 
  }\ 
 }\ 
}'
  ```
  