
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground "{
 \"proposalSubmission\": {
  \"rationale\": {
   \"description\": \"Update governance.proposal.asset.requiredMajority\"
  },
  \"terms\": {
   \"updateNetworkParameter\": {
    \"changes\": {
     \"key\": \"governance.proposal.asset.requiredMajority\",
     \"value\": \"300\"
    }
   },
   \"closingTimestamp\": 1662374250,
   \"enactmentTimestamp\": 1662460650
  }
 }
}"
```
  