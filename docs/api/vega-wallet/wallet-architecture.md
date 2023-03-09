---
title: Wallet's architecture
hide_title: false
sidebar_position: 2
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## How does it work?

The Vega wallet software is composed of 3 main components:

1. An API: this is the communication layer used by third-party applications to talk to the wallet.
2. A backend: this is the core of the wallet that is shared by all Vega wallet implementation. It manages the wallets, their keys and the requests from the third-party applications. It takes the form of a JSON-RPC API and is implementation agnostic.
3. A frontend: it displays information about the wallets and the requests from the third-party applications to the user.

![High level view of the Vega wallet architecture](/img/concept-diagrams/high-level-wallet-architecture.png)

## What is happening when a third-party application wants to send a transaction?

1. The third-party application requests to send a transaction.
2. The API receive the request and delegate it to the backend.
3. The backend checks and forward the transaction to the frontend so the user can review it and approved the sending.
4. If approved by the user the backend proceed to the signing of the transaction and send it to the network.
5. The backend waits for the network response and forward it to the third-party application.

![High level view of the transaction flow inside the wallet](/img/concept-diagrams/basic-transaction-flow-in-wallet.png)
