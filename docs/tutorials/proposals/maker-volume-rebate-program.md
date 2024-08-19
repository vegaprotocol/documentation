---
sidebar_position: 11
title: Enable or replace maker rebate program
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

When a high-volume maker rebate program is enabled, market makers can receive a rebate of a portion of their paid fees. The higher their maker volume over the program's window length, the greater the rebate that makers can receive.

The program needs to be enabled by governance. Once it's enabled, both the requirements and the benefits can also be replaced with a new program.

This page describes what you need to propose enabling or replacing the program, and provides example proposal templates that you will need to edit before sharing and submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeRebateProgram.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeRebateProgram.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [governance on Vega](../../concepts/governance/index.md)

## Anatomy of a maker rebate program proposal
The fields below all need to be defined to enable the program or replace an existing one. 

If you are suggesting a replacement program, you'll need to include all the fields, even if you don't want to change their values. Just use the existing values from the current maker rebate program program.

**End of program timestamp**: Date and time after which, when the current epoch ends, the program will end and rebates will be disabled.

**Window length**: Number of epochs over which to evaluate LPs' volume of maker trades.

To end an existing program early, set your proposal up with the exact same parameters. Set the *end of program timestamp* to be the same as the proposal's *enactment* timestamp. 

#### Benefit tier fields

| Benefit tier field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `benefitTiers` | List of values defining the rebate factors for the program | Holds the details of each tier of rebates, listed below. Maximum of <NetworkParameter frontMatter={frontMatter} param="volumeRebateProgram.maxBenefitTiers" hideName={true}/> tiers |
| `minimumPartyMakerVolumeFraction` | The required maker volume a party needs to have to access this tier, as a fraction. |  Greater than 0 and up to 1, inclusive |
| `additionalMakerRebate` | Additional fraction of fees a party will receive as a rebate when they are on the maker side of a trade. | Greater than 0 and up to 1, inclusive |

## Submitting proposals in a batch

<Batch />

## Templates and submitting

Below you will find: 
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

<Tabs groupId="UpdateVolumeRebateProgram">
<TabItem value="json" label="Governance dApp (JSON)">
<JSONInstructions />

```json
{
    "proposalSubmission": {
    "rationale": {
      "title": "Maker volume rebate proposal title",
      "description": "This enacts or replaces the maker volume rebate program"
    },
    "terms": {
        "UpdateVolumeRebateProgram": {
          "changes": {
            "endOfProgramTimestamp": 1234567890,

            "window_length": 11,
            "benefitTiers": [
              {
                "minimumPartyMakerVolumeFraction": "10000",
                "additionalMakerRebate": "0.002"
              },
              {
                "minimumPartyMakerVolumeFraction": "10198",
                "additionalMakerRebate": "0.098"
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
      "title": "Maker volume rebate proposal title",
      "description": "This enacts or replaces the volume rebate program"
    },
    "terms": {
        "UpdateVolumeRebateProgram": {
          "changes": {
            "end_of_program_timestamp": 1234567890,

            "window_length": 3,
            "benefitTiers": [
              {
                "minimumPartyMakerVolumeFraction": "10020",
                "additionalMakerRebate": "0.001"
              },
              {
                "minimumPartyMakerVolumeFraction": "10198",
                "additionalMakerRebate": "0.098"
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
  \"title\": \"Maker volume rebate program proposal title\",^
  \"description\": \"This explains why I want to enact or replace the volume rebate program\"^
 },^
 \"terms\": {^
 : {
        \"UpdateVolumeRebateProgram\":^ {
         \"changes\": {^
            \"end_of_program_timestamp\": \"1234567890\",:^

            \"window_length\": \"3\",
            \"benefitTiers\": [
              {
                \"minimumPartyMakerVolumeFraction\": \"10100\",^
                \"additionalMakerRebate\": \"0.001\"^

              },
              {
                \"minimumPartyMakerVolumeFraction\": \"11000\",^
                \"additionalMakerRebate\": \"0.098\"^
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

<!--
Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).
-->

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeRebateProgram.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeRebateProgram.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.VolumeRebateProgram.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. 

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the program changes will go live in the epoch following the time you specify in the `enactmentTimestamp` field.