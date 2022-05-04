
  ```javascript
  {
    // Timestamp (Unix time in seconds) when voting closes for this proposal,
    // constrained by `minClose` and `maxClose` network parameters (int64 as string) 
    closingTimestamp: 1653235733190,
    // Timestamp (Unix time in seconds) when proposal gets enacted (if passed),
    // constrained by `minEnact` and `maxEnact` network parameters (int64 as string) 
    enactmentTimestamp: 1653322133190,
    newAsset:  {
  name: 'Ethereum',
  symbol: 'ETH',
  totalSupply: '19010568',
  decimals: '5',
  quantum: '1',
  erc20: { contractAddress: '0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e' }
}
 }
  ```