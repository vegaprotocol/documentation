```javascript
 {
  // Specifies parameters related to target stake calculation
  targetStakeParameters: {
   // Specifies length of time window expressed in seconds for target stake calculation (string)
   timeWindow: "3600",
   // Specifies scaling factors used in target stake calculation (number)
   scalingFactor: 10
  },
  // Specifies the triggering ratio for entering liquidity auction (undefined as string) 
  triggeringRatio: "0.7",
  // Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction (int64 as string) 
  auctionExtension: "1",
 }
}
```