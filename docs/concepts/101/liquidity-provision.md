---
sidebar_position: 3
title: Liquidity Provision
hide_title: false
---

# CLOB Liquidity Provision

To be rewarded for providing liquidity on Vega’s limit order books, a user must:

1. Commit to liquidity provision by submitting a liquidity commitment transaction.
2. Place and maintain orders to supply the committed liquidity and manage any resulting position.

LPs share the liquidity component of the market’s fee revenue, along with any additional LP rewards in VEGA (or other assets) that are available to the market. Rewards are paid at epoch end.

An LP’s share of rewards relative to other LPs in the market depends on:

- Over- or underperformance relative to the SLA and other LPs.
- Actual amount of liquidity supplied, including recognition for supplying more than committed.
- How competitively an LP’s liquidity is priced vs other LPs.
- An LP’s accrued virtual stake vs. other LPs

Note that LPs will also receive the maker rebate when their orders trade, and may be eligible for other trading rewards based on their activity.

## Liquidity commitments

The liquidity commitment transaction specifies the following:

**Market ID:** the Vega ID of the market to commit liquidity to

**Commitment Size:** specified in terms of the bond amount to be locked

- Note that the notional amount of liquidity required for a given bond amount is defined by the bond amount multiplied by the current value of the network parameter market.liquidity.stakeToCcyVolume. For example, if this parameter is set to 20, a bond of 1,000 USDT implies a commitment of 20,000 USDT of notional order volume on each side of the book.

**Proposed LP Fee:** the LP’s proposal for the LP fee that should be charged on the market, e.g. 0.005 implies a 50 basis point LP fee in addition to the network-wide infrastructure and maker fee components. (See more info on fees.)

- Note that how and indeed *if* this value is used to calculate the LP depends on the fee mode of the market.

## Liquidity SLA

In the example used above, the LP committed a bond of 1,000 USDT for an obligation to post 20,000 USDT of notional on each side of the book. They quote this notional within a certain price range and for at least a certain amount of time per epoch in order to be considered as meeting their commitment and share the available fees and rewards.

The liquidity SLA parameters below determine the percentage of the time that this obligation must be met on the order book, and the width of that price range, as well as the specifics of how LPs are rewarded and penalised for meeting, or failing to meet, their commitment. The following are set per market:

**price range:** The allowed spread either side of the mid price for LP orders (for example, if this is set to 0.01, LPs must place orders within 1% of the mid price for them to count towards their liquidity commitment time on the book).

- When in an auction, the price range is calculated slightly differently, instead of utilising the mid price for both sides:
    - The maximum price is defined by max(last trade price, indicative auction uncrossing price) * (1 + price range).
    - The minimum price is defined by min(last trade price, indicative auction uncrossing price) * (1 - price range).

**minimum time fraction:** The % of the time during each epoch that an LP must spend with at least their committed volume of orders on the book. Below this they will be penalised, at least by loss of all received fees for the epoch.

**hysteresis epochs:** The number of epochs for which an LP will continue to receive a penalty after failing to meet the SLA. At the end of any given epoch the penalty is defined as the maximum of either the penalty for the just completed epoch or the average penalty across other epochs in the hysteresis window.

**competition factor:** Controls the extent to which an LP outperforming other LPs in time spent on the book will receive a larger share of rewards.

And these network parameters, which also impact LP rewards, are set system wide:

**market.liquidity.sla.nonPerformanceBondPenaltyMax:** Specifies the maximum fraction of an LP’s bond that may be slashed per epoch for failing to meet their SLA commitment. (NB: at the time of writing this has been set to zero by the community and LP bonds are not at risk of slashing.)

**market.liquidity.sla.nonPerformanceBondPenaltySlope:** Specifies how aggressively the penalty is applied for underperformance (for example: a slope of 1.00 means that for every 1% underperformance 1% of the bond is slashed, up to the maximum above, whereas a slope of 0.1 would mean that for every 10% underperformance the bond would be slashed by 1%).

