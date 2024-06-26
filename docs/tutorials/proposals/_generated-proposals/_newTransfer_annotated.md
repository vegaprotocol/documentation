
  ```javascript
 {
  proposalSubmission: {
   rationale: {
    title: "An example transfer",
    description: "I propose that this transfer happens"
   }
  },
  terms: {
   newTransfer: {
    changes: {
     // Source account type, such as network treasury, market insurance pool
     sourceType: "ACCOUNT_TYPE_NETWORK_TREASURY",

     // "All or nothing" or "best effort":
     transferType: "GOVERNANCE_TRANSFER_TYPE_ALL_OR_NOTHING",

     // Maximum amount to transfer
     amount: "10000000",

     // ID of asset to transfer
     asset: "12345",

     // Maximum fraction of the source account's balance to transfer as a decimal - i.e. 0.1 = 10% of the balance
     fractionOfBalance: "0.1",

     // Specifies the account type to transfer to: reward pool, party, network insurance pool, market insurance pool
     destinationType: "ACCOUNT_TYPE_GENERAL",

     // Address of recipient
     destination: "0x1234567890abcdef",

     // Specific details for a one off transfer
     oneOff: {
      // Timestamp in Unix nanoseconds for when the transfer should be delivered into the receiver's account.
      deliverOn: "12345678",
     }
    }
   },

   // Timestamp as Unix time in seconds when voting closes for this proposal,
   // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
   closingTimestamp: 1721053584,

   // Timestamp as Unix time in seconds when proposal gets enacted if passed,
   // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
   enactmentTimestamp: 1721139984,
  }
 }
}
```