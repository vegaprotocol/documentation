
  ```bash
  ./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{\ 
 "proposalSubmission": {\ 
  "rationale": {\ 
   "description": "Update governance.proposal.asset.requiredMajority"\ 
  },\ 
  "terms": {\ 
   "updateNetworkParameter": {\ 
    "changes": {\ 
     "key": "governance.proposal.asset.requiredMajority",\ 
     "value": "0.045862788498804985"\ 
    }\ 
   },\ 
   "closingTimestamp": 1657381811,\ 
   "enactmentTimestamp": 1657468211\ 
  }\ 
 }\ 
}'
  ```
  