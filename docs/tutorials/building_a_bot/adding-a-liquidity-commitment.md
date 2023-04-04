---
title: Adding a Liquidity Commitment
sidebar_position: 3
hide_title: false
description: Add a Liquidity Commitment to the bot
---

This tutorial builds upon the basis of the codebase in [Streaming Data](streaming-data.md) so ensure you have run through that tutorial first if you want to build a working bot. 

In the last tutorial we built a bot which listened to streams of market data to update it's knowledge of position and order state to ensure it could trade with full knowledge without having to make repeated queries and incur that time cost. Now that we have a working bot, in this tutorial we are going to look at how one could extend the bot to have and manage a liquidity commitment. Before reading through this it is strongly advisable to read through the full guide to [liquidity provision on Vega Protocol](../../concepts/liquidity/index.md) to fully understand what a liquidity provision entails alongside the general guide to [providing liquidity](../committing-liquidity.md). However, briefly here, committing liquidity to a Vega Protocol market means that:

- A party makes a commitment to always provide both a bid and ask order for a given market. As a guarantee of this they lock a portion of their funds in a `bond` account, which will remain there untouched so long as their commitments are met. The exact size of orders required is determined by the size of the bond and a further network controlled parameter. 
- In return for this commitment a party receives a portion of all fees paid on the market, whether they were the maker party in the trade or not. 
- As part of their commitment message a party must specify orders which should be placed onto the market should their manually placed orders not sufficiently meet their requirement at any time. These are defined in terms of offsets from either the mid price or the best bid/ask prices.
- To count towards a commitment orders must be within a certain percentage of the midprice on a market. If limit orders are outside these bounds they will not count towards the commitment. If the orders specified in the initial liquidity commitment message are offset such that they are outside these bounds they will be placed just inside the bounds instead.
- The exact proportion of the fees received is based upon a combination of the commitment bond size relative to others' alongside how competitive the placed limit orders were across the epoch.

So whilst a liquidity commitment can mean a trader receives fees they would not otherwise have received, they must be aware that it ties them into always offering to buy/sell the instrument whatever market conditions. Whilst in general a liquidity provider can withdraw at any time, if withdrawing their commitment would bring the market below the currently required stake to stay out of auction then this will be impossible.

That said, for the purposes of this tutorial we are comfortable taking on this commitment and will continue.

## Making a Commitment

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
        "buys": [
            {
                "offset": "0",
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_BEST_BID",
            },
        ],
        "sells": [
            {
                "offset": "0",
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_BEST_ASK",
            },
        ],
    }

```

Which will be our functions for generating a liquidity provision submission and amending. The structures for the submission and amendment are the same other than the tag on the outer layer. An amendment will totally replace what was there previously, and only one liquidity provision can be active for any given market. Here we are hardcoding our offset to `0` which will mean a liquidity provision would always place its orders at best bid and ask. This could be risky if positions are not monitored, so one potential other solution would be to set these offsets large enough that placed orders were always at the bounds of where they could be. These orders would be unlikely to attract much in the way of fees but would be less likely to trade. 

We're almost there with this one, jumping back to `main.py` let's add it into our trading flow.

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

Here we're loading some details then creating our liquidity commitment. Once it's created, we don't necessarily need to amend it unless we want to increase, decrease or change our pegged order description. In this tutorial we're keeping it simple so won't be doing any of that, but one particular thing you may want to consider is increasing the commitment if that would get the market out of auction. This will also allow you to set the fee, as the minimum fee required to keep the market out of auction is the one used.

Finally, add a section at the end of `main` after `vega_store.stop()` to cancel the liquidity provision when we exit the trader:

```python
    # Cancel Liquidity Commitment
    wallet = VegaWallet(token=token, wallet_url=wallet_url, pub_key=party_id)
    wallet.submit_transaction(
        sub.liquidity_commitment_cancellation(market_id=market_id)
    )
```

There are obviously occasions currently, such as a crash, which would mean this cancellation was not called. If adapting this setup to run on a production market then it would be wise to make this more robust, or at least have a separate script simply to cancel.

Now that we have these two components, you can once more run with `python -m main` and see your liquidity commitment appear on the Console. You may also see some liquidity provision orders be created depending upon what you are quoting in your standard limit orders.

Now that you have a liquidity commitment, and if you haven't already, you may want to look at the [other tutorial](adding-an-external-price.md) at this level where we add in an external price feed to base our pricing on.