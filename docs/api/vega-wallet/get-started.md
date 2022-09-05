---
title: Getting started
hide_title: true
sidebar_position: 2 
---

# Start using the Vega Wallet API
Build on and integrate with the Vega Wallet service using the available APIs. 

## REST API
The **REST API** is being deprecated and will only be supported until the JSON-RPC API is out of alpha. See the [REST API for Vega Wallet](rest-api.md) documentation.

## JSON-RPC API
The **JSON-RPC API** and its endpoint **`/v2/requests`** is in the alpha phase. If you discover any issues, please raise them on the [feedback board ↗](https://github.com/vegaprotocol/feedback/discussions).

* [Connect and set permissions](#connect-and-set-permissions): First, use the guide below to get set up
* [API documentation](./openrpc): See the full JSON-RPC documentation to build your integration with the Vega Wallet
* [API playground](./openrpc-api-playground): Try it out and explore the potential results and errors

### Software compatibility
The latest Vega Wallet API (v2) was released in the Vega software `v.0.54`. If you're interacting with a network on `v0.54` or newer, you'll need to have a wallet that supports the new API.

### Connect and set permissions
1. Verify if the service exposes the JSON-RPC methods using `GET /v2/methods` endpoint.
   * If you get a 404 response, `v2` API is not available. Update your wallet to use the `v2` API, unless you're running a network using software older than 0.54.

Then, on endpoint `POST /v2/requests`:
1. Get the chain ID of the network the wallet is connected to, to show data from the same network using `session.get_chain_id`.
2. Connect to a wallet using `session.connect_wallet`. You’ll get a token back as a response, if the connection is successful.
3. Verify you have the permissions you need using `session.get_permissions`
4. If you don't have enough permission, for example if the host needs to read public keys, use `session.request_permissions` 
   * The available permissions are `none`, `read`, and (in a future release) `write` 
5. Before sending a transaction, use `session.list_keys`, as you'll need to know the public keys you have access to
6. Send transaction using `session.send_transaction`
7. See the full set of methods that you can use in the **[Open RPC documentation](./openrpc)**.


:::tip New to JSON-RPC?
Read the [JSON-RPC specification ↗](https://www.jsonrpc.org/specification) for the standards and conventions.
:::
