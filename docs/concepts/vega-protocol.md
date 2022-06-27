# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Vega supports on-chain proposals for creating markets and assets, changing network parameters, markets and assets. Vega also supports freeform proposals for community suggestions that will not be enacted on-chain. 

:::info 
Try out proposing markets using [Fairground](https://fairground.wtf), Vega's testnet. 
:::

### Lifecycle of a governance proposal 
1. VEGA tokenholder creates and submits a governance proposal. 
1. The governance proposal is accepted by the validator nodes as a transaction.
1. The nodes decide whether to validate the proposal. This is when the network parameters that validate the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated. If not specified on the proposal, the required participation rate and majority for success are defined based on the existing network parameters, and copied to the proposal. The proposal is immutable once entered.
1. If valid, the proposal is considered 'active' for the defined proposal period. That period must be at least as long as the minimum duration for the proposal type, specified by the network parameter.
1. During the proposal period, network participants who are eligible to vote on the proposal can submit votes for or against the proposal.
1. When the proposal period closes, the network calculates the outcome by:
   - comparing the total number of votes cast as a percentage of the number eligible to be cast, to the minimum participation requirement. If the minimum is not reached, the proposal is rejected.
	- comparing the number of 'for' votes as a percentage of all votes cast (maximum one vote counted per party) to the required majority. 
1. If the required majority of 'for' votes is met, the action described in the proposal will be taken (i.e., proposal is enacted) on the defined enactment date. Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter) _after_ voting closes.

### Voting on proposals 
VEGA tokenholders can vote for or against any proposals. 

* Any tokenholder with more than 0 tokens associated with a Vega key can vote on proposals. 
* The Vega key used for voting will need to have more than 0 tokens when a vote is submitted, as well as when votes are counted at the proposal's closing date/time, otherwise the vote is disregarded. 
* Tokens used for voting are not locked or transferred: they can be used for staking as well as for voting on any/all active proposals
* Each public key with a non-zero token balance gets one vote.
* While the voting period is open, a public key can vote multiple times but only the most recent vote will count at the proposal's close.

