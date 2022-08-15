
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
     "value": "300"
    }
   },
   "closingTimestamp": 1658846745,
   "enactmentTimestamp": 1658933145
  }
 }
}'
```
  