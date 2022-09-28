
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add Dai Stablecoin (DAI)\",^
  \"description\": \"Proposal to add Dai Stablecoin (DAI) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"Dai Stablecoin\",^
    \"symbol\": \"DAI\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0x31f42841c2db5173425b5223809cf3a38fede360\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1666016251,^
  \"enactmentTimestamp\": 1666102651,^
  \"validationTimestamp\": 1665929851^
 }^
}^
}"
```
  