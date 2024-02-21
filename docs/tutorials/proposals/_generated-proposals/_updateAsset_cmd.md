
  ```bash
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
 "proposalSubmission": {
  "rationale": {
   "title": "Update asset",
   "description": "Proposal to change withdrawal threshold for asset"
  },
  "terms": {
   "updateAsset": {
    "assetId": "ebcd94151ae1f0d39a4bde3b21a9c7ae81a80ea4352fb075a92e07608d9c953d",
    "changes": {
     "quantum": "1",
     "erc20": {
      "withdrawThreshold": "10",
      "lifetimeLimit": "10"
     }
    }
   },
   "closingTimestamp": 1710159461,
   "enactmentTimestamp": 1710245861
  }
 }
}'
```
  