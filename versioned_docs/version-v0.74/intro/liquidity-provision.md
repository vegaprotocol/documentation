---
sidebar_position: 3
title: Liquidity provision
hide_title: true
---

import NetworkParameter from '@site/src/components/NetworkParameter';

# CLOB liquidity provision

To be rewarded for providing liquidity on Vega’s limit order books, you must:

1. Commit to providing liquidity by submitting a liquidity commitment transaction and locking a commitment amount as bond.
2. Place and maintain orders to supply the committed liquidity and manage any resulting position.

LPs share the liquidity component of the market’s fee revenue, along with any additional LP rewards in VEGA or other assets that are available to the market. Fee revenue and rewards are paid at epoch end.

A liquidity provider's share of fee revenue relative to other LPs in the market depends on:

- Over- or underperformance relative to the SLA and other LPs.
- Actual amount of liquidity supplied, including recognition for supplying more than committed.
- How competitively an LP’s liquidity is priced vs other LPs.
- An LP’s accrued virtual stake vs. other LPs.

LPs will also receive a maker rebate when their orders trade, and may be eligible for other trading rewards based on their activity.

## Liquidity commitments

The liquidity commitment transaction specifies the following:

* **Market ID:** the Vega ID of the market to commit liquidity to
* **Commitment size:** specified in terms of the bond amount to be locked
    - The notional amount of liquidity required for a given bond amount is defined by the bond amount multiplied by <NetworkParameter frontMatter={frontMatter} param="market.liquidity.stakeToCcyVolume" />. For example, for a value of 20, a bond of 1,000 USDT implies a commitment of 20,000 USDT of notional order volume on each side of the book.
* **Proposed liquidity fee:** the LP’s proposal for the liquidity fee that should be charged on the market, e.g. 0.005 implies a 50 basis point liquidity fee in addition to the network-wide infrastructure and maker fee components. See more info on [fees](../concepts/trading-on-vega/fees.md).
    - Note that this value is used to calculate the liquidity fee only if the liquidity fee mode of the market supports it.

## Liquidity SLA

In the example used above, the LP committed a bond of 1,000 USDT for an obligation to post 20,000 USDT of notional on each side of the book. They need to quote this notional within a certain price range and for at least a certain amount of time per epoch in order to be considered as meeting their commitment and to get a share of the available fee revenue and rewards.

The liquidity SLA parameters below determine the percentage of time that this obligation must be met on the order book, and the width of that price range, as well as the specifics of how LPs are rewarded and penalised for meeting, or failing to meet, their commitment. 

## Calculating fee distribution

Liquidity fee distribution is calculated in several steps:

1. Primarily, when a trade is eligible to pay fees, the market's current liquidity fee is charged, with each LP assigned some portion of it into their liquidity fee per-market account. This distribution is made pro-rata according to their current score. This is determined by their equity-like share and current on-book liquidity quality compared to other LPs - more in-depth calculation is below.
2. These per-market liquidity fee accounts accumulate fees across an epoch (currently defined as 1 day). At the end of each epoch, the SLA calculations occur:
    a. Any LP underperforming the SLA minimum time fraction will lose the funds accumulated in their fee account on that market. In addition, currently the <NetworkParameter frontMatter={frontMatter} param="market.liquidity.sla.nonPerformanceBondPenaltyMax" />. If a non-zero value has been set for it, they may also lose some fraction of their bond.
    b. Any LP meeting the SLA but with less than 100% time on the book may have a percentage of the fees within the liquidity fee account redistributed. This percentage is determined by the market's *competition factor*.
    c. Any funds moved from LPs in steps a. and b. are then redistributed amongst all LPs on the market according to the product of (1 - their penalty) and their proportion of total fees received across the epoch. For example, for a larger LP and a smaller LP with the same time on book, the larger LP will receive more from this pool, but if the larger LP was close to SLA and the smaller was close to 100%, then the smaller LP could receive more.

