```javascript
{
 // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
 triggers: [
  {
   // Price monitoring projection horizon τ in seconds. (int64 as string)
   horizon: "43200",
   // Price monitoring probability level p. (string)
   probability: "0.9999999",
   // Price monitoring auction extension duration in seconds should the price
   breach its theoretical level over the specified horizon at the specified probability level.(string) auctionExtension: "3600",
  }
 ]
}
```