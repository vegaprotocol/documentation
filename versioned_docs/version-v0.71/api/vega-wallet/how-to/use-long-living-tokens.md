---
title: Use long-living tokens
hide_title: false
sidebar_position: 3
---

:::caution Warning
Long-living tokens are highly privileged tokens that bypass user review and the approval process, and give access to all public keys of the associated wallet.

If using this process, be sure you are comfortable allowing that level of access to your keys.
:::

## Enable the support for long-living tokens
This is only needed once, the first time you use long-living tokens.

```bash
vegawallet api-token init
```

## Generate a long-living token
Generate a token, and link it to the wallet of your choice:

```bash
vegawallet api-token generate --wallet-name "WALLET_NAME" --description "for my trading bot"
```

## Start the service with long-living token support
**If you forget the `--load-tokens` flag, sessions with long-living tokens are not created.**

```bash
vegawallet service run --load-tokens --network mainnet1
```

:::note Good to know!
If you have a running service (with the `--load-tokens` flags), you don't have to restart it. The generated token will be picked up automatically.
:::

## Get help with the CLI
**If you need help using the Vega wallet CLI**, see the ["Get help with the CLI" guide](../../../tools/vega-wallet/cli-wallet/latest/guides/get-help.md).
