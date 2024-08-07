---
sidebar_position: 2
title: Change a spot market
hide_title: true
vega_network: MAINNET
toc: true
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

# Propose changes to spot market
Propose changes to an existing spot market.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* A minimum equity-like share in the market of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" hideName={true} />
* Familiarity with [market governance](../../concepts/governance/market.md) on Vega

## Anatomy of an update spot market proposal

The update spot market proposal requires the same fields as a new spot market proposal, except the locked fields below. See the descriptions in the [new spot market proposal tutorial](new-spot-market.md#anatomy-of-a-market-proposal) for more on each field.

In addition to the parameters you want to change, you must include all existing editable parameters from the original new market proposal, even if they are not being changed.

### Locked fields

The following fields cannot be changed. They are not included in the [proposal templates](#templates-and-submitting).

- `sizeDecimalPlaces`
- `priceDecimalPlaces`
- `baseAsset`
- `quoteAsset`

### Thresholds

Note that some network parameters may differ, such as the limits on how long the voting period can last, as follows.

| Field                 | Description           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closingTimestamp`    | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string)         |

## Submitting proposals in a batch

<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="updateSpotMarket">
  <TabItem value="json" label="Governance dApp (JSON)">
  	<JSONInstructions />

```json
{
"proposalSubmission": {
  "rationale": {
    "description": "Propose a change to the spot market for Bitcoin and USDT",
    "title": "Change Bitcoin/USDT spot market"
  },
  "terms": {
    "closingTimestamp": "1683626590",
    "enactmentTimestamp": "1683626600",
    "updateSpotMarket": {
    "marketId": "123",
      "changes": {
          "instrument": {
          "code": "BTC/USDT",
          "name": "BTC/USDT"
          },
        "tickSize": "10",        
        "metadata": [
          "base:BTC",
          "quote:USDT",
          "class:fx/crypto",
          "spot",
          "sector:defi"
        ],
        "priceMonitoringParameters": {
          "triggers": [
            {
              "horizon": "21600",
              "probability": "0.9999999",
              "auctionExtension": "86400"
            },
            {
              "horizon": "4320",
              "probability": "0.9999999",
              "auctionExtension": "3600"
            },
            {
              "horizon": "1440",
              "probability": "0.9999999",
              "auctionExtension": "1800"
            },
            {
              "horizon": "360",
              "probability": "0.9999999",
              "auctionExtension": "300"
            }
          ]
        },
        "targetStakeParameters": {
          "timeWindow": "3600",
          "scalingFactor": 0.05
        },
        "slaParams": {
          "priceRange": "0.03",
          "commitmentMinTimeFraction": "0.75",
          "performanceHysteresisEpochs": "1",
          "slaCompetitionFactor": "0.8"
        },
        "liquidityFeeSettings": {
          "method": "METHOD_MARGINAL_COST"
        },
        "logNormal": {
          "riskAversionParameter": 1e-06,
          "tau": 3.995e-06,
          "params": {
            "sigma": 1.0
          }
        }
      }
    }
   }
 }
}
```
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
		<TerminalInstructions />

```
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '
{
    "proposalSubmission": {
        "rationale": {
            "description": "Propose a spot market for Bitcoin and USDT",
            "title": "Bitcoin/USDT spot market",
            "terms": {
                "closingTimestamp": "1683626590",
                "enactmentTimestamp": "1683626600",
                "updateSpotMarket": {
                    "marketId": "123",
                    "changes": {
                        "instrument": {
                            "code": "BTC/USDT",
                            "name": "BTC/USDT"
                        },
                        "tickSize": "10",
                        "metadata": [
                            "base:BTC",
                            "quote:USDT",
                            "class:fx/crypto",
                            "spot",
                            "sector:defi"
                        ],
                        "priceMonitoringParameters": {
                            "triggers": [
                                {
                                    "horizon": "21600",
                                    "probability": "0.9999999",
                                    "auctionExtension": "86400"
                                },
                                {
                                    "horizon": "4320",
                                    "probability": "0.9999999",
                                    "auctionExtension": "3600"
                                },
                                {
                                    "horizon": "1440",
                                    "probability": "0.9999999",
                                    "auctionExtension": "1800"
                                },
                                {
                                    "horizon": "360",
                                    "probability": "0.9999999",
                                    "auctionExtension": "300"
                                }
                            ]
                        },
                        "targetStakeParameters": {
                            "timeWindow": "3600",
                            "scalingFactor": 0.05
                        },
                        "slaParams": {
                            "priceRange": "0.03",
                            "commitmentMinTimeFraction": "0.75",
                            "performanceHysteresisEpochs": "1",
                            "slaCompetitionFactor": "0.8"
                        },
                        "liquidityFeeSettings": {
                            "method": "METHOD_MARGINAL_COST"
                        },
                        "logNormal": {
                            "riskAversionParameter": 0.000001,
                            "tau": 0.000003995,
                            "params": {
                                "sigma": 1
                            }
                        }
                    }
                }
            }
        }
    }
}
```
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
  <TerminalInstructions />

```
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Add Lorem Ipsum market\",^
  \"description\": \"An example proposal to add Lorem Ipsum market\"^
 },^
 \"terms\": {^
  \"updateSpotMarket\": {^
  \"marketId\": \"123\",
   \"changes\": {^
   \"instrument\": {^
      \"code\": \"BTC/USDT\",^
      \"name\": \"BTC/USDT\"^
      },^
    \"metadata\": [^
     \"enactment:2024-04-23T15:14:03Z\"^
    ],^
    \"priceMonitoringParameters\": {^
     \"triggers\": [^
      {^
       \"horizon\": \"59000\",^
       \"probability\": \"0.0009099\",^
       \"auctionExtension\": \"3600\"^
      }^
      {^
       \"horizon\": \"88200\",^
       \"probability\": \"0.0000999\",^
       \"auctionExtension\": \"3600\"^
      }^
     ]^
    },^
    \"logNormal\": {^
     \"tau\": 3.995e-06,^
     \"riskAversionParameter\": 1e-06,^
     \"params\": {^
      \"sigma\": 1.0^
     }^
    },^
    \"liquiditySlaParameters\": {^
     \"priceRange\": \"0.03\",^
     \"commitmentMinTimeFraction\": \"0.75\",^
     \"performanceHysteresisEpochs\": \"1\",^
     \"slaCompetitionFactor\": \"0.8\"^
    },^
    \"liquidityFeeSettings\": {^
     \"method\": \"METHOD_CONSTANT\",^
     \"feeConstant\": \"0.00005\"^
    },^
    \"liquidityMonitoringParameters\": {^
     \"targetStakeParameters\": {^
      \"timeWindow\": \"3600\",^
      \"scalingFactor\": \"0.05\"^
     }^
    },^
    \"tickSize\": \"1\"^
   }^
  },^
  \"closingTimestamp\": 1713795243,^
  \"enactmentTimestamp\": 1713881643^
 }^
}^
}^
"
```
</TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. 

<!--
Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).
-->

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" formatter="governanceToken" suffix="tokens" hideName={true} /> or <NetworkParameter frontMatter={frontMatter} formatter="governanceToken" param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-the-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential. 

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.