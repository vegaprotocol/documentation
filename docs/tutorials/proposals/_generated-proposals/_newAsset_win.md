
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add USDT Coin (USDT)\",^
  \"description\": \"Proposal to add USDT Coin (USDT) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"USDT Coin\",^
    \"symbol\": \"USDT\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0xb404c51bbc10dcbe948077f18a4b8e553d160084\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1665918056,^
  \"enactmentTimestamp\": 1666004456,^
  \"validationTimestamp\": 1665831656^
 }^
}^
}"
```
  