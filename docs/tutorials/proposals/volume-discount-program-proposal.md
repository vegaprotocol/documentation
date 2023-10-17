---
sidebar_position: 11
title: Enable or replace volume discount program
hide_title: false
vega_network: TESTNET
keywords:
- proposal
- governance
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The volume discount program needs to be enabled by governance. Once it's enabled, both the requirements and the benefits can also be replaced with a new program.

This page describes what you need to propose enabling or replacing the referral program, and provides example proposal templates that you will need to edit before sharing and submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance.md)

## Anatomy of a volume discount program proposal [WIP]
The fields below all need to be defined to enable the volume discount program or replace an existing one. 

If you are suggesting a replacement volume discount program, you'll need to include all the fields, even if you don't want to change their values. Just use the existing values from the current volume discount program.

**End of program timestamp**: Date and time after which, when the current epoch ends, the program will end and benefits will be disabled.

**Window length**: Number of epochs over which to evaluate a volume discount set's running notional taker volume.

#### Benefit tier fields

| Benefit tier field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `benefitTiers` | List of values defining the reward and discount factors for the volume discount program | Holds the details of each benefit tier, listed below. Maximum of <NetworkParameter frontMatter={frontMatter} param="volumeDiscountProgram.maxBenefitTiers" hideName={true}/> |
| `minimumRunningNotionalTakerVolume` | Required cumulative notional volume of taker trades, per epoch, that is required to have access to the related benefit tier | Whole number, decimals allowed, greater than 1 |
| `volumeDiscountFactor` | Proportion of each referee's taker fees to be discounted | Must be greater than or equal to 0 and less than / equal to <NetworkParameter frontMatter={frontMatter} param="volumeDiscountProgram.maxVolumeDiscountFactor" hideName={true}/> |

## Templates and submitting

Below you will find: 
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

<Tabs groupId="referralProgramParameters">
<TabItem value="json" label="Governance dApp (JSON)">
<JSONInstructions />

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
                "volumeDiscountFactor": "0.001"
              },
              {
                "minimumRunningNotionalTakerVolume": "10100",
                "volumeDiscountFactor": "0.002"
              }
            ],
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
      "title": "Volume discount proposal title",
      "description": "This enacts or replaces referral program"
    },
    "terms": {
        "updateVolumeVolumeDiscountProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 3,
            "benefitTiers": [
              {
                "minimumRunningNotionalTakerVolume": "10020",
                "volumeDiscountFactor": "0.001"
              },
              {
                "minimumRunningNotionalTakerVolume": "10100",
                "volumeDiscountFactor": "0.003"
              }
            ],
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
  \"title\": \"Volume discount program proposal title\",^
  \"description\": \"This explains why I want to enact or replaces referral program\"^
 },^
 \"terms\": {^
 : {
        \"updateVolumeDiscountProgram\":^ {
         \"changes\": {^
            \"end_of_program_timestamp\": \"1234567890\",:^

            \"window_length\": \"3\",
            \"benefitTiers\": [
              {
                \"minimumRunningNotionalTakerVolume\": \"10100\",^
                \"volumeDiscountFactor\": \"0.001\"^
              },
              {
                \"minimumRunningNotionalTakerVolume\": \"11000\",^
                \"volumeDiscountFactor\": \"0.001\"^
              }
            ],
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
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. 

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.