---
title: Getting started
hide_title: true
---
# Getting started with the Vega Wallet API
Start integrating with the Vega Wallet service by following the guide below. See a full list of methods that you can use in the JSON-RPC docs.

:::warn 
The latest Vega Wallet API (v2) was released in the Vega software v.0.54. If you're interacting with a network on v0.54 or newer, you'll need to have a wallet that supports the new API. 
:::

:::tip New to JSON-RPC?
Read the [JSON-RPC specification ↗](https://www.jsonrpc.org/specification) for the standards and conventions.
:::

## Connect and set permissions
1.  Verify if the service exposes all the JSON-RPC methods you need to work, using `GET /v2/methods` endpoint.
    - If 404, no `v2` API available -> Fail. However, if you’re already integrated with v1, you can fallback to it, or, ideally, update your wallet to use the v2 API. 

Then, on endpoint `POST /v2/requests`:
2. Get the Chain ID of the network the wallet is connected to, to show data from the same network using `session.get_chain_id`.

This is formulated with: `"Method": "session.connect_wallet", “params”: {“hostname”: “insert-host-name”}`

3. Connect to a wallet using `session.connect_wallet`. You’ll get a token back as a response, if the connection is successful.
4. Verify you have the permissions you need using `session.get_permissions` 
    - If not enough permission, for example if the host needs to read public keys, use `session.request_permissions`
5. Before sending a transaction, you will need to know the public keys you have access to using `session.list_keys`
6. Send transaction using `session.send_transaction`