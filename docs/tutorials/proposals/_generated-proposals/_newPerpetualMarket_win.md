
  ```bash
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Lorem Ipsum perpetual\",^
  \"description\": \"An orange perpetual market\"^
 },^
 \"terms\": {^
  \"newMarket\": {^
   \"changes\": {^
    \"linearSlippageFactor\": \"0.001\",^
    \"quadraticSlippageFactor\": \"0\",^
    \"decimalPlaces\": \"5\",^
    \"positionDecimalPlaces\": \"5\",^
    \"instrument\": {^
     \"name\": \"Oranges Perpetual\",^
     \"code\": \"ORANGES.PERP\",^
     \"perpetual\": {^
      \"settlementAsset\": \"8b52d4a3a4b0ffe733cddbc2b67be273816cfeb6ca4c8b339bac03ffba08e4e4\",^
      \"quoteName\": \"tEuro\",^
      \"dataSourceSpecForSettlementData\": {^
       \"external\": {^
        \"ethOracle\": {^
         \"address\": \"0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43\",^
         \"abi\": \"[{\\"inputs\\":[],\\"name\\":\\"latestAnswer\\",\\"outputs\\":[{\\"internalType\\":\\"int256\\",\\"name\\":\\"\\",\\"type\\":\\"int256\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"}]\",^
         \"method\": \"latestAnswer\",^
         \"normalisers\": [^
          {^
           \"name\": \"btc.price\",^
           \"expression\": \"$[0]\"^
          }^
         ],^
         \"requiredConfirmations\": 3,^
         \"trigger\": {^
          \"timeTrigger\": {^
           \"every\": 30^
          }^
         },^
         \"filters\": [^
          {^
           \"key\": {^
            \"name\": \"btc.price\",^
            \"type\": \"TYPE_INTEGER\",^
            \"numberDecimalPlaces\": 8^
           },^
           \"conditions\": [^
            {^
             \"operator\": \"OPERATOR_GREATER_THAN_OR_EQUAL\",^
             \"value\": \"0\"^
            }^
           ]^
          }^
         ]^
        }^
       }^
      },^
      \"settlementScheduleProperty\": {^
       \"internal\": {^
        \"timeTrigger\": {^
         \"conditions\": [^
          {^
           \"operator\": \"OPERATOR_GREATER_THAN_OR_EQUAL\",^
           \"value\": \"0\"^
          }^
         ],^
         \"triggers\": [^
          {^
           \"every\": 1800^
          }^
         ]^
        }^
       }^
      },^
      \"dataSourceSpecBinding\": {^
       \"settlementDataProperty\": \"prices.ORANGES.value\",^
       \"settlementScheduleProperty\": \"vegaprotocol.builtin.timetrigger\"^
      }^
     }^
    },^
    \"metadata\": [^
     \"enactment:2023-10-30T16:06:11Z\",^
     \"settlement:2023-10-29T16:06:11Z\",^
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
    \"liquidityMonitoringParameters\": {^
     \"targetStakeParameters\": {^
      \"timeWindow\": \"3600\",^
      \"scalingFactor\": 10^
     },^
     \"triggeringRatio\": \"0.7\",^
     \"auctionExtension\": \"1\"^
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
  \"closingTimestamp\": 1698595571,^
  \"enactmentTimestamp\": 1698681971^
 }^
}^
}"
```
  