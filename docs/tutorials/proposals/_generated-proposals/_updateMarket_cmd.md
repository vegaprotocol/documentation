
  ```bash
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
 "proposalSubmission": {
  "rationale": {
   "title": "Update Lorem Ipsum market",
   "description": "A proposal to update Lorem Ipsum market"
  },
  "terms": {
   "updateMarket": {
    "marketId": "123",
    "changes": {
     "linearSlippageFactor": "0.001",
     "instrument": {
      "code": "APPLES.22",
      "future": {
       "quoteName": "tEuro",
       "dataSourceSpecForSettlementData": {
        "external": {
         "ethOracle": {
          "sourceChainId": "1",
          "address": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
          "abi": "[{\"inputs\":[],\"name\":\"latestRoundData\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"\",\"type\":\"int256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
          "method": "latestRoundData",
          "normalisers": [
           {
            "name": "prices.ORANGES.value",
            "expression": "$[0]"
           }
          ],
          "requiredConfirmations": 3,
          "trigger": {
           "timeTrigger": {
            "every": 30
           }
          },
          "filters": [
           {
            "key": {
             "name": "prices.ORANGES.value",
             "type": "TYPE_INTEGER",
             "numberDecimalPlaces": 8
            },
            "conditions": [
             {
              "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
              "value": "0"
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
      "source:docs.vega.xyz"
     ],
     "priceMonitoringParameters": {
      "triggers": [
       {
        "horizon": "43200",
        "probability": "0.9999999",
        "auctionExtension": "3600"
       }
      ]
     },
     "logNormal": {
      "tau": 0.0001140771161,
      "riskAversionParameter": 0.00001,
      "params": {
       "mu": 0,
       "r": 0.016,
       "sigma": 0.8
      }
     },
     "liquiditySlaParameters": {
      "priceRange": "0.1",
      "commitmentMinTimeFraction": "0.1",
      "performanceHysteresisEpochs": "10",
      "slaCompetitionFactor": "0.2"
     },
     "tickSize": "1",
     "enableTransactionReordering": true
    }
   },
   "closingTimestamp": 1728735072,
   "enactmentTimestamp": 1728821472
  }
 }
}'
```
  