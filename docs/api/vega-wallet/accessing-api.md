---
title: Accessing the API
hide_title: false
description: How to access the right APIs for your purposes.
sidebar_position: 3
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

## How to access this API
First of all, there are two kinds of API.

All Vega Wallet software exposes a JSON-RPC API. This API, its endpoints, requests, and responses are all exactly the same, and are handled exactly the same way, whatever the software implementation.

However, the way the JSON-RPC API is exposed depends on the software that implements it. One could expose it through an HTTP server, another could inject it in the webpage. This part of the API is called the communication layer.

<!--So, the first step is to determine which communication layer your application will use. It can be both! -->

:::caution Software compatibility
Vega Wallet API (v2)'s latest version was released in Vega software `v.0.68`. If you're interacting with a network on `v0.68` or newer, you'll need to have a wallet that supports the new API.
:::

## Supported communication layers
Below are the supported implementations:

1. Local service with an HTTP API by means of software installed on the computer
2. Coming soon: JavaScript library injected into web pages by the mean of a browser extension

## Communicating with the local service
First, you will have to run the wallet using one of the following softwares:
- [Command-line application](../../tools/vega-wallet/cli-wallet/latest/create-wallet.md): Best for developers, tech-savvy users, and those running headless software like bots and scripts.
- [Desktop application](../../tools/vega-wallet/desktop-app/index.md): Best for regular users, and those who want to test the UI user experience.

Then, to connect the local service, see ["Connect to local service" guide](./how-to/connect-to-local-service.md).

<!--## Communicating with the browser extension

To communicate with the browser extension, you need to install it first.

Then, to interact with the browser extension, see ["Connect to browser extension" guide](./how-to/_connect-to-browser-extension.md).
-->

