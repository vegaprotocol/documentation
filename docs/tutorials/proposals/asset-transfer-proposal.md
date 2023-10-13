---
sidebar_position: 9
title: Propose transferring assets [WIP]
vega_network: TESTNET
hide_title: false
keywords:
- proposal
- governance

---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Certain network-managed accounts require the community to approve transferring assets out of them. 

This tutorial describes what you need to propose transferring assets from those network-managed accounts to other accounts, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken"  formatter="governanceToken" suffix="tokens"/>)
* Familiarity with how [proposing an asset transfer](../../concepts/governance.md#propose-an-asset-transfer) works

## Anatomy of an asset transfer proposal [WIP]
Read on for the key inputs to a governance-initiated parameter proposal.

The contents of a `changes` object specifies what will be different after the proposal. In this case, this is the accounts that assets will move to/from, how much, and when.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the proposal.

**????** is the name of the ???.

**????** is the ????.

"governance.proposal.transfer.maxFraction"
governance.proposal.transfer.maxAmount

governance.proposal.transfer.minClose
governance.proposal.transfer.maxClose

governance.proposal.transfer.maxEnact
governance.proposal.transfer.minEnact

### Basic proposal fields

### Fields used to fund trading rewards
To fund trading rewards 
need to use the right account type
need to define the dispatch strategy, which includes the reward type, which needs to match the destination account type

Dispatch strategy 
| Field | Description | Potential options |
| ----------- | ----------- | ----------- |
| `assetForMetric` | Asset that's used to evaluate how someone performs, such as the settlement asset for the market(s) relevant to the reward | Any asset enabled on Vega |
| `metric` | Specific reward category the transfer is funding | DISPATCH_METRIC_MAKER_FEES_PAID; DISPATCH_METRIC_MAKER_FEES_RECEIVED; DISPATCH_METRIC_LP_FEES_RECEIVED; DISPATCH_METRIC_MARKET_VALUE; DISPATCH_METRIC_AVERAGE_POSITION; DISPATCH_METRIC_RELATIVE_RETURN; DISPATCH_METRIC_RETURN_VOLATILITY; DISPATCH_METRIC_VALIDATOR_RANKING |
| `markets` | Optional: Used to choose which market(s) are in scope | Any active market's ID |
| `staking_requirement` | Optional: Sets a minimum number of governance (e.g. VEGA) tokens staked for a party to be considered eligible for a reward | A number, if omitted it defaults to 0 |
| `notional_time_weighted_average_position_requirement` | Optional: Sets a minimum notional time-weighted averaged position required for a party to be considered eligible to receive rewards | Defaults to 0 | 
| `windowLength` | ???? | numbers |
| `lock_period` | Number of epochs to keep earned rewards in the recipient's reward vesting account before moving to their vested account |
| `entityScope` | defines the entities within scope | Currently ENTITY_SCOPE_INDIVIDUALS is the only option |
| `individualScope` | To be used if the eligible reward recipients should be individuals, and that can then be further focused to determine who is eligible | Currently INDIVIDUAL_SCOPE_ALL is the only option |
| `distributionStrategy` | ranking shit |  DISTRIBUTION_STRATEGY_PRO_RATA; DISTRIBUTION_STRATEGY_RANK |

## Templates and submitting

### Basic transfer proposal
In the tabs below you'll see:

* Annotated example describing what each field is for
* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

**To propose funding trading rewards with a governance-initiated transfer, use the fields above to expand the proposal.**


```
{
  "proposalSubmission": {
    "rationale": {
      "title": "An example transfer testing",
      "description": "I propose that this transfer happens, so do I"
    },
    "terms": {
      "closingTimestamp": 1697283340,
      "enactmentTimestamp": 1697283400,
      "newTransfer": {
        "changes": {
          "sourceType": "ACCOUNT_TYPE_NETWORK_TREASURY",
          "transferType": "GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT",
          "amount": "10000000",
          "asset": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
          "fractionOfBalance": "0.1",
          "destinationType": "ACCOUNT_TYPE_REWARD_AVERAGE_POSITION",
          "recurring": {
            "startEpoch": 116515,
            "endEpoch": 116615,
            "dispatchStrategy": {
              "assetForMetric": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
              "metric": "DISPATCH_METRIC_AVERAGE_POSITION",
              "windowLength": "2",
              "entityScope": "ENTITY_SCOPE_INDIVIDUALS",
              "individualScope": "INDIVIDUAL_SCOPE_ALL",
              "distributionStrategy": "DISTRIBUTION_STRATEGY_PRO_RATA"
            }
          }
        }
      }
    }
  }
}
```

**Replace the example data with the relevant details before submitting.**

<Tabs groupId="transferAssetsParameter">
 <TabItem value="json" label="Governance dApp (JSON)">
    <JSONInstructions />
JSON HERE
  </TabItem>
  <TabItem value="cmd" label="Command line (Linux / OSX)">
    <TerminalInstructions />
COMMAND LINE HERE FOR LINUX
  </TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />
WINDOWS COMMAND LINE HERE
  </TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.