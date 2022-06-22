
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Add Solana (SOL)"
  },
  "terms": {
   "newAsset": {
    "changes": {
     "name": "Solana",
     "symbol": "SOL",
     "totalSupply": "19010568",
     "decimals": "5",
     "quantum": "1",
     "erc20": {
      "contractAddress": "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e"
     }
    }
   },
   "closingTimestamp": 1657558422,
   "enactmentTimestamp": 1657644822
  }
 }
}'
```
  