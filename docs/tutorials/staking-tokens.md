---
title: Stake tokens
sidebar_position: 5
hide_title: false
vega_network: TESTNET
description: Stake unlocked tokens with Vega Wallet and smart contracts
---

import EthAddresses from '@site/src/components/EthAddresses';
import Topic from '/docs/topics/_topic-staking.mdx'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Topic />

:::tip
This tutorial describes how to stake using the smart contracts, the APIs, an Ethereum wallet, and a Vega Wallet. If you're looking for the easiest way to stake tokens, visit [token.fairground.wtf](https://token.fairground.wtf)
:::

* Tokenholders can stake tokens to [validators on the Vega chain](../concepts/vega-chain#delegated-proof-of-stake), also known as nominating validators.
* A [Vega Wallet](../tools/vega-wallet/) is required to create a Vega key and to stake (also known as nominate) validators.
* Vega tokens may be locked in a vesting schedule. This tutorial covers unlocked tokens, i.e. tokens that are in a user's Ethereum wallet.
* The staking bridge used to *stake* assets is different to the ERC20 bridge that allows asset *withdrawal*.

## Staking unlocked tokens
Staking tokens from a tokenholder's Ethereum wallet follows the below process:
1. On Ethereum, the tokens need to be associated with a Vega key
2. On Vega, the Vega key is used to nominate a validator (stake)
3. At the end of each epoch, rewards are paid out to the Vega key

## Withdrawing unlocked and unassociated tokens
1. On Vega, rewards and unassociated tokens can be withdrawn by submitting a withdrawal transaction
2. On Ethereum, the withdrawal confirmation is submitted to the staking bridge, and the rewards are released to the specified Ethereum address

## Staking unlocked tokens: step by step
### 1. Associating tokens
Tokens are associated by calling [`stake` on the Vega staking bridge](../api/bridge/contracts/Vega_Staking_Bridge#stake). The two parameters are:
* `vega_public_key` - the Vega public key that will be used to nominate validators on Vega
* `amount` - the amount of tokens being associated with the Vega key

It will take ~50 block confirmations for the balance to update (approximately 1 minute). You can see when the staking balance has been credited by using [REST](../api/rest/data-v2/trading-data-service-get-stake), [GraphQL](../api/graphql/objects/party#operation/TradingDataService1_ERC20WithdrawalApproval) or [gRPC](../api/grpc/vega/vega.proto#vegaproto).

### 2. Nominating a validator
Once the token balance is associated to a Vega key, you'll want to choose a validator or validators to nominate. 

Fetch a list of validator nodes using [REST](../api/rest/data-v2/trading-data-service-list-nodes), [GraphQL](../api/graphql/queries/nodes-connection) or [gRPC](../api/grpc/data-node/api/v2/trading_data.proto#nodesconnection).

Nominate a validator by sending a transaction with the Vega Wallet:

<Tabs>
  <TabItem value="cmd" label="Command line (Linux / OSX)">

```bash
vegawallet transaction send --wallet "WALLET_NAME" --pubkey "VEGA_PUBKEY" --network fairground '{
  "delegateSubmission": {
    "nodeId":"INSERT_NODE_ID_FOR_NOMINATION",
    "amount":"1000000000000000000"
   }
}'
```

  </TabItem>
  <TabItem value="win" label="Command line (Windows)">

```bash
vegawallet.exe transaction send --wallet "WALLET_NAME" --pubkey "VEGA_PUBKEY" --network fairground ^
"{\"delegateSubmission\": ^
    { ^
        \"nodeId\":\"INSERT_NODE_ID_FOR_NOMINATION", ^
        \"amount\":\"1000000000000000000\" ^
    } ^
}"
```

  </TabItem>
</Tabs>



### 3. Claiming rewards
A nomination to a validator occurs in one epoch, [and takes effect in the subsequent epoch](../concepts/vega-chain#operation/ERC20WithdrawalApproval). 

That means that during the first epoch in which you nominate, no rewards will be received. For each subsequent epoch, rewards will be deposited to the Vega key, in the form of VEGA tokens. (Once trading is available on mainnet, rewards will be paid in a mix of VEGA tokens and settlement asset tokens.)

Specific reward payouts can be queried via the API ([REST](../api/rest/data-v2/trading-data-service-list-reward-summaries), [GraphQL](../api/graphql/objects/reward-summary-connection)).

After VEGA rewards have been credited to the Vega key they can used to nominate validators or withdrawn.

Withdrawing involves preparing a withdrawal request, which the validators will confirm and sign in order for you to be able to request the withdrawal on Ethereum. The funds will immediately be locked on Vega, so they can be withdrawn through the Ethereum bridge.

## Withdrawing unlocked tokens: step by step

### 1. Getting multisig bundle for withdrawal
Your withdrawal should be confirmed within a few seconds. 

You can retrieve the signature bundle, which you will submit to the ERC20 bridge in the next step, by using the APIs ([REST](../api/rest/data-v2/trading-data-service-list-withdrawals), [GraphQL](../api/graphql/objects/party#withdrawals-withdrawal)).

### 2. Submitting withdrawal to Ethereum
With the signature bundle fetched above, the final step is to submit that withdrawal to the staking bridge. This can be done via the [`withdraw_asset` function on the Ethereum bridge](../api/bridge/interfaces/IERC20_Bridge_Logic#withdraw_asset).

* `amount` - the amount of Vega being withdrawn
* `asset_source` - the contract address of the asset being withdrawn
* `target` - the Ethereum address to receive the rewards
* `nonce` - the nonce from step 4
* `signatures` - signature bundle from step 4

### Ethereum addresses
<EthAddresses frontMatter={frontMatter} />