:::info
Vote on proposals on the [Vega token governance page](https://token.vega.xyz/governance).
:::

### Submitting governance proposals
A proposal must have all of the relevant information, in the correct format, before it can be submitted. 

The Vega public key of the proposer also must have enough VEGA staked to submit a proposal. For a market change proposal, the proposer must also have enough equity-like stake in the market from their liquidity commitment. 

If the above conditions are not met, the proposal will be rejected and will not be available for a vote. You'll then need to re-submit the proposal.

[Creating and submitting proposals](./tutorials/proposals/index.md): See guides that describe how tokenholders can submit proposals using the command line.

### Community support for a propsal
Having a submitted proposal pass the governance threshold requires the support of other Vega tokenholders. To give your proposal the best chance at success, you'll need to get the community on board.

* Sense check your proposal by sharing an outline of your proposed action on the [community forum](https://community.vega.xyz) to find out if there is support for the proposal and its intention.
* Share the detailed proposal on the forum, including the rationale, the specific parameters, and the data (JSON or similar) that would be submitted on-chain Invite discussion to amend the proposal until it reaches a final state that is ready to be submitted.
* Once you submit the proposal, invite the community to vote, and be sure to vote on it yourself, too.

## Asset governance [WIP]

### New asset proposal [WIP]

## Market governance [WIP]
Markets are proposed and voted into existence by Vega tokenholders. The parameters for a market all need to be defined in the proposal.

The parameters of a market can also be changed if a liquidity provider with enough equity-like stake in the market proposes those changes and they are voted in by a sufficient number of tokenholders and/or liquidity providers.

When creating a market governance proposal, whether it is for a new market or to change parameters for an existing market, it's recommended that you sense check the proposal and share the final details with the tokenholder community before proposing, so that you can garner support and make any necessary amends. 

[Vega community forum](https://community.vega.xyz): Share your draft proposals for community discussion. 

### Propose a new market [WIP]
Tokenholders can propose new markets, which then need to be voted on by other tokenholders. If the market proposal gets a majority of tokeholder support, then it will be enacted. The required majority is set with the network parameter `governance.proposal.market.requiredMajority`. 

:::info
A liquidity commitment is optional when proposing a market, but a market will not enter into continuous trading until its liquidity needs are met.
:::

To propose a market, you'll need to provide the details required for the market to begin trading right away.

Required fields include: 
* Instrument details, including a human-readable name, an understandable shortcode for the market, the type of product (futures)
* Product specifics including the settlement asset and quote name
* Decimal places for the settlement asset, market, and positions 
* Oracle details, including the oracle's public key, specifications for the settlement price and trading termination, and data filters
* Liquidity monitoring parameters, including the target stake parameters, triggering ratio and auction extension
* Risk model parameters

Optional fields include: 
* Metadata so that people can easily interpret the market's details
* Price monitoring parameters, including the triggers covering the horizon, probability and auction extension time. If left blank these parameters will default to the values set in the network parameters
* Liquidity commitment: the amount committed, proposed fee level, and the buy and sell order shapes. Note: Once a market is proposed, it can accept liquidity commitments from any party

Read more:
* [Data sources](./trading-framework#data-sources)
* [Liquidity monitoring parameters]
* [Price monitoring parameters]
* [Risk models and parameters]

<!--##### Market [WIP] 
"newMarket": {
          "changes": {
            
            "decimalPlaces": 5,
            "metadata": [
              "formerly:076BB86A5AA41E3E",
              "base:BTC",
              "quote:USD",
              "class:fx/crypto",
              "monthly",
              "sector:crypto"
            ],

##### Tradable instrument [WIP]

##### Instrument [WIP]
"instrument": {
              "name": "BTCUSD Monthly (30 Jun 2022)",
              "code": "BTCUSD.MF21",
              "future": {
                "settlementAsset": "fDAI",
                "quoteName": "USD",
                "oracleSpecForSettlementPrice": {
                  "pubKeys": [
                    "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
                  ],
                  "filters": [
                    {
                      "key": {
                        "name": "prices.BTC.value",
                        "type": "TYPE_INTEGER"
                      },
                      "conditions": [
                        {
                          "operator": "OPERATOR_EQUALS",
                          "value": "1"
                        }
                      ]
                    }
                  ]
                },
                "oracleSpecForTradingTermination": {
                  "pubKeys": [
                    "0xab5c950b071684321d59360ccb924d9c5010b31abd6b4148206a57e73594abc9"
                  ],
                  "filters": [
                    {
                      "key": {
                        "name": "termination.BTC.value",
                        "type": "TYPE_BOOLEAN"
                      },
                      "conditions": [
                        {
                          "operator": "OPERATOR_EQUALS",
                          "value": "1"
                        }
                      ]
                    }
                  ]
                },
                "oracleSpecBinding": {
                  "settlementPriceProperty": "prices.BTC.value",
                  "tradingTerminationProperty": "termination.BTC.value"
                }
              }
            },-->

### Risk models and parameters
When proposing a market, the market proposer will need to choose the risk parameters associated with the risk model that's appropriate for the product. Find out more about the relationship between the product, instrument, and tradable instrument above. The purpose of the risk model is for the calculation of margins on the market. 

The first product available to create is cash-settled futures, which use a log-normal risk parameter. 

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

The remaining, model specific parameters are covered in sections below.

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

### Propose changes to a market [WIP]

## Network governance [WIP]-->

### Network parameters
There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals.

A network parameter is defined by:
* Name
* Type
* Value
* Constraints
* Governance update policy 

### Changing network parameters [WIP]
Network parameters can be changed by governance, however some network parameters need to be more difficult to change than others. Therefore, the protocol needs to know for each network parameter what governance thresholds apply for ascertaining a proposal's ability to change the parameter's value. Specifically, those thresholds are:

* `MinimumProposalPeriod`
* `MinimumPreEnactmentPeriod`
* `MinimumRequiredParticipation` 
* `MinimumRequiredMajority`

There are groups of network parameters that will use the same values for the thresholds. Importantly, these `Minimum` levels are themselves network parameters, and therefore subject to change. They should be self-referential in terms of ascertaining the success of changing them.

For example, consider a network parameter that specifies the proportion of fees that goes to validators (`feeAmtValidators`), with change thresholds:

* `MinimumProposalPeriod = 30 days`
* `MinimumPreEnactmentPeriod = 10 days` 
* `MinimumRequiredParticipation = 60%` 
* `MinimumRequiredMajority = 80%`

Thus, a proposal to change the `feeAmtValidators.MinimumProposalPeriod` would need to pass all of the thresholds listed above.

Network parameters can only be added and removed with Vega core software releases.

<!--### Threshold and rules [WIP]-->
  
## Asset management [WIP]
In contrast to staking tokens, assets for trading, paying fees, and providing liquidity need to be deposited using a bridge contract, and can be withdrawn if they are not being used for margin or liquidity commitment.

Intro. What is the collateral management in general? (TODO)
 
 
:::info
You'll need a Vega Wallet for staking and receiving rewards. Connect to wallets and see your account balance on the [Vega token website](https://token.vega.xyz). CoinList custodial users should confirm with CoinList how staking works for them.
:::

### Deposits
For restricted mainnet, the deposits function for Vega is not required. To stake, instead of depositing, tokens must be associated to a Vega key. Tokens used for staking stay in your Ethereum wallet, rather than being held in the ERC20 bridge contract. 

Read more: [Staking VEGA tokens](./vega-chain#staking-on-vega)

The first assets that will be available for interacting with markets on Vega will be ERC20 assets. They will need to be deposited into the ERC20 bridge contract. The funds in that smart contract will then be made available to the user's chosen public key.

:::info
Follow a step-by-step guide to depositing testnet collateral for trading on Fairground on the [Fairground docs](https://docs.fairground.vega.xyz/docs/console/#how-to-deposit-tokens-to-use-on-vega).
:::

### Withdrawals
In restricted mainnet, the only assets that are available to withdraw are rewards accrued through staking tokens to network validators. 

To stake those rewards, the recipient must withdraw them from the Vega key the rewards are credited to, and send the tokens to their Ethereum wallet. After withdrawing, the tokens can be associated with a Vega key. 

Note: Associated and deposited are not equivalent, as deposited tokens are held within the ERC20 bridge contract, and associated tokens stay in an Ethereum wallet or in the vesting contract. 

:::info
Track and withdraw rewards on the [Vega token withdrawals page](https://token.vega.xyz/withdraw).
:::

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens. 

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.
