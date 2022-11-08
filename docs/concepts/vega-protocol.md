---
sidebar_position: 2
title: Vega Protocol
vega_network: TESTNET
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import Topic from '/docs/topics/_topic-governance.mdx'

# Vega Protocol

## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Vega supports on-chain proposals for creating markets and assets, and changing network parameters, markets and assets. Vega also supports freeform proposals for community suggestions that will not be enacted on-chain. 

Taking part in governance by voting, or by proposing additions/changes with community support, is a way for tokenholders and community members to contribute to improve the network, and to add value for other network participants.

:::tip Try it out 
Try out proposing markets using [Fairground ↗](https://fairground.wtf), Vega's testnet. 
:::

### Lifecycle of a governance proposal 
Proposing an addition or change to the network requires community support. It's worth considering what it contributes to the network, and if it would have enough support to pass a governance vote. You'll have a better chance of positively contributing to the network if you confirm there is support off-chain before submitting a proposal.

#### 1. Sense checking proposal idea (off-chain)
Before submitting a proposal, it's recommended that you share an outline of your proposed action informally in a new topic on the [community forum ↗](https://community.vega.xyz/c/governance/25/) Governance Proposals section, with a "sense-check" tag. You can find out if there is sufficient interest in making a change.

Proposals can be submitted for creating a new market, amending an existing market, changing network parameters, adding an external asset to Vega and making a freeform proposal (for changes that will not change network behaviour).

#### 2. Formalising proposal (off-chain)
Once the proposal details are refined, share the detailed proposal in the same topic you created for your sense check, and change the tag to "formalise". 

Including as much detail as possible gives other community members the opportunity to fully understand your proposal. Include the rationale for the proposal (and IPFS hash for more details), the specifics of the proposed addition/change, and the data (JSON or similar) that would be submitted on-chain. Invite debate and discussion to amend the proposal until it reaches a final state, ready to submit.

When formalising the proposal, it is worth ensuring that any fields that are dependent on a range set by network parameters are correctly defined. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.fairground.wtf/network-parameters).

#### 3. Submitting proposal and telling the community (on-chain and off-chain)
Tokenholders can submit a governance proposal to the network using the command line or via a script. 

The Vega public key of the proposer must have enough VEGA staked to submit a proposal. For a 'market parameter change' proposal, the proposer must also have enough equity-like share in the market from their liquidity commitment, which is defined in the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.updateMarket.minProposerEquityLikeShare" />.

Proposals are first checked by the wallet, then verified by the nodes before entering into the voting period you set. A proposal must have all of the relevant information, in the correct format, and in some cases within the accepted range - otherwise it will be rejected immediately. 

A proposal is immutable once entered.

