---
title: Streaming data
sidebar_position: 2
hide_title: false
description: Enhance the bot with a data stream.
---

This tutorial builds upon the basis of the codebase in [Getting Started](getting-started.md), so ensure you have run through that tutorial first if you want to build a working bot. 

In the last tutorial we built a bot that looped infinitely, checking its position on a market and the live prices before submitting its own orders based on that. However, as noted, despite sleeping for only 1s at the end of each iteration, it only actually runs through the loop once every few seconds. This is down to the fact it had to call out to a REST API for each of these data updates. 

One way to speed this up is to set up listeners with WebSockets to stream these updates live. That is what will be set up in this tutorial.

## Listener

This tutorial will be using the methods from the [REST API](../../api/rest/data-v2/trading-data-service.mdx) `Subscription` endpoint for these streams. To start off with, add these two new lines to the `requirements.txt` file:

```
rel
websocket-client
```

Then with your `venv` activated rerun 
```bash
python -m pip install -r requirements.txt
```

Now create a file called `models.py` in the `bot` folder and paste the following into it:

```python
from dataclasses import dataclass

from bot.submission import convert_to_decimals


@dataclass
class ReferencePrice:
    symbol: str
    bid_price: float
    ask_price: float


@dataclass
class Position:
    party_id: str
    market_id: str
    open_volume: float
    average_entry_price: float
    unrealised_pnl: float
    realised_pnl: float


@dataclass
class Order:
    order_id: str
    market_id: str
    size: float
    remaining_size: float
    price: float
    order_type: str
    time_in_force: str
    status: str
    party_id: str


@dataclass
class Market:
    market_id: str
    state: str
    trading_mode: str
    decimal_places: int
    position_decimal_places: int
    code: str
    name: str
    settlement_asset_id: str

    mark_price: float = 0
    best_bid_price: float = 0
    best_offer_price: float = 0
    best_bid_volume: float = 0
    best_offer_volume: float = 0
    open_interest: float = 0


@dataclass
class Asset:
    asset_id: str
    status: str
    name: str
    symbol: str
    decimal_places: int


@dataclass
class Account:
    owner: str
    account_type: str
    balance: float
    asset_id: str
    market_id: str

    def get_id(self):
        return f"{self.owner}-{self.market_id}-{self.account_type}-{self.asset_id}"


@dataclass
class AppState:
    accounts: list[Account]
    orders: list[Order]
    positions: list[Position]
    assets: list[Asset]
    reference_prices: list[ReferencePrice]
    markets: list[Market]


def parse_asset(node: dict) -> Asset:
    details = node["details"]
    return Asset(
        node["id"],
        node["status"],
        details["name"],
        details["symbol"],
        int(details["decimals"]),
    )


def parse_account(node: dict, asset_decimal_places: int) -> Account:
    return Account(
        node["owner"],
        node["type"],
        convert_to_decimals(asset_decimal_places, float(node["balance"])),
        node["asset"],
        node["marketId"],
    )


def parse_order(
    node: dict, position_decimal_places: int, price_decimal_places: int
) -> Order:
    return Order(
        node["id"],
        node["marketId"],
        convert_to_decimals(position_decimal_places, float(node["size"])),
        convert_to_decimals(position_decimal_places, float(node.get("remaining", 0))),
        convert_to_decimals(price_decimal_places, float(node["price"])),
        node["type"],
        node["timeInForce"],
        node["status"],
        node["partyId"],
    )


def parse_position(
    node: dict,
    position_decimal_places: int,
    price_decimal_places: int,
    asset_decimal_places: int,
) -> Position:
    return Position(
        node["partyId"],
        node["marketId"],
        convert_to_decimals(position_decimal_places, float(node.get("openVolume", 0))),
        convert_to_decimals(price_decimal_places, float(node["averageEntryPrice"])),
        convert_to_decimals(asset_decimal_places, float(node["unrealisedPnl"])),
        convert_to_decimals(asset_decimal_places, float(node["realisedPnl"])),
    )


def parse_market(node: dict) -> Market:
    instrument = node["tradableInstrument"]["instrument"]
    return Market(
        node["id"],
        node["state"],
        node["tradingMode"],
        int(node["decimalPlaces"]),
        int(node["positionDecimalPlaces"]),
        instrument["code"],
        instrument["name"],
        instrument["future"]["settlementAsset"],
    )


parsers = {
    "markets": parse_market,
    "assets": parse_asset,
    "accounts": parse_account,
    "orders": parse_order,
    "positions": parse_position,
}

```

