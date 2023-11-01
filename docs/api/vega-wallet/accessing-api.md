---
title: Accessing the API
hide_title: false
description: How to access the right APIs for your purposes.
sidebar_position: 3
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## How to access this API

All Vega Wallet software exposes a JSON-RPC API. This API, its endpoints, requests, and responses are all exactly the same, and are handled exactly the same way, whatever the software implementation.

However, the way the JSON-RPC API is exposed depends on the software that implements it. One could expose it through HTTP, another could inject it in the webpage, and yet another could make it accessible through IPC. The layer that exposes this JSON-RPC API is called the "communication layer". Therefore, to access the JSON-RPC API, a third-party application has to interact with the communication layer. The supported communication layers are:

1. A local service with an HTTP API running on users computer by the mean of an installed software
2. Coming soon: A JavaScript library injected into the third-party web application pages by the mean of a browser extension

:::caution Software compatibility
The beta version of this JSON-RPC API was released with the Vega software `v.0.67.0`. Make sure the wallet software you are using supports it.
:::

## Communicating with the local service

First, you will have to run the Vega wallet using one of the following wallet softwares:

- [Command-line application](../../tools/vega-wallet/cli-wallet/create-wallet.md): Best for developers, tech-savvy users, and those running headless software like bots and scripts.
- [Desktop application](../../tools/vega-wallet/desktop-app/index.md): Best for regular users, and those who want to test the UI experience.

Then, to connect the local service, see ["Connect to local service" guide](./how-to/connect-to-local-service.md).

<!--## Communicating with the browser extension

To communicate with the browser extension, you need to install it first.

Then, to interact with the browser extension, see ["Connect to browser extension" guide](./how-to/_connect-to-browser-extension.md).
-->

## Why use JSON-RPC?

To send transactions to a network, third-party applications need to interact with a wallet. However, wallet softwares come in all shape and flavours, such as browser extensions, or an HTTP server. They are all managed in specific ways, and thus it's essential for third-party application developers to account for each implementation. They _will need_ to implement custom adapters for browser extensions, for an HTTP server, etc.

That said, defining a dedicated API for each type of implementation is not desirable. It's error-prone and slows down integration between third-party applications and wallet softwares.

As a result, to strike the right balance between the work that has to be done by a third-party application developer, general availability, and simplicity, the candidate of choice is JSON-RPC. It's well-defined and  flexible, and easy to implement on both third-party applications and wallet software, helps standardise communication, doesn't require specific tooling, and can be served on all sorts of communication layers.