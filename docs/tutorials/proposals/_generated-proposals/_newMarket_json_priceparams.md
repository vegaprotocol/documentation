```javascript
{
 // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
 triggers: [
  {
   // undefined (int64 as string)
   horizon: "43200",
   // undefined (string)
   probability: "0.9999999",
   // Price monitoring auction extension duration in seconds should the price
   // breach its theoretical level over the specified horizon at the specified
   // probability level. (int64 as string)
   auctionExtension: "600",
  }
 ]
}
```