
  ```bash
vegawallet.exe command send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add Wrapped Ether (WETH)\",^
  \"description\": \"Proposal to add Wrapped Ether (WETH) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"Wrapped Ether\",^
    \"symbol\": \"WETH\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0xc778417e063141139fce010982780140aa0cd5ab\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1666539201,^
  \"enactmentTimestamp\": 1666625601,^
  \"validationTimestamp\": 1666452801^
 }^
}^
}"
```
  