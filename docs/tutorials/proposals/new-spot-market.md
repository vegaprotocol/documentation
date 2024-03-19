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

## Anatomy of a new spot market proposal


```
{
  "rationale": {
    "description": "Making a proposal",
    "title": "This is a proposal"
  }
  "terms": {
    "closingTimestamp": "1683626590",
    "enactmentTimestamp": "1683626600",
    "newSpotMarket": {
      "changes": {
        "instrument": {
          "name": "Bitcoin / Tether USD (Spot)",
          "code": "BTC/USDT",
          "spot": {
            "baseAsset": "b335cd4ba8a9c5b387b66117e5ee6dbd5a03fb7c74ee4a1d012589aafd45eb25",
            "quoteAsset": "948970482946248f0d04dd271d063cd44458822c67609d230e072d6d51d60956",
            "name": "BTC/USDT"
          }
        },
        "decimalPlaces": "2",
        "metadata": [
          "base:BTC",
          "quote:USDT",
          "oracle:pyth",
          "oracleChain:gnosis",
          "class:fx/crypto",
          "perpetual",
          "sector:defi",
          "enactment:2023-12-01T18:00:00Z"
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
        "positionDecimalPlaces": "4",
        "slaParams": {
          "priceRange": "0.03",
          "commitmentMinTimeFraction": "0.75",
          "performanceHysteresisEpochs": "1",
          "slaCompetitionFactor": "0.8"
        },
        "liquidityFeeSettings": {
          "method": "METHOD_MARGINAL_COST"
        },
        "tickSize": "10",
        "logNormal": {
          "riskAversionParameter": 1e-06,
          "tau": 3.995e-06,
          "params": {
            "sigma": 1.0
          }
        }
      }
    }
  },
}
```
