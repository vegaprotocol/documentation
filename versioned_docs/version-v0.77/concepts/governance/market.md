---
sidebar_position: 5
title: Markets
vega_network: MAINNET
hide_title: false
description: Add new markets or change existing ones.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

Markets can be proposed and voted into existence by tokenholders. The parameters for a market all need to be defined in the proposal.

Some market parameters can also be changed. They can only be proposed by a liquidity provider with enough equity-like share in the market, and need to be voted for by a sufficient number of tokenholders and/or liquidity providers.

When creating a market governance proposal, whether it is for a new dated futures market, a new perpetual futures market, a new spot market, or to change parameters for an existing market, it's recommended that you sense check the proposal and share the final details with the tokenholder community before proposing, so that you can garner support and make any necessary amends. 

Read more:
* [New perpetual futures market proposal ↗](../../tutorials/proposals/new-perpetuals-market.md): Guide to submitting a proposal for a new market
* [New futures market proposal ↗](../../tutorials/proposals/new-market-proposal.md): Guide to submitting a proposal for a new market
* [New spot market proposal ↗](../../tutorials/proposals/new-spot-market.md): Guide to submitting a proposal for a new market
* [New successor market proposal ↗](../../tutorials/proposals/new-successor-market-proposal.md): Guide to submitting a proposal for a new successor market
* [Update market proposal ↗](../../tutorials/proposals/update-market-proposal.md): Guide to submitting a proposal to change a market using the command line

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
* Liquidity parameters, including the target stake

Optional fields include: 
* Metadata so that people can easily interpret the market's details - while this is optional, it's highly recommended that you include metadata for the market
* Price monitoring parameters, including the triggers covering the horizon, probability and auction extension time. If left blank these parameters will default to the values set in the network parameters
* Tick size, to set the minimal change in a price. If not set, it will default to 1 (which is 10^{-market decimal places})

:::note Read more
* [New market proposal tutorial](../../tutorials/proposals/new-market-proposal.md)
* [Data sources](../trading-on-vega/data-sources.md)
* [Price monitoring parameters](../trading-on-vega/market-protections.md#price-monitoring)
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
A successor market is a market that will carry on after the original market, or parent, that it is based on has settled - though a parent and successor market can be active simultaneously. Proposing a new successor market that follows from an existing market offers liquidity providers the option to keep their [equity-like share](../liquidity/rewards-penalties.md#how-liquidity-fees-are-split) on the new market, even when the original market expires. Creating an entirely new market with no parent doesn't offer the same benefit.

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
[Tutorial: Propose a change to a market's state](../../tutorials/proposals/market-state-proposal.md)
:::
