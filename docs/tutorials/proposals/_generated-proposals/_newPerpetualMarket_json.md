
  ```json
{
  "proposalSubmission": {
    "rationale": {
      "title": "Lorem Ipsum perpetual",
      "description": "An orange perpetual market"
    },
    "terms": {
      "newMarket": {
        "changes": {
          "linearSlippageFactor": "0.001",
          "decimalPlaces": "5",
          "positionDecimalPlaces": "5",
          "instrument": {
            "name": "Oranges Perpetual",
            "code": "ORANGES.PERP",
            "perpetual": {
              "settlementAsset": "8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4",
              "quoteName": "tEuro",
              "marginFundingFactor": "0.9",
              "interestRate": "0",
              "fundingRateScalingFactor": "1",
              "fundingRateLowerBound": "-0.001",
              "fundingRateUpperBound": "0.001",
              "clampLowerBound": "0",
              "clampUpperBound": "0",
              "internalCompositePriceConfiguration": {
                "decayWeight": "1",
                "decayPower": "1",
                "cashAmount": "5000000",
                "sourceWeights": [
                  "0",
                  "1",
                  "0",
                  "1"
                ],
                "sourceStalenessTolerance": [
                  "1m0s",
                  "1m0s",
                  "1m0s",
                  "1m0s"
                ],
                "compositePriceType": "COMPOSITE_PRICE_TYPE_WEIGHTED",
                "dataSourcesSpec": [
                  {
                    "external": {
                      "ethOracle": {
                        "address": "0x719abd606155442c21b7d561426d42bd0e40a776",
                        "abi": "[{\"inputs\": [{\"internalType\": \"bytes32\", \"name\": \"id\", \"type\": \"bytes32\"}], \"name\": \"getPrice\", \"outputs\": [{\"internalType\": \"int256\", \"name\": \"\", \"type\": \"int256\" }], \"stateMutability\": \"view\", \"type\": \"function\"}]",
                        "method": "getPrice",
                        "args": [
                          "elvB0rVq0CkEjNY5ZLOtJ3bq34Eu3BpDoxQGy1S/9ZI="
                        ],
                        "trigger": {
                          "timeTrigger": {
                            "every": "60"
                          }
                        },
                        "requiredConfirmations": "3",
                        "filters": [
                          {
                            "key": {
                              "name": "inj.price",
                              "type": "TYPE_INTEGER",
                              "numberDecimalPlaces": "18"
                            },
                            "conditions": [
                              {
                                "operator": "OPERATOR_GREATER_THAN",
                                "value": "0"
                              }
                            ]
                          }
                        ],
                        "normalisers": [
                          {
                            "name": "inj.price",
                            "expression": "$[0]"
                          }
                        ],
                        "sourceChainId": "100"
                      }
                    }
                  }
                ],
                "dataSourcesSpecBinding": [
                  {
                    "priceSourceProperty": "inj.price"
                  }
                ]
              },
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
              "dataSourceSpecForSettlementSchedule": {
                "internal": {
                  "timeTrigger": {
                    "conditions": [
                      {
                        "operator": "OPERATOR_GREATER_THAN_OR_EQUAL",
                        "value": "0"
                      }
                    ],
                    "triggers": [
                      {
                        "every": 28800
                      }
                    ]
                  }
                }
              },
              "dataSourceSpecBinding": {
                "settlementDataProperty": "prices.ORANGES.value",
                "settlementScheduleProperty": "vegaprotocol.builtin.timetrigger"
              }
            }
          },
          "metadata": [
            "enactment:2024-10-13T13:37:44Z",
            "settlement:2024-10-12T13:37:44Z",
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
              "sigma": 0.15
            }
          },
          "liquiditySlaParameters": {
            "priceRange": "0.1",
            "commitmentMinTimeFraction": "0.1",
            "performanceHysteresisEpochs": "10",
            "slaCompetitionFactor": "0.2"
          },
          "liquidationStrategy": {
            "disposalTimeStep": "500",
            "disposalFraction": "1",
            "fullDisposalSize": "18446744073709551615",
            "maxFractionConsumed": "1",
            "disposalSlippageRange": "0.1"
          },
          "liquidityFeeSettings": {
            "method": "METHOD_CONSTANT",
            "feeConstant": "0.00005"
          },
          "liquidityMonitoringParameters": {
            "targetStakeParameters": {
              "timeWindow": "3600",
              "scalingFactor": "0.05"
            }
          },
          "markPriceConfiguration": {
            "decayWeight": "1",
            "decayPower": "1",
            "cashAmount": "5000000",
            "sourceWeights": [
              "0",
              "1",
              "0"
            ],
            "sourceStalenessTolerance": [
              "1m0s",
              "1m0s",
              "1m0s"
            ],
            "compositePriceType": "COMPOSITE_PRICE_TYPE_WEIGHTED",
            "dataSourcesSpec": [],
            "dataSourcesSpecBinding": []
          },
          "tickSize": "1",
          "enableTransactionReordering": true
        }
      },
      "closingTimestamp": 1728736664,
      "enactmentTimestamp": 1728823064
    }
  }
}
```
  