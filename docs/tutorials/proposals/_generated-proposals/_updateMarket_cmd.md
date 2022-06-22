
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Update Lorem Ipsum market"
  },
  "terms": {
   "updateMarket": {
    "marketId": "123",
    "changes": {
     "instrument": {
      "code": "APPLES.22",
      "future": {
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
            "operator": "OPERATOR_GREATER_THAN",
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
           "type": "TYPE_BOOLEAN"
          },
          "conditions": []
         }
        ]
       },
       "oracleSpecBinding": {
        "settlementPriceProperty": "prices.AAPL.value",
        "tradingTerminationProperty": "prices.AAPL.value"
       }
      }
     },
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
      "riskAversionParameter": 0.0001,
      "params": {
       "mu": 0,
       "r": 0.016,
       "sigma": 0.8
      }
     }
    }
   },
   "closingTimestamp": 1657558422,
   "enactmentTimestamp": 1657644822
  }
 }
}'
```
  