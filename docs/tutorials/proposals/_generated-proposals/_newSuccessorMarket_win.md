
  ```bash
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Lorem Ipsum successor\",^
  \"description\": \"A successor market\"^
 },^
 \"terms\": {^
  \"newMarket\": {^
   \"changes\": {^
    \"successor\": {^
     \"parentMarketId\": \"marketid\",^
     \"insurancePoolFraction\": \"1\"^
    },^
    \"linearSlippageFactor\": \"0.001\",^
    \"decimalPlaces\": \"5\",^
    \"positionDecimalPlaces\": \"5\",^
    \"instrument\": {^
     \"name\": \"Oranges Daily\",^
     \"code\": \"ORANGES.24h\",^
     \"future\": {^
      \"settlementAsset\": \"8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4\",^
      \"quoteName\": \"tEuro\",^
      \"dataSourceSpecForSettlementData\": {^
       \"external\": {^
        \"oracle\": {^
         \"signers\": [^
          {^
           \"ethAddress\": {^
            \"address\": \"0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC\"^
           }^
          }^
         ],^
         \"filters\": [^
          {^
           \"key\": {^
            \"name\": \"prices.ORANGES.value\",^
            \"type\": \"TYPE_INTEGER\",^
            \"numberDecimalPlaces\": \"5\"^
           },^
           \"conditions\": [^
            {^
             \"operator\": \"OPERATOR_GREATER_THAN\",^
             \"value\": \"0\"^
            }^
           ]^
          },^
          {^
           \"key\": {^
            \"name\": \"prices.ORANGES.timestamp\",^
            \"type\": \"TYPE_INTEGER\"^
           },^
           \"conditions\": [^
            {^
             \"operator\": \"OPERATOR_GREATER_THAN\",^
             \"value\": \"1648684800\"^
            }^
           ]^
          }^
         ]^
        }^
       }^
      },^
      \"dataSourceSpecForTradingTermination\": {^
       \"internal\": {^
        \"time\": {^
         \"conditions\": [^
          {^
           \"operator\": \"OPERATOR_GREATER_THAN_OR_EQUAL\",^
           \"value\": \"1648684800\"^
          }^
         ]^
        }^
       }^
      },^
      \"dataSourceSpecBinding\": {^
       \"settlementDataProperty\": \"prices.ORANGES.value\",^
       \"tradingTerminationProperty\": \"vegaprotocol.builtin.timestamp\"^
      }^
     }^
    },^
    \"metadata\": [^
     \"enactment:2024-02-26T11:34:20Z\",^
     \"settlement:2024-02-25T11:34:20Z\",^
     \"source:docs.vega.xyz\"^
    ],^
    \"priceMonitoringParameters\": {^
     \"triggers\": [^
      {^
       \"horizon\": \"43200\",^
       \"probability\": \"0.9999999\",^
       \"auctionExtension\": \"600\"^
      }^
     ]^
    },^
    \"logNormal\": {^
     \"tau\": 0.0001140771161,^
     \"riskAversionParameter\": 0.01,^
     \"params\": {^
      \"mu\": 0,^
      \"r\": 0.016,^
      \"sigma\": 0.15^
     }^
    },^
    \"liquiditySlaParameters\": {^
     \"priceRange\": \"0.1\",^
     \"commitmentMinTimeFraction\": \"0.1\",^
     \"performanceHysteresisEpochs\": \"10\",^
     \"slaCompetitionFactor\": \"0.2\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1708860860,^
  \"enactmentTimestamp\": 1708947260^
 }^
}^
}"
```
  