
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "title": "Add Wrapped Ether (WETH)",
   "description": "Proposal to add Wrapped Ether (WETH) as an asset"
  },
  "terms": {
   "newAsset": {
    "changes": {
     "name": "Wrapped Ether",
     "symbol": "WETH",
     "decimals": "18",
     "quantum": "1",
     "erc20": {
      "contractAddress": "0xc778417e063141139fce010982780140aa0cd5ab",
      "withdrawThreshold": "10",
      "lifetimeLimit": "10"
     }
    }
   },
   "closingTimestamp": 1664728340,
   "enactmentTimestamp": 1664814740,
   "validationTimestamp": 1664641940
  }
 }
}'
```
  