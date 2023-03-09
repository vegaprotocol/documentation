---
title: Quick refresher
hide_title: false
sidebar_position: 1
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## Quick concepts refresher

For a transaction to be accepted by a network, it has to be signed by the user.

To sign a transaction, the user uses a cryptographic wallet.

Therefore, for third-party applications to send a transaction to a network, they have to connect to the user's wallet to get the transaction signed, then sent.

## Where does it sit in the ecosystem?

Technically speaking, the Vega wallet is a software that sits between the third-party applications and the network, and is owned by the users of the network.

![High level view of the interactions with the Vega wallet](/img/concept-diagrams/high-level-wallet-workflow.png)

As a developer, if you want to send a transaction to the network you will have to integrate with a Vega wallet software to get the user to approve and sign the transaction. Once signed, the Vega wallet software will either send it to the network, either hand it to your application to send it yourself.  
