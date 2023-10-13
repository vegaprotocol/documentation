---
sidebar_position: 9
title: Propose transferring assets
vega_network: TESTNET
hide_title: false
keywords:
- proposal
- governance

---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Certain network-managed accounts require the community to approve transferring assets out of them. You can also propose that those assets are used to fund trading rewards by including those details into the proposal.

This tutorial describes what you need to propose transferring assets from those network-managed accounts to other accounts, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken" formatter="governanceToken" suffix="tokens"/>)
* Familiarity with how [proposing an asset transfer](../../concepts/governance.md#propose-an-asset-transfer) works

## Anatomy of an asset transfer proposal
Read on for the key inputs to a governance-initiated parameter proposal.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the proposal.

The **terms** of the proposal describe the details of the proposal, including closing and enactment timestamps, and details about the proposed transfer, including what accounts the transfer is to move assets between, and optionally information about rewards to fund with the transfer, if that's the intent.
* **Closing timestamp**, the date and time when voting closes, must be within a range of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minClose" hideName={true}/> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxClose" hideName={true}/>, from when it was proposed.
* **Enactment timestamp**, the date and time when the transfer is to happen, must be within a range of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minEnact" hideName={true}/> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxClose" hideName={true}/>.

**Amount** is how much to transfer, as whole number with the asset decimal places implied. For example, if the asset has a decimal place of 2 and the transfer is for 100, then the amount needs to be set at 10000. The maximum you can propose to transfer is governance.proposal.transfer.maxAmount. Before proposing, make sure the account you're transferring from exists and has a balance. The full amount may not be transferred if there isn't enough to transfer.

**Fraction of balance** is used to determine what fraction of the source account's balance could be transferred, the biggest fraction that you can choose is <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxFraction" hideName={true}/>.

**Governance transfer type** lets you determine if you want to try to transfer all or nothing, or to transfer as much as is possible up to the full amount.

### Fields used to fund trading rewards

If you're proposing a transfer to fund rewards, there are extra fields to define.

The `destinationType` must be the account type that matches the reward category. For example, to propose that the 'average position' reward will pay out, you'll need to set the destination type as `ACCOUNT_TYPE_REWARD_AVERAGE_POSITION`, and then choose the complementary reward category, known as the `metric`. The asset you choose then determines which market(s) the reward targets.

You will need to define the dispatch strategy, which includes the  metric, the length of time to measure performance, the asset used to evaluate performance, and other fields. 

| Dispatch strategy field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `assetForMetric` | Asset that's used to evaluate how someone performs, such as the settlement asset for the market(s) relevant to the reward | Any asset enabled on Vega |
| `metric` | Specific reward category the transfer is funding | DISPATCH_METRIC_MAKER_FEES_PAID; DISPATCH_METRIC_MAKER_FEES_RECEIVED; DISPATCH_METRIC_LP_FEES_RECEIVED; DISPATCH_METRIC_MARKET_VALUE; DISPATCH_METRIC_AVERAGE_POSITION; DISPATCH_METRIC_RELATIVE_RETURN; DISPATCH_METRIC_RETURN_VOLATILITY; DISPATCH_METRIC_VALIDATOR_RANKING |
| `markets` | Optional: Used to choose which market(s) are in scope | Any trading market's ID |
| `staking_requirement` | Optional: Sets a minimum number of VEGA tokens that need to be staked for a party to be considered eligible for the reward | Number, if omitted it defaults to 0 |
| `notional_time_weighted_average_position_requirement` | Optional: Sets a minimum notional TWAP required for a party to be considered eligible to receive rewards | Defaults to 0 | 
| `windowLength` | Number of epochs in which performance against the reward metric is measured | Any number between 1 and 100 |
| `lock_period` | Number of epochs to keep earned rewards in the recipient's reward vesting account before moving to their vested account |
| `entityScope` | defines the entities within scope | Currently ENTITY_SCOPE_INDIVIDUALS is the only option |
| `individualScope` | To be used if the eligible reward recipients should be individuals, and that can then be further focused to determine who is eligible | Currently INDIVIDUAL_SCOPE_ALL is the only option |
| `distributionStrategy` | Sets how the participants should be ranked, and what other factors to consider. |  DISTRIBUTION_STRATEGY_PRO_RATA; DISTRIBUTION_STRATEGY_RANK |

#### Example dispatch strategy snippet

```
"dispatchStrategy": {
  "assetForMetric": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
  "metric": "DISPATCH_METRIC_AVERAGE_POSITION",
  "windowLength": "2",
  "entityScope": "ENTITY_SCOPE_INDIVIDUALS",
  "individualScope": "INDIVIDUAL_SCOPE_ALL",
  "distributionStrategy": "DISTRIBUTION_STRATEGY_PRO_RATA"
```

## Templates and submitting

### Basic recurring transfer proposal

* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

**To propose funding trading rewards with a governance-initiated transfer, use the fields and information above to expand the proposal.**

<Tabs groupId="transferAssetsParameter">
 <TabItem value="json" label="Governance dApp (JSON)">

```
{
  "proposalSubmission": {
    "rationale": {
      "title": "Transfer some assets",
      "description": "Here is a description about why I want to transfer"
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
            "endEpoch": 116615
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
   "title": "Propose moving assets",
   "description": "Here is a description about why I want to transfer"
  },
  "terms": {
    "closingTimestamp": 10000000,
    "enactmentTimestamp": 10000100,
    "newTransfer": {
    "changes": {
     "sourceType": "ACCOUNT_TYPE_NETWORK_TREASURY",
     "transferType": "GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT",
     "amount": "10000000",
          "asset": "ASSET_ID",
          "fractionOfBalance": "0.1",
          "destinationType": "ACCOUNT_TYPE_REWARD_AVERAGE_POSITION",
          "recurring": {
            "startEpoch": 1111110,
            "endEpoch": 1111111,
     }
    }
   },
  }
 }
}'
``` 
</TabItem>
  <TabItem value="win" label="Command line (Windows)">
    <TerminalInstructions />   

```
vegawallet.exe transaction send --wallet YOUR_WALLETNAME --pubkey YOUR_PUBLIC_KEY --network NETWORK_NAME ^
"{^
\"proposalSubmission\": {^
 \"rationale\": {^
  \"title\": \"Propose moving assets\",^
  \"description\": \"Here is a description about why I want to transfer\"^
 },^
 \"terms\": {^
  \"closingTimestamp\": \"10000000\",^
  \"enactmentTimestamp\": \"10000100\",^
  \"newTransfer\": {^
   \"changes\": {^
    \"sourceType\": \"ACCOUNT_TYPE_NETWORK_TREASURY\",^
    \"transferType\": \"GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT\",^
    \"amount\": \"10000000\",^
        \"asset\": \"ASSET_ID\",^
        \"fractionOfBalance\": `\"0.1\",^
        \"destinationType\": \"ACCOUNT_TYPE_REWARD_AVERAGE_POSITION\",^
        \"recurring\": {^
           \"startEpoch\": \"1111110\"^
          \"endEpoch\": \"1111111\"^
    }^
   }^
  },^
 }^
}^
}"
```
</TabItem>
</Tabs>

## Voting
All proposals are voted on by the community. To vote, community members need, at a minimum, the larger of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minVoterBalance" suffix="tokens" hideName={true} formatter="governanceToken" />, or <NetworkParameter formatter="governanceToken" frontMatter={frontMatter} param="spam.protection.voting.min.tokens" suffix="tokens" hideName={true} /> associated with their Vega key. 

Your proposal will need [participation](../../concepts/governance.md#how-a-proposals-outcome-is-calculated) of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredParticipation" formatter="percent" hideName={true} /> and a majority of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" formatter="percent" hideName={true} />, so having community support is essential.

Proposers who invite feedback, engage with comments, and make revisions to meet the needs of the community are more likely to be successful.

## Enactment
If successful, the proposal will be enacted at the time you specify in the `enactmentTimestamp` field.