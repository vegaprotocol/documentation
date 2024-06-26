
  ```bash
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
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
      "chainId": "1",
      "contractAddress": "0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b",
      "withdrawThreshold": "10",
      "lifetimeLimit": "10"
     }
    }
   },
   "closingTimestamp": 1721053584,
   "enactmentTimestamp": 1721139984,
   "validationTimestamp": 1721139984
  }
 }
}'
```
  