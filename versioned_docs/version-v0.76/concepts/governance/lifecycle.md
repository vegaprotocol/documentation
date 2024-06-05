---
sidebar_position: 2
title: Taking part
vega_network: MAINNET
hide_title: false
description: Understanding the governance lifecycle.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

## Voting
Proposals are enacted if they get enough votes from VEGA holders. There's no limit to how many active proposals you can vote on. 

Your tokens must be associated with a Vega public key. The tokens need to be associated to your Vega key, but they don't need to be nominated to validators. To check if your tokens are associated, connect to your Vega wallet on the [governance dApp ↗](https://governance.vega.xyz).

You can vote as soon as the proposal passes validation and is active, and it can be voted on until the proposal's closing date/time.

* How many tokens are associated with your voting key determines how much weight the vote has. For market parameter change proposals, the liquidity providers' market share is also taken into account. 
* Each Vega public key with a non-zero token balance gets one vote, and the key votes with the full weight of all the tokens associated to that key. You'll need to have tokens when the vote is submitted *and* when votes are counted, otherwise your vote is disregarded.
* Tokens used for voting are not locked or transferred: they can be used to nominate validators and to vote on other active proposals.
* While the voting period is open, you can change your vote, but only the most recent vote will count at the proposal's close.

## How a proposal's outcome is calculated 
* The network compares the weight of all valid votes cast as a percentage of the total weight that could vote, to the minimum participation requirement - `participation_rate = SUM (weightings of ALL valid votes cast) / max total weighting possible`
* The network compares the weight of all 'for' votes, as a percentage of the weight of all votes cast, to the required majority - `for_rate = SUM (weightings of votes cast for) / SUM (weightings of all votes cast)`
* If the minimum for both is reached, the proposal is enacted. If at least one is not reached, the proposal fails.

### Proposal outcome: Update market
For proposals to update a market, there are extra requirements. The market's liquidity providers can vote with their equity-like share without requiring tokenholder participation. However, if tokenholders vote and participation and majority requirements for this vote are met, then the tokenholders' votes can overrule the liquidity providers' votes.

The network will also calculate:
* The LP participation rate, which is the sum of the equity-like share of all LPs who cast a vote - `LP participation rate = SUM (equity-like share of all LPs who cast a vote)`
* The rate of 'for' votes cast by liquidity providers, calculated as the sum of all who voted 'for', divided by the LP participation rate - `LP for rate = SUM (all who voted for) / LP participation rate`

The proposal will pass if one of the two scenarios occur: 
1. The tokenholder vote meets or exceeds the minimum set by <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarketParam.requiredParticipation" hideValue={true} />, and the votes in favour are greater than the amount set by <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarketParam.requiredMajority" hideValue={true} />. In this case the market's liquidity providers were overridden by governance token holders.
2. The governance tokenholder vote does not reach participation threshold, but the liquidity providers' votes do, and there are enough votes in favour. The participation rate must be greater than/equal to <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarketParam.requiredParticipation" hideValue={true} />, and the liquidity providers' participation rate must be greater than/equal to <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarketParam.requiredParticipationLP" hideValue={true} />, and the liquidity providers' votes in favour is greater than/equal to <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarketParam.requiredMajorityLP" hideValue={true} />

### Proposal outcome: Successor market
For proposals adding a new successor market, the outcome of the proposal can change even after it's been approved. 

If a parent market is still in its proposed state, its successor market cannot be enacted, even if it passes the vote.

