---
sidebar_position: 1
title: Governance
vega_network: TESTNET
hide_title: false
description: Governance allows tokenholders to make on-chain decision.
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

## Overview
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. Contribute to the network by voting or submitting proposals.

Proposals are enacted if they get enough votes from VEGA holders. There's no limit to how many active proposals you can vote on.

Vega supports on-chain proposals for:
**Markets**: Creating new markets and changing parameters for existing ones
**Assets** - Adding new assets and changing parameters for existing ones
**Transferring network assets** - Moving network-held assets to different accounts or keys
**Network parameters** - Changing the values of existing parameters to change network and market behaviour
**Freeform** - Exploring community sentiment for actions that may or may not be enacted on-chain

:::tip Try it out
**[Vega governance dApp ↗](https://governance.fairground.wtf)**: Read through and vote on active proposals.
:::

:::info Looking for proposal templates?
**[Tutorials: Governance proposals](../../tutorials/proposals/index.md)**: See the full range of proposal templates and descriptions of the fields.

## Governance topics
<DocCardList items={useCurrentSidebarCategory().items}/>