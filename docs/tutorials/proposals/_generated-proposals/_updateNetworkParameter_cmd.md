
  ```bash
  ./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{\ 
 "proposalSubmission": {\ 
  "rationale": {\ 
   "description": "Update governance.proposal.freeform.minVoterBalance"\ 
  },\ 
  "terms": {\ 
   "updateNetworkParameter": {\ 
    "changes": {\ 
     "key": "governance.proposal.freeform.minVoterBalance",\ 
     "value": "0.6184675137542133"\ 
    }\ 
   },\ 
   "closingTimestamp": 1657554552,\ 
   "enactmentTimestamp": 1657640952\ 
  }\ 
 }\ 
}'
  ```
  