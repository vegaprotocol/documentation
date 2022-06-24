
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
      "code": "ORANGES.24h",
      "future": {
       "quoteName": "tEuro",
       "settlementPriceDecimals": 5,
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
   "closingTimestamp": 1657714005,
   "enactmentTimestamp": 1657800405
  }
 }
}'
```
  