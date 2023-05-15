
  ```bash
vegawallet.exe transaction send --wallet YOUR-WALLETNAME --pubkey YOUR-PUBLIC-KEY --network NETWORK-NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Update market.fee.factors.infrastructureFee\",^
  \"description\": \"Proposal to update market.fee.factors.infrastructureFee to 300}\"^
 },^
 \"terms\": {^
  \"updateNetworkParameter\": {^
   \"changes\": {^
    \"key\": \"market.fee.factors.infrastructureFee\",^
    \"value\": \"300\"^
   }^
  },^
  \"closingTimestamp\": 1685553047,^
  \"enactmentTimestamp\": 1685639447^
 }^
}^
}"
```
  