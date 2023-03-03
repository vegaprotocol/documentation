---
title: Get started with Wallet API
hide_title: false
sidebar_position: 1
---
import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

Vega Wallet supports a JSON-RPC API for integrating interfaces with the Vega Wallet service, to read keys, get transaction approval, and more. The previous Wallet API has been deprecated and is no longer supported.

## Admin access
The HTTP service doesn't provide access to the `admin` endpoints, for security reasons. Actions such as creating a wallet cannot be done programmatically using the API.

## Pre-requisite
See the [Create a Wallet guide](../../tools/vega-wallet/cli-wallet/latest/create-wallet.md) to set up the Vega Wallet for command line. Then connect using the info below.

## Available APIs
The **JSON-RPC API** and its endpoint **`/api/v2/requests`** is in the alpha phase, and will be replacing the v1 REST API. If you discover any issues, please raise them on the [feedback board ↗](https://github.com/vegaprotocol/feedback/discussions).

:::note New to JSON-RPC?
Read the [JSON-RPC specification ↗](https://www.jsonrpc.org/specification) for the standards and conventions.
:::

* 📚 **[OpenRPC documentation](./reference/core/openrpc.md)**: See the full JSON-RPC documentation to build your integration with the Vega Wallet
* 🛝 **[OpenRPC playground](./reference/core/openrpc-api-playground)**: Try it out and explore the potential results and errors
* 🔌 **[HTTP (REST) documentation](./reference/local-service/wallet-api.info.mdx)**: See the reference for the HTTP endpoint available for the wallet service 

## Guides
* 🥾 **[Bootstrap the wallet service](./how-to/bootstrap-wallet-service.md)**: Set up the Vega Wallet from scratch to use when building a Vega dApp, or integrating with CI/CD
* 🤖 **[Integrate a bot](./how-to/integrate-with-bots.md)**: Connect your bots, or other headless software, to the Vega Wallet service
* 🧩 **[Connect to local service](./how-to/connect-to-local-service)**: Connect your dApp to the Vega Wallet service

## Software compatibility
Vega Wallet API (v2)'s latest version was released in Vega software `v.0.68`. If you're interacting with a network on `v0.68` or newer, you'll need to have a wallet that supports the new API.