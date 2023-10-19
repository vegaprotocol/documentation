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

Network-managed accounts that allow transfers require the community to approve transferring assets out of them. You can also propose that those assets are used to fund trading rewards by including those details into the proposal.

This tutorial describes what you need to propose transferring assets from those network-managed accounts to other accounts, and provides proposal templates that you will need to edit before submitting.

## Requirements

You will need:
* A connected [Vega wallet](../../tools/vega-wallet/index.md), with your wallet name and public key to hand
* A minimum of whichever is larger, associated with that public key: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideName={true} formatter="governanceToken" suffix="tokens"/>) or <NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideValue={true}/> (<NetworkParameter frontMatter={frontMatter} param="spam.protection.proposal.min.tokens" hideName={true} formatter="governanceToken" formatter="governanceToken" suffix="tokens"/>)
* Familiarity with how [proposing an asset transfer](../../concepts/governance.md#propose-an-asset-transfer) works

## Anatomy of an asset transfer proposal
Read on for the key inputs to a governance-initiated parameter proposal.

Transfers can be one-off, or they can be set up to send assets repeatedly, for as long as the account sending the assets has enough money to keep the transfers funded. Transfers to fund rewards must be recurring.

**Rationale** requires a title and a description. They are free-text fields that describe the purpose of the proposal. Within the description, include links with more information about your proposal (such as to the IPFS content or forum post) that voters can reference to learn more about the proposal.

The **terms** of the proposal describe the details of the proposal, including closing and enactment timestamps, and details about the proposed transfer, including what accounts the transfer is to move assets between, and optionally information about rewards to fund with the transfer, if that's the intent.
* **Closing timestamp**, the date and time when voting closes, must be within a range of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minClose" hideName={true}/> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxClose" hideName={true}/>, from when it was proposed.
* **Enactment timestamp**, the date and time when the transfer is to happen, must be within a range of <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minEnact" hideName={true}/> and <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxClose" hideName={true}/>.

For **one-off transfers** use `deliverOn` to set a delivery date/time for when the transfer arrives with the recipient account. `deliverOn` only accepts Unix time in nanoseconds. Setting it to 0 means the transfer will be completed immediately. Note: when you delay a transfer, the amount leaves the origin account immediately but is not delivered until the date/time you chose. A one-off transfer **cannot be cancelled**, regardless of when the transfer is scheduled to arrive.

For **recurring transfers**, such as for funding rewards, you'll need to include the following information: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of that epoch.
* `endEpoch`: The transfer will repeated indefinitely, unless you add this optional parameter to end the recurring transfer in a specified epoch.
* `factor`: Written as a decimal less than 1.0. Factor is used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount will be transferred each time.

**Amount** is the cap on how much will be transferred, as whole number with the asset decimal places implied. For example, if the asset has a decimal place of 2 and the transfer is for 100, then the amount needs to be set at 10000. The maximum you can propose to transfer is <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxAmount" hideName={true}/>. Before proposing, make sure the account you're transferring from exists and has a balance. The full amount may not be transferred if there isn't enough to transfer. For specifics on how the final amount is determined, see the [calculations in the transfers spec ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0057-TRAN-transfers.md#recurring-transfers).

**Fraction of balance** is used to determine what fraction of the source account's balance could be transferred, the biggest fraction that you can choose is <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.maxFraction" hideName={true}/>.

**Governance transfer type** lets you determine what happens if the full requested amount can't be transferred. The options are "all or nothing", or "best effort", which is as much as is possible of the maximum amount.

The **destination** field is used for all transfers *except* to fund rewards. 
* When transferring to a global network-managed account, use `0000000000000000000000000000000000000000000000000000000000000000`.
* When transferring to a market-specific network-managed account, use the market ID

### Fields used to fund trading rewards
Rewards can only be funded with recurring tranfers. If you're proposing a transfer to fund rewards, there are extra fields to define.

The `destinationType` must be the account type that matches the reward category. For example, to propose that the 'average position' reward will pay out, you'll need to set the "destination type" type as `ACCOUNT_TYPE_REWARD_AVERAGE_POSITION`, and then choose the complementary reward category, known as the `metric`. The asset you choose then determines which market(s) the reward targets.

You will need to define the dispatch strategy, which includes the  metric, the length of time to measure performance, the asset used to evaluate performance, and other fields. 

| Dispatch strategy field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `assetForMetric` | Asset that's used to evaluate how someone performs. Use the settlement asset for the market(s) relevant to the reward. Not required for market creation and validator ranking rewards | Any asset enabled on Vega |
| `metric` | Specific reward category the transfer is funding | DISPATCH_METRIC_MAKER_FEES_PAID; DISPATCH_METRIC_MAKER_FEES_RECEIVED; DISPATCH_METRIC_LP_FEES_RECEIVED; DISPATCH_METRIC_MARKET_VALUE; DISPATCH_METRIC_AVERAGE_POSITION; DISPATCH_METRIC_RELATIVE_RETURN; DISPATCH_METRIC_RETURN_VOLATILITY; DISPATCH_METRIC_VALIDATOR_RANKING |
| `markets` | Optional: Used to choose which market(s) are in scope. If left blank, all markets that are settled in the asset are included | Any trading market's ID |
| `staking_requirement` | Optional: Sets a minimum number of VEGA tokens that need to be staked for a party to be considered eligible for the reward | Number, if omitted it defaults to 0 |
| `notional_time_weighted_average_position_requirement` | Optional: Sets a minimum notional TWAP, measured for the asset metric, that's required for a party to be considered eligible to receive rewards | Defaults to 0 | 
| `windowLength` | Number of epochs in which performance against the reward metric is measured | Any number between 1 and 100 |
| `lock_period` | Number of epochs to keep earned rewards in the recipient's reward vesting account before moving to their vested account |
| `entityScope` | defines the entities within scope | Currently ENTITY_SCOPE_INDIVIDUALS is the only option |
| `individualScope` | To be used if the eligible reward recipients should be individuals, and that can then be further focused to determine who is eligible | Currently INDIVIDUAL_SCOPE_ALL is the only option |
| `distributionStrategy` | Sets how the participants should be ranked, and what other factors to consider. Read [distribution method](../trading-on-vega/fees-rewards.md#how-rewards-are-scaled) for more info |  DISTRIBUTION_STRATEGY_PRO_RATA; DISTRIBUTION_STRATEGY_RANK |

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

### Sample recurring transfer proposal to fund rewards

These templates show an example of how to fund rewards with a governance transfer. **To propose a different reward with a governance-initiated transfer, use the fields and information above to expand the proposal.**

* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

<Tabs groupId="transferForRewards">
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
          "dispatchStrategy": {
          "assetForMetric": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
          "metric": "DISPATCH_METRIC_MAKER_FEES_PAID",
          "windowLength": "1",
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
          "dispatchStrategy": {
          "assetForMetric": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
          "metric": "DISPATCH_METRIC_MAKER_FEES_PAID",
          "windowLength": "1",
          "entityScope": "ENTITY_SCOPE_INDIVIDUALS",
          "individualScope": "INDIVIDUAL_SCOPE_ALL",
          "distributionStrategy": "DISTRIBUTION_STRATEGY_PRO_RATA"
      }

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
          \"dispatchStrategy\": {^
          \"assetForMetric\": \"b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663\",^
          \"metric\": \"DISPATCH_METRIC_MAKER_FEES_PAID\",^
          \"windowLength\": \"1\",^
          \"entityScope\": \"ENTITY_SCOPE_INDIVIDUALS\",^
          \"individualScope\": \"INDIVIDUAL_SCOPE_ALL\",^
          \"distributionStrategy\": \"DISTRIBUTION_STRATEGY_PRO_RATA\"^
      }^

    }^
   }^
  },^
 }^
}^
}"
```
</TabItem>
</Tabs>

### Sample one-off transfer proposal

These templates show an example transfer from an asset's insurance pool to the insurance pool of a specific market, both of which need to use the same asset as specified in your transfer.

* JSON example that can be submitted with the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw)
* Command line examples for different operating systems

<Tabs groupId="transferAssetsParameter">
 <TabItem value="json" label="Governance dApp (JSON)">

```
{
  "proposalSubmission": {
    "rationale": {
      "title": "Transfer some assets once",
      "description": "Here is a description about why I want to transfer"
    },
    "terms": {
      "closingTimestamp": 1234567890,
      "enactmentTimestamp": 1334567890,
      "newTransfer": {
        "changes": {
          "sourceType": "ACCOUNT_TYPE_GLOBAL_INSURANCE",
          "transferType": "GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT",
          "amount": "10000000",
          "asset": "RELEVANT_ASSET_ID",
          "fractionOfBalance": "0.1",
          "destinationType": "ACCOUNT_TYPE_INSURANCE",
          "destination": "MARKET_ID_FOR_INSURANCE_ACCOUNT",
         "oneOff":{ 
            "deliverOn": 0
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
    "closingTimestamp": 1234567890,
    "enactmentTimestamp": 1334567890,
    "newTransfer": {
      "changes": {
      "fromAccountType": "ACCOUNT_TYPE_GLOBAL_INSURANCE",
      "transferType": "GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT",
      "amount": "10000000",
            "asset": "RELEVANT_ASSET_ID",
            "fractionOfBalance": "0.1",
            "destinationType": "ACCOUNT_TYPE_INSURANCE",
            "destination": "MARKET_ID_FOR_INSURANCE_ACCOUNT",
         "oneOff":{ 
            "deliverOn": 0
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
  \"closingTimestamp\": \"1234567890\",^
  \"enactmentTimestamp\": \"1334567890\",^
  \"newTransfer\": {^
   \"changes\": {^
    \"fromAccountType\": \"ACCOUNT_TYPE_GLOBAL_INSURANCE\",^
    \"transferType\": \"GOVERNANCE_TRANSFER_TYPE_BEST_EFFORT\",^
    \"amount\": \"10000000\",^
        \"asset\": \"RELEVANT_ASSET_ID\",^
        \"fractionOfBalance\": `\"0.1\",^
        \"destinationType\": \"ACCOUNT_TYPE_INSURANCE\",^
        \"destination\": \"MARKET_ID_FOR_INSURANCE_ACCOUNT\",^
        \"oneOff\": {^
        \"deliverOn\": \"0\"^
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