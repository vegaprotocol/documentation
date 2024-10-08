---
sidebar_position: 1
title: Trading
hide_title: false
---
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

The Vega protocol software is built to provide a framework for creating markets for trading financial instruments that are based on the values of their underlying assets. Markets must be initiated and voted on by tokenholders.

The Vega protocol software supports the following cash-settled products:
* dated futures markets
* perpetual futures markets
* spot markets

[Learn about cash settlement on Investopedia. ↗](https://www.investopedia.com/terms/c/cashsettlement.asp)

Participants can submit market, limit, pegged orders. They can also act as market makers in exchange for a portion of the fees by submitting the liquidity commitment transaction and fulfilling the requirements associated with it.

## Automated market processes
As markets and collateral are not managed through human intervention, markets must have certain automated processes to assure that the collateral required to manage positions is available when it's needed.

There are a few mechanisms that work differently to how they would on a centralised exchange. 

They include:
- [**Cross margining**](./margin.md#cross-margining): When a participant places an order using cross margin mode, the *initial margin* requirement is calculated automatically depending on the market's risk model. If the market moves against the participant, and the margin towards the *maintenance level*, the software will *search* for more collateral in the general account, to avoid liquidating the position. Margin can also be *released* if the position is in sufficient profit. Other positions in markets with the same settlement asset may also interact with the same general account. 
- [**Margin isolated per position**](./margin.md#isolated-margin): When a participant places an order using isolated margin mode, the expected margin required for the life of the order, if it's filled, is set aside. The network continually tracks the requirements for open orders and positions to ensure there is enough margin to keep them open.
- [**Mark to market**](./margin.md#mark-to-market): Mark to market happens much more frequently than on typical exchanges. Marking to market is used to move assets into your margin account (from someone else's) if you are in profit, or out of your margin account if not.


<DocCardList items={useCurrentSidebarCategory().items}/>