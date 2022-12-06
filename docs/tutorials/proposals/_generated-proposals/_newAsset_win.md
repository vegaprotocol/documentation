
  ```bash
vegawallet.exe transaction send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add tEuro (tEURO)\",^
  \"description\": \"Proposal to add tEuro (tEURO) as an asset\"^
 },^
 \"terms\": {^
  \"newAsset\": {^
   \"changes\": {^
    \"name\": \"tEuro\",^
    \"symbol\": \"tEURO\",^
    \"decimals\": \"18\",^
    \"quantum\": \"1\",^
    \"erc20\": {^
     \"contractAddress\": \"0x0158031158Bb4dF2AD02eAA31e8963E84EA978a4\",^
     \"withdrawThreshold\": \"10\",^
     \"lifetimeLimit\": \"10\"^
    }^
   }^
  },^
  \"closingTimestamp\": 1672095854,^
  \"enactmentTimestamp\": 1672182254,^
  \"validationTimestamp\": 1672009454^
 }^
}^
}"
```
  