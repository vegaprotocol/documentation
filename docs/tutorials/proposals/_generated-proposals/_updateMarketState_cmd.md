
  ```bash
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
 "proposalSubmission": {
  "rationale": {
   "title": "Terminate market X",
   "description": "Market X should be terminated as it is no longer relevant. Termination price set in proposal."
  },
  "terms": {
   "updateMarketState": {
    "changes": {
     "marketId": "0f2f8d077a53835ca802808d1eaae090de06328e5a0fb21e55de2f8ea8faa389",
     "updateType": "MARKET_STATE_UPDATE_TYPE_TERMINATE",
     "price": "123456"
    }
   },
   "closingTimestamp": 1731769771,
   "enactmentTimestamp": 1731856171
  }
 }
}'
```
  