
  ```bash
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
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
     \"chainId\": \"1\",^
     \"contractAddress\": \"0x26223f9C67871CFcEa329975f7BC0C9cB8FBDb9b\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1727523020,^
  \"enactmentTimestamp\": 1727609420,^
  \"validationTimestamp\": 1727609420^
 }^
}^
}"
```
  