
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Update governance.proposal.freeform.minVoterBalance"
  },
  "terms": {
   "updateNetworkParameter": {
    "changes": {
     "key": "governance.proposal.freeform.minVoterBalance",
     "value": "0.8253601133665003"
    }
   },
   "closingTimestamp": 1657557844,
   "enactmentTimestamp": 1657644244
  }
 }
}'
```
  