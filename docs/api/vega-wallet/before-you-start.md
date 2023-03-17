---
title: Accessing the API
hide_title: false
description: Don't know where to start? Read this.
sidebar_position: 1
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

This page gives guidance on how to navigate the wallet API documentation, based on your profile.

## I am new to the wallet

If you are not familiar with the wallet, we recommend you to read the following pages, in the specified order:

1. [How it works](/api/vega-wallet/how-it-works.md): This page provides a broad picture of the wallet architecture, the way it works, its place in the Vega ecosystem, and the flow of a transaction inside the wallet.
2. [Leading principles](/api/vega-wallet/leading-principles.md): This page helps to understand the basic principles behind the wallet and its API design. It can help you adjust your development to the wallet mindset.

Now, you have a good understanding of the wallet and its interaction with the Vega ecosystem, see the next section to start integrating your application with the Vega wallet.

## I know how it works, but I don't know how to connect to it

So, you understand how the wallet works. Now, you want to start implementing:

1. [Accessing the API](/api/vega-wallet/accessing-api.md): This page lists the different wallet software from which you can consume the wallet API, and, based on your choice, provides links to dedicated guides. **We recommend you to start you integration with the local wallet service.**
2. [Bootstrap the local service](/api/vega-wallet/how-to/bootstrap-local-service.md): This will teach you how to download the vega wallet CLI, create your first wallet, and get the service up and running.
3. [Connect to the local service](/api/vega-wallet/how-to/connect-to-local-service.md): This will teach you how to consume the service API, initiate a connection, and retrieve the wallet keys.

Now, you are able to start a local wallet service and your application can connect to a wallet. See the next section to dive deeper in HTTP and JSON-RPC API.

## I know it all, I just need the API documentation

You have a local wallet service running, and your application can connect to a wallet. Next steps are all yours, here are the API documentations:

- [HTTP API documentation](/api/vega-wallet/reference/local-service/wallet-api.info.mdx): This documents all the details about the HTTP endpoints of the local service.
- [JSON-RPC API documentation](/api/vega-wallet/reference/core/openrpc.md): This documents all the details of the JSON-RPC methods exposed to third-party applications.
