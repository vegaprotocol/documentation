---
title: Stake tokens
sidebar_position: 1
hide_title: false
vega_network: TESTNET
description: Stake unlocked tokens with Vega Wallet and smart contracts
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::tip
This tutorial describes how to stake using the smart contracts, the APIs, an Ethereum wallet, and a Vega Wallet.
:::

* Tokenholders can stake tokens to [validators on a network](../../concepts/chain/proof-of-stake.md), also known as nominating validators.
* A [Vega Wallet](../../tools/vega-wallet/) is required to create a Vega key and to stake (also known as nominate) validators.
* Governance tokens may be locked in a vesting schedule set by the network operators. This tutorial covers unlocked tokens, i.e. tokens that are in a user's Ethereum wallet.
* The staking bridge used to *stake* assets is different to the ERC20 bridge that allows asset *withdrawal*.

## Staking unlocked tokens
Staking tokens from a tokenholder's Ethereum wallet follows the below process:
1. On Ethereum, the tokens need to be associated with a Vega key
2. On a network running Vega software, the Vega key is used to nominate a validator (stake)
3. At the end of each [epoch](../../concepts/chain/network.md#epochs), rewards are paid out to the Vega key

## Withdrawing unlocked and unassociated tokens
1. On a network running Vega software, rewards and unassociated tokens can be withdrawn by submitting a withdrawal transaction
2. On Ethereum, the withdrawal confirmation is submitted to the staking bridge, and the rewards are released to the specified Ethereum address

## Staking unlocked tokens: step by step
### 1. Associating tokens
Tokens are associated by calling `stake` on the staking bridge. The two parameters are:
* `vega_public_key` - the Vega public key that will be used to nominate validators on the network
* `amount` - the amount of tokens being associated with the Vega key

It will take ~50 block confirmations for the balance to update. You can see when the staking balance has been credited by using [REST](../../api/rest/data-v2/trading-data-service-get-stake) or [gRPC](../../api/grpc/vega/vega.proto#vegaproto).

### 2. Nominating a validator
Once the token balance is associated to a Vega key, you'll want to choose a validator or validators to nominate. 

Fetch a list of validator nodes using [REST](../../api/rest/data-v2/trading-data-service-list-nodes).

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
A nomination to a validator occurs in one epoch, [and takes effect in the subsequent epoch](../../concepts/chain/proof-of-stake.md#nominating-validators). 

That means that during the first epoch in which you nominate, no rewards will be received. For each subsequent epoch, rewards will be deposited to the Vega key. 

Specific reward payouts can be queried via [REST](../../api/rest/data-v2/trading-data-service-list-reward-summaries).

After any rewards in the form of governance tokens have been credited to the Vega key they can used to nominate validators or withdrawn.

Withdrawing involves preparing a withdrawal request, which the validators will confirm and sign in order for you to be able to request the withdrawal on Ethereum. The funds will immediately be locked, so they can be withdrawn through the Ethereum bridge.

## Withdrawing unlocked tokens: step by step

### 1. Getting multisig bundle for withdrawal
Your withdrawal should be confirmed within a few seconds.

You can retrieve the signature bundle, which you will submit to the ERC20 bridge in the next step, by using [REST](../../api/rest/data-v2/trading-data-service-list-withdrawals).

### 2. Submitting withdrawal to Ethereum
With the signature bundle fetched above, the final step is to submit that withdrawal to the staking bridge. This can be done via the `withdraw_asset` function on the network's Ethereum bridge.

* `amount` - the amount being withdrawn
* `asset_source` - the contract address of the asset being withdrawn
* `target` - the Ethereum address to receive the rewards
* `nonce` - the nonce from step 4
* `signatures` - signature bundle from step 4