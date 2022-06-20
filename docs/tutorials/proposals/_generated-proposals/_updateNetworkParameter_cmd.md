
  ```bash
  vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{\ 
 "proposalSubmission": {\ 
  "rationale": {\ 
   "description": "Update governance.proposal.asset.requiredMajority"\ 
  },\ 
  "terms": {\ 
   "updateNetworkParameter": {\ 
    "changes": {\ 
     "key": "governance.proposal.asset.requiredMajority",\ 
     "value": "0.8801031807248922"\ 
    }\ 
   },\ 
   "closingTimestamp": 1657379090,\ 
   "enactmentTimestamp": 1657465490\ 
  }\ 
 }\ 
}'
  ```
  