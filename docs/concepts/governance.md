---
sidebar_position: 3
title: Governance
vega_network: TESTNET
hide_title: false
description: Governance allows for on-chain decision making by tokenholders.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Vega supports on-chain proposals for creating markets and assets, changing network parameters, markets and assets, and transferring assets between some network-managed accounts. Vega also supports freeform proposals for community suggestions that will not be enacted on-chain.

Taking part in governance by voting, or by proposing additions/changes with community support, is a way for tokenholders and community members to contribute to improve the network, and to add value for other network participants.

## Voting on proposals
Proposals only get enacted if they get enough votes from VEGA tokenholders. There's no limit to how many active proposals they can vote on. 

To vote, your tokens must be associated with a Vega public key. It's not necessary to have those tokens nominated to validators, but the tokens must be associated to the Vega key used for voting.

You can vote on a proposal as soon as it passes validation and is active, and it can be voted on until the proposal's closing date/time.

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

Two proposals that name the same parent can be submitted and pass a governance vote. Whichever market clears its [opening auction](./trading-on-vega/trading-modes.md#auction-type-opening) first gets the share of the insurance pool, and the liquidity providers' equity-like share is moved to that market. The second market will then be [rejected](./trading-on-vega/market-lifecycle.md#market-status-rejected).

:::tip Try it out
**[Vega governance dApp ↗](https://governance.fairground.wtf)**: Vote on active proposals.
:::

## Lifecycle of a governance proposal
You need community support if you want to change something about the network, whether that's to add a new market, change a network parameter, or transfer pooled assets. It's worth considering what your proposed change contributes to the network, and if it would get enough votes from fellow tokenholders.

You'll have a better chance of positively contributing to the network if you confirm there is support off-chain before submitting a proposal.

### 1. Sense checking proposal idea (off-chain)
Before submitting a proposal, share an outline of your proposed action informally in a new topic on the [community forum ↗](https://community.vega.xyz/c/governance/25/) Governance Proposals section, with a "sense-check" tag. You can find out if there is enough interest in your proposal.

Proposals can be submitted for creating a new market, amending an existing market, changing network parameters, adding an external asset to Vega, transferring out of asset pools. You can also suggest changes that won't impact network behaviour with a freeform proposal.

### 2. Formalising proposal (off-chain)
Once the proposal details are refined, share the detailed proposal in the same topic you created for your sense check, and change the tag to "formalise". 

Including as much detail as possible gives other community members the opportunity to fully understand your proposal. Include the rationale for the proposal (and IPFS hash for more details), the specifics of the proposed addition/change, and the data (JSON or similar) that would be submitted on-chain. Invite debate and discussion to amend the proposal until it reaches a final state, ready to submit.

When formalising the proposal, it is worth ensuring that any fields that are dependent on a range set by network parameters are correctly defined. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.fairground.wtf/network-parameters).

### 3. Submitting proposal and telling the community (on-chain and off-chain)
You can submit a governance proposal to the network using the command line, a script, or the [governance dApp ↗](https://governance.fairground.wtf/proposals/propose/raw).

Your Vega key must have enough VEGA associated to submit a proposal. For a 'market parameter change' proposal, you'll also need enough equity-like share in the market from your liquidity commitment. This is defined in the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" />.

Proposals are first checked by the wallet, then verified by the nodes before entering into the voting period you set. A proposal must have all of the relevant information, in the correct format, and in some cases within the accepted range - otherwise it will be rejected immediately.

A proposal cannot be changed once it's submitted to the network.

After it's submitted and accepted, rally the community to vote on the proposal by announcing it on the [forum ↗](https://community.vega.xyz/), [Discord ↗](https://vega.xyz/discord), and through your own networks to vote on the proposal.

:::tip Try it out 
**[Proposals guides](../tutorials/proposals/index.md)**: How to build and then submit a proposal using the command line. 
:::

#### Validating a proposal
* The governance proposal is checked and then accepted by the wallet as a transaction.
* The validator nodes then check and validate the proposal. This is when the proposal data that defines the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated against the network's requirements, defined by [network parameters ↗](https://explorer.fairground.wtf/network-parameters), which are different depending the type of proposal.
* If not specified on the proposal, the required participation rate and majority for success are defined and copied to the proposal. You can find them under the [network parameters ↗](https://explorer.fairground.wtf/network-parameters), and they are specific to each proposal type.
* If the above conditions are not met, the proposal will be rejected and will not be available for a vote. **You'll need to fix and re-submit the proposal.**

### 4. Voting (on-chain)
VEGA tokenholders - including those who submitted a proposal - can vote for or against any active proposals, with the full weight of the tokens associated with each public key.

Read more about [voting](#voting-on-proposals).

### 5. Enacting changes (on-chain)
If a proposal receives enough token weight in favour within the enactment period, the change/addition is accepted (except for a freeform proposal), and will be enacted on the enactment date defined in the proposal.

Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter for each proposal type) after voting closes. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.fairground.wtf/network-parameters).

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
**[Block explorer ↗](https://explorer.fairground.wtf)**: See the current network parameter values (in some cases, different per network). 

**[REST](../api/rest/state/core-state-service-list-network-parameters.api.mdx)** The API provides the network parameters and their values.
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

## Submitting proposals in a batch
You can submit governance proposals individually, or batch up the proposed changes into one proposal.

The only thing that can't be proposed in a batch is adding a new asset - that needs to be a proposal on its own.

When a batch proposal goes up for the vote, each proposed change within the batch needs to pass based on its own voting requirements. For example, if the batch includes a market change, the equity-like share voting rules apply to that specific change.

Every proposed change in the batch needs to pass its voting requirements, or the whole batch fails.

The batch proposal only has one rationale field, as well as one closing timestamp, for the whole set of proposals, so the description should describe why each change is being proposed. Each enactment timestamp needs to work with the single closing timestamp chosen for the batch.

## Asset governance
Assets need to be proposed and pass a governance vote before they can be used on the Vega network.

The protocol currently supports adding ERC-20 assets. Those ERC-20 assets that are successfully validated and pass a governance vote are can be enabled via the Vega bridge. In practice, that means that assets on Vega are deposited from and withdrawn to Ethereum.

After a new asset vote passes, the change has to be submitted to the asset bridge on Ethereum. Until it has been submitted, no one can start depositing that asset. 

Certain asset details can also be changed through a governance proposal. While the [contract-level details](./assets/asset-framework.md#contract-level-details) are immutable, the [protocol-level details](./assets/asset-framework.md#protocol-level-details) can be changed.

:::note Learn more
See the tutorials to: 
* [Propose a new asset](../tutorials/proposals/new-asset-proposal.md)
* [Propose an update to an asset](../tutorials/proposals/update-asset-proposal.md)
:::

### ERC-20 asset validation
When adding an ERC-20 asset to the bridge, the key details are compared to the smart contract on Ethereum. 

Specifically:
* The contract must be an ERC-20 asset
* The name and symbol must match the contract
* There cannot be multiple assets on a Vega network for the same ERC-20 asset

### Transferring assets
For assets that are held in certain accounts - those with pooled assets, the community determines if the assets should be moved, and how they should be used. Generally speaking, those accounts have accumulated assets from settled markets, market protection movements, or are entirely funded by community members that transfer assets into them.

These proposals give community members a chance to determine what they think the assets should be spent on, whether that's to fund [trading or validator rewards](./trading-on-vega/discounts-rewards.md#trading-rewards), to move money from [insurance pools](./assets/accounts.md#insurance-pool-accounts) into [network treasury accounts](./assets/accounts.md#network-treasury-accounts), or for other purposes.

Transferring assets from network-managed account types can only be initiated by on-chain governance proposals. 

The transfers from those asset pools can be one-off or recurring. A recurring transfer that's initiated by governance can only be cancelled when a governance proposal to cancel it is submitted and passes the governance vote.

To see a full table of which types of transfers can only be initiated through governance, see the [transfers page](./assets/transfers.md#governance-initiated-transfers).

:::info Read more
* [Transfers](./assets/transfers.md)
* [Tutorial: Propose transferring assets](../tutorials/proposals/asset-transfer-proposal.md)
:::

### Propose an asset transfer
Tokenholders can propose asset transfers from certain accounts, which then need to be voted on by other tokenholders. Not all transfers need to be proposed by governance.

The proposer will need to have at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the market, and staked to a validator. Note, this amount is set through the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.minProposerBalance" hideValue={true} />.

If the proposal gets a <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" hideName={true} formatter="percent"/> majority of tokenholder support, then it will be enacted. The required majority is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredMajority" hideValue={true} />. It would also need to pass the required participation threshold: <NetworkParameter frontMatter={frontMatter} param="governance.proposal.transfer.requiredParticipation" hideName={true} formatter="percent" />.

To propose assets be transferred, you'll need to provide the details required for the transfer to be successful. While some of the fields are free-text, others are constrained by a range set through network parameters, to ensure that the values provided are fit for purpose.

Proposal fields include:
* Source account type: The type of account that the assets are to be transferred from, such as the network treasury
* Source: The actual account ID. For network treasury, leave it blank.
* Asset: Asset to transfer
* Transfer type, which can be 'all or nothing' or 'best effort'
  * All or nothing: Transfers the specified amount, or nothing 
  * Best effort: Transfers the specified amount or the max allowable amount if it's less than the specified amount
* Amount: Maximum amount to transfer; can be used to add an upper limit the fractional amount described below
* Fraction of balance: Maximum fraction of the source account's balance to transfer, submitted as a decimal (i.e. 0.1 = 10% of the balance)
* Destination type: Type of account to transfer to, such as reward pool, individual party, market insurance pool
* Destination: Specific account to transfer to, using an ID or public key. For network treasury, leave it blank.
* If the proposal is for a one-off transfer, it can optionally define a time, based on Vega time, for delivery. If there is no delivery time, it will execute immediately
* If the proposal is for a recurring transfer, it must include a start epoch. It can optionally include an end epoch for the last transfer

#### Calculating amount to be transferred
The final amount transferred is determined based on the inputs into the proposal as well as the values of the relevant network parameters:
* <NetworkParameter frontMatter={frontMatter} param="governance.transfer.max.amount" /> specifies the maximum amount that can be transferred from a source account in a proposal
* <NetworkParameter frontMatter={frontMatter} param="governance.transfer.max.fraction" /> specifies the maximum fraction of the balance that can be transferred from a source account.

The final amount is calculated with the following formula:

```
  transfer_amount = min(
    proposal.fraction_of_balance * source.balance,
    proposal.amount,
    governance.transfer.max.amount,
    governance.transfer.max.fraction * source.balance )
```

## Market governance
Markets are proposed and voted into existence by Vega tokenholders. The parameters for a market all need to be defined in the proposal.

Some market parameters can also be changed. They can only be proposed by a liquidity provider with enough equity-like share in the market, and need to be voted for by a sufficient number of tokenholders and/or liquidity providers.

When creating a market governance proposal, whether it is for a new futures market, a new perpetual futures market, or to change parameters for an existing market, it's recommended that you sense check the proposal and share the final details with the tokenholder community before proposing, so that you can garner support and make any necessary amends. 

Read more:
* [Vega community forum ↗](https://community.vega.xyz): Share your draft proposals for community discussion.
* [New perpetual futures market proposal ↗](../tutorials/proposals/new-perpetuals-market.md): Guide to submitting a proposal for a new market
* [New futures market proposal ↗](../tutorials/proposals/new-market-proposal.md): Guide to submitting a proposal for a new market
* [New successor market proposal ↗](../tutorials/proposals/new-successor-market-proposal.md): Guide to submitting a proposal for a new successor market
* [Update market proposal ↗](../tutorials/proposals/update-market-proposal.md): Guide to submitting a proposal to change a market using the command line

### Propose a new market
Tokenholders can propose new markets, which then need to be voted on by other tokenholders. The proposer will need to have at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the market, and staked to a validator. Note, this amount is set through the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideValue={true} />.

If the market proposal gets a <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" hideName={true} formatter="percent"/> majority of tokenholder support, then it will be enacted. The required majority is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" hideValue={true} />.

To propose a market, you'll need to provide the details required for the market to begin trading right away. While some of the fields are free-text, others are constrained by a range set through network parameters, to ensure that the values provided are fit for purpose.

Required fields include:
* Instrument details, including a human-readable name, an understandable shortcode for the market, the type of product
* Risk model parameters
* Product specifics including the settlement asset and quote name
* Decimal places for the market and positions. (Note: A market cannot specify more decimal places than its settlement asset supports)
* Oracle details, including the oracle's public key, specifications for settlement price, and data filters
* Liquidity monitoring parameters, including the target stake
* Method for setting liquidity fees, such as constant, marginal cost or stake-weighted average

Optional fields include: 
* Metadata so that people can easily interpret the market's details - while this is optional, it's highly recommended that you include metadata for the market
* Price monitoring parameters, including the triggers covering the horizon, probability and auction extension time. If left blank these parameters will default to the values set in the network parameters

:::note Read more
* [New market proposal tutorial](../tutorials/proposals/new-market-proposal.md)
* [Data sources](./trading-on-vega/data-sources.md)
* [Liquidity monitoring parameters](./trading-on-vega/market-protections.md#liquidity-monitoring)
* [Price monitoring parameters](./trading-on-vega/market-protections.md#price-monitoring)
:::

### Risk models and parameters
When proposing a market, the market proposer will need to choose the risk parameters associated with the risk model that's appropriate for the instrument. The acceptable amount of volatility on a market is driven by its risk model. The risk model is essential for calculating margins on the market. 

The [log-normal risk model](#log-normal-risk-model) is the only one currently supported. While the model is pre-defined, you'll need to choose the individual parameters.

You should choose parameters that ensure the risk model adequately represents the dynamics of the underlying instrument, and that the resulting margins strike the right balance between prudence and capital efficiency.

Below are the risk parameters, the accepted values for each parameter and suggested values for some. When suggested values are provided, these should be used as a reference point and to aid in deciding on what's appropriate for the market, not in place of rigorous analysis and calibration.

Model-independent parameters used in margin calculation are:

* `Risk aversion lambda` - probability confidence level used in [expected shortfall ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf#page=7) calculation when obtaining the maintenance margin level. This enters the margin calculation as follows. First, the value at risk, defined by confidence lambda is calculated. This is the cash amount that one would need to add to the position to make the probability of the value of the position and cash going negative after time tau to be less than lambda. The margin is then the expected loss of the position given that it incurred a loss bigger than the value at risk. 
  * accepted values: **strictly greater than 0 and strictly smaller than 1**
  * suggested value: `0.00001`
* `Tau` - projection horizon measured as a year fraction used in the expected shortfall calculation to obtain the maintenance margin:
  * accepted values: **any strictly non-negative real number**,
  * suggested value: `0.000114077116130504` - corresponds to one hour expressed as year fraction
* `Risk free rate` - annualised growth rate of the risk-free asset, it's used for discounting of future cash flows:
  * accepted values: **any real number**,
  * suggested value: `0`.

The remaining, model specific parameters are covered below.

:::note Go deeper
**[Margins and Credit Risk on Vega ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf)**: Note, a position size of 1 is assumed throughout the research paper.
:::

#### Log-normal risk model
The log-normal model assumes that the logarithm of the price increments are normally distributed. The main model parameter is: 
* `Volatility (Sigma)` - annualised historical volatility of the underlying asset:
  * accepted values: **any strictly non-negative real number**,
  * suggested value: asset dependent, should be derived from the historical time-series of prices, and a typical value would be 0.8 = 80%

Another parameter is
* `Mu` - annualised growth rate of the underlying asset:
  * accepted values: **any real number**,
  * suggested value: in almost all situations `0` is the value to use

### Propose a successor market
A successor market is a market that will carry on after the original market, or parent, that it is based on has settled - though a parent and successor market can be active simultaneously. Proposing a new successor market that follows from an existing market offers liquidity providers the option to keep their [equity-like share](./liquidity/rewards-penalties.md#how-liquidity-fees-are-split) on the new market, even when the original market expires. Creating an entirely new market with no parent doesn't offer the same benefit.

Each market can have only one active successor. A successor market can also be a parent market.

In terms of the proposal format, there are only two differences between a succesor market proposal and that for a regular market, and one field that ties the successor to the parent market.
* Parent market ID: Required to define the proposal as for a successor market
* Insurance pool percentage: Required percentage of the parent market's insurance pool, up to 100%, can be earmarked for transfer to the successor market. It is submitted as a number between and including 0 and 1, which represents the factor for the percentage.
* Settlement asset validation: The settlement asset needs to match that of the parent market

For a successor market to be enacted, the parent market must be in one of the following states: proposed, pending, active, suspended or trading terminated. 

The parent market can be settled or cancelled when the successor market reaches enactment time, as long as the time it's been settled/cancelled is equal to or less than the parent market's settlement time plus the `market.liquidity.successorLaunchWindowLength` - determined by a network parameter. This parameter specifies for how long after a market has settled, the liquidity provider's equity-like share data are retained and the insurance pool is left undistributed to allow a successor to be defined. If the successor is proposed after that time, then it's rejected and any assets committed to the market are returned.

### Propose updates to a market
Most details about a market can be changed through governance. Those includes risk models, monitoring triggers, and the settlement and termination (if applicable) data sources.

However, there are a few that cannot be edited, and will be the same for the duration of the market's life.
* Name: Market name, which should be a short, descriptive and relevant name
* Settlement asset: Asset used for margin, liquidity, and to settle positions
* Decimal places/precision for:
  * Market - Sets the smallest price increment on the book. A market cannot specify more decimal places than its settlement asset supports
  * Position - Precision of the position size

### Propose a change to a market's state
Markets can be suspended, resumed from being suspended, and terminated using governance proposals.

Suspending a market puts the market into an auction-only state. A market can be suspended for an indefinite amount of time, and it may never come out of suspension. 

A suspended market can only open to normal trading again if a proposal to resume the market is proposed and enacted.

Markets that are terminated are closed to trading forever. When a proposal to terminate a market is enacted, it ends all trading on the market, settles all positions, and closes the market completely. The termination proposal includes a final price that's used to settle all open positions.

:::tip Try it out
[Tutorial: Propose a change to a market's state](../tutorials/proposals/market-state-proposal.md)
:::

## Network parameter governance
There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals to change the values of existing network parameters.

Network parameters can only be added and removed with Vega core software releases.

:::note Go deeper
* [Concept: Network parameters](../concepts/vega-chain/network.md#parameters)
* [Network parameters: See full list on the block explorer ↗](https://explorer.fairground.wtf/network-parameters)
* [Tutorial: Propose a network parameter change](../tutorials/proposals/network-parameter-proposal.md)
:::

### Suggested ranges for parameters
Some network parameters have minimum/maximum boundaries to ensure they aren't supplied with nonsensical values. The table below contains those parameters, to be used as guidance when proposing changes to any of those parameters.

| Parameter name                                    | Minimum/Maximum |
|---------------------------------------------------|-----------------|
| `reward.staking.delegation.competitionLevel`      | Minimum value 1 (inclusive), no maximum. |
| `governance.proposal.(TYPE).minEnact`             | Must be greater than / equal to the corresponding `minClose`, proposal can't be enacted before voting on it has closed. |
| `governance.proposal.(TYPE).requiredMajority`     | Minimum 0.0, maximum 1.0. Is multiplied by 100 to get percentage. |
| `governance.proposal.(TYPE).requiredParticipation`| Minimum 0.0, maximum 1.0. Is multiplied by 100 to get percentage. |
| `rewards.activityStreak.benefitTiers`: `reward_multiplier` | Minimum 1.0. |