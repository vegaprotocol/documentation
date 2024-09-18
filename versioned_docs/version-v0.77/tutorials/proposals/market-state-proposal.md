---
sidebar_position: 2
title: Change market state
hide_title: true
vega_network: TESTNET
toc: true
keywords:
  - proposal
  - governance
  - updateMarket
---

import NetworkParameter from '@site/src/components/NetworkParameter';
import JSONInstructions from './_json-instructions.md';
import TerminalInstructions from './_terminal-instructions.md';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Batch from './_batch-sample.md';

# Propose changing the state of a market
Below, learn how to submit a governance proposal to:
* [Suspend normal trading](#suspend-a-market) on a live market
* [Resume trading](#resume-a-market) on a market suspended through governance
* [Terminate a market](#terminate-a-market)

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: based on the network parameter values for <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" />
* Familiarity with [market governance](../../concepts/governance/market.md)

## Anatomy of the proposal types

### Thresholds

| Field                 | Description           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closingTimestamp`    | Timestamp (Unix time in seconds) when voting closes for this proposal. The chosen time must be between network parameter values: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minClose" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxClose" /> after the proposal submission time. (int64 as string) |
| `enactmentTimestamp ` | Timestamp (Unix time in seconds) when proposal gets enacted (if passed). The chosen time must be between network parameter values <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minEnact" /> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.maxEnact" /> after `closingTimestamp`. (int64 as string)         |

## Submitting proposals in a batch

<Batch />

## Suspend a market
A market can be suspended for an indefinite amount of time, which puts the market into auction-only mode. Suspending a market allows for the possibility that it will be open to normal trading again in the future. A market that's suspended through governance can be resumed using the [resume a market](#resume-a-market) proposal.

The proposal to suspend an open market requires: 
* `marketID` for the market to suspend
* `updateType` of `MARKET_STATE_UPDATE_TYPE_SUSPEND`

### Template: Suspend a market
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="suspendMarket">
<TabItem value="annotated-suspend" label="Annotated example">

```javascript
{
proposalSubmission: {
 rationale: {
  title: "Suspend futures market ORANGES2023",
  description: "Proposal to suspend Oranges 2023 market"
 },
 terms: {
  updateMarketState: {
   changes: {
    // the market to suspend
    marketId: "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    // the type of update required
    updateType: "MARKET_STATE_UPDATE_TYPE_SUSPEND"    
   }
  },
  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1685553047,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1685639447
 }
}
}
```

</TabItem>

<TabItem value="json-suspend" label="JSON">
  <JSONInstructions />

```json
{
  "proposalSubmission": {
 "rationale": {
  "title": "Suspend futures market LINK/USDT-230931",
  "description": "Proposal to suspend futures market"
 },
 "terms": {
  "updateMarketState": {
   "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_SUSPEND"    
   }
  },
  "closingTimestamp": 1685553047,
  "enactmentTimestamp": 1685639447
 }
}
}
```  

</TabItem>
<TabItem value="cmd-suspend" label="Command line (Linux / OSX)">
  <TerminalInstructions />

 ```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '
{
  "proposalSubmission": {
 "rationale": {
  "title": "Suspend futures market LINK/USDT-230930",
  "description": "Proposal to suspend futures market"
 },
 "terms": {
  "updateMarketState": {
   "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_SUSPEND"    
   }
  },
  "closingTimestamp": "1685553047",
  "enactmentTimestamp": "1685639447"
 }
}
}'
```

</TabItem>
  <TabItem value="win-suspend" label="Command line (Windows)">
    <TerminalInstructions />

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{ ^
 \"proposalSubmission\": { ^
 \"rationale\": { ^
  \"title\": \"Suspend futures market LINK/USDT-230930\", ^
  \"description\": \"Proposal to suspend futures market\" ^
 }, ^
 \"terms\": { ^
  \"updateMarketState\": { ^
   \"changes\": { ^
    \"marketId\": \"d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f\", ^
    \"updateType\": \"MARKET_STATE_UPDATE_TYPE_SUSPEND\" ^
   } ^
  }, ^
  \"closingTimestamp\": \"1685553047\", ^
  \"enactmentTimestamp\": \"1685639447\" ^
 } ^
} ^
}" ^
```

</TabItem>
</Tabs>


## Resume a market
A market that's been suspended through governance can be resumed using the following proposal type. If the proposal passes a governance vote, it will be resumed at the enactment time in the proposal. 

The proposal to resume an open market requires the `marketID` for the one to suspend, as well as the `updateType`of `MARKET_STATE_UPDATE_TYPE_RESUME`

### Template: Resume a market

In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="resumeMarket">
<TabItem value="annotated-resume" label="Annotated example">

```javascript
{
proposalSubmission: {
 rationale: {
  title: "Resume suspended futures market LINK/USDT-230930",
  description: "Proposal to resume futures market"
 },
 terms: {
  updateMarketState: {
   changes: {
    // the market to update
    marketId: "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    // the type of update required
    updateType: "MARKET_STATE_UPDATE_TYPE_RESUME"    
   }
  },
  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1685553047,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1685639447
 }
}
}
```

</TabItem>
<TabItem value="json-resume" label="JSON">
  <JSONInstructions />

```json
{
"proposalSubmission": {
 "rationale": {
  "title": "Resume suspended futures market LINK/USDT-230930",
  "description": "Proposal to resume futures market"
 },
 "terms": {
  "updateMarketState": {
   "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_RESUME"
   }
  },
  "closingTimestamp": 1685553047,
  "enactmentTimestamp": 1685639447
 }
}
}
```

</TabItem>
<TabItem value="cmd-resume" label="Command line (Linux / OSX)">
  <TerminalInstructions />

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
"proposalSubmission": {
  "rationale": {
  "title": "Resume suspended market ORANGES2023",
  "description": "Proposal to resume market"
 },
 "terms": {
  "updateMarketState": {
   "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_RESUME"
   }
  },
  "closingTimestamp": 1685553047,
  "enactmentTimestamp": 1685639447
 }
}
}'
```

</TabItem>
<TabItem value="win-resume" label="Command line (Windows)">
  <TerminalInstructions />

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{ ^
 \"proposalSubmission\": { ^
 \"rationale\": { ^
  \"title\": \"Resume suspended futures market LINK/USDT-230930\", ^
  \"description\": \"Proposal to resume futures market\" ^
 }, ^
 \"terms\": { ^
  \"updateMarketState\": { ^
   \"changes\": { ^
    \"marketId\": \"d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f\", ^
    \"updateType\": \"MARKET_STATE_UPDATE_TYPE_RESUME\" ^
   } ^
  }, ^
  \"closingTimestamp\": \"1685553047\", ^
  \"enactmentTimestamp\": \"1685639447\" ^
 } ^
 } ^
}"
```

