---
sidebar_position: 10
title: Enable or replace referral program
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import Batch from './_batch-sample.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The on-chain referral program allows users to refer new traders. Referrers can get a cut of their referees' trading fees, and referees get a discount on their fees. In addition, a referrer with governance tokens associated can multiply their rewards.

The referral program needs to be enabled by governance. Once it's enabled, both the requirements and the benefits can also be replaced with a new program.

This page describes what you need to propose enabling or replacing the referral program, and provides example proposal templates that you will need to edit before sharing and submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key, based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.referralProgram.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [governance](../../concepts/governance/index.md)

## Anatomy of a referral program proposal
The fields below all need to be defined to enable the referral program or replace an existing one. 

If you are suggesting a replacement referral program, you'll need to include all the fields, even if you don't want to change their values. Just use the existing values from the current referral program.

**End of program timestamp**: Date and time after which, when the current epoch ends, the program will end and benefits will be disabled.

**Window length**: Number of epochs over which to evaluate a referral set's running notional taker volume.

To end an existing program early, set your proposal up with the exact same parameters. Set the *end of program timestamp* to be the same as the proposal's *enactment* timestamp.

#### Benefit tier fields

| Benefit tier field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `benefitTiers` | List of values defining the reward and discount factors for the program | Holds the details of each benefit tier, listed below. Maximum of <NetworkParameter frontMatter={frontMatter} param="referralProgram.maxReferralTiers" hideName={true}/> tiers |
| `minimumRunningNotionalTakerVolume` | The notional volume of aggressive trades that a trader is required to have across the aggregation window, to access this tier | Integer greater than or equal to 1 |
| `minimumEpochs` | Required number of epochs that a referee must have been in a referral set to access the benefits in this tier | Integer greater than 0 | Integer greater than 0 |
| `referralRewardFactor` | Proportion of the referee's paid fees that will be rewarded to the referrer | Whole number, decimals allowed, greater than or equal to 0, and less / equal to the value of the network parameter `referralProgram.maxReferralRewardFactor` |
| `referralDiscountFactor` | Proportion of each referee's fees to be discounted, will be converted to a percentage | Must be greater than or equal to 0 and less than / equal to the value of the network parameter `referralProgram.maxReferralDiscountFactor`/> |

#### Staking tier fields

| Staking tier field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `stakingTiers` | List of values defining the multipliers to be used for referrals | Holds the details for each benefit tier, listed below. Maximum of <NetworkParameter frontMatter={frontMatter} param="referralProgram.maxReferralTiers" hideName={true}/>|
| `minimumStakedTokens` | Required number of governance tokens a referrer must have associated to their Vega key to receive the reward multiplier | Integer greater than 0 |
| `referralRewardMultiplier` | Multiplier applied when calculating referral rewards due to the referrer, if they meet the criteria | Whole number, decimals allowed, greater than or equal to 1 |

## Submitting proposals in a batch

<Batch />

## Templates and submitting

Below you will find: 
* JSON example
* Command line examples for different operating systems

<Tabs groupId="referralProgramParameters">
<TabItem value="json" label="JSON">
<JSONInstructions />

```json
{
    "proposalSubmission": {
    "rationale": {
      "title": "Referral proposal title",
      "description": "This is why I want to enact or replace referral program"
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

<TabItem value="cmd-linux-osx" label="Command line (Linux / OSX)">
<TerminalInstructions />

```
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME 
'{"proposalSubmission": {
    "rationale": {
      "title": "Referral proposal title",
      "description": "This is why I want to enact or replace referral program"
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
<TabItem value="cmd-windows" label="Command line (Windows)">
<TerminalInstructions />

```
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Referral proposal title\",^
  \"description\": \"This is why I want to enact or replace referral program\"^
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
</Tabs>

## Voting
All proposals are voted on by the community. 

To vote, community members need, at a minimum, the larger of the values of the network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.referralProgram.minVoterBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) of the value of the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.referralProgram.requiredParticipation" /> and a majority of the value of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.referralProgram.requiredMajority" />.

## Enactment
If successful, the program changes will go live in the epoch following the time you specify in the `enactmentTimestamp` field.