---
title: API principles
hide_title: false
description: Learn the core principles behind the wallet API.
sidebar_position: 2
---

import Topic from '/docs/topics/_topic-wallet.mdx'

<Topic />

On this page, you will find the core principles behind the API. It helps to understand the ins and outs to properly communicate with a Vega wallet.

## Third-party applications gets very little information about user information
It's important to understand the API is built to give very little information to the third-party application. This is done to reduce, as much as possible, information leakage that could lead to unmasking the user.

As a result, the third-party application only has access to:
- Public keys the users explicitly gave access to
- Chain ID of the network the user is connected to
- Requesting to send, sign and check a transaction

## A transaction can be prevented from being sent for a lot of reasons
As a third-party application developer, you will have to account for the checks done by the Vega Wallet backend, the user approvals, and the network state.

All these parts can prevent the sending of the transaction. The most common reasons are:
- The transaction is incorrect
- The transaction breaks the anti-spam rules
- The user denies access to their wallet for your application
- The user rejects the transaction
- The user cancels the request
- The network rejects the transaction
