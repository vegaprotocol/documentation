
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
     "value": "0.34916444962937754"
    }
   },
   "closingTimestamp": 1657556650,
   "enactmentTimestamp": 1657643050
  }
 }
}'
  ```
  