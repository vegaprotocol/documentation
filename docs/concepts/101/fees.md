---
sidebar_position: 2
title: Fees
hide_title: false
---

# Fees

Participants in the Vega network who place orders on the order book, provide liquidity and run the network infrastructure receive the fees that traders pay on filled trades and transfers. The protocol does not charge gas fees for interacting with the network.

You can offset some of those fees, or earn even more, by receiving discounts or getting rewards based on trading activity. Rewards can be funded by anyone, and can be in any asset. See the rewards that are currently available on [vega.xyz ↗](https://vega.xyz/rewards).

[Concept: Discounts and rewards](https://docs.vega.xyz/mainnet/concepts/trading-on-vega/discounts-rewards)

At the time of writing the current fees for taker trades is 0.045% across all markets. This breaks down as:

- 0.03% Infrastructure Fee
- 0.01% Liquidity Provider Fee
- 0.005% Maker Fee

The meaning of each is covered [here](../trading-on-vega/fees.md). The Infrastructure and Maker fees are set by governance at a network level and the Liquidity Provider Fee is set independently for each market, and may be either set dynamically or configured statically in the market configuration, however at time of writing all are at 0.01%. 

## Fee discounts based on trading volume
Traders can get discounts on their [fees](./fees.md) when there's an active volume discount program on the network. The higher your volume of aggressive trades on a market, the greater the discount you can receive.

The size of the discount, generally speaking, depends on the volume of your taker trades over a set window of time. You can get access to different levels of discounts when your trading volume is higher.

All of the details for the volume discount program are proposed and accepted through governance. You can see what the current program offers by checking the [volume discount program API](../../api/rest/data-v2/trading-data-service-get-current-volume-discount-program.api.mdx).

:::note Read more
* [Tutorial: Propose enabling or changing the volume discount program](../../tutorials/proposals/volume-discount-program-proposal.md)
* [Spec: Technical design of the volume discount program ↗](https://github.com/vegaprotocol/specs/blob/master/protocol/0084-VDPR-volume_discount_program.md).
:::
