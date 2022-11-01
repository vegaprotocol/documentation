
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "title": "Update governance.proposal.asset.requiredMajority",
   "description": "Proposal to update governance.proposal.asset.requiredMajority to 300}"
  },
  "terms": {
   "updateNetworkParameter": {
    "changes": {
     "key": "governance.proposal.asset.requiredMajority",
     "value": "300"
    }
   },
   "closingTimestamp": 1668528151,
   "enactmentTimestamp": 1668614551
  }
 }
}'
```
  