
  ```bash
vegawallet.exe transaction send --wallet your_walletname --pubkey your_public_key --network fairground ^
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
  \"closingTimestamp\": 1681727444000,^
  \"enactmentTimestamp\": 1681813844000^
 }^
}^
}"
```
  