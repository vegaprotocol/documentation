---
sidebar_position: 10
title: Enable or change referral program
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';

The on-chain referral program allows users to refer new traders. Referrers can get a cut of their referees' trading fees, and referees get a discount on their fees.

The referral program needs to be enabled by governance. Once it's enabled, both the requirements and the benefits for the program can also be changed by governance.

This page describes what you need to propose enabling or replacing the referral program, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateNetParam.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance.md)

## Anatomy of a referral program proposal [WIP]

the proposer needs to specify the following fields, 1 is smallest for minimums. the number of tiers in benefit_tiers must be less than or equal to the network parameter referralProgram.maxReferralTiers.

If you are suggesting a change to the referral program, but you don't want to change some values, you'll need to use the existing values on the current referral program.

**End of program timestamp**: Date and time after which, when the current epoch ends, the program will end and benefits will be disabled. 
**Window length**: Number of epochs over which to evaluate a referral set's running notional taker volume.

**Benefit tier fields**

| Benefit tier field | Description | Values |
| ----------- | ----------- | ----------- |
| `benefitTiers` | a list of values defining the reward and discount factors to be used for referrals | Holds the details required for each benefit tier, listed below |
| `minimumRunningNotionalTakerVolume` | the required notional taker volume everyone in the referral set needs to have to access the related benefit tier |  quantum units |
| `minimumEpochs` | required number of epochs a referee must have been in a referral set to access this tier of benefits | number |
| `referralRewardFactor` | the proportion of the referees taker fees to be rewarded to the referrer | ? |
| `referralDiscountFactor` | proportion of each referee's taker fees to be discounted | ? |


**Staking tier fields**

| Staking tier field | Description | Values |
| ----------- | ----------- | ----------- |
| `stakingTiers` | a list of values defining the multipliers to be used for referrals | Holds the details required for each benefit tier, listed below |
| `minimumStakedTokens` | required number of VEGA tokens a referrer must have staked to receive the reward multiplier | 5 |
| `referralRewardMultiplier` | the multiplier applied to the referral reward factor when calculating referral rewards due to the referrer. | ? |

## Templates and submitting

Below you will find: 
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

<Tabs groupId="referralProgramParameters">
 <TabItem value="json" label="Governance dApp (JSON)">

```json
{
    "proposalSubmission": {
    "rationale": {
      "title": "Referral proposal title",
      "description": "This enacts or replaces referral program"
    },
    "terms": {
        "updateReferralProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 3,
            "benefitTiers": [
              {
                "minimumRunningNotionalTakerVolume": "10000",
                "minimumEpochs": "6",
                "referralRewardFactor": "0.001",
                "referralDiscountFactor": "0.001"
              },
              {
                "minimumRunningNotionalTakerVolume": "10000",
                "minimumEpochs": "6",
                "referralRewardFactor": "0.001",
                "referralDiscountFactor": "0.001"
              }
            ],
            "stakingTiers": [
              {
                "minimumStakedTokens": "100",
                "referralRewardMultiplier": "1.5"
              },
              {
                "minimumStakedTokens": "500",
                "referralRewardMultiplier": "2"
              }
            ]
          }
      },
      "closingTimestamp": 1111111111,
      "enactmentTimestamp": 1111111155
  }
  }
}
```  
</TabItem>
<TabItem value="cmd" label="Command line (Linux / OSX)">
<TerminalInstructions />

```
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME 
'{"proposalSubmission": {
    "rationale": {
      "title": "Referral proposal title",
      "description": "This enacts or replaces referral program"
    },
    "terms": {
        "updateReferralProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 3,
            "benefitTiers": [
              {
                "minimumRunningNotionalTakerVolume": "10000",
                "minimumEpochs": "6",
                "referralRewardFactor": "0.001",
                "referralDiscountFactor": "0.001"
              },
              {
                "minimumRunningNotionalTakerVolume": "10000",
                "minimumEpochs": "6",
                "referralRewardFactor": "0.001",
                "referralDiscountFactor": "0.001"
              }
            ],
            "stakingTiers": [
              {
                "minimumStakedTokens": "100",
                "referralRewardMultiplier": "1.5"
              },
              {
                "minimumStakedTokens": "500",
                "referralRewardMultiplier": "2"
              }
            ]
          }
      },
      "closingTimestamp": 1111111111,
      "enactmentTimestamp": 1111111155
  }
  }
}'
```

</TabItem>
<TabItem value="cmd" label="Command line (Windows)">


```
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Referral proposal title\",^
  \"description\": \"This explains why I want to enact or replaces referral program\"^
 },^
 \"terms\": {^
 : {
        \"updateReferralProgram\":^ {
         \"changes\": {^
            \"end_of_program_timestamp\": \"1234567890\",:^

            \"window_length\": \"3\",
            \"benefitTiers\": [
              {
                \"minimumRunningNotionalTakerVolume\": \"10000\",^
                \"minimumEpochs\": \"6\",:^
                \"referralRewardFactor\": \"0.001\",^
                \"referralDiscountFactor\": \"0.001\"^
              },
              {
                \"minimumRunningNotionalTakerVolume\": \"10000\",^
                \"minimumEpochs\": \"6\",^
                \"referralRewardFactor\": \"0.001\",^
                \"referralDiscountFactor\": \"0.001\"^
              }
            ],
            \"stakingTiers\": [
              {
                \"minimumStakedTokens\": \"100\",^
                \"referralRewardMultiplier\": \"1.5\"^
              },
              {
                \"minimumStakedTokens\": \"500\",^
                \"referralRewardMultiplier\": \"2\"^
              }
            ]
          }
      },
      \"closingTimestamp\": \"1111111111\",^
      \"enactmentTimestamp\": \"1111111155\"
  }^
  }^
}'^
```
</TabItem>
