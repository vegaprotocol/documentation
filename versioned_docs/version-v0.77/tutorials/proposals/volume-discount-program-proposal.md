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
import Batch from './_batch-sample.md';

When a volume discount program is enabled, traders can receive discounts on their fees. The higher their taker volume over the discount program's window length, the greater the discount traders can receive.

The volume discount program needs to be enabled by governance. Once it's enabled, both the requirements and the benefits can also be replaced with a new program.

This page describes what you need to propose enabling or replacing the volume discount program, and provides example proposal templates that you will need to edit before sharing and submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [governance on Vega](../../concepts/governance/index.md)

## Anatomy of a volume discount program proposal
The fields below all need to be defined to enable the volume discount program or replace an existing one. 

If you are suggesting a replacement program, you'll need to include all the fields, even if you don't want to change their values. Just use the existing values from the current volume discount program.

**End of program timestamp**: Date and time after which, when the current epoch ends, the program will end and discounts will be disabled.

**Window length**: Number of epochs over which to evaluate traders' volume of taker trades.

To end an existing program early, set your proposal up with the exact same parameters. Set the *end of program timestamp* to be the same as the proposal's *enactment* timestamp. 

#### Benefit tier fields

| Benefit tier field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `benefitTiers` | List of values defining the discount factors for the program | Holds the details of each tier of discounts, listed below. Maximum of <NetworkParameter frontMatter={frontMatter} param="volumeDiscountProgram.maxBenefitTiers" hideName={true}/> tiers |
| `minimumRunningNotionalTakerVolume` | The notional volume of aggressive trades that a trader is required to have across the aggregation window, to access the discount in this tier | Integer greater than or equal to 1 |
| `volumeDiscountFactor` | Proportion of each trader's fees to be discounted, will be converted to a percentage | Must be greater than or equal to 0 and less than / equal to <NetworkParameter frontMatter={frontMatter} param="volumeDiscountProgram.maxVolumeDiscountFactor" hideName={true}/> |

## Submitting proposals in a batch

<Batch />

## Templates and submitting

Below you will find: 
* JSON example
* Command line examples for different operating systems

<Tabs groupId="volumeDiscountProgramParameters">
<TabItem value="json" label="JSON">
<JSONInstructions />

```json
{
    "proposalSubmission": {
    "rationale": {
      "title": "Volume discount proposal title",
      "description": "This enacts or replaces the volume discount program"
    },
    "terms": {
        "updateVolumeDiscountProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 11,
            "benefitTiers": [
              {
                "minimumRunningNotionalTakerVolume": "10000",
                "volumeDiscountFactor": "0.002"
              },
              {
                "minimumRunningNotionalTakerVolume": "10198",
                "volumeDiscountFactor": "0.098"
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
      "description": "This enacts or replaces the volume discount program"
    },
    "terms": {
        "updateVolumeDiscountProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 3,
            "benefitTiers": [
              {
                "minimumRunningNotionalTakerVolume": "10020",
                "volumeDiscountFactor": "0.001"
              },
              {
                "minimumRunningNotionalTakerVolume": "10198",
                "volumeDiscountFactor": "0.098"
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
  \"description\": \"This explains why I want to enact or replace the volume discount program\"^
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
                \"volumeDiscountFactor\": \"0.098\"^
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
All proposals are voted on by the community. 

To vote, community members need, at a minimum, the larger of the value of the following network parameters <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.minVoterBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.requiredParticipation" /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeDiscountProgram.requiredMajority" />. 

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the program changes will go live in the epoch following the time you specify in the `enactmentTimestamp` field.