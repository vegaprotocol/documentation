
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
     "value": "0.36787646733031276"
    }
   },
   "closingTimestamp": 1657558422,
   "enactmentTimestamp": 1657644822
  }
 }
}'
```
  