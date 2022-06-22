
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground "{ ^
 "proposalSubmission": { ^
  "rationale": { ^
   "description": "Update governance.proposal.freeform.minVoterBalance" ^
  }, ^
  "terms": { ^
   "updateNetworkParameter": { ^
    "changes": { ^
     "key": "governance.proposal.freeform.minVoterBalance", ^
     "value": "0.11035329942508865" ^
    } ^
   }, ^
   "closingTimestamp": 1657557562, ^
   "enactmentTimestamp": 1657643962 ^
  } ^
 } ^
}"
```
  