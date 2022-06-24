
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground "{
 \"proposalSubmission\": {
  \"rationale\": {
   \"description\": \"Update market.fee.factors.infrastructureFee\"
  },
  \"terms\": {
   \"updateNetworkParameter\": {
    \"changes\": {
     \"key\": \"market.fee.factors.infrastructureFee\",
     \"value\": \"0.43600230480170277\"
    }
   },
   \"closingTimestamp\": 1657714005,
   \"enactmentTimestamp\": 1657800405
  }
 }
}"
```
  