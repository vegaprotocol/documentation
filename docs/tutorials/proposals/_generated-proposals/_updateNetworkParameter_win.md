
  ```bash
vegawallet.exe transaction send --wallet your_walletname --pubkey your_public_key --network fairground ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Update governance.proposal.asset.requiredMajority\",^
  \"description\": \"Proposal to update governance.proposal.asset.requiredMajority to 300}\"^
 },^
 \"terms\": {^
  \"updateNetworkParameter\": {^
   \"changes\": {^
    \"key\": \"governance.proposal.asset.requiredMajority\",^
    \"value\": \"300\"^
   }^
  },^
  \"closingTimestamp\": 1673527565,^
  \"enactmentTimestamp\": 1673613965^
 }^
}^
}"
```
  