For a full step-by step calculation and examples, see [liquidity rewards and penalties](../concepts/liquidity/rewards-penalties.md#dividing-liquidity-fees-between-lps).

## Estimating income

Any profits from running an LP strategy can come from several sources:

1. Profit from trading at good prices
2. Profit from receiving maker fees
3. Profit from receiving liquidity fees
4. Profit from receiving any rewards distributed according to maker or liquidity fee receipts

Point 1 is a function of an LP's strategy directly and so is beyond estimating here. Point 2 depends on the network's maker fee, but more importantly on how many trades are executed against the LP vs. other market participants, which is similarly out of scope for estimating here. Point 4 can be calculated directly from knowing either 2 or 3 as the rewards are distributed according to proportions of those fees directly, which leaves Point 3.

In order to estimate an approximate range for *received liquidity fees* for a given market there are three components required:

1. **Total liquidity fees paid on the market per epoch**. The liquidity fees paid in a given 24-hour period can be calculated by multiplying the total volume of base currency traded (such as USDT) by the active liquidity fee on the market.
2. **LP equity-like share.** The LP's equity-like share (ELS) when first joining the market will be equal to their bonded stake. Any growth in future can be seen in the “Adjusted Stake” tab of the Liquidity panel for a market on [Console ↗](https://console.vega.xyz/). This adjusted stake is the stake a new LP would have to provide to equal the ELS for the existing LP. 

    In the below example, a new LP would have to provide 113,751 USDT to have equal ELS with the first LP who provided 100,000 USDT at an earlier point in the market's growth.
    
    ![Commitment ELS](/img/intro/liquidity-provision/els.png)
    
3. **LP relative liquidity score.** This metric is trickier to calculate in advance, as it is heavily reliant on competition with other LPs. It can be estimated in a static fashion with formulae such as those used in this example [visualisation tool](https://github.com/cdummett/vegavis/blob/main/vegavis/tau_scaling/calculator.ipynb), or using the API or the “View As Party” feature in Console to check the active quotes for existing LPs on the market and choose one similar to the anticipated quotes for the new LP for comparison. For the sake of estimation, as it is a relative score, comparison to existing LPs is likely to yield the cleanest answer.
    a. The LP liquidity score is non-linear, i.e. quoting incrementally tighter spreads can yield increasingly larger benefits.
    b. At time of writing the probability of trading at various price levels on the BTC-USD perp market is illustrated below. The tau scaling parameter can be used by network governance to control how quickly the probability of trading drops off with price. The current network value is 1.
        
![Probability of Trading Dropoff](/img/intro/liquidity-provision/pot-drop.png)
        

Once these three metrics have been calculated, multiply 2 and 3 together, compared with multiplying together the equity-like shares and renormalised liquidity scores of the existing LPs, and use that as an estimate.

## Making a liquidity commitment

Pre-requisites:

- Read and understand this content
- Build an integration for your market making algorithm
    - See the [building a bot tutorial](../tutorials/building-a-bot/adding-a-liquidity-commitment.md) for a basic example
- Fund your Vega keys(s)
- Understand how to interact with Vega [data nodes](../concepts/vega-chain/data-nodes.md) and [APIs](../api/overview.md)

Optional further reading:

- [Concept: Liquidity provision](../concepts/liquidity/provision.md)
- [Concept: Liquidity rewards and penalties](../concepts/liquidity/rewards-penalties.md)
- [Spec: Setting fees and rewarding LPs ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md)
- [Spec: LP mechanics ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md)

Once you are ready to begin market making as an LP, you will need to take the following steps:

1. **Calculate the size of the committed stake you want to make.**
    - This is an important decision as it drives several key aspects of the LP strategy and any subsequent income.
    - The most direct consequence is that the size of the stake, multiplied by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.stakeToCcyVolume" />. This determines the notional volume (price * contract volume) the LP has to provide on each side of the book to count as meeting the SLA at any given time point.
        - For example, if the `market.liquidity.stakeToCcyVolume value is 20 and the stake is 100, assuming all prices are within the SLA price bounds as defined above, the requirement could be met by:
            - A bid of 200 units at price 10 and an ask of 100 units at price 20
            - Bids of 100 units at price 10 and 50 units at price 20 and an ask of 50 units at price 40
        - It is important not to set this too high as it is a commitment to provide this volume much of/all of the time, and failing to do so will result in missing out on the entirety of liquidity fees that you could have received.
    - This amount can be increased or decreased in future, however equity-like share only accrues on the supplied amount, and reducing the stake will irrecoverably lose some portion of the equity-like share.
    - The current equity-like share also translates to a voting power in market update proposals, allowing LPs some say over the maintenance of markets they are supporting.
    - Additional liquidity supplied above the SLA requirement still yields benefits as it is included when calculating the LP's instantaneous liquidity score, so a strategy of committing to some base level then providing increased liquidity when possible can also be beneficial.
2. **Submit your commitment transaction on-chain.**
    - The exact steps for constructing and sending a liquidity commitment will depend on the individual LP's choice of programming language/systems, however the steps and a template for the submission can be found in the [committing liquidity](../tutorials/committing-liquidity.md) tutorial.
3. **Start running and monitoring your market making algorithms.**
    - When monitoring an active liquidity provision, beyond what is required of monitoring any trading strategies, refer to the Liquidity tab on [Console ↗](https://console.vega.xyz/) when viewing a market for more useful information. In particular, the columns labeled below:
    1. **Adjusted Stake** shows the current staked volume plus any equity-like share growth which has occurred to it. The **Share** column next to it shows this value as a percentage of the sum across LPs.
    2. **Fees currently accrued across the epoch**: Although these can change at the end of the epoch due to SLA rebalancing, this is the result of the distribution of fees at each tilmestep based on ELS and liquidity score.
    3. **Live time on book this epoch** shows the percentage of the so-far-elapsed epoch for which the LP has met their SLA requirement.
    4. **Live liquidity score** displays the score as a percentage of the total across all LPs. This is the score derived from volume on the book and its associated probability of trading. The product of this and the LP's ELS decides LP fee distributions. This value is responsive to changes of the liquidity intra-epoch so any improvements in pricing can be observed here to see how they improve the score.
    
    ![Liquidity Tab Columns](/img/intro/liquidity-provision/liq-columns.png)
    