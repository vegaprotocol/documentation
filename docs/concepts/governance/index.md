---
sidebar_position: 1
title: Governance
hide_title: false
description: Governance allows tokenholders to make on-chain decision.
---
import NetworkParameter from '@site/src/components/NetworkParameter';
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

## Overview
Governance allows for arriving at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject.

Proposals are enacted if they get enough votes from tokenholders. There's no limit to how many active proposals you can vote on.

The Vega software provides functionality to support on-chain proposals for governing:
* **Markets**: Creating new markets and changing parameters for existing ones
* **Assets** - Adding new assets and changing parameters for existing ones
* **Transferring network assets** - Moving network-held assets to different accounts or keys
* **Network parameters** - Changing the values of existing parameters to change network and market behaviour
* **Freeform** - Exploring community sentiment for actions that may or may not be enacted on-chain

:::note Looking for proposal templates?
**[Tutorials: Governance proposals](../../tutorials/proposals/index.md)**: See the full range of proposal templates and descriptions of the fields.
:::

## Governance topics
<DocCardList items={useCurrentSidebarCategory().items}/>