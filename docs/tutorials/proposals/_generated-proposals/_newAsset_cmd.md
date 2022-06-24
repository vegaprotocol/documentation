
  ```bash
./vegawallet command send --wallet your_walletname --pubkey your_public_key --network fairground '{
 "proposalSubmission": {
  "rationale": {
   "description": "Add XRP (XRP)"
  },
  "terms": {
   "newAsset": {
    "changes": {
     "name": "XRP",
     "symbol": "XRP",
     "totalSupply": "19010568",
     "decimals": "5",
     "quantum": "1",
     "erc20": {
      "contractAddress": "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e"
     }
    }
   },
   "closingTimestamp": 1657721401,
   "enactmentTimestamp": 1657807801
  }
 }
}'
```
  