This file contains various mappings to convert JSON results into data classes. You can handle them locally more easily, and it is useful to read through to get a feel for the structure of some of these objects, but it doesn't contain too much in the way of new concepts so you can read through it later.

Next create a file called `vega_ws_client.py` with the following contents:

```python
import websocket
import rel
import logging
import json
from typing import Callable, Any


logger = logging.getLogger(__name__)


class VegaWebSocketClient:
    def __init__(self, data_node_url: str):
        self._data_node_url = data_node_url

    def _on_error(self, ws, err):
        logger.exception(err)

    def _on_message(
        self,
        message: str,
        callback: Callable[[dict], Any],
    ) -> None:
        callback(json.loads(message)["result"])

    def stop(self):
        rel.abort()

    # https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-observe-markets-data
    def subscribe_market_data(
        self, market_id: str, callback: Callable[[dict], Any]
    ) -> None:
        self.subscribe_endpoint(
            f"{self._data_node_url}/stream/markets/data?marketIds={market_id}",
            callback=callback,
        )

    # https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-observe-orders
    def subscribe_orders(
        self, market_id: str, party_id: str, callback: Callable[[dict], Any]
    ) -> None:
        self.subscribe_endpoint(
            f"{self._data_node_url}/stream/orders?marketIds={market_id}&partyIds={party_id}",
            callback=callback,
        )

    # https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-observe-positions
    def subscribe_positions(
        self, market_id: str, party_id: str, callback: Callable[[dict], Any]
    ) -> None:
        self.subscribe_endpoint(
            f"{self._data_node_url}/stream/positions?marketId={market_id}&partyId={party_id}",
            callback=callback,
        )

    # https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-observe-accounts
    def subscribe_accounts(
        self, market_id: str, party_id: str, callback: Callable[[dict], Any]
    ) -> None:
        self.subscribe_endpoint(
            f"{self._data_node_url}/stream/accounts?marketId={market_id}&partyId={party_id}",
            callback=callback,
        )

    def subscribe_endpoint(self, url: str, callback: Callable[[dict], Any]) -> None:
        ws = websocket.WebSocketApp(
            url,
            on_message=lambda _, msg: self._on_message(message=msg, callback=callback),
            on_error=self._on_error,
        )
        ws.run_forever(dispatcher=rel, reconnect=5)

```

Next, you can set up WebSocket connections to a few different endpoints on a data node server. These will listen to messages sent actively by the data node and react to them as soon as they arrive. One example: 

```python
    def subscribe_orders(
        self, market_id: str, party_id: str, callback: Callable[[dict], Any]
    ) -> None:
        self.subscribe_endpoint(
            f"{self._data_node_url}/stream/orders?marketIds={market_id}&partyIds={party_id}",
            callback=callback,
        )
```

Below shows how to subscribe to a stream of orders from the given party on the given market. If you take a look at the `subscribe_endpoint` function you can see that it uses the WebSocket client library to set up a connection to the URL string you generated:

```python
    def subscribe_endpoint(self, url: str, callback: Callable[[dict], Any]) -> None:
        ws = websocket.WebSocketApp(
            url,
            on_message=lambda _, msg: self._on_message(message=msg, callback=callback),
            on_error=self._on_error,
        )
        ws.run_forever(dispatcher=rel, reconnect=5)
```

This client automatically handles connection management and allows us to pass in an `on_message` handler which can be used to call a function every time a message is received. The messages will generally be received as a string, so the `on_message` function converts that string to a JSON (as we know that the server will be sending JSON objects) and then calls a custom function. Use this custom function to save the data within the storage object:

```python
    def _on_message(
        self,
        message: str,
        callback: Callable[[dict], Any],
    ) -> None:
        callback(json.loads(message)["result"])
```

Moving onto the store, create `vega_store.py` and populate with the following:

