
  ```bash
vegawallet.exe transaction send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add tUSDC TEST (tUSDC)\",^
  \"description\": \"Proposal to add tUSDC TEST (tUSDC) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"tUSDC TEST\",^
    \"symbol\": \"tUSDC\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0xB404c51BBC10dcBE948077F18a4B8E553D160084\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1673527565,^
  \"enactmentTimestamp\": 1673613965,^
  \"validationTimestamp\": 1673441165^
 }^
}^
}"
```
  