</TabItem>
</Tabs>

## Terminate a market
Once a market is terminated, it **cannot be reversed**. If the proposal to terminate a market is enacted, it will end all trading on the market, settle all positions, and close the market completely.

The proposal to resume an open market requires the `marketID` for the one to suspend, as well as the `updateType` of `MARKET_STATE_UPDATE_TYPE_TERMINATE`.

It also requires a final settlement price, with enough digits to account for the market's decimal places. This uses the `price` field.

### Template: Terminate a market
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example
* Command line examples for different operating systems

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="terminateMarket">
<TabItem value="annotated-terminate" label="Annotated example">

```javascript
{
proposalSubmission: {
 rationale: {
  title: "Terminate futures market LINK/USDT-230930",
  description: "Proposal to terminate futures market"
 },
 terms: {
  updateMarketState: {
   changes: {
    // the market to terminate
    marketId: "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    // the type of update required
    updateType: "MARKET_STATE_UPDATE_TYPE_TERMINATE",
    // the price to use for settlement
    price: "100"
   }
  },
  // Timestamp as Unix time in seconds when voting closes for this proposal,
  // constrained by `minClose` and `maxClose` network parameters. (int64 as string)
  closingTimestamp: 1685553047,
  // Timestamp as Unix time in seconds when proposal gets enacted if passed,
  // constrained by `minEnact` and `maxEnact` network parameters. (int64 as string)
  enactmentTimestamp: 1685639447
 }
}
}
```  

</TabItem>
<TabItem value="json-terminate" label="JSON">
  <JSONInstructions />

```json
{
"proposalSubmission": {
 "rationale": {
  "title": "Terminate market ORANGES2023",
  "description": "Proposal to terminate market"
 },
 "terms": {
  "updateMarketState": {
  "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_TERMINATE",
    "price": "100"
   }
  },
  "closingTimestamp": 1685553047,
  "enactmentTimestamp": 1685639447
 }
}
}
```

</TabItem>
<TabItem value="cmd-terminate" label="Command line (Linux / OSX)">
  <TerminalInstructions />

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
 "proposalSubmission": {
 "rationale": {
  "title": "Terminate market ORANGES2023",
  "description": "Proposal to terminate market"
 },
 "terms": {
  "updateMarketState": {
   "changes": {
    "marketId": "d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f",
    "updateType": "MARKET_STATE_UPDATE_TYPE_TERMINATE",
    "price": "100"
   }
  },
  "closingTimestamp": 1685553047,
  "enactmentTimestamp": 1685639447
 }
}
}'
```

</TabItem>
<TabItem value="win-terminate" label="Command line (Windows)">
  <TerminalInstructions />

```
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{ ^
 \"proposalSubmission\": { ^
 \"rationale\": { ^
  \"title\": \"Close futures market LINK/USDT-230930\", ^
  \"description\": \"Proposal to close futures market\" ^
 },^
 \"terms\": { ^
  \"updateMarketState\": { ^
   \"changes\": { ^
    \"marketId\": \"d2157929132456dbc66eecbd478307156066243cd8769306e71f31882c22344f\", ^
    \"updateType\": \"MARKET_STATE_UPDATE_TYPE_TERMINATE\", ^
    \"price\": \"100\" ^
   } ^
  }, ^
  \"closingTimestamp\": \"1685553047\", ^
  \"enactmentTimestamp\": \"1685639447\" ^
 } ^
 } ^
}"
```

</TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. 

To vote, community members need, at a minimum, the larger of the following network parameters' values: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minVoterBalance" /> or <NetworkParameter frontMatter={frontMatter} param="spam.protection.voting.min.tokens" /> associated to their Vega key.

Your proposal will need [participation](../../concepts/governance/lifecycle.md#how-a-proposals-outcome-is-calculated) of the value of network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredParticipation" />, a majority determined by the value of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajority" />, as well as a percentage of liquidity provider votes determined by the value of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.requiredMajorityLP" />. 

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.