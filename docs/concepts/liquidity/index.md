---
sidebar_position: 5
title: Liquidity on Vega
hide_title: false
---
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

Each market has its own liquidity. Liquidity providers earn fee revenue from participants trading on the market they're providing liquidity to. LPs receive a cut of the liquidity fee paid by traders on the market. In addition, they can receive [rewards funded by members of the community](./rewards-penalties.md#community-funded-lp-rewards).

There are two ways to provide liquidity to a market:

* [Automated market making](./amm.md)
* [Actively-maintained liquidity commitments](./provision.md)

LPs who take a bigger risk on newer markets with less liquidity are rewarded for taking a bigger risk because you can earn more per trade. Markets where there are many participants committing liquidity benefit from lower fees for traders, because there is more competition for the fee percentage paid by traders.

**[Liquidity fees](./rewards-penalties.md#earning-liquidity-fees)** are determined based on the commitments and proposed fee levels chosen by the providers, not by the protocol.

## Tactics for providing liquidity
Providing liquidity can be done using:
* [Automated market making](./amm.md) strategy
* Standard limit orders, which give you the most control over your strategy. The [batch orders transaction](../trading-on-vega/orders.md#batch-order) is designed to enable this efficiently
* [Iceberg orders](../trading-on-vega/orders.md#iceberg-order) allow LPs to remain competitively present on the order book without needing to supply excessive volume to a large aggressive order

Anyone that supplies limit orders is eligible to receive maker fees when volume you place on the book is hit. A liquidity commitment also makes an LP eligible to receive a portion of the liquidity fee from every trade in the market, on top of the maker fee.

:::info Read more
**[Concept: Rewards and penalties](./rewards-penalties.md)**: LPs receive rewards (through fees paid by traders) when they meet their commitment. Fees are withheld, and they can be further penalised for not meeting their commitment.
:::

You need to have enough available assets to cover the margin for your orders and the positions that will be generated from trades.

## How orders are matched with liquidity

For all incoming active orders, the matching process coordinates between the on-book (actively managed liquidity) and off-book (AMM) liquidity sources. 

When an order comes in that may immediately trade because there are not already resting orders of the same type for the best applicable price, the following steps occur until the order's full volume has traded:

All on-book orders are checked first when an active order comes in. Any volume at the first applicable price level that can be filled with on-book orders trades.

Then, AMMs are checked to determine if they can fill any of the remaining volume, and as much of that volume is filled as possible.

<DocCardList items={useCurrentSidebarCategory().items}/>