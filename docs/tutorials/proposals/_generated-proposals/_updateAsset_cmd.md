
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "title": "Update asset",
   "description": "Proposal to change withdrawal threshold for asset"
  },
  "terms": {
   "updateAsset": {
    "changes": {
     "erc20": {
      "withdrawThreshold": "10",
      "lifetimeLimit": "10"
     }
    }
   },
   "closingTimestamp": 1664964291,
   "enactmentTimestamp": 1665050691
  }
 }
}'
```
  