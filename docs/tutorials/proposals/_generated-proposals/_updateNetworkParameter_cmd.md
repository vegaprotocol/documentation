
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Update governance.proposal.asset.requiredMajority"
  },
  "terms": {
   "updateNetworkParameter": {
    "changes": {
     "key": "governance.proposal.asset.requiredMajority",
     "value": "300"
    }
   },
   "closingTimestamp": 1661608109,
   "enactmentTimestamp": 1661694509
  }
 }
}'
```
  