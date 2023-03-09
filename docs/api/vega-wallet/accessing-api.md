---
title: Accessing the API
hide_title: false
sidebar_position: 4
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## How to access this API?

First of all, there are two kind of APIs.

All vega wallet software expose a JSON-RPC API. This API, its endpoints, requests and responses are exactly the same, are handled exactly the same way, whatever the software implementation.

However, the way this JSON-RPC API is exposed depends on the software that implements it. One could expose it through an HTTP server, another could inject it in the web page. We call this part of the API the "communication layer".

So, the first step is to determine which communication layer your application will use. It can be both!

:::caution Software compatibility
Vega Wallet API (v2)'s latest version was released in Vega software `v.0.68`. If you're interacting with a network on `v0.68` or newer, you'll need to have a wallet that supports the new API.
:::

## What are the supported communication layers

We currently support two implementations:

1. a local service with an HTTP API by the mean of a software installed on the computer, and
2. a JavaScript library injected in the web pages by the mean of a browser extension.

## Communicating with the local service

First, you will have to run one of the following software:

- [Command-line application](../../tools/vega-wallet/CLI-wallet/index.md): It's best for developer, tech-savvy, and headless software like bots and scripts.
- [Desktop application](../../tools/vega-wallet/desktop-app/index.md): It's best for regular users.

Then, to connect the local service, see ["Connect to local service" guide](./how-to/connect-to-local-service.md).

## Communicating with the browser extension

To communicate with the browser extension, you need to install it first.

Then, to interact with the browser extension, see ["Connect to browser extension" guide](./how-to/_connect-to-browser-extension.md).


