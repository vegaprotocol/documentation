---
title: Getting Started
sidebar_position: 2
hide_title: false
description: Start development of a bot to trade on Vega
---

In this series of tutorials you will work towards building the components of a simple bot which can trade on a Vega Protocol network, and to which you can add your own specific trading logic. In the first section, we will build out the basics of signing transactions, sending order creation and amendment payloads to a node and listening for position and order updates via WebSockets.

In later sections we will cover adding a liquidity commitment to the bot and implementing a simple arbitrage strategy between a centralised exchange's prices and the Vega market's taking into account trading fees.

We will be building the bot in Python, however the concepts are transferable and all communication with the wallet and network will be conducted through language-agnostic methods (predominately JSON through REST and WebSockets).


## Pre-Setup

If you don't have Python installed already, follow the [official instructions](https://www.python.org/downloads/) to install a recent version.

Once installed, ensure everything is setup correctly by checking the version:
`python --version`

Additionally, follow the wallet setup instructions within the [programmatic trading basics](../programmatic-trading-basics.md#set-up-your-vega-wallet) tutorial to ensure you have a working wallet and token. Take a note of your token as you will need it for configuring the bot. If lost, the token can be retrieved by calling `vegawallet api-token list`.

## Setup

Navigate to the folder you want to place your project folder in and run

```bash
mkdir vega_bot
cd vega_bot
```

Then we will create a basic `venv` with Python which allows us to keep installed requirements and versions contained to an isolated environment. To do this run

```bash
python -m venv ./venv
```

This will create an environment within the `venv` folder which you can enter and exit at will. Ensure you are always within the environment when installing new dependencies.

To enter the environment, run `source ./venv/bin/activate` whilst in the root of your project. To leave it again, run `deactivate` with no path specified. You will know that the activation has taken place as your terminal line will begin with `(venv)`.

Finally, create a `requirements.txt` file to contain the Python dependencies we will need. The contents of the file should be:

```
requests
python-dotenv
```

Once you have completed the creation of this file, install the requirements to finish setting up the Python environment:

```bash
python -m pip install -r requirements.txt
```


## Components

To build our basic bot we will create a couple of components, upon which we will expand as we increase in complexity in later guides. To begin with, create a folder called `bot` and within it create these blank files:

 - `__init__.py`
 - `wallet.py`
 - `strategy.py`
 - `submission.py`
 - `vega_store.py`
 - `vega_api_client.py`

Within the root directory create two files:

 - `.env`
 - `main.py`

## Configuration

Our first version of the bot will be basic. On a fixed timing loop we will check our position on the market, check the market's prices and then place some limit orders based on all that.

Firstly populate `.env` with the following:

```bash
# Vega config
MARKET_ID=YOUR_MARKET_ID_HERE
PARTY_ID=YOUR_PUB_KEY_HERE
WS_URL=wss://api.n11.testnet.vega.xyz/api/v2
NODE_URL=https://api.n11.testnet.vega.xyz/api/v2
WALLET_URL=http://localhost:1789
WALLET_TOKEN=YOUR_WALLET_TOKEN_HERE
```

If later in the guide you find you have a connection error to `api.n11.testnet.vega.xyz` select another one from the `API.REST` section of [this](https://github.com/vegaprotocol/networks-internal/blob/main/fairground/vegawallet-fairground.toml) configuration toml.

Populate the rest of the fields like so:

- `PARTY_ID`: This should be your public key (without a `0x` prefix), you will find it in the vegawallet 
  - [[Image of wallet location here]]
- `WALLET_TOKEN`: This should be the token you received when setting up the steps in [programmatic trading basics](../programmatic-trading-basics.md#set-up-your-vega-wallet)
- `MARKET_ID`: For this, navigate to the Fairground [console](https://console.fairground.wtf/#/markets/all) and select a market, ideally choose one whose `Trading mode` is `Continuous` to load one which is actively trading. Once that market is open, navigate to the `Info` tab and within `Market Specification` -> `Key details` take the `Market ID` value and paste it into that section of the config. If you wish to follow the section of this guide in which we place orders ensure it is a market trading with a token you hold on the Fairground testnet.

### Building a Submission

Now that we have our configuration we can start building the bot itself. Start by populating `submission.py` with the following:

```python
from dataclasses import dataclass
from typing import Optional


@dataclass
class OrderAmendment:
    order_id: str
    size_delta: float
    price: float


@dataclass
class OrderCancellation:
    market_id: str
    order_id: Optional[str] = None


@dataclass
class OrderSubmission:
    market_id: str
    size: float
    price: float
    time_in_force: str
    type: str
    side: str


@dataclass
class BatchMarketInstruction:
    submissions: list[OrderSubmission]
    cancellations: list[OrderCancellation]
    amendments: list[OrderAmendment]


def convert_to_decimals(decimal_places: int, number: float) -> float:
    return number / (10**decimal_places)


def convert_from_decimals(decimal_places: int, number: float) -> int:
    return int(number * (10**decimal_places))


def _submission_to_json(
    submission: OrderSubmission, price_decimals: int, position_decimals: int
) -> dict[str, str]:
    return {
        "marketId": submission.market_id,
        "timeInForce": submission.time_in_force,
        "type": submission.type,
        "side": submission.side,
        "size": str(convert_from_decimals(position_decimals, submission.size)),
        "price": str(convert_from_decimals(price_decimals, submission.price)),
    }


def _cancellation_to_json(cancellation: OrderCancellation) -> dict[str, str]:
    res = {"marketId": cancellation.market_id}
    if cancellation.order_id:
        res["orderId"] = cancellation.order_id
    return res


def _amendment_to_json(
    amendment: OrderAmendment, price_decimals: int, position_decimals: int
) -> dict[str, str]:
    return {
        "orderId": amendment.order_id,
        "size_delta": str(
            convert_from_decimals(position_decimals, amendment.size_delta)
        ),
        "price": str(convert_from_decimals(price_decimals, amendment.price)),
    }


def instruction_to_json(
    instruction: BatchMarketInstruction, price_decimals: int, position_decimals: int
) -> dict:
    return {
        "batchMarketInstructions": {
            "submissions": [
                _submission_to_json(
                    s,
                    price_decimals=price_decimals,
                    position_decimals=position_decimals,
                )
                for s in instruction.submissions
            ],
            "amendments": [
                _amendment_to_json(
                    s,
                    price_decimals=price_decimals,
                    position_decimals=position_decimals,
                )
                for s in instruction.amendments
            ],
            "cancellations": [
                _cancellation_to_json(s) for s in instruction.cancellations
            ],
        }
    }

```


Here we're defining some boilerplate to convert between the raw JSON we will send and receive to the Vega node and some dataclasses which make it easier to deal with things locally. We also introduce a few factors of which it's important to be aware when building a trading system interacting with Vega Protocol.

- `BatchMarketInstruction`: A batch market instruction allows you to send multiple order-related actions within one transaction, saving on the number of messages required and allowing you to submit more operations within one block than would otherwise be allowed. Check the network parameter value `"spam.protection.max.batchSize"` to find the maximum number of operations (submissions + amendments + cancellations) which can be submitted in a single batch instruction.
- `convert_(to/from)_decimals`: As a blockchain it is important for Vega Protocol calculations to be replicable across multiple computers and architectures. To enable that, many numbers are represented as integers, allowing integer arithmetic to be performed and avoiding the representation issues floating point numbers can encounter (which can lead to small numerical differences between computations on different processor types etc). So, for example, a number `50.12` could be represented as `5012` with a decimal precision of `2` or `50120` with a precision of `3`. We can load these precisions from the market and asset specifications but need to convert between floating point numbers and this decimal precision to interact. There are generally three of which to be aware:
  - `asset`: Precision of the asset when dealing with it specifically (transfers etc)
  - `price`: Precision of the price on a market (e.g. a price of `1243.42` would be `2` precision)
  - `position`: Precision of the position on a market, allowing fractional units (e.g. a precision of `1` would allow lots of `0.1` to be traded)

Other functions are largely for conversion between the types. They are useful to read through, especially if you're newer to Python, but don't contain many Vega specifics.


### REST API

Next we will put together a few REST API calls to load in data from the core. Into `vega_api_client.py` paste the following:

```python
import requests


def execute_unrollable_get_request(path: str, key: str, node_url: str):
    query_url = f"{node_url}/{path}"

    response = requests.get(query_url)
    response.raise_for_status()

    results = []
    response_json = response.json()
    edges = response_json[key]["edges"]
    for edge in edges:
        results.append(edge["node"])

    # Here we unroll any paginated queries.
    # Each query will have a 'pageInfo' component which gives details about pagination.
    # Use the `endCursor` field to start the next query's results
    while response_json[key]["pageInfo"]["hasNextPage"]:
        response = requests.get(
            query_url
            + f"&pagination.after={response_json[key]['pageInfo']['endCursor']}"
        )
        response.raise_for_status()
        response_json = response.json()
        edges = response_json[key]["edges"]
        for edge in edges:
            results.append(edge["node"])

    return results


def execute_get_request(path: str, key: str, node_url: str):
    query_url = f"{node_url}/{path}"

    response = requests.get(query_url)
    response.raise_for_status()

    return response.json()[key]


def get_markets(node_url: str) -> list[dict]:
    return execute_unrollable_get_request("markets", "markets", node_url=node_url)


def get_market(node_url: str, market_id: str) -> list[dict]:
    return execute_get_request(f"market/{market_id}", "market", node_url=node_url)


def get_market_data(node_url: str, market_id: str) -> list[dict]:
    return execute_get_request(
        f"market/data/{market_id}/latest", "marketData", node_url=node_url
    )


def get_assets(node_url: str) -> list[dict]:
    return execute_unrollable_get_request("assets", "assets", node_url=node_url)


def get_accounts(party_id: str, node_url: str) -> list[dict]:
    return execute_unrollable_get_request(
        f"accounts?filter.partyIds={party_id}", "accounts", node_url=node_url
    )


def get_open_orders(party_id: str, node_url: str) -> list[dict]:
    return execute_unrollable_get_request(
        f"orders?partyId={party_id}&liveOnly=true", "orders", node_url=node_url
    )


def get_positions(party_id: str, node_url: str) -> list[dict]:
    return execute_unrollable_get_request(
        f"positions?partyId={party_id}", "positions", node_url=node_url
    )

```

In general these functions are simply loading JSON results from the APIs defined within the [documentation](https://docs.vega.xyz/testnet/api/rest/overview). However this snippet is worth considering:

```python
    while response_json[key]["pageInfo"]["hasNextPage"]:
        response = requests.get(
            query_url
            + f"&pagination.after={response_json[key]['pageInfo']['endCursor']}"
        )
        response.raise_for_status()
        response_json = response.json()
        edges = response_json[key]["edges"]
        for edge in edges:
            results.append(edge["node"])
```

Some APIs return paginated results, which may require several queries to load the full set. Within this loop we read whether there is a further page and step through queries iteratively using the `endCursor` and the `pagination.after` flag until we have loaded them all.

### The First Run

Now, moving over to `main.py`, paste in the following content:

```python
import time
import dotenv
import logging
import os

import bot.submission as sub
import bot.vega_api_client as client


def main(node_rest_url: str, market_id: str):
    market_info = client.get_market(node_url=node_rest_url, market_id=market_id)
    market_price_decimals = int(market_info["decimalPlaces"])
    while True:
        time.sleep(1)
        latest_data = client.get_market_data(
            node_url=node_rest_url, market_id=market_id
        )
        best_bid = sub.convert_to_decimals(
            number=int(latest_data["bestBidPrice"]),
            decimal_places=market_price_decimals,
        )
        best_offer = sub.convert_to_decimals(
            number=int(latest_data["bestOfferPrice"]),
            decimal_places=market_price_decimals,
        )
        print(f"Latest prices are {best_bid} - {best_offer}")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(message)s",
    )
    dotenv.load_dotenv()
    main(node_rest_url=os.environ["NODE_URL"], market_id=os.environ["MARKET_ID"])

```

At this point we're about ready to start our first run. Here we can see the bot will simply loop and each second will load the latest prices, convert them to floating point numbers using the market information then output them to the screen. Our second version will be smarter however for now we will just confirm that everything is set up as we would expect.

Run the program by ensuring you have activated the `venv` as covered above then running `python -m main` from within the root folder of your project. If all is well you will see an output once a second of the best prices on your chosen market, if not go back and ensure you've successfully completed all the steps above.

Kill the program using `Ctrl+C` \ `^ + C` and continue on to the next section

### Placing Some Orders

Now that we have our connection up and running it is time to place some orders, and make sure our risk doesn't grow too large. To do this, we'll first need some code to interact with the Vega wallet service. Update `wallet.py` to contain the following:


```python
import requests


class VegaWallet:
    def __init__(self, token: str, wallet_url: str, pub_key: str):
        self.token = token
        self.wallet_url = wallet_url
        self.pub_key = pub_key

        self.session = requests.Session()
        self.session.headers = {
            "Origin": "VegaBot",
            "Authorization": f"VWT {self.token}",
        }

    def submit_transaction(self, transaction: dict) -> None:
        self.session.post(
            self.wallet_url + "/api/v2/requests",
            json={
                "jsonrpc": "2.0",
                "method": "client.send_transaction",
                "params": {
                    "publicKey": self.pub_key,
                    "sendingMode": "TYPE_SYNC",
                    "transaction": transaction,
                },
                "id": "request",
            },
        )

```

Here we're creating a class to hold connection details for the wallet, our API token and a session with the needed headers. We then have a wrapper to easily submit a transaction to the wallet's submission endpoint, which will then broadcast for us to the network. You will also need to ensure the vegawallet itself is set to the correct network (Fairground in the case of this tutorial) which is determined on startup of the CLI wallet in the wallet documentation.

Now, update the `main.py` code to use our new VegaWallet and maintain some orders by changing the code to:

```python
import datetime
import logging
import os
import time

import dotenv

import bot.submission as sub
import bot.vega_api_client as client
from bot.wallet import VegaWallet


def main(
    node_rest_url: str,
    market_id: str,
    party_id: str,
    token: str,
    wallet_url: str,
    max_abs_position: int =1,
):
    market_info = client.get_market(node_url=node_rest_url, market_id=market_id)
    market_price_decimals = int(market_info["decimalPlaces"])
    market_pos_decimals = int(market_info["positionDecimalPlaces"])
    wallet = VegaWallet(token=token, wallet_url=wallet_url, pub_key=party_id)
    while True:
        time.sleep(1)
        latest_data = client.get_market_data(
            node_url=node_rest_url, market_id=market_id
        )
        best_bid = sub.convert_to_decimals(
            number=int(latest_data["bestBidPrice"]),
            decimal_places=market_price_decimals,
        )
        best_offer = sub.convert_to_decimals(
            number=int(latest_data["bestOfferPrice"]),
            decimal_places=market_price_decimals,
        )

        # Our get_positions query here will return an empty list if there
        # has never been trading on the market, so handle that case.
        position = client.get_positions(
            party_id=party_id, market_id=market_id, node_url=node_rest_url
        )

        position = (
            sub.convert_to_decimals(
                number=int(position[0]["openVolume"]),
                decimal_places=market_pos_decimals,
            )
            if len(position) > 0
            else 0
        )

        submissions = []
        if position < max_abs_position:
            submissions.append(
                sub.OrderSubmission(
                    market_id=market_id,
                    size=1,
                    price=best_bid,
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
                    price=best_offer,
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
        print(f"Latest prices are {best_bid} - {best_offer}")
        print(f"Position is {position}")
        print("--------------------------------------")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(message)s",
    )
    dotenv.load_dotenv()
    main(
        node_rest_url=os.environ["NODE_URL"],
        market_id=os.environ["MARKET_ID"],
        token=os.environ["WALLET_TOKEN"],
        party_id=os.environ["PARTY_ID"],
        wallet_url=os.environ["WALLET_URL"],
        max_abs_position=1,
    )

```

We've added a few new sections here, let's highlight a couple of them.

```python
    max_abs_position=1,
```

Our market making trader will have a max position at which point it will stop quoting on that side. For example, if our max position is 1, once we have a position of 1 we stop quoting a price to buy any more any only look to sell some.

```python
        # Our get_positions query here will return an empty list if there
        # has never been trading on the market, so handle that case.
        position = client.get_positions(
            party_id=party_id, market_id=market_id, node_url=node_rest_url
        )

        position = (
            sub.convert_to_decimals(
                number=int(position[0]["openVolume"]),
                decimal_places=market_pos_decimals,
            )
            if len(position) > 0
            else 0
        )

```

In each loop we load in the current position so that we can make a decision based on that. The get positions API returns a list of positions, however because we are specifying both market and party we know that the only two options are that the list is empty (if we have never touched the market), or a single position item exists representing our party. If a party has ever touched a market there will be a position record for it, even if that position is now `0`.

```python

        submissions = []
        if position < max_abs_position:
            submissions.append(
                sub.OrderSubmission(
                    market_id=market_id,
                    size=1,
                    price=best_bid,
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
                    price=best_offer,
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
```

Here we check our position and create buy or sell orders depending on what we want to do. We take a price of whatever the current best bid or ask on the market are and a size of 1. Both of these are very simplified for the sake of our example and would likely have more complexity in a real world system, but for the sake of an example they will do. 

We then aggregate these into a batch market instruction. One method to implement this would be to monitor what our current orders are doing and amend them, however here we take the easier route of simply cancelling whatever is there and replacing the new ones. Within a single batch the orders are placed as first cancellations then amendments then submissions, so we will never have overlapping orders. We also take advantage of that an `OrderCancellation` with only `market_id` specified and no `order_id` will cancel all orders on the given market for your party.

From here you should be able to run your bot with `python -m main` again and watch it trading. You can log into the Fairground Console to see the orders it places and current position. 

If you watch the logs you may see that although we have only a 1s sleep in the loop it is only updating the price every few seconds. This is because each of the API queries we do in the loop takes a short amount of time, and that adds up! In the next guide we will think about ways to tackle that, along with covering how we might add a liquidity commitment to our bot.

In the meantime, testing different parameters in terms of how you set the price and volume, or even increasing the number of different buy and sell orders you create to have volumes at different prices you might buy/sell, can be a good way to experiment with the setup.
