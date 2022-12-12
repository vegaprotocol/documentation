```javascript
{
 // DataSourceDefinition represents the top level object that deals with data sources.
 // DataSourceDefinition can be external or internal, with whatever number of data sources are defined
 internal {
  // DataSourceSpecConfigurationTime is the internal data source used for emitting timestamps.
  time: {
   // Conditions that the timestamps should meet in order to be considered.
   conditions: [
    {
     // comparator is the type of comparison to make on the value. (string)
     operator: "OPERATOR_GREATER_THAN_OR_EQUAL",
     // value is used by the comparator. (string)
     value: "1648684800000000000",
    }
   ]
  }
 }
```