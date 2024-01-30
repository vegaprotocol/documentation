---
sidebar_position: 1
title: Token Economics
hide_title: false
---

import NetworkParameter from '@site/src/components/NetworkParameter';

# Token Economics

The VEGA token is an ERC-20 token used for staking and platform governance, allowing holders to take part in the creation and maintenance of markets alongside various other protocol level configurations. The token itself is not necessary for trading, and is non-inflationary with all fees paid for trading on the network paid in the traded asset.

# Token Details

Ethereum Address: [0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e](https://etherscan.io/address/0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e)

Issued: 64,999,723 VEGA

# Staking

Held tokens can be staked to validators once associated to a key on the Vega protocol network in order to receive a portion of infrastructure fee revenue. This can be completed using the front-end at [https://token.vega.xyz/validators](https://token.vega.xyz/validators) and further information on staking can be found [here](https://docs.vega.xyz/mainnet/concepts/vega-chain/proof-of-stake). In return for helping support the protocol stakers receive a proportion of the fees their staked validator receives. Stakers receive a fraction defined by the network parameter <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.delegatorShare" hideName={false} /> of the fees their validator receives, with validators receiving a proportion of the collected [infrastructure fee](../trading-on-vega/fees.md#infrastructure-fee) according to their [voting power](../vega-chain/validator-scores-and-rewards.md).

Currently active validators and their respective stakes and performances can be checked on the [Governance dApp](https://token.vega.xyz/validators). 

# Governance

Once staked, VEGA tokens also allow holders to vote on proposals on the Vega network itself, along with proposing their own changes. These proposals range from changing network parameters to proposing entirely new markets. 

Active proposals can be found at [https://token.vega.xyz/proposals](https://token.vega.xyz/proposals) whilst a more in-depth guide to the various governance options can be found at [https://docs.vega.xyz/mainnet/concepts/governance](https://docs.vega.xyz/mainnet/concepts/governance).