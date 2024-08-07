---
sidebar_position: 6
title: Network parameters
vega_network: MAINNET
hide_title: false
description: Change network configuration parameters.
---
import NetworkParameter from '@site/src/components/NetworkParameter';

There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. 

Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals to change the values of existing network parameters.

Network parameters can only be added and removed with Vega core software releases.

:::note Go deeper
* [Concept: Network parameters](../vega-chain/network.md#parameters)
* [Network parameters: See full list on the block explorer ↗](https://explorer.vega.xyz/network-parameters)
* [Tutorial: Propose a network parameter change](../../tutorials/proposals/network-parameter-proposal.md)
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
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';