**market.liquidity.earlyExitPenalty:** This defines the amount of an LPs bond that will be kept if they cancel their commitment while the market is below its target stake of committed liquidity. If the cancellation is partial or takes a market from above to below target stake, only the pro-rata portion of the bond related to the removal of liquidity below the target stake will be assessed for the penalty.

## Calculating Fee Distribution

LP fee distribution is calculated in several steps:

**Intuitive Steps:**

1. Primarily, a trade is eligible to pay fees the percentage currently defined by the LP fee on the market is taken from it and each LP is assigned some portion of it into their LP fee-per-market account. This distribution is made pro-rata according to their current score (a product of their equity-like share and their current on-book liquidity quality compared to other LPs (more in-depth calculation is below)).
2. These LP fee-per-market accounts accumulate fees across an epoch (currently defined as 1 day). At the end of the epoch the SLA calculations occur:
    1. Any LP underperforming the SLA minimum time fraction will lose the funds accumulated in their fee account on that market. If a non-zero **market.liquidity.sla.nonPerformanceBondPenaltyMax** has been set they may also lose some fraction of their bond, however at time-of-writing this value is 0 so no bond penalty applies.
    2. Any LP meeting the SLA but with less than 100% time on the book may have up to **competition factor** percentage of the fees within the fee-per-market account redistributed.
    3. Any funds moved from LPs in steps a and b are then redistributed amongst all LPs according to the product of (1 - their penalty) and their proportion of total fees received across the epoch (so for a larger LP and a smaller LP with the same time on book, the larger LP will receive more from this pool, but if the larger LP were close to SLA and the smaller were close to 100% then the smaller could receive more)

**Mathematical Steps:**

- **Probability of Trading**: For each price level, the risk model implies a **Probability of Trading**, which is based on the cumulative distribution of a lognormal function between the tightest price monitoring bounds currently for the market and best bid/ask. The network parameter `minProbabilityOfTrading` defines a minimum value for the probability of trading at a given price level.
    1. Parameters `mu`, `tau` and `sigma` are taken from the individual market's risk model, additionally `tau_scaling` is taken from the relevant network parameter.
    2. For a price on the buy side, calculate the cdf between `min_valid_price` (the lowest price within the tightest price monitoring boundaries) and the `price`, normalising for a sum of `1` between `min_valid_price` and `best_bid`.
    3. For a price on the buy side, calculate the cdf between the `price` and  `max_valid_price` (the highest price within the tightest price monitoring boundaries), normalising for a sum of `1` between `best_ask` and `max_valid_price`.
    4. Define a lognormal distribution `D` with:
        1. scale = `sigma` * `sqrt(tau * tau_scaling)`
        2. loc = `exp(log(best_price) + (mu - 0.5 * sigma ^ 2) * tau * tau_scaling)` (where `best_price` is `best_bid/ask` depending on whether considering the buy or sell side.)
    5. Calculate the CDF of distribution `D` at the `lower_bound` (`min_valid_price` for buy side and `best_ask` for sell side) and at the upper bound (`best_bid` for buy side and `max_valid_price` for sell side).
    6. Define `z`, a scaler, to be `CDF(upper_bound) - CDF(lower_bound)`
    7. Probability of trading is then:
        1. For a buy order, `P(t) = 0.5 * (CDF(price) - CDF(lower_bound)) / z`
        2. For a sell order, `P(t) = 0.5 * (CDF(upper_bound) - CDF(price)) / z`
    8. If probability of trading < `minProbabilityOfTrading`, return the value `minProbabilityOfTrading`
