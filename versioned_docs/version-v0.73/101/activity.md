---
sidebar_position: 6
title: Activity streaks
hide_title: false
---

When enabled, activity streaks on Vega Protocol reward users who actively use the protocol and thus contribute to the ecosystem consistently over time. Activity streaks are measured by the number of consecutive epochs in which the public key has either made a trade or held an open position, and can be configured to carry over for a number of epochs without activity.

An activity streak can grant several customisable benefits, which can be scaled to increase as the length of the activity streak does. These are:

1. **Reward multiplier:** Scales a participant's reward share in all reward pools they've accessed. For example, in a *maker fees paid* reward pool, if your reward multiplier was 1.5x and you paid fees of 10 USDT during the epoch, when weighting you score vs. others for maker fee paid reward distributions, you would have an effective 15 USDT of fees credited.
2. **Vesting multiplier:** This multiplier scales what proportion of vesting rewards will vest each epoch. For example, if by default 25% of the vesting rewards vest per epoch, and you have a 1.5x multiplier, you would have a vesting rate of 37.5% (25 * 1.5) per epoch.

For a deeper dive, see the main [activity streak section](../trading-on-vega/discounts-rewards.md#activity-streak).