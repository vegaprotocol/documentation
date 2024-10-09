---
title: Before you start
hide_title: false
description: Don't know where to start? Read this.
sidebar_position: 1
---

This page provides guidance on how to navigate the wallet API documentation, based on your profile.

## I am new to the wallet
If you are not familiar with the wallet, we recommend you to read the [How it works](how-it-works) page. It provides a broad picture of the wallet architecture, its place in the Vega ecosystem, and the flow of a transaction inside the wallet.

Once read, you will have a good understanding of the wallet and its interaction with the Vega ecosystem. See the next section to start integrating your application with the Vega wallet.

## I know how it works, but I don't know how to connect
If you understand how the wallet works and you want to start implementing, choose from the following guides. Start your integration with the local wallet service:

1. [Accessing the API](./accessing-api): This page lists the different wallet softwares from which you can consume the wallet API, and, based on your choice, provides links to dedicated guides.
2. [Bootstrap the local service](./how-to/bootstrap-local-service): This will teach you how to download the Vega Wallet CLI, create your first wallet, and get the service up and running.
3. [Connect to the local service](./how-to/connect-to-local-service): This will teach you how to consume the service API, initiate a connection, and retrieve the wallet keys.

Once you've read the guides above, you will be able to start a local wallet service and your application can connect to a wallet. Next, dive deeper into the HTTP and JSON-RPC API.

## I just need the API documentation
If you have a local wallet service running, and your application can connect to a wallet, you're all set up. Here is the API documentation:

- [HTTP API documentation](./reference/local-service/wallet-api.info.mdx): This documents all the details about the HTTP endpoints of the local service.
- [JSON-RPC API documentation](./reference/core/json-rpc.md): This documents all the details of the JSON-RPC methods exposed to third-party applications.