```python
from threading import Lock
from typing import Optional

import bot.models as parsers
import bot.vega_api_client as api
from bot.vega_ws_client import VegaWebSocketClient
from bot.models import Account, Asset, Market, Order, Position
from bot.submission import convert_to_decimals


class VegaStore:
    def __init__(self, websocket_url: str, rest_api_url: str):
        self._accounts: dict[str, Account] = {}
        self._orders: dict[str, Order] = {}
        self._assets: dict[str, Asset] = {}
        self._positions: dict[str, Position] = {}
        self._markets: dict[str, Market] = {}

        self._accounts_lock = Lock()
        self._orders_lock = Lock()
        self._positions_lock = Lock()
        self._markets_lock = Lock()

        self._rest_api_url = rest_api_url
        self._ws_client = VegaWebSocketClient(data_node_url=websocket_url)

    def start(self, market_id: str, party_id: str) -> None:
        self.load_data(party_id=party_id)

        self._ws_client.subscribe_market_data(
            market_id=market_id, callback=self._update_market_data
        )

        self._ws_client.subscribe_accounts(
            party_id=party_id, market_id=market_id, callback=self._update_accounts
        )

        self._ws_client.subscribe_orders(
            market_id=market_id, party_id=party_id, callback=self._update_order
        )

        self._ws_client.subscribe_positions(
            market_id=market_id, party_id=party_id, callback=self._update_position
        )

    def stop(self):
        self._ws_client.stop()

    ###########################################################
    #                   All item loaders                      #
    ###########################################################

    def get_markets(self) -> list[Market]:
        with self._markets_lock:
            return list(self._markets.values())

    def get_accounts(self) -> list[Account]:
        with self._accounts_lock:
            return list(self._accounts.values())

    def get_assets(self) -> list[Asset]:
        return list(self._assets.values())

    def get_positions(self) -> list[Position]:
        with self._positions_lock:
            return list(self._positions.values())

    def get_orders(self) -> list[Order]:
        with self._orders_lock:
            return list(self._orders.values())

    ###########################################################
    #               Individual item loaders                   #
    ###########################################################

    def get_market_by_id(self, market_id: str) -> Optional[Market]:
        return self._markets.get(market_id)

    def get_order_by_id(self, order_id: str) -> Optional[Order]:
        return self._orders.get(order_id)

    def get_position_by_market_id(self, market_id: str) -> Optional[Position]:
        return self._positions.get(market_id)

    def get_asset_by_id(self, asset_id: str) -> Optional[Asset]:
        return self._assets.get(asset_id)

    ###########################################################
    #                   Update functions                      #
    ###########################################################

    def _update_market_data(self, market_dict: dict) -> None:
        market_data = market_dict["marketData"][0]
        with self._markets_lock:
            market = self._markets[market_data["market"]]
            market.mark_price = convert_to_decimals(
                market.decimal_places, float(market_data["markPrice"])
            )
            market.best_bid_price = convert_to_decimals(
                market.decimal_places,
                float(market_data["bestBidPrice"]),
            )
            market.best_offer_price = convert_to_decimals(
                market.decimal_places,
                float(market_data["bestOfferPrice"]),
            )
            market.best_bid_volume = convert_to_decimals(
                market.decimal_places,
                float(market_data["bestBidVolume"]),
            )
            market.best_offer_volume = convert_to_decimals(
                market.decimal_places,
                float(market_data["bestOfferVolume"]),
            )
            market.open_interest = convert_to_decimals(
                market.decimal_places,
                float(market_data["openInterest"]),
            )
            market.trading_mode = market_data["marketTradingMode"]
            market.state = market_data["marketState"]

    def _update_order(self, order_dict: dict) -> None:
        orders = [
            parsers.parse_order(
                order,
                position_decimal_places=self.get_market_by_id(
                    order["marketId"]
                ).position_decimal_places,
                price_decimal_places=self.get_market_by_id(
                    order["marketId"]
                ).decimal_places,
            )
            for order in order_dict.get("snapshot", order_dict.get("updates")).get(
                "orders", []
            )
        ]
        with self._orders_lock:
            for order in orders:
                if order.status != "STATUS_ACTIVE":
                    self._orders.pop(order.order_id, None)
                else:
                    self._orders[order.order_id] = order

    def _update_position(self, position_dict: dict) -> None:
        position_dict = position_dict.get("snapshot", position_dict.get("updates"))[
            "positions"
        ][0]

        market = self.get_market_by_id(position_dict["marketId"])
        asset = self.get_asset_by_id(market.settlement_asset_id)
        position = parsers.parse_position(
            position_dict,
            position_decimal_places=market.position_decimal_places,
            price_decimal_places=market.decimal_places,
            asset_decimal_places=asset.decimal_places,
        )
        with self._positions_lock:
            self._positions[position.market_id] = position

    def _update_accounts(self, account_dict: dict) -> None:
        account_dict = account_dict.get("snapshot", account_dict.get("updates"))
        if not account_dict.get("accounts"):
            return
        account_dict = account_dict["accounts"][0]
        asset = self.get_asset_by_id(account_dict["asset"])
        account = parsers.parse_account(
            account_dict,
            asset_decimal_places=asset.decimal_places,
        )
        with self._accounts_lock:
            self._accounts[account.get_id()] = account

    def load_data(self, party_id: str) -> None:
        self._assets = {
            a["id"]: parsers.parse_asset(a)
            for a in api.get_assets(node_url=self._rest_api_url)
        }

        markets = {
            m["id"]: parsers.parse_market(m)
            for m in api.get_markets(node_url=self._rest_api_url)
        }
        with self._markets_lock:
            self._markets = markets

        new_accts = {}
        for acct in api.get_accounts(node_url=self._rest_api_url, party_id=party_id):
            acct = parsers.parse_account(
                acct,
                asset_decimal_places=self.get_asset_by_id(acct["asset"]).decimal_places,
            )
            new_accts[acct.get_id()] = acct

        with self._accounts_lock:
            self._accounts = new_accts

        orders = {
            o["id"]: parsers.parse_order(
                o,
                self.get_market_by_id(o["marketId"]).decimal_places,
                self.get_market_by_id(o["marketId"]).position_decimal_places,
            )
            for o in api.get_open_orders(party_id=party_id, node_url=self._rest_api_url)
        }
        with self._orders_lock:
            self._orders = orders

        posns = {
            p["marketId"]: parsers.parse_position(
                p,
                position_decimal_places=self.get_market_by_id(
                    p["marketId"]
                ).position_decimal_places,
                price_decimal_places=self.get_market_by_id(
                    p["marketId"]
                ).decimal_places,
                asset_decimal_places=self.get_asset_by_id(
                    self.get_market_by_id(p["marketId"]).settlement_asset_id
                ).decimal_places,
            )
            for p in api.get_positions(party_id=party_id, node_url=self._rest_api_url)
        }
        with self._positions_lock:
            self._positions = posns

```

