---
sidebar_position: 1
title: New spot market
hide_title: true
vega_network: TESTNET
keywords:
- proposal
- governance
- newMarket
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import Batch from './_batch-sample.md';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Propose new spot market

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideValue={true}/>   (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with [market governance](../../concepts/governance/market.md) on Vega

## Spot market assets
Both the base and quote assets for the market need to be enabled on one of the bridges. 

Use the [list assets API](../../api/rest/data-v2/trading-data-service-list-assets.api.mdx) for REST to see all currently enabled assets.

For an asset that's not already on the bridge, you'll need to [propose a new asset](./new-asset-proposal.md), and if it passes governance, [update the asset bridge](./update-asset-bridge.md).

## Anatomy of a new spot market proposal

The contents of a `changes` object specifies what will be different after the proposal. In this case, these are the changes that will occur on the network, in the form of a new spot market.

**Rationale** requires a title and description, which are free-text fields that describe the purpose of the proposal.  Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the market proposal. Formatting your rationale with markdown makes it easier to read when it's displayed.

**Timestamps** are required for ending the voting period, as well as enacting the market. The time between closing and enactment also defines how long an [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) will be, which must be smaller than/equal to the difference between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" />.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `closingTimestamp` | Timestamp (Unix time in seconds) when voting closes for this proposal. If it passes the vote, liquidity can be committed from this time. The chosen time must be between <NetworkParameter frontMatter={frontMatter}param="governance.proposal.market.minClose" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxClose" hideName={true} /> after the proposal submission time. (int64 as string) | 1663517914 |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when the market will be enacted, ready for trading. The chosen time must be between <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minEnact" hideName={true} /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.maxEnact" hideName={true} /> after `closingTimestamp`. (int64 as string) | 1663604314 |

### Instrument

The instrument shape is as follows, see below for a description of each property:

An instrument contains the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `name` | A string for the market name. Best practice is to include a full and fairly descriptive name for the instrument. | Oranges DEC18. |
| `code`  (instrument) | This is a shortcode used to easily describe the instrument. The more information you add, the easier it is for people to know what the market offers. | FX:BTCUSD |
| `spot` | An object that provides details about the spot market to be proposed. |
| `quoteAsset` | Quote specifies the asset which can be exchanged for the base asset. This field requires the asset ID. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `baseAsset` | Base asset specifies the asset to be bought or sold on the market. Requires the asset ID. You can get a list of supported assets by querying REST, GraphQL, or gRPC, and then selecting the asset ID. |  |
| `tickSize` | Sets the smallest possible change in the price in the market. Tick size is in relation to the market `decimalPlaces`, as an integer. If a BTCUSDT market is configured with 5 mdp, tick size 1 would make the smallest tick size 0.00001. Tick size can help manage a market with 'too many' decimal places, or an asset's value dropping dramatically. | A value of 2000 with 5 `decimalPlaces` is a scaled tick size of 0.02. |
| `enableTransactionReordering` | Sets whether or not aggressive orders sent to the market are delayed by the number of blocks configured by the network parameter `market.aggressiveOrderBlockDelay` | true / false |

**Decimal places** need to be defined for both order sizes and the market. A market cannot specify more decimal places than its settlement asset supports. The values for these fields cannot be changed, even through governance.

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `priceDecimalPlaces` | Sets the smallest price increment on the book that can be stored by Vega. Use with `tickSize` to get bigger price increments that are currently financially meaningful. Though `pricedecimalPlaces` can't be changed via governance, `tickSize` can. | 18 |
| `sizeDecimalPlaces` | Sets the size that the smallest order on the market can be. Price decimal places can also be negative integers. | 3 |

### Price monitoring
Price monitoring parameters are optional, and configure the acceptable price movement bounds for price monitoring.

Price monitoring uses the following properties: 

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `horizon` | Price monitoring projection horizon τ in seconds (set as >0) | 43200 |
| `probability` | Price monitoring probability level p (set as >0 and <1) | 0.9999999 |
| `auctionExtension` | Price monitoring auction extension duration (in seconds) should the price breach its theoretical level over the specified horizon at the specified probability level (set as >0) | 600 |

You can use a maximum of 5 sets of price monitoring parameters for a market.


### Liquidity SLA parameters 
The liquidity parameters set the requirements that liquidity providers on the market must meet in order to avoid being penalised and to earn fee revenue. There is also an option to change how the liquidity fee is determined.

| Field | Description | Sample value |
| ----------- | ----------- | ----------- |
| `liquiditySlaParameters` | Parameters for minimum requirements and measurements | |
| `priceRange` | Sets the percentage move up and down from the mid price that LPs must be within to count towards their commitment | 0.1 | 
| `commitmentMinTimeFraction` | The minimum fraction of time that LPs must spend on the book and within the price range | 0.1 | 
| `performanceHysteresisEpochs` | Sets the number of epochs over which past performance will continue to affect rewards. | 10 | 
| `slaCompetitionFactor` | Sets the maximum fraction of their accrued fees an LP that meets the SLA will lose to liquidity providers that achieved a higher SLA performance than them. | 0.2 |
| `liquidityFeeSettings` | Optional setting for how the liquidity fee factor is determined. See [liquidity fees](../../concepts/liquidity/rewards-penalties.md#determining-the-liquidity-fee-percentage) for more. | `METHOD_MARGINAL_COST` (default) `METHOD_CONSTANT`, `METHOD_WEIGHTED_AVERAGE` |
| `feeConstant` | For the fee setting `METHOD_CONSTANT`, a constant fee factor needs to be provided. | 0.00005 |

### Liquidity monitoring
The liquidity monitoring settings detect when the market's liquidity drops below the ideal level.

Liquidity monitoring uses the following properties:

| Field | Description | Example |
| ----------- | ----------- | ----------- |
| `targetStakeParameters` | Target stake parameters are derived from open interest history over a time window to calculate the maximum open interest. |
| `timeWindow` | Defines the length of time (in seconds) over which open interest is measured. | 3600 |
| `scalingFactor` | The target stake scaling factor scales the estimated required liquidity (based on the market's risk model and current market data) to yield the market's target stake. The scaling factor must be a number greater than zero and finite | 10 |

### Risk model
Choose the individual parameters for the [log-normal risk model](../../concepts/governance/market.md#log-normal-risk-model). This is used to determine the probability of trading, which influences how liquidity providers are scored.

The risk model uses the following properties: 

| Field | Description | Suggested value |
| ----------- | ----------- | ----------- |
| `tau` | Projection horizon measured as a year fraction. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: 0.000114077116130504 - corresponds to one hour expressed as year fraction | 0.000114077116130504 |
| `riskAversionParameter` | Probability confidence level; lower values will mean tighter price monitoring bounds. <br/><br/> Accepted values: strictly greater than 0 and strictly smaller than 1 | 0.00001 |
| `param: mu` | Annualised growth rate of the underlying asset. <br/><br/>Accepted values: any real number | 0 |
| `param: r` | Annualised growth rate of the risk-free asset, it's used for discounting of future cash flows. Use 0.0 unless otherwise required. <br/><br/> Accepted values: any real number | 0.0 |
| `param: sigma` | Annualised historic volatility of the underlying asset. <br/><br/>Accepted values: any strictly non-negative real number; suggested value: asset dependent, should be derived from the historical time-series of prices. | 0.8 (converts to 80%) |

## Submitting proposals in a batch
<Batch />

## Templates and submitting
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems that can be submitted with a Vega Wallet app.

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="newMarket">
  <TabItem value="json" label="Governance dApp (JSON)">
  	<JSONInstructions />

```json
{
"proposalSubmission": {
  "rationale": {
    "description": "Propose a spot market for Bitcoin and USDT",
    "title": "Bitcoin/USDT spot market"
  },
  "terms": {
    "closingTimestamp": "1683626590",
    "enactmentTimestamp": "1683626600",
    "newSpotMarket": {
      "changes": {
        "instrument": {
          "name": "Bitcoin / Tether USD (Spot)",
          "code": "BTC/USDT spot",
          "spot": {
            "baseAsset": "b335cd4ba8a9c5b387b66117e5ee6dbd5a03fb7c74ee4a1d012589aafd45eb25",
            "quoteAsset": "948970482946248f0d04dd271d063cd44458822c67609d230e072d6d51d60956"
          }
        },
        "tickSize": "10",        
        "enableTransactionReordering": true,
        "priceDecimalPlaces": "2",
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
        "sizeDecimalPlaces": "4",
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
./vegawallet transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME '{
"proposalSubmission": {
  "rationale": {
    "description": "Propose a spot market for Bitcoin and USDT",
    "title": "Bitcoin/USDT spot market"
  },
  "terms": {
    "closingTimestamp": "1683626590",
    "enactmentTimestamp": "1683626600",
    "newSpotMarket": {
      "changes": {
        "instrument": {
          "name": "Bitcoin / Tether USD (Spot)",
          "code": "BTC/USDT spot",
          "spot": {
            "baseAsset": "b335cd4ba8a9c5b387b66117e5ee6dbd5a03fb7c74ee4a1d012589aafd45eb25",
            "quoteAsset": "948970482946248f0d04dd271d063cd44458822c67609d230e072d6d51d60956"
          }
        },
        "tickSize": "10",        
        "enableTransactionReordering": true,
        "priceDecimalPlaces": "2",
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
        "sizeDecimalPlaces": "4",
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
  \"newSpotMarket\": {^
   \"changes\": {^
    \"priceDecimalPlaces\": \"5\",^
    \"sizeDecimalPlaces\": \"5\",^
    \"instrument\": {^
     \"name\": \"Bitcoin / Tether USD (Spot)\",^
     \"code\": \"BTC/USDT spot\",^
     \"spot\": {^
      \"baseAsset\": \"b335cd4ba8a9c5b387b66117e5ee6dbd5a03fb7c74ee4a1d012589aafd45eb25\",^
      \"quoteAsset\": \"b335cd4ba8a9c5b387b66117e5ee6dbd5a03fb7c74ee4a1d012589aafd45eb25\"^
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
    \"tickSize\": \"1\",^
    \"enableTransactionReordering\": \true\^

   }^
  },^
  \"closingTimestamp\": 1713795243,^
  \"enactmentTimestamp\": 1713881643^
 }^
}^
}^
}^
}"
```
</TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. 

<!--
Building support is down to you. Share your proposal in the [_Governance_ section ↗](https://community.vega.xyz/c/governance) on the Vega community forum. You may also wish to share on [Discord ↗](https://vega.xyz/discord).
-->

A vote can be submitted with a [transaction](../../api/grpc/vega/commands/v1/commands.proto.mdx#votesubmission) on the command line, or by using the [governance dApp](https://governance.fairground.wtf/proposals).

To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

Learn more about voting on the [governance concepts](../../concepts/governance/lifecycle.md#voting) page.

## Enactment 
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field, or as soon as the [opening auction](../../concepts/trading-on-vega/trading-modes.md#auction-type-opening) has successfully concluded, whichever is later.