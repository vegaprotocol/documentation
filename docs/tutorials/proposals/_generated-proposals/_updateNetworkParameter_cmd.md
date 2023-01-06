
  ```bash
./vegawallet transaction send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "title": "Update governance.proposal.freeform.minVoterBalance",
   "description": "Proposal to update governance.proposal.freeform.minVoterBalance to 300}"
  },
  "terms": {
   "updateNetworkParameter": {
    "changes": {
     "key": "governance.proposal.freeform.minVoterBalance",
     "value": "300"
    }
   },
   "closingTimestamp": 1674663903,
   "enactmentTimestamp": 1674750303
  }
 }
}'
```
  