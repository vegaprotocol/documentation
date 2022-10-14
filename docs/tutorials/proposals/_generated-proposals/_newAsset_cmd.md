
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
   "closingTimestamp": 1667407789,
   "enactmentTimestamp": 1667494189,
   "validationTimestamp": 1667321389
  }
 }
}'
```
  