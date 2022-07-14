
  ```bash
./vegawallet command send --wallet "your_walletname" --pubkey your_public_key --network mainnet1 '{
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
   "closingTimestamp": 1657721401,
   "enactmentTimestamp": 1657807801
  }
 }
}'
```
  