```javascript
{
 // The external data source spec describing the data source of trading termination.
 internal {
  // DataSourceSpecConfigurationTime is the internal data source used for emitting timestamps.
  time: {
   // Conditions that the timestamps should meet in order to be considered.
   conditions: [
    {
     // Type of comparison to make on the value. (string)
     operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
     // Value to be compared with by the operator. (string)
     value: "1648684800000000000",
    }
   ]
  }
 }
```