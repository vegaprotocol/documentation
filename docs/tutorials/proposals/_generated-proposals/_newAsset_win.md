
  ```bash
vegawallet.exe transaction send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add tDAI TEST (tDAI)\",^
  \"description\": \"Proposal to add tDAI TEST (tDAI) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"tDAI TEST\",^
    \"symbol\": \"tDAI\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1678708127000,^
  \"enactmentTimestamp\": 1678794527000,^
  \"validationTimestamp\": 1678794527000^
 }^
}^
}"
```
  