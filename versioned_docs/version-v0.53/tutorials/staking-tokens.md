---
title: Stake tokens
hide_title: false
vega_network: MAINNET
ethereum_network: Mainnet
---

import EthAddresses from '@site/src/components/EthAddresses';
import Topic from '/docs/topics/\_topic-staking.mdx'

<Topic />

:::tip

This tutorial describes how to stake via APIs and smart contract integrations. If you're just looking to stake tokens, visit [token.vega.xyz](https://token.vega.xyz)

:::

# Background knowledge

- Users can stake tokens to [validators on the Vega chain](../concepts/vega-chain#delegated-proof-of-stake)
- Vega tokens may be locked in a vesting schedule. This tutorial covers unlocked tokens, i.e. tokens that are in a user's Ethereum wallet.
- A Vega address can be created using the [Vega Wallet](../tools/vega-wallet/)
- The staking bridge used to _stake_ assets is different to the ERC20 bridge that allows asset _withdrawal_.

# Staking unlocked tokens

Staking tokens from a user's Ethereum wallet is a three step process:

1. On Ethereum, the tokens are associated with a Vega address
2. On Vega, the Vega address nominates a validator to stake their tokens
3. At the end of each epoch, rewards are paid out to the Vega address
4. On Vega, a withdrawal transaction is submitted
5. On Ethereum, the withdrawal confirmation is submitted to the Staking bridge, and the rewards are released to the specified address

## 1. Associating tokens

Tokens are associated by calling [`stake` on the Vega staking bridge](../api/bridge/contracts/Vega_Staking_Bridge#stake). The two parameters are:

- `vega_public_key` - the public key of the address that will perform staking on Vega
- `amount` - the amount of stake being associated with the Vega key

Deposits will take ~50 block confirmations to arrive on Vega. You can check using [REST](../api/rest/data-v1/trading-data-service-party-stake), [GraphQL](../graphql/objects/party#operation/TradingDataService_ERC20WithdrawalApproval) or [GRPC](../grpc/vega/vega.proto#vegaproto) to know when the staking balance has been credited.

## 2. Nominating to a validator

Now that the staking balance is available, you'll want to choose a validator to stake to.

## 3. Waiting for the next epoch

A nomination to a validator occurs in one epoch, [and takes effect in the subsequent epoch](../concepts/vega-chain#operation/ERC20WithdrawalApproval). That means that during the first period in which you nominate, no rewards will be received. For each subsequent epoch, rewards will be deposited to the Vega key, in the form of Vega tokens. Specific reward payouts can be queried via the API ([REST](../api/rest/data-v1/trading-data-service-get-rewards)).

## 4. Withdrawing rewards

Now that rewards have been paid in to your account, you will want to request a withdrawal. This involves preparing a withdrawal request, which the validators will confirm and sign in order for you to be able to request the withdrawal on Ethereum. The funds will immediately be locked on Vega, to allow for you to withdraw them through the Ethereum bridge.

Your withdrawal should be confirmed within a few seconds, and using the APIs ([REST](../api/rest/data-v1/trading-data-service-withdrawals), [GraphQL](../graphql/objects/party#withdrawals-withdrawal)) you can retrieve the signature bundle, which you will submit to the ERC20 bridge in the next step.

## 5. Submit withdrawal

With the signature bundle fetched in step 4, the final step is to submit that withdrawal to the staking bridge. This can be done via the [`withdraw_asset` function on the Ethereum bridge](../api/bridge/interfaces/IERC20_Bridge_Logic#withdraw_asset).

- `amount` - the amount of Vega being withdrawn
- `asset_source` - the contract address of the asset being withdrawn
- `target` - the Ethereum address to receive the rewards
- `nonce` - the nonce from step 4
- `signatures` - signature bundle from step 4

## Ethereum addresses

<EthAddresses frontMatter={frontMatter} />
