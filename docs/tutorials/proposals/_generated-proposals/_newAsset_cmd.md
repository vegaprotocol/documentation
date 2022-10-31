
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "title": "Add tDAI TEST (tDAI)",
   "description": "Proposal to add tDAI TEST (tDAI) as an asset"
  },
  "terms": {
   "newAsset": {
    "changes": {
     "name": "tDAI TEST",
     "symbol": "tDAI",
     "decimals": "18",
     "quantum": "1",
     "erc20": {
      "contractAddress": "0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b",
      "withdrawThreshold": "10",
      "lifetimeLimit": "10"
     }
    }
   },
   "closingTimestamp": 1668875777,
   "enactmentTimestamp": 1668962177,
   "validationTimestamp": 1668789377
  }
 }
}'
```
  