Once a proposal is submitted and accepted, rally the community to vote on the proposal by announcing it on the [forum ↗](https://community.vega.xyz/), [Discord ↗](https://vega.xyz/discord), and through your own networks to vote on the proposal.

:::tip Try it out 
Read the **[proposals guides](../tutorials/proposals/)** to see what information needs to be in a proposal, and how to submit them using the command line. 
:::

##### Validating a proposal
* The governance proposal is checked and then accepted by the wallet as a transaction.
* The validator nodes then check and validate the proposal. This is when the proposal data that defines the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated against the network's requirements, defined by [network parameters ↗](https://explorer.fairground.wtf/network-parameters), which are different depending the type of proposal.
* If not specified on the proposal, the required participation rate and majority for success are defined and copied to the proposal. You can find them under the [network parameters ↗](https://explorer.fairground.wtf/network-parameters), and they are specific to each proposal type.
* If the above conditions are not met, the proposal will be rejected and will not be available for a vote. **You'll need to fix and re-submit the proposal.**

#### 4. Voting 
VEGA tokenholders can vote for or against any active proposals, as long as the tokens they want to vote with are associated with their key. It's not necessary to nominate validators, but the tokens must be associated to the Vega key used for voting. 

* The number of tokens associated with the voting key determines how much weight the vote has (and for 'market parameter change' proposals, liquidity providers' market share is also taken into account). 
* Each Vega public key with a non-zero token balance gets one vote, and the key votes with the full weight of all the tokens that key has staked.
* Tokens used for voting are not locked or transferred: they can be used for staking as well as for voting on any/all active proposals.
* While the voting period is open, a public key can vote multiple times, but only the most recent vote will count at the proposal's close.
* The Vega key used for voting will need to have more than 0 tokens when a vote is submitted, as well as when votes are counted at the proposal's closing date/time, otherwise the vote is disregarded.

##### How the outcome is calculated 
* The network compares the weight of all valid votes cast as a percentage of the total weight that could vote, to the minimum participation requirement - `participation_rate = SUM (weightings of ALL valid votes cast) / max total weighting possible`
* The network compares the weight of all 'for' votes, as a percentage of the weight of all votes cast, to the required majority - `for_rate = SUM (weightings of votes cast for) / SUM (weightings of all votes cast)`
* If the minimum for both is reached, the proposal is enacted. If at least one is not reached, the proposal fails.

For proposals to change market parameters, there are additional requirements. The market's liquidity providers can vote with their equity like share without requiring tokenholder participation. However, if tokenholders vote and participation and majority requirements for this vote are met, then the tokenholders' votes can overrule the liquidity providers' votes.

The network will also calculate:
* The LP participation rate, which is the sum of the equity like share of all LPs who cast a vote - `LP participation rate = SUM (equity like share of all LPs who cast a vote)`
* The rate of 'for' votes cast by liquidity providers, calculated as the sum of all who voted 'for', divided by the LP participation rate - `LP for rate = SUM (all who voted for) / LP participation rate`
    
:::tip Try it out
Vote on active proposals on the **[Vega token dApp ↗](https://token.fairground.wtf/governance)**.
:::

#### 5. Enacting changes
If a proposal receives enough token weight in favour within the enactment period, the change/addition is accepted (except for a freeform proposal), and will be enacted on the enactment date defined in the proposal.

Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter for each proposal type) after voting closes. See the network parameters and their values on the [Vega block explorer ↗](https://explorer.fairground.wtf/network-parameters).

### Thresholds set by network parameters
Governance requires that certain parameters need to be within a defined range, but offer some flexibility.

When validating a governance proposal, the values chosen in the proposal will be checked to ensure they fit within the thresholds defined by the network parameters.

Each type of governance proposal can have different thresholds, though they fit into broader categories. Those categories include:

* `minProposerBalance`: minimum amount of VEGA that a proposer needs to have associated with their Vega key to have the proposal accepted for a tokenholder vote
* `minClose`: minimum amount of time before a proposal can be closed for voting 
* `maxClose`: maximum amount of time a proposal can be open for voting 
* `minEnactment`: minimum time allowed between vote closing on a proposal and the proposal's change being enacted on the network
* `maxEnactment`: maximum time allowed between vote closing on a proposal and the proposal's change being enacted on the network
* `requiredParticipation`: minimum number of tokens that must vote for a proposal to pass 
* `requiredMajority`: minimum majority that a proposal's 'yes' votes must reach for it to be enacted 
  
Importantly, these `minimum` levels are themselves network parameters, and therefore can be changed through governance.

:::tip Query for data
See the current values (in some cases, different per network) on the [block explorer](https://explorer.fairground.wtf). 

Otherwise, [use REST](../api/rest/state/core-state-service-list-network-parameters.api.mdx) to see the network parameters and their values.
:::

#### Example
Consider a network parameter that specifies the proportion of fees that goes to validators (<NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" />), with change thresholds:

* <NetworkParameter frontMatter={frontMatter} name="Minimum length of voting period" param="governance.proposal.updateNetParam.minClose" />
* <NetworkParameter frontMatter={frontMatter} name="Maximum length of voting period" param="governance.proposal.updateNetParam.maxClose" />
* <NetworkParameter frontMatter={frontMatter} name="Minimum time to enactment" param="governance.proposal.updateNetParam.minEnact" />
* <NetworkParameter frontMatter={frontMatter} name="Maximum time to enactment" param="governance.proposal.updateNetParam.maxEnact" />
* <NetworkParameter frontMatter={frontMatter} name="Required participation" param="governance.proposal.updateNetParam.requiredParticipation" formatter="percent" />
* <NetworkParameter frontMatter={frontMatter} name="Required majority" param="governance.proposal.updateNetParam.requiredMajority" formatter="percent" />
* <NetworkParameter frontMatter={frontMatter} name="Proposer must have" param="governance.proposal.updateNetParam.minProposerBalance" formatter="governanceToken" suffix='tokens' />

A proposal to change the <NetworkParameter frontMatter={frontMatter} hideValue={true} param="transfer.fee.factor" />, would need to pass all of the thresholds listed above.

## Asset governance
Details on asset governance to come. 

See the proposal tutorials to: 
* [Propose a new asset](../tutorials/proposals/new-asset-proposal.md)
* [Propose an update to an asset](../tutorials/proposals/update-asset-proposal.md)

<!--
### New asset proposal [WIP]
-->

## Market governance
Markets are proposed and voted into existence by Vega tokenholders. The parameters for a market all need to be defined in the proposal.

Some market parameters can also be changed. They can only be proposed by a liquidity provider with enough equity-like share in the market, and need to be voted for by a sufficient number of tokenholders and/or liquidity providers.

When creating a market governance proposal, whether it is for a new market or to change parameters for an existing market, it's recommended that you sense check the proposal and share the final details with the tokenholder community before proposing, so that you can garner support and make any necessary amends. 

Read more:
* [Vega community forum ↗](https://community.vega.xyz): Share your draft proposals for community discussion.
* [New market proposal ↗](../tutorials/proposals/new-market-proposal.md): Guide to submitting a proposal for a new market using the command line
* [Update market proposal ↗](../tutorials/proposals/update-market-proposal.md): Guide to submitting a proposal to change a market using the command line

### Propose a new market
Tokenholders can propose new markets, which then need to be voted on by other tokenholders. The proposer will need to have at least <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideName={true} suffix="tokens" />, associated with the public key you're using to propose the market, and staked to a validator. Note, this amount is set through the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.minProposerBalance" hideValue={true} />.

If the market proposal gets a <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" hideName={true} formatter="percent"/> majority of tokeholder support, then it will be enacted. The required majority is defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="governance.proposal.market.requiredMajority" hideValue={true} />.

To propose a market, you'll need to provide the details required for the market to begin trading right away. While some of the fields are free-text, others are constrained by a range set through network parameters, to ensure that the values provided are fit for purpose.

Required fields include:
* Instrument details, including a human-readable name, an understandable shortcode for the market, the type of product (futures)
* Risk model parameters
* Product specifics including the settlement asset and quote name
* Decimal places for the settlement asset, market, and positions 
* Oracle details, including the oracle's public key, specifications for the settlement price and trading termination, and data filters
* Liquidity monitoring parameters, including the target stake parameters, triggering ratio and auction extension

Optional fields include: 
* Metadata so that people can easily interpret the market's details - while this is optional, it's highly recommended that you include metadata for the market
* Liquidity commitment: the amount committed, proposed fee level, and the buy and sell order shapes. Note: Once a market is proposed, it can accept liquidity commitments from any party
* Price monitoring parameters, including the triggers covering the horizon, probability and auction extension time. If left blank these parameters will default to the values set in the network parameters

:::note Read more
* [Risk models and parameters](#risk-models-and-parameters)
* [New market proposal](../tutorials/proposals/new-market-proposal.md)
:::

<!--
* [Data sources]
* [Liquidity monitoring parameters]
* [Price monitoring parameters]
-->

### Risk models and parameters
When proposing a market, the market proposer will need to choose the risk parameters associated with the risk model that's appropriate for the instrument. The risk model is essential for calculating margins on the market. 

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
**[Margins and Credit Risk on Vega ↗](https://vega.xyz/papers/margins-and-credit-risk.pdf)** - Note, a position size of 1 is assumed throughout the research paper.
:::

#### Log-normal risk model
The log-normal model assumes that the logarithm of the price increments are normally distributed. The main model parameter is   
* `Volatility (Sigma)` - annualised volatility of the underlying asset:
  * accepted values: **any strictly non-negative real number**,
  * suggested value: asset dependent, should be derived from the historical time-series of prices, and a typical value would be 0.8 = 80%

Another paramerer is
* `Mu` - annualised growth rate of the underlying asset:
  * accepted values: **any real number**,
  * suggested value: in almost all situations `0` is the value to use

<!--### Changing models [WIP]

### Propose changes to a market
Details on proposing changes to market to come.

<!--  More voting details for market change: 
1. The tokenholder vote meets or exceeds the minimum set by `governance.proposal.updateMarketParam.requiredParticipation` and the votes in favour are greater than the amount set by `governance.proposal.updateMarketParam.requiredMajority` (in this case the LPs were overridden by governance token holders)
  2. The governance tokenholder vote does not reach participation threshold, but the liquidity providers' votes do (and has enough votes in favour). The participation rate must be greater than/equal `governance.proposal.updateMarketParam.requiredParticipation`, and the liquidity providers' participation rate must be greater than/equal to `governance.proposal.updateMarketParam.requiredParticipationLP`, and the liquidity providers' votes in favour is greater than/equal to `governance.proposal.updateMarketParam.requiredMajorityLP` -->


## Network parameter governance
There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals.

Network parameters can only be added and removed with Vega core software releases.

A network parameter is defined by:
* Name
* Type
* Value
* Constraints
* Governance update policy

**Read more:** [Guide to submitting a network parameter proposal using the command line](../tutorials/proposals/network-parameter-proposal.md)
  
## Asset/token management

### Deposits and withdrawals
See the [Deposits and withdrawals](./deposits-withdrawals) page for how they work on Vega.

### Transfer assets to keys or accounts
Transfers can be used to move assets from one Vega key to another, or from a Vega key to a specific account, such as a reward pool used for the on-chain network treasury.

Anyone with a Vega public key and assets (such as the VEGA token) can set up a transfer. Those transfers can only be done from a general account the party has control of, using their own funds.

**Each transfer incurs a fee.** The fee is paid to the validators who run the network. The amount of the fee is set with the network parameter <NetworkParameter frontMatter={frontMatter} param="transfer.fee.factor" />, which defines the proportion of each transfer that's taken as a fee. The fee's subtracted immediately on execution, and is taken on top of the transfer amount.

Transfers can be set up to happen only once, or can happen repeatedly.

:::tip Try it out
Set up transfers with your Vega wallet using the command line. Find out how in the **[transfers guide](../tutorials/transferring-assets.md)**.
:::

#### Transfer limits
* Each party has a max number of transfers per epoch that they can send, set by the network parameter <NetworkParameter frontMatter={frontMatter} param="spam.protection.maxUserTransfersPerEpoch" />. 
* A minimum transfer amount is controlled by the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />, which is dependent on the quantum (smallest possible amount) specified for the asset. To calculate the smallest a transfer can be, multiply the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" hideValue={true} /> by the asset's quantum.

#### One-off transfers
A one-off transfer can happen immediately (as soon as it is validated), or be set to happen at a specific time. When you set a delay, the transfer funds are removed from your account immediately and stored in a pool, and then distributed to the destination account once the time you chose is reached.

#### Recurring transfers
A party can also setup recurring transfers that will happen at the end of each epoch, and before the next one starts.

A recurring transfer transaction needs to contain the following:
* How much is available to transfer
* The starting epoch for the transfer
* Optionally, the end epoch when the transfers should stop. If it's not specified, the transfer run until cancelled
* The percentage of the full amount to pay each epoch, which is defined using the factor - a decimal
  - The amount paid at the end of each epoch is calculated using the following formula: `amount = start amount x factor ^ (current epoch - start epoch)`

#### Cancel or amend transfers
It's possible to cancel a recurring transfer, but not to amend. If you want to change your transfer, you'll need to cancel the existing transfer and submit a new one.

If the asset used to fund a recurring transfer is depleted, either because the funds have run out or it's less than the <NetworkParameter frontMatter={frontMatter} param="transfer.minTransferQuantumMultiple" />` x quantum`, then the transfer is cancelled automatically. You'll have to set up a new transfer if you want to keep funding the key/account.

#### Recurring transfer limits
While a party (public key) can have multiple transfers set up to move assets to different accounts, each party can only have one recurring transfer between two given accounts at the same time. For example, a party can transfer from their general account to Public key A and Public key B, but they cannot set up two recurring transfers of different amounts both going to Public key B.

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens.

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.
