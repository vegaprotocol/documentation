
  ```bash
  vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Update governance.proposal.asset.requiredMajority"
  },
  "terms": {
   "updateNetworkParameter": {
    "changes": {
     "key": "governance.proposal.asset.requiredMajority",
     "value": "0.3140862870737786"
    }
   },
   "closingTimestamp": 1657555971,
   "enactmentTimestamp": 1657642371
  }
 }
}'
  ```
  