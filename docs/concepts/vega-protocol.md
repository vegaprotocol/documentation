# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Vega supports on-chain proposals for creating markets and assets, changing network parameters, markets and assets. Vega also supports freeform proposals for community suggestions that will not be enacted on-chain. 

:::info 
Try out proposing markets using [Fairground](https://fairground.wtf), Vega's testnet. 
:::

## Lifecycle of a governance proposal 
### 1. Sense check 
Share an outline of your proposed action informally on the forum. Get an idea of whether there is support for the proposal and refine your plans to be able to find out if there is sufficient interest in making a change.

:::info 
Check out the [forum](https://community.vega.xyz/) and create a new topic to sense check your proposal with the community. 
:::

### 2. Formalising a proposal
Share the detailed proposal on the forum, including rationale and specifics of the proposed addition/change, including the data (JSON or similar) that would be submitted on chain. Invite debate and discussion to amend the proposal until it reaches a final state, ready to submit.
 
### 3. Submitting a proposal 
As a token holder, you can submit the proposal using the APIs to create a new market, change an existing market, change network parameters, add an external asset to Vega and make a freeform proposal (for changes that will not change network behaviour). For each, you will define specific inputs for a set list of parameters, which are validated by the nodes before entering into the voting period you set. Rally the community to vote for your proposal on the forum.

Submission process
* A proposal must have all of the relevant information, in the correct format, before it can be submitted. 
* The governance proposal is accepted by the validator nodes as a transaction.
* The nodes decide whether to validate the proposal. This is when the network parameters that validate the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated. If not specified on the proposal, the required participation rate and majority for success are defined based on the existing network parameters, and copied to the proposal. The proposal is immutable once entered.
* If valid, the proposal is considered 'active' for the defined proposal period. That period must be at least as long as the minimum duration for the proposal type, specified by the network parameter.
* The Vega public key of the proposer also must have enough VEGA staked to submit a proposal. For a market change proposal, the proposer must also have enough equity-like stake in the market from their liquidity commitment.
* If the above conditions are not met, the proposal will be rejected and will not be available for a vote. You'll then need to re-submit the proposal.

:::info 
Read the [creating and submitting proposals guides](https://community.vega.xyz/) to understand how tokenholders can submit proposals using the command line. 
:::

### 4. Voting 
VEGA tokenholders can vote for or against any active proposals. 

Voting rules
* Tokens used for voting are not locked or transferred: they can be used for staking as well as for voting on any/all active proposals.
* Each public key with a non-zero token balance gets one vote.
* While the voting period is open, a public key can vote multiple times but only the most recent vote will count at the proposal's close.
* The Vega key used for voting will need to have more than 0 tokens when a vote is submitted, as well as when votes are counted at the proposal's closing date/time, otherwise the vote is disregarded.

How the outcome is calculated 
* Comparing the total number of votes cast as a percentage of the number eligible to be cast, to the minimum participation requirement. If the minimum is not reached, the proposal is rejected.
* Comparing the number of 'for' votes as a percentage of all votes cast (maximum one vote counted per party) to the required majority

:::info
Vote on active proposals on the [Vega token interface](https://token.vega.xyz/governance).
:::

### 5. Enacting changes
If a proposal receives enough votes in favour within the enactment period, the network parameters automatically change (except for a free form proposal).
* When the required majority of 'for' votes is met, the action described in the proposal will be taken on the defined enactment date.
* Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter) after voting closes.



<!--## Asset governance [WIP]

### New asset proposal [WIP]-->

## Market governance
Markets are proposed and voted into existence by Vega tokenholders. The parameters for a market all need to be defined in the proposal.

Some market parameters can also be changed. They can only be proposed by a liquidity provider with enough equity-like stake in the market, and need to be voted for by a sufficient number of tokenholders and/or liquidity providers.

When creating a market governance proposal, whether it is for a new market or to change parameters for an existing market, it's recommended that you sense check the proposal and share the final details with the tokenholder community before proposing, so that you can garner support and make any necessary amends. 

Read more:
* [Vega community forum](https://community.vega.xyz): Share your draft proposals for community discussion.
* [New market proposal](../tutorials/proposals/new-market-proposal.md): Guide to submitting a proposal for a new market using the command line
* [Update market proposal](../tutorials/proposals/update-market-proposal.md): Guide to submitting a proposal to change a market using the command line

### Propose a new market
Tokenholders can propose new markets, which then need to be voted on by other tokenholders. If the market proposal gets a majority of tokeholder support, then it will be enacted. The required majority is defined by the network parameter `governance.proposal.market.requiredMajority`. 

:::info
A liquidity commitment is optional when proposing a market, but a market will not enter into continuous trading until its liquidity needs are met.
:::

To propose a market, you'll need to provide the details required for the market to begin trading right away. While some of the fields are free-text, others are constrained by a range set through network parameters, to ensure that the values provided are fit for purpose.

Required fields include: 
* Instrument details, including a human-readable name, an understandable shortcode for the market, the type of product (futures)
* Risk model parameters
* Product specifics including the settlement asset and quote name
* Decimal places for the settlement asset, market, and positions 
* Oracle details, including the oracle's public key, specifications for the settlement price and trading termination, and data filters
* Liquidity monitoring parameters, including the target stake parameters, triggering ratio and auction extension

Optional fields include: 
* Metadata so that people can easily interpret the market's details
* Price monitoring parameters, including the triggers covering the horizon, probability and auction extension time. If left blank these parameters will default to the values set in the network parameters
* Liquidity commitment: the amount committed, proposed fee level, and the buy and sell order shapes. Note: Once a market is proposed, it can accept liquidity commitments from any party

Read more:
* [Risk models and parameters](#risk-models-and-parameters)
* [New market proposal](../tutorials/proposals/new-market-proposal.md): Guide to submitting a proposal for a new market using the command line

<!--
* [Data sources]
* [Liquidity monitoring parameters]
* [Price monitoring parameters]
-->

### Risk models and parameters
When proposing a market, the market proposer will need to choose the risk parameters associated with the risk model that's appropriate for the instrument. The risk model is essential for calculating margins on the market. 

The first product available to create is cash-settled futures, which uses a log-normal risk model. While the model is pre-defined, you'll need to choose the individual parameters.

You should choose parameters that ensure the risk model adequately represents the dynamics of the underlying instrument, and that the resulting margins strike the right balance between prudence and capital efficiency.

Below are the risk parameters, the accepted values for each parameter and suggested values for some. When suggested values are provided, these should be used as a reference point and to aid in deciding on what's appropriate for the market, not in place of rigorous analysis and calibration.

Model-independent parameters used in margin calculation are:

* `Risk aversion lambda` - probability level used in [Expected Shortfall](https://vega.xyz/papers/margins-and-credit-risk.pdf#page=7) calculation when obtaining `Risk Factor Long` and `Risk Factor Short`:
  * accepted values: **strictly greater than 0 and strictly smaller than 1**,
  * suggested value: `0.001` - indicates the probability that the position value drops by more than its current value at risk at level lambda.
* `Tau` - projection horizon measured as a year fraction used in Expected Shortfall calculation when obtaining `Risk Factor Long` and `Risk Factor Short`:
  * accepted values: **any strictly non-negative real number**,
  * suggested value: `0.000114077116130504` - corresponds to one hour expressed as year fraction.
* `Risk free rate` - annualised growth rate of the risk-free asset, it's used for discounting of future cash flows:
  * accepted values: **any real number**,
  * suggested value: `0`.

The remaining, model specific parameters are covered below.

:::note Further reading
**[Margins and Credit Risk on Vega](https://vega.xyz/papers/margins-and-credit-risk.pdf)** - Note, a position size of 1 is assumed throughout the research paper.
:::

#### Log-normal risk model
The log-normal model assumes that the price of the underlying asset follows the process specified by the stochastic differential equation:

dS<sub>t</sub> = S<sub>t</sub>(Mu*dt+Sigma*dW<sub>t</sub>), S(t) = s,

where `Mu`, `Sigma` and `s` are constants and `dW` represents a Brownian Motion increment. For any time in `t` in the interval `(0,T]` the model implies a distribution where the natural logarithm of price is normally distributed (hence the name Log-Normal).  

* `Mu` - annualised growth rate of the underlying asset:
  * accepted values: **any real number**,
  * suggested value: `0`.
* `Volatility (Sigma)` - annualised volatility of the underlying asset:
  * accepted values: **any strictly non-negative real number**,
  * suggested value: asset dependent, should be derived from the historical time-series of prices.

<!--### Changing models [WIP]

### Thresholds and rules [WIP]

### Propose changes to a market [WIP]-->

### Network parameter governance
There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals.

Network parameters can only be added and removed with Vega core software releases.

A network parameter is defined by:
* Name
* Type
* Value
* Constraints
* Governance update policy

**Read more:** [Guide to submitting a network parameter proposal using the command line](../tutorials/proposals/network-parameter-proposal.md)

### Thresholds for network parameters
Some network parameters need to be more difficult to change than others. Therefore, the protocol needs to know for each network parameter what governance thresholds apply for ascertaining a proposal's ability to change the parameter's value. Specifically, those thresholds are:

* `MinimumProposalPeriod`
* `MinimumPreEnactmentPeriod`
* `MinimumRequiredParticipation` 
* `MinimumRequiredMajority`

There are groups of network parameters that will use the same values for the thresholds. Importantly, these `minimum` levels are themselves network parameters, and therefore subject to change.

Consider a network parameter that specifies the proportion of fees that goes to validators (`feeAmtValidators`), with change thresholds:

* `MinimumProposalPeriod = 30 days`
* `MinimumPreEnactmentPeriod = 10 days`
* `MinimumRequiredParticipation = 60%`
* `MinimumRequiredMajority = 80%`

A proposal to change the `feeAmtValidators.MinimumProposalPeriod` would need to pass all of the thresholds listed above.

<!--### Threshold and rules [WIP]-->
  
## Asset management
Assets used for trading, paying fees, funding rewards, and providing liquidity need to be deposited using a bridge contract, and can be withdrawn back into an Ethereum wallet if they are not being used for margin or liquidity commitment.

### Deposits
The first assets that will be available for interacting with markets on Vega will be ERC20 assets. They will need to be deposited into the ERC20 bridge contract. The funds in that smart contract will then be made available to the user's chosen Vega public key.

:::info 
Associated and deposited are not equivalent, as deposited tokens are held within the ERC20 bridge contract, and associated tokens stay in an Ethereum wallet or in the vesting contract.
:::

To acquire an asset balance on the Vega network, a participant must first deposit an asset using the relevant Vega asset bridge. Every asset class supported by and voted into Vega will have a bridge. 

Due to variations in asset infrastructure, each bridge will have a different way to make a deposit.

#### Depositing ERC20 assets
ERC20 assets are managed by a smart contract that supports the Vega bridge interface. 

When a participant wants to deposit assets onto a Vega key, they need to call a deposit function on the ERC20 bridge that contains how much of the specified asset the Vega key will receive.

Once deposited, the assets are held in an asset pool for security and to make contract updates easier/less risky.

:::info 
Before running the deposit function, you must run the ERC20-standard approve function to authorise the bridge smart contract as a spender of the target token. This will only allow a specific amount of that token to be used by the bridge. This can be done directly or through a Vega app.

Further reading: [EIP-20: Token Standard proposal](https://eips.ethereum.org/EIPS/eip-20)
:::

After a successful deposit transaction, the `Asset_Deposited` event will be emitted for use by the Vega event queue.

The transaction is recognised by the Vega event queue and packaged as an event, which is then submitted to the validator nodes to verify the event contents against an Ethereum node that Vega validators also run. 

Once the transaction is verified, the Vega public key submitted in the transaction will be credited with the deposited asset.

**Read more**: [ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#deposit_asset)

### Diagram: Deposits
![Deposit diagram](/img/concept-diagrams/diagram-deposit.png)

### Withdrawals
Assets used for trading and related activities can only be withdrawn if they are not being held in bond for liquidity or in the margin account for active orders. VEGA tokens can only be withdrawn if they are not staked.

When a participant decides they want to remove their assets from the Vega network, they'll need to submit a withdrawal request via a Vega app or the API.

This request, if valid, will put through Vega consensus, wherein the validators will sign a multi-signature withdrawal order bundle, and assign an expiry. If the withdrawal is not completed by the participant before the expiry, the tokens are returned to their collateral account. 

To move the assets into the participant's Ethereum wallet, they need to submit the bundle to the ERC20 bridge. The bridge validates the bundle and then releases the funds to the Ethereum wallet.

Once a successful withdrawal transaction has occurred, the ERC20 bridge will emit an `Asset_Withdrawn` event, and confirms to the Vega network that the withdrawal has been completed.

**Read more**: [ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#withdraw_asset)

### Diagram: Withdrawals
![Withdrawal diagram](/img/concept-diagrams/diagram-withdraw.png)

##### Withdrawing VEGA
VEGA (an ERC20 token) used for staking is associated with a Vega key, and so to withdraw those tokens, they must be dissociated first.

Rewards accrued through staking are not associated automatically. To stake those tokens or transfer them, they need to be withdrawn from the Vega key that the rewards are credited to, and sent to an Ethereum wallet.

:::info
Track and withdraw staking rewards on the [Vega token withdrawals page](https://token.vega.xyz/withdraw).
:::

**Read more**: [Withdrawing ERC20 assets](#withdrawing-erc20-assets) for more on the withdrawal transaction

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens. 

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.