Two proposals that name the same parent can be submitted and pass a governance vote. Whichever market clears its [opening auction](../trading-on-vega/trading-modes.md#auction-type-opening) first gets the share of the insurance pool, and the liquidity providers' equity-like share is moved to that market. The second market will then be [rejected](../trading-on-vega/market-lifecycle.md#market-status-rejected).

## Lifecycle of a governance proposal
You need community support if you want to change something about the network, whether that's to add a new market, change a network parameter, or transfer pooled assets. It's worth considering what your proposed change contributes to the network, and if it would get enough votes from fellow tokenholders.

You'll have a better chance of positively contributing to the network if you confirm there is support off-chain before submitting a proposal.

### 1. Sense checking proposal idea (off-chain)
Before submitting a proposal, share an outline of your proposed action informally in a new topic on the [community forum ↗](https://community.vega.xyz/c/governance/25/) Governance Proposals section, with a "sense-check" tag. You can find out if there is enough interest in your proposal.

Proposals can be submitted for creating a new market, amending an existing market, changing network parameters, adding an external asset to Vega, transferring out of asset pools. You can also suggest changes that won't impact network behaviour with a freeform proposal.

### 2. Formalising proposal (off-chain)
Once the proposal details are refined, share the detailed proposal in the same topic you created for your sense check, and change the tag to "formalise". 

Including as much detail as possible gives other community members the opportunity to fully understand your proposal. Include the rationale for the proposal (and IPFS hash for more details), the specifics of the proposed addition/change, and the data (JSON or similar) that would be submitted on-chain. Invite debate and discussion to amend the proposal until it reaches a final state, ready to submit.

When formalising the proposal, it is worth ensuring that any fields that are dependent on a range set by network parameters are correctly defined. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.vega.xyz/network-parameters).

### 3. Submitting proposal and telling the community (on-chain and off-chain)
You can submit a governance proposal to the network using the command line, a script, or the [governance dApp ↗](https://governance.vega.xyz/proposals/propose/raw).

Your Vega key must have enough VEGA associated to submit a proposal. For a 'market parameter change' proposal, you'll also need enough equity-like share in the market from your liquidity commitment. This is defined in the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" />.

Proposals are first checked by the wallet, then verified by the nodes before entering into the voting period you set. A proposal must have all of the relevant information, in the correct format, and in some cases within the accepted range - otherwise it will be rejected immediately.

A proposal cannot be changed once it's submitted to the network.

After it's submitted and accepted, rally the community to vote on the proposal by announcing it on the [forum ↗](https://community.vega.xyz/), [Discord ↗](https://vega.xyz/discord), and through your own networks to vote on the proposal.

:::tip Try it out 
**[Proposals guides](../../tutorials/proposals/index.md)**: How to build and then submit a proposal using the command line. 
:::

#### Validating a proposal
* The governance proposal is checked and then accepted by the wallet as a transaction.
* The validator nodes then check and validate the proposal. This is when the proposal data that defines the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated against the network's requirements, defined by [network parameters ↗](https://explorer.vega.xyz/network-parameters), which are different depending the type of proposal.
* If not specified on the proposal, the required participation rate and majority for success are defined and copied to the proposal. You can find them under the [network parameters ↗](https://explorer.vega.xyz/network-parameters), and they are specific to each proposal type.
* If the above conditions are not met, the proposal will be rejected and will not be available for a vote. **You'll need to fix and re-submit the proposal.**

### 4. Voting (on-chain)
VEGA tokenholders - including those who submitted a proposal - can vote for or against any active proposals, with the full weight of the tokens associated with each public key.

Read more about [voting](#voting-on-proposals).

### 5. Enacting changes (on-chain)
If a proposal receives enough token weight in favour within the enactment period, the change/addition is accepted (except for a freeform proposal), and will be enacted on the enactment date defined in the proposal.

Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter for each proposal type) after voting closes. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.vega.xyz/network-parameters).

## Submitting proposals in a batch
You can submit governance proposals individually, or batch up the proposed changes into one proposal.

When a batch proposal goes up for the vote, each proposed change within the batch needs to pass based on its own voting requirements. For example, if the batch includes a market change, the equity-like share voting rules apply to that specific change.

Every proposed change in the batch needs to pass its voting requirements, or the whole batch fails.

The batch proposal only has one rationale field, as well as one closing timestamp, for the whole set of proposals, so the description should describe why each change is being proposed. Each enactment timestamp needs to work with the single closing timestamp chosen for the batch.

## Thresholds set by network parameters
Certain governance parameters need to be within a defined range, but offer some flexibility.

When a submitted governance proposal is validated, the values chosen will be checked to ensure they fit within the thresholds, which themselves are defined by network parameters.

Each type of governance proposal can have different thresholds, though they fit into broader categories. Those categories include:

* `minProposerBalance`: Minimum amount of VEGA that a proposer needs to have associated with their Vega key to have the proposal accepted for a tokenholder vote
* `minClose`: Minimum amount of time before a proposal can be closed for voting 
* `maxClose`: Maximum amount of time a proposal can be open for voting 
* `minEnactment`: Minimum time allowed between vote closing on a proposal and the proposal's change being enacted on the network
* `maxEnactment`: Maximum time allowed between vote closing on a proposal and the proposal's change being enacted on the network
* `requiredParticipation`: Minimum number of tokens that must vote for a proposal to pass 
* `requiredMajority`: Minimum majority that a proposal's 'yes' votes must reach for it to be enacted 

As these thresholds are network parameters, their values can be changed through governance.

:::tip Query for data
**[Block explorer ↗](https://explorer.vega.xyz)**: See the current network parameter values (in some cases, different per network). 

**[REST](../../api/rest/state/core-state-service-list-network-parameters.api.mdx)** The API provides the network parameters and their values.
:::

### Example
Consider a network parameter that specifies the proportion of fees that goes to validators (<NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" />). Each of the following thresholds would need to be met:

* <NetworkParameter frontMatter={frontMatter} name="Minimum length of voting period" param="governance.proposal.updateNetParam.minClose" />
* <NetworkParameter frontMatter={frontMatter} name="Maximum length of voting period" param="governance.proposal.updateNetParam.maxClose" />
* <NetworkParameter frontMatter={frontMatter} name="Minimum time to enactment" param="governance.proposal.updateNetParam.minEnact" />
* <NetworkParameter frontMatter={frontMatter} name="Maximum time to enactment" param="governance.proposal.updateNetParam.maxEnact" />
* <NetworkParameter frontMatter={frontMatter} name="Required participation" param="governance.proposal.updateNetParam.requiredParticipation" formatter="percent" />
* <NetworkParameter frontMatter={frontMatter} name="Required majority" param="governance.proposal.updateNetParam.requiredMajority" formatter="percent" />
* <NetworkParameter frontMatter={frontMatter} name="Proposer must have" param="governance.proposal.updateNetParam.minProposerBalance" formatter="governanceToken" suffix='tokens' />
