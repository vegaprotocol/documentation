---
title: Adding a liquidity commitment
sidebar_position: 3
hide_title: false
description: Add a liquidity commitment to the bot
---
import NetworkParameter from '@site/src/components/NetworkParameter';

This tutorial builds upon the basis of the codebase in [streaming data](streaming-data.md), so ensure you have run through that tutorial first if you want to build a working bot.

:::caution Build with care
As described in the open source license, the Vega Protocol software and supporting documentation is provided “as is”, at your own risk, and without warranties of any kind.

The information provided in this tutorial does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the content as such. Gobalsky Labs Limited does not recommend that any asset should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.

No developer or entity involved in creating the Vega protocol or supporting documentation will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Vega Protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or legal costs, loss of profits, cryptocurrencies, tokens, or anything else of value.
:::

In the last tutorial you built a bot that listened to streams of market data to update its knowledge of position and order state to ensure it could trade with full knowledge without having to make repeated queries and incur that time cost. Now that you have a working bot, this tutorial will look at how one could extend the bot to have and manage a liquidity commitment. 

:::note Pre-reading
Before reading through this it is strongly advisable to read through the full guide to [liquidity provision](../../concepts/liquidity/index.md) to fully understand what a liquidity provision entails and requires of you.
:::

In brief, committing liquidity to a market means that:
- A party makes a commitment to always provide both a bid and ask order for a given market. As a guarantee of this they lock a portion of their funds in a bond account, which will remain there untouched so long as their commitments are met. The exact size of orders required is determined by the size of the bond and a further network controlled parameter. 
- In return for this commitment, a party receives a portion of all fees paid on the market, whether they were the maker party in the trade or not. 
- To count towards a commitment, orders must be within a certain percentage of the mid price on a market. If limit orders are outside these bounds they will not count towards the commitment. If the orders specified in the initial liquidity commitment message are offset such that they are outside these bounds they will be placed just inside the bounds instead.
- The exact proportion of the fees received is based upon a combination of the commitment bond size relative to others', alongside how competitive the placed limit orders were across the epoch.
- The amount of time during an epoch where the party must meet the commitment is defined by the SLA settings on the market. There will be a minimum percentage of time, below which the LP may have a penalty to their bond applied depending on the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.sla.nonPerformanceBondPenaltyMax" />, but will never receive a portion of the paid liquidity fees within the epoch even if no penalty is applied. Above the SLA, the LP is eligible to receive fees, however there may be a reweighting of some portion of received fees within the set of LPs who met the target to reward those who are on the book a higher percentage of time. 

Whilst a liquidity commitment can mean a trader receives fees they would not otherwise have received, they must be aware that it is a commitment to provide prices whenever possible, whatever the conditions. Whilst in general a liquidity provider can withdraw at the end of any epoch, if withdrawing their commitment would bring the market below the current target stake then a penalty may be applied to the withdrawn bond amount.

With the awareness of these constraints, this tutorial will cover the basic steps required to submit the liquidity commitment.

:::note Read more
[Providing liquidity](../../concepts/liquidity/index.md)
[Liquidity bond accounts](../../concepts/assets/accounts.md#liquidity-bond-accounts)
:::

## Making a commitment

Open `submission.py` and add to the end:

```python
def liquidity_commitment_submission(
    market_id: str, amount: float, asset_decimals: int, proposed_fee: float
):
    return {
        "liquidityProvisionSubmission": _liquidity_provision_base(
            market_id=market_id,
            amount=amount,
            asset_decimals=asset_decimals,
            proposed_fee=proposed_fee,
        )
    }


def liquidity_commitment_amendment(
    market_id: str, amount: float, asset_decimals: int, proposed_fee: float
):
    return {
        "liquidityProvisionAmendment": _liquidity_provision_base(
            market_id=market_id,
            amount=amount,
            asset_decimals=asset_decimals,
            proposed_fee=proposed_fee,
        )
    }


def liquidity_commitment_cancellation(market_id: str):
    return {
        "liquidityProvisionCancellation": {
            "marketId": market_id,
        },
    }


def _liquidity_provision_base(
    market_id: str, amount: float, asset_decimals: int, proposed_fee: float
):
    return {
        "marketId": market_id,
        "commitmentAmount": str(
            convert_from_decimals(decimal_places=asset_decimals, number=amount)
        ),
        "fee": str(proposed_fee),
    }

```

Those will be the functions for generating a liquidity provision submission and amending. The structures for the submission and amendment are the same, other than the tag on the outer layer. An amendment will totally replace what was there previously, and only one liquidity provision can be active for any given market. 

The commitment amount covers the funds which will be transferred into the bond account for the specific market.

Keep in mind that your commitment amount will be scaled by the network parameter <NetworkParameter frontMatter={frontMatter} param="market.liquidity.stakeToCcyVolume" formatter="percent" hideName={false} /> to determine the on-book volume required for your commitment.

## Making the commitment live

We're almost there with this tutorial. Jumping back to `main.py` let's add it into our trading flow.

Just after you've created your wallet within `_run`, add these lines:

```python
asset_id = vega_store.get_market_by_id(market_id=market_id).settlement_asset_id
to_commit = [
    acc
    for acc in vega_store.get_accounts()
    if acc.account_type == "ACCOUNT_TYPE_GENERAL" and acc.asset_id == asset_id
][0].balance / 4

wallet.submit_transaction(
    sub.liquidity_commitment_submission(
        market_id=market_id,
        amount=to_commit,
        asset_decimals=vega_store.get_asset_by_id(asset_id=asset_id).decimal_places,
        proposed_fee=0.03,
    )
)
```

Your final code should look like:

```python
    wallet = VegaWallet(token=token, wallet_url=wallet_url, pub_key=party_id)

    asset_id = vega_store.get_market_by_id(market_id=market_id).settlement_asset_id
    to_commit = [
        acc
        for acc in vega_store.get_accounts()
        if acc.account_type == "ACCOUNT_TYPE_GENERAL" and acc.asset_id == asset_id
    ][0].balance / 4

    wallet.submit_transaction(
        sub.liquidity_commitment_submission(
            market_id=market_id,
            amount=to_commit,
            asset_decimals=vega_store.get_asset_by_id(asset_id=asset_id).decimal_places,
            proposed_fee=0.03,
        )
    )

    while True:
```

Here we're loading some details then creating a liquidity commitment. Once it's created, you don't necessarily need to amend it unless you want to increase, decrease, or change the pegged order description. In this tutorial we're keeping it simple and won't be doing any of that, but one particular thing you may want to consider is increasing the commitment if that would get the market out of auction. This will also allow you to set the fee, as the minimum fee required to keep the market out of auction is the one used.

## Putting it all together

Finally, add a section at the end of `main` after `vega_store.stop()` to cancel the liquidity provision when you exit the trader:

```python
    # Cancel Liquidity Commitment
    wallet = VegaWallet(token=token, wallet_url=wallet_url, pub_key=party_id)
    wallet.submit_transaction(
        sub.liquidity_commitment_cancellation(market_id=market_id)
    )
```

There are occasions currently, such as a crash, which would mean this cancellation was not called. If adapting this setup to run on a production market, then it would be wise to make this more robust, or at least have a separate script simply to cancel.

Now that you have these two components, you can once more run with `python -m main` and see your liquidity commitment appear. You may also see some liquidity provision orders be created depending on what you are quoting in your standard limit orders.

Now that you have a liquidity commitment, and if you haven't already, you may want to look at the [other tutorial](adding-an-external-price.md) at this level where you can add in an external price feed to base pricing on.