- **Initial fee distribution**:
    - **Liquidity score** is used for initial fee distribution between LPs at trade time. It is recalculated frequently:
        - For each LP, each of their orders within the SLA bound is assessed. For each price level, the **Probability of Trading** is calculated as above. For each order included, the LP's volume is multiplied by the probability of trading at that price. These are then summed up to generate a notional **Liquidity Score.**
        - These are then normalised across all LPs. i.e. fractional instantaneous liquidity score = instantaneous liquidity score / total scores across all LPs
        - LP liquidity score is then updated to be a weighted sum of the previous liquidity score and the new instantaneous one:
            - liquidity score <- ((n-1)/n) x liquidity score + (1/n) x fractional instantaneous liquidity score
- For fee distribution, each LP receives a portion equal to (LP Equity-like Share * LP Liquidity Score), normalised across all LPs.
- Under 100% time-on-book
    - If an LP meets the SLA criteria but is under 100% time on book they may have some portion of their fees redistributed. This is calculated with the equation below, where **t** is their fraction of time on the book, **s** is the minimum SLA fraction and **c** is the competition fraction discussed above. **p** then gives the fraction of fees redistributed.
        
        ![Penalty calculation for missing time on book](/img/101/liquidity-provision/time-penalty.png)
        
- Fee Redistribution
    - Any fees not immediately paid out to LPs as a result of under 100% time on book are redistributed according to a few steps. First each LP receives a weight according to their proportion of fees that epoch
        
        ![Initial weighting for bonus distribution](/img/101/liquidity-provision/bonus-reweighting.png)

    - Then that score is updated by multiplying by their SLA penalty as calculated above
        
        ![Adding SLA penalty](/img/101/liquidity-provision/bonus-sla-weighting.png)
        
    - Then these are finally re-weighted across all LPs
        
        ![Ensure bonuses sum to 1](/img/101/liquidity-provision/bonus-final-weighting.png)
        
    - Each LP then receives this fraction of the garnished SLA funds as a final bonus.

## Estimating LP Income

Any profits from running an LP strategy can come from several sources:

1. Profit from trading at good prices
2. Profit from receiving maker fees
3. Profit from receiving LP fees
4. Profit from receiving any rewards distributed according to maker or LP fee receipts

Point 1 is a function of an LP's strategy directly and so is beyond estimating here. Point 2 depends on the network's maker fee but more importantly on how many trades are executed against the LP vs other market participants, which is similarly out of scope for estimating here. Point 4 can be calculated directly from knowing either 2 or 3 as the rewards are distributed according to proportions of those fees directly, which leaves Point 3.

In order to estimate an approximate range for received LP fees for a given market there are three components required:

1. **Total LP fees paid on the market per epoch**. The LP fees paid in a given 24 hour period can be calculated by simply multiplying the total volume of base currency traded (such as USDT) by the active LP fee on the market.
2. **LP Equity-Like Share.** The LP's equity-like share (ELS) when first joining the market will be equal to their bonded stake. Any growth in future can be seen in the “Adjusted Stake” tab of the Liquidity panel for a market in the Console. This adjusted stake is the stake a new LP would have to provide to equal the ELS for the existing LP (In the below example, a new LP would have to provide 113,751 USDT to have equal ELS with the first LP who provided 100,000 USDT at an earlier point in the market's growth)
    
    ![Commitment ELS](/img/101/liquidity-provision/els.png)
    
