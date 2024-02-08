```javascript
{
 // PriceMonitoringTrigger holds together price projection horizon τ, probability level p, and auction extension duration
 triggers: [
  {
   // Price monitoring projection horizon τ in seconds. (int64 as string)
   horizon: "43200",
   // Price monitoring probability level p. (string)
   probability: "0.9999999",
  }
 ]
}
```