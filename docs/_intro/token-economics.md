---
sidebar_position: 1
title: Token economics
vega_network: TESTNET
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

The VEGA token is an ERC-20 token used for staking and platform governance, allowing holders to take part in the creation and maintenance of markets alongside various other network level configurations. The token itself is not necessary for trading, and is non-inflationary with all fees paid for trading on the network paid in a market's settlement asset.

## Token details

Ethereum Address: [0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e](https://etherscan.io/address/0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e)

Issued: 64,999,723 VEGA

## Staking

Held tokens can be staked to validators once associated to a key on the Vega network. Stakers receive a portion of infrastructure fee revenue. This can be completed using the [governance dApp ↗](https://token.vega.xyz/validators). Learn more on the [proof of stake](../concepts/vega-chain/proof-of-stake.md) page.
 
In return for helping support the protocol, stakers receive a proportion of the fees their staked validator receives. Stakers receive a fraction of the fees their validator receives, which is defined by a network parameter: <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" />. Validators receive a proportion of the collected [infrastructure fee](../concepts/trading-on-vega/fees.md#infrastructure-fee) according to their [voting power](../concepts/vega-chain/validator-scores-and-rewards.md).

Check active validators and their respective stakes and performances using the [governance dApp ↗](https://token.vega.xyz/validators). 

## Governance

Once staked, governance tokens also allow holders to vote on governance proposals, along with proposing their own changes. These proposals range from changing network parameter values to proposing entirely new markets. 

Active proposals can be found on the [governance dApp proposals page ↗](https://token.vega.xyz/proposals) whilst a more in-depth guide to the various governance options can be found on the [governance](../concepts/governance/index.md) concepts page.