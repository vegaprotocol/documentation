---
sidebar_position: 6
title: Activity Streaks
hide_title: false
---

# Activity Streaks

When active, Activity Streaks on Vega Protocol serve to reward users actively using the protocol and thus contributing to its ecosystem consistently over time. Activity streaks are measured in number of consecutive epochs in which the key has either made a trade or held an open position within the epoch, and can be configured to carry over for a number of epochs without activity.

An activity streak can grant several customisable benefits, which can be scaled to increase at the length of the activity streak does. These are:

1. **Reward Multiplier:** This multiplier scales a party's reward share in all reward pools in which they are included. For example, in a maker fees paid reward pool, if the trader's reward multiplier was 1.5x and they had paid 10 USDT of fees during the epoch, when weighting their score vs others to define maker fee paid reward distributions they would have an effective 15 USDT of fees credited.
2. **Vesting Multiplier:** This multiplier scales the proportion of vesting rewards which vest each epoch. For example, if by default 25% of the vesting rewards vest per epoch, and you have a 1.5x multiplier, instead 37.5% (25 * 1.5) of the rewards would vest.