This is a slightly longer module, but generally contains a couple of different patterns repeated for each endpoint. We'll work through the components of one and others should follow from there. Start by initialising a couple of fields in `__init__`:

```python
        self._orders: dict[str, Order] = {}
        self._orders_lock = Lock()
```

The dictionary is used to store information about all orders that have been fed through the WebSocket, along with an initial snapshot at the start. Then create a `Lock` object, which will be used when updating or reading the dictionary to ensure that a read always has access to a point-in-time snapshot. 

```python
    def get_orders(self) -> list[Order]:
        with self._orders_lock:
            return list(self._orders.values())
```

When returning orders, we want to ensure that it doesn't encourage accessing the dictionary or objects inside it directly. As Python does not have a way of totally ensuring no-one can access values stored on a class, the best option is to discourage it by ensuring what's returned here is just the order objects themselves. (They are replaced on each update to the dictionary. If they were being updated, you would have to also create copies on the `get_orders` function).

```python

    def _update_order(self, order_dict: dict) -> None:
        orders = [
            parsers.parse_order(
                order,
                position_decimal_places=self.get_market_by_id(
                    order["marketId"]
                ).position_decimal_places,
                price_decimal_places=self.get_market_by_id(
                    order["marketId"]
                ).decimal_places,
            )
            for order in order_dict.get("snapshot", order_dict.get("updates")).get(
                "orders", []
            )
        ]
        with self._orders_lock:
            for order in orders:
                if order.status != "STATUS_ACTIVE":
                    self._orders.pop(order.order_id, None)
                else:
                    self._orders[order.order_id] = order
```

The final component is the `_update_order` function. This is what the WebSocket listener created earlier will be calling each time a new order is received. You can see below that it expects a dictionary, which will be the JSON-formatted object received, and it then uses the `parsers` functions to convert that into an order object itself. Once you have created these order objects, update the dictionary to include them, alongside removing any orders which are now dead. The order object generation is kept outside of the `_orders_lock` to hold the lock for as little time as possible. Finally, the subscribe call in `start` puts the whole thing in motion:

```python
        self._ws_client.subscribe_orders(
            market_id=market_id, party_id=party_id, callback=self._update_order
        )
```

We're almost there. As a last step, update the `main.py` file to now read:

```python
import datetime
import logging
import os
import threading
import time

import dotenv
import rel

import bot.submission as sub
import bot.vega_api_client as client
import bot.vega_store as store
from bot.wallet import VegaWallet


def _run(
    node_rest_url: str,
    market_id: str,
    party_id: str,
    token: str,
    wallet_url: str,
    vega_store: store.VegaStore,
    max_abs_position=1,
):
    market_info = client.get_market(node_url=node_rest_url, market_id=market_id)
    market_price_decimals = int(market_info["decimalPlaces"])
    market_pos_decimals = int(market_info["positionDecimalPlaces"])
    wallet = VegaWallet(token=token, wallet_url=wallet_url, pub_key=party_id)

    while True:
        latest_data = vega_store.get_market_by_id(market_id=market_id)

        # The get_positions query here will return an empty list if there
        # has never been trading on the market, so handle that case.
        position = vega_store.get_position_by_market_id(market_id=market_id)
        position = position.open_volume if position is not None else 0

        submissions = []
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
        batch_tx = sub.BatchMarketInstruction(
            submissions=submissions,
            cancellations=[sub.OrderCancellation(market_id=market_id)],
            amendments=[],
        )

        wallet.submit_transaction(
            sub.instruction_to_json(
                instruction=batch_tx,
                price_decimals=market_price_decimals,
                position_decimals=market_pos_decimals,
            )
        )

        print("--------------------------------------")
        print(f"At time {datetime.datetime.now()}")
        print(
            f"Latest prices are {latest_data.best_bid_price} -"
            f" {latest_data.best_offer_price}"
        )
        print(f"Position is {position}")
        print("--------------------------------------")
        time.sleep(1)


def main(
    node_rest_url: str,
    node_ws_url: str,
    market_id: str,
    party_id: str,
    token: str,
    wallet_url: str,
    max_abs_position=1,
):
    vega_store = store.VegaStore(websocket_url=node_ws_url, rest_api_url=node_rest_url)
    vega_store.start(market_id=market_id, party_id=party_id)

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
        },
        daemon=True,
    )
    run_thread.start()

    # Now run event loop (Send SIGINT (Ctrl+C) to close)
    rel.dispatch()
    vega_store.stop()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(message)s",
    )
    dotenv.load_dotenv()
    main(
        node_rest_url=os.environ["NODE_URL"],
        node_ws_url=os.environ["WS_URL"],
        market_id=os.environ["MARKET_ID"],
        token=os.environ["WALLET_TOKEN"],
        party_id=os.environ["PARTY_ID"],
        wallet_url=os.environ["WALLET_URL"],
        max_abs_position=1,
    )

```

We have changed this function up a little bit since the previous tutorial to best use the subscription logic. You may notice a couple of major changes:

- `_run` is now a separate function. This enables you to spin it off into a separate thread within the `main` function and let it run at the same time as the WebSocket listener. This is why you needed those `Lock`s earlier. 
- We are now creating a `VegaStore` instance and starting it up. This store starts up the various WebSockets you configured earlier and constantly updates its internal dictionaries whenever new values are received. Now, when you need to know the latest state of something, you can simply load it from here instead of making a new web request.

We have also changed the old queries to simply load from the store:

```python
latest_data = vega_store.get_market_by_id(market_id=market_id)
position = vega_store.get_position_by_market_id(market_id=market_id)
```

And finally because you are using a dispatcher called `rel` for handling the WebSockets, call `dispatch` at the end, which will hold execution there and run the WebSocket server.

You should now be able to once more run `python -m main` to kick off the bot. This time around you should see that the update frequency is much closer to being solely due to the `1s` sleep, allowing more control over timing and cutting down on waiting time.

The next two tutorials will be independent and focus on different areas of the code. In one, we will look at how to add a [liquidity commitment](adding-a-liquidity-commitment.md) to this trader and what requirements that entails, whilst in the other we will look at drawing pricing from an [external source](adding-an-external-price.md) rather than blindly following what is on the Vega market currently. Either can be followed independently, or both together.