3. **LP Relative Liquidity Score.** This metric is trickier to calculate in advance, as it is heavily reliant on competition with other LPs. It can be estimated in a static fashion with formulae such as those used [here](https://github.com/cdummett/vegavis/blob/main/vegavis/tau_scaling/calculator.ipynb) or alternatively utilise the API or the “View As Party” feature in Console to check the active quotes for existing LPs on the market and choose one similar to the anticipated quotes for the new LP for comparison. For the sake of estimation, as it is a relative score, comparison to existing LPs is likely to yield the cleanest answer.
    1. Note: The LP Liquidity score is non-linear, i.e. quoting incrementally tighter spreads can yield increasingly larger benefits.
    2. At time-of-writing the probability of trading at various price levels on the BTC-USD perp market is illustrated below. The Tau scaling parameter can be used by network governance to control how quickly the probability of trading drops off with price. The current network value is 1.
        
        ![Probability of Trading Dropoff](/img/101/liquidity-provision/pot-drop.png)
        

Once these three metrics have been calculated, multiply 2 and 3 together, compared with multiplying together the ELSs and renormalised liquidity scores of the existing LPs, and use that 

## Making an LP commitment

Pre-requisites:

- Read and understand this content
- Optionally deep dive:
    - [https://docs.vega.xyz/mainnet/concepts/liquidity/provision](../liquidity/provision)
    - [https://docs.vega.xyz/mainnet/concepts/liquidity/rewards-penalties](../liquidity/rewards-penalties)
    - Deep Dive Specs:
        - [https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md)
        - [https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md](https://github.com/vegaprotocol/specs/blob/master/protocol/0044-LIME-lp_mechanics.md)
- Learn about Vega data nodes and APIs
- Build an integration for your market making algorithm
    - [https://docs.vega.xyz/mainnet/tutorials/building-a-bot](../../tutorials/building-a-bot)
- Fund your Vega keys(s)

Once you are ready to begin market making as an LP, you will need to do three things:

1. **Calculate the size of the committed stake you want to make**
    - This is an important decision as it drives several key aspects of the LP strategy and any subsequent income.
    - The most direct consequence is that the size of the stake, multiplied by the network parameter **market.liquidity.stakeToCcyVolume** (set to 20 at time of writing) determines the notional volume (price * contract volume) the LP has to provide on each side of the book to count as meeting the SLA at any given time point.
        - For example, if the **market.liquidity.stakeToCcyVolume** value is 20 and the stake is 100, the requirement could be met by (assuming all prices are within the SLA price bounds as defined above):
            - A bid of 200 units at price 10 and an ask of 100 units at price 20
            - Bids of 100 units at price 10 and 50 units at price 20 and an ask of 50 units at price 40
        - It is important not to set this too high as it entails a commitment to be providing this volume much of/all of the time, and failing to do so will result in missing out on the entirety of LP fees which could have been received.
    - This amount can be increased or decreased in future, however equity-like share only accrues on the supplied amount, and reducing the stake will irrecoverably lose some portion of the equity-like share.
    - The current equity-like share also translates to a voting power in market update proposals, allowing LPs some say over the maintenance of markets they are supporting.
    - Additional liquidity supplied above the SLA requirement still yields LP benefits as it is still included when calculating the LP's instantaneous liquidity score, so a strategy of committing to some base level then providing increased liquidity when possible can also be beneficial.
2. **Submit your commitment transaction on-chain**
    - The exact steps for constructing and sending a liquidity commitment will depend on the individual LP's choice of programming language/systems, however the steps and a template for the submission can be found [here](https://docs.vega.xyz/mainnet/tutorials/committing-liquidity)
3. **Start running and monitoring your market making algorithms**
    - When monitoring an active liquidity provision, beyond what is required of monitoring any trading strategies, there are additional fields of interest contained within the **Liquidity** tab when viewing a market. A few which may be of particular use are:
    1. The **Adjusted Stake** shows the current staked volume plus any equity-like share growth which has occurred to it. The **Share** column next to it shows this value as a percentage of the sum across LPs.
    2. This column shows fees currently accrued across the epoch. Although these can change at the end of the epoch due to SLA rebalancing, this is the result of the distribution of fees at each tilmestep based on ELS and liquidity score.
    3. The live time on book this epoch. This is the percentage of the so far elapsed epoch for which the LP has met their SLA requirement.
    4. This column displays the live liquidity score as a percentage of the total across all LPs. This is the score derived from volume on the book and its associated probability of trading. The product of this and the LP's ELS decide LP fee distributions. This value is responsive to changes of the liquidity intra-epoch so any improvements in pricing can be observed here to see how they improve the score.
    
    ![Liquidity Tab Columns](/img/101/liquidity-provision/liq-columns.png)
    