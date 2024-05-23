
  ```json
{
  "proposalSubmission": {
    "rationale": {
      "title": "An example transfer",
      "description": "I propose that this transfer happens"
    },
    "terms": {
      "newTransfer": {
        "changes": {
          "sourceType": "ACCOUNT_TYPE_NETWORK_TREASURY",
          "transferType": "GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING",
          "amount": "10000000",
          "asset": "12345",
          "fractionOfBalance": "0.1",
          "destinationType": "ACCOUNT_TYPE_GENERAL",
          "destination": "0x1234567890abcdef",
          "oneOff": {
            "deliverOn": "12345678"
          }
        }
      },
      "closingTimestamp": 1718118736,
      "enactmentTimestamp": 1718205136
    }
  }
}
```
  