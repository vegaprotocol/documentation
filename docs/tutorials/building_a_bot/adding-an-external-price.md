---
title: Adding an external price feed
sidebar_position: 3
hide_title: false
description: Add an external price feed to the bot.
---


This tutorial builds upon the basis of the codebase in [Streaming Data](streaming-data.md) so ensure you have run through that tutorial first if you want to build a working bot. 

## External Prices

### The Current Setup

In the last tutorial we built a bot which listened to streams of market data to update it's knowledge of position and order state to ensure it could trade with full knowledge without having to make repeated queries and incur that time cost. Now that we have a working bot, in this tutorial we will add in a connection to a Binance price feed to make our quoting slightly smarter. Before we do that, let's review how we currently set our prices:

```python
if position < max_abs_position:
    submissions.append(
        sub.OrderSubmission(
            market_id=market_id,
            size=1,
            price=latest_data.best_bid_price,
            time_in_force="TIME_IN_FORCE_GTC",
            type="TYPE_LIMIT",
            side="SIDE_BUY",
        )
    )
if position > -1 * max_abs_position:
    submissions.append(
        sub.OrderSubmission(
            market_id=market_id,
            size=1,
            price=latest_data.best_offer_price,
            time_in_force="TIME_IN_FORCE_GTC",
            type="TYPE_LIMIT",
            side="SIDE_SELL",
        )
    )
```

As you can see, we're pretty blindly quoting at whatever the best bid and offer are on the market. That works, but it's not exactly ideal. For one thing, if the market is quoting very incorrect prices we don't really want to be doing the same, and secondly we could even be looking at our own orders, if the rest of the market widens out ours will just sit there until someone trades with them! So let's try and improve that, at least a little, and think about trading fees along the way.

### Moving External

To do this, we're going to add in a feed to a Binance spot price, and then quote based on a spread around that. To start this off, add a new line to our `requirements.txt` for `python-binance` and run `python -m pip install -r requirements.txt` once again.

Now, create a new file in `bot/` called `binance_store.py` and populate it with:

```python
from threading import Lock
from typing import Any, Optional

from binance import ThreadedWebsocketManager
from binance.client import Client

from bot.models import ReferencePrice


class BinanceStore:
    def __init__(self, symbols_to_subscribe: list[str]):
        """Runs a websocket client listening to a list of binance tickers
        and storing their latest best bid/ask prices to be consumed later.

        Start the client by calling `start`.

        Args:
            symbols_to_subscribe:
                list[str], list of binance symbols to which to listen
        """
        self._ws_client = ThreadedWebsocketManager()
        self._client = Client()

        self._symbols = symbols_to_subscribe
        self._lock = Lock()

        # Elements in a list to allow atomic updates and avoid locks
        self._reference_prices = {}

    def start(self) -> None:
        """Start the websocket client, listening to passed symbols
        and storing their market data on each tick to be read on demand
        by trader.
        """
        for symb in self._symbols:
            ticker = self._client.get_orderbook_ticker(symbol=symb)
            self._reference_prices[ticker["symbol"]] = ReferencePrice(
                symbol=ticker["symbol"],
                bid_price=float(ticker["bidPrice"]),
                ask_price=float(ticker["askPrice"]),
            )

        self._ws_client.start()
        self._ws_client.start_multiplex_socket(
            callback=self._on_tick,
            streams=[f"{symb.lower()}@bookTicker" for symb in self._symbols],
        )

    def stop(self) -> None:
        """Stops the websocket client"""
        self._ws_client.stop()

    def _on_tick(self, tick: dict[str, Any]) -> None:
        tick_data = tick["data"]
        ref_price = ReferencePrice(
            symbol=tick_data["s"],
            bid_price=float(tick_data["b"]),
            ask_price=float(tick_data["a"]),
        )
        with self._lock:
            self._reference_prices[ref_price.symbol] = ref_price

    def get_reference_prices(self) -> list[ReferencePrice]:
        with self._lock:
            return list(self._reference_prices.values())

    def get_reference_price_by_symbol(self, symbol: str) -> Optional[ReferencePrice]:
        with self._lock:
            return self._reference_prices[symbol]

```

This is mostly boilerplate for interacting with the `binance` wrapper, but what we're broadly doing here is setting up a manager which will, like our `VegaStore`, listen to Binance websockets for a given price and update it's internal pricing. This will allow us to query that value each loop without having to wait for a REST request. 

Next, add a new section to `.env`:

```bash
# Binance config
BINANCE_MARKET=YOUR_MARKET_HERE
```

This sets up our Binance connection parameters. Choose a Binance spot market name which is a good match for your chosen Vega market and put its name in `BINANCE_MARKET` field. For example if you are looking at a `BTC-USDC` market on Vega you might put in `BTCUSDC`.

Now jump back to `main.py` and make a few changes. First, add an import for our new class at the top:

```python
from bot.binance_store import BinanceStore
```

### Connecting up the Feed

Now update the `_run` function to have these arguments (adding in `binance_store`):

```python
def _run(
    node_rest_url: str,
    market_id: str,
    party_id: str,
    token: str,
    wallet_url: str,
    vega_store: store.VegaStore,
    binance_store: BinanceStore,
    binance_symbol: str,
    max_abs_position=1,
):
```

Now to create it and pipe it in there, update the `main` function to start with:

```python
def main(
    node_rest_url: str,
    node_ws_url: str,
    market_id: str,
    party_id: str,
    token: str,
    wallet_url: str,
    binance_market: str,
    max_abs_position=1,
):
    vega_store = store.VegaStore(websocket_url=node_ws_url, rest_api_url=node_rest_url)
    vega_store.start(market_id=market_id, party_id=party_id)

    binance_store = BinanceStore(symbols_to_subscribe=[binance_market])
    binance_store.start()

    run_thread = threading.Thread(
        target=_run,
        kwargs={
            "node_rest_url": node_rest_url,
            "market_id": market_id,
            "party_id": party_id,
            "token": token,
            "wallet_url": wallet_url,
            "max_abs_position": max_abs_position,
            "vega_store": vega_store,
            "binance_store": binance_store,
            "binance_symbol": binance_market,
        },
        daemon=True,
    )
    run_thread.start()

    # Now run event loop (Send SIGINT (Ctrl+C) to close)
    rel.dispatch()
    vega_store.stop()
    binance_store.stop()  # Adding a stop here for the Binance store too
```

(don't forget to retain the section cancelling the liquidity commitment if you have already run through that tutorial) and finally pass in the required market by updating our call to `main` to be:

```python
main(
    node_rest_url=os.environ["NODE_URL"],
    node_ws_url=os.environ["WS_URL"],
    market_id=os.environ["MARKET_ID"],
    token=os.environ["WALLET_TOKEN"],
    party_id=os.environ["PARTY_ID"],
    wallet_url=os.environ["WALLET_URL"],
    binance_market=os.environ["BINANCE_MARKET"],
    max_abs_position=1,
)
```

### Incorporating Fees

Now we have access to the Binance store inside our bot we should make use of it. But first a short digression on fees, as if we're setting our own prices we should start to consider them. By taking a price feed from Binance, what we are really saying is that if we notice a difference between a price on Binance and on the corresponding Vega market we may want to capitalise on that difference by buying/selling on Vega and selling/buying on Binance. However to do that we're probably going to incur fees, (though these will vary depending on how we execute the trades) so we only want to do this if the difference is large enough to profit. To take some indicative numbers, and make some assumptions, at time of writing both the maker and taker fees for spot trading on Binance sit at `0.1%` assuming no discounts are applied. Meanwhile the `maker` fee, paid to the maker in a trade on the Vega Protocol testnet is `0.02%`. It is entirely possible both of these numbers have changed by the time you read this so be sure to explore for yourself, and mainnet fees on Vega Protocol may also change depending on community decisions, but for now they will do. If we combine the `0.1%` fee from Binance and a `0.02%` rebate from Vega Protocol we only want to execute if we get a price `0.08%` better than on Binance (e.g. sell `0.08%` higher than we can buy on Binance and buy `0.08%` lower than we can sell). For now for simplicity we assume on Binance we will execute with market orders to close out the trade immediately. 

In a real strategy we would also want to take into account:

- Fees to transfer funds between Binance and Vega Protocol, as they may build up in one location or another
- Execution differences. Perhaps we will sometimes want to aggresively take a price on Vega if it is very good, however this will incur higher fees so we should be sure the difference is large enough

For now though to implement our strategy, update our price generation to:

```python
ref_price = binance_store.get_reference_price_by_symbol(binance_symbol)
if position < max_abs_position:
    submissions.append(
        sub.OrderSubmission(
            market_id=market_id,
            size=1,
            price=ref_price.bid_price * 0.992,
            time_in_force="TIME_IN_FORCE_GTC",
            type="TYPE_LIMIT",
            side="SIDE_BUY",
        )
    )
if position > -1 * max_abs_position:
    submissions.append(
        sub.OrderSubmission(
            market_id=market_id,
            size=1,
            price=ref_price.bid_price * 1.008,
            time_in_force="TIME_IN_FORCE_GTC",
            type="TYPE_LIMIT",
            side="SIDE_SELL",
        )
    )
```

You can see here we are taking the reference price from Binance, looking at the current bid price (which we would be trying to execute at on Binance if someone buys from us on Vega Protocol) and scaling that out by the fees we incur. We then do similar for our sale price. In the real world we would obviously want to increase this a little because currently we're making no profit from the transaction, but should at least help liquidity on the market.

### Putting it Together

From here, you can kick off your bot once more with `python -m main` and see the results. You will likely see that your spreads have become much wider as a result, and may no longer be competitive, which is fair because if it were this easy someone else would probably have already done it! However we've now covered the basics of how this setup could work, and how to listen to an external price and feed that through, considering fees, into a potential price on Vega Protocol. 

If you want to look at another way to potentially enhance your bot, and haven't already run through it, jump over to the [liquidity provision](adding-a-liquidity-commitment.md) tutorial to learn about maintaining a liquidity commitment.