---
title: How it works
hide_title: false
description: Understand how the wallet works to ease your integration.
sidebar_position: 2
---

For a transaction to be accepted by a network, it has to be signed by the user.

To sign a transaction, the user uses a cryptographic wallet.

Therefore, for third-party applications to send a transaction to a network, they have to connect to the user's wallet to get the transaction signed, then send it.

## Wallet in the software ecosystem

Technically speaking, the Vega Wallet is a software that sits between the third-party applications and the network, and is owned by the users of the network.

![High level view of the interactions with the Vega wallet](/img/concept-diagrams/high-level-wallet-workflow.png)

As a developer, if you want to send a transaction to the network, you will have to integrate with Vega Wallet software to allow the user to approve and sign the transaction. Once signed, the Vega Wallet software will either send it to the network, or pass it to your application to send it.

## How the wallet works

The Vega wallet software has 3 main components:

* **API**: The communication layer used by third-party applications to talk to the wallet.
* **Backend**: The core of the wallet that is shared by all Vega Wallet implementations. It manages the wallets, their keys and the requests from the third-party applications. It takes the form of a JSON-RPC API and is implementation agnostic.
* **Frontend**: Displays information about the wallets and the requests from the third-party applications to the user.

![High level view of the Vega wallet architecture](/img/concept-diagrams/high-level-wallet-architecture.png)

## Sending a transaction with a third-party app

What happens when a third party application wants to send a transaction on behalf of a user:

1. The third-party application requests to send a transaction.
2. The API receives the request and delegates it to the backend.
3. The backend checks and forwards the transaction to the frontend so the user can review it and approve sending.
4. If approved by the user, the backend proceeds to sign the transaction and send it to the network.
5. The backend waits for the network response and forwards it to the third-party application.

![High level view of the transaction flow inside the wallet](/img/concept-diagrams/basic-transaction-flow-in-wallet.png)

### Handling errors

As you can see, there are several systems involved in sending a transaction, and all of them can prevent it: the user can reject or cancel the connection and the transaction, the Vega wallet software can label the transaction as malformed or breaking the anti-spam rules, the network can reject the transaction, the network connection might fail, etc.

As a result, when a third-party application wants to send a transaction, it's important to account for all these errors.

All errors are documented in the [JSON-RPC reference](./reference/core/index.md).
