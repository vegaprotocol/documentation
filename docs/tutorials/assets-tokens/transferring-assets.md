---
title: Transfer assets
sidebar_position: 3
hide_title: true
description: One-off or recurring asset transfers between Vega keys or asset pools
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';

# Transfers: Key-to-key and trading rewards
Use transfers to send assets to **another Vega key** or to a **reward pool** to fund trading rewards. 

Key-to-key transfers can be one-off, or they can be set up to send assets repeatedly, for as long as the key sending the assets has enough money to keep the transfers funded and fees paid.

Transfers to fund reward pools can only be recurring, though they can be set up to limit for how long they supply a reward pool, or be cancelled.

### Requirements
* **Enough of the asset** to transfer and pay the transfer fee each time
* **Vega public key** the assets are sent from. The **same key pair** must sign the transaction
* **Public key or [account type](../../api/grpc/vega/vega.proto.mdx#accounttype)** the assets are going to. (Either the number or `ACCOUNT_TYPE_.."`)
* **[Asset ID](../../api/rest/data-v2/trading-data-service-list-assets.api.mdx)** for the asset to transfer
* **Transfer amount**. It must be written with no decimal point, but include all decimal places. Note: The amount in the below examples is based on an 18 decimal point asset, and so these would transfer 1 tVEGA

## Key-to-key transfers
A key-to-key transfer allows you to transfer assets between two Vega keys. You'll need enough of the asset to transfer the nominated amount, as well as enough to pay the transfer fee.

### One-off transfer to Vega key
Use `deliverOn` to set a **delivery date/time** for when the transfer arrives with the recipient account. `deliverOn` only accepts Unix time in nanoseconds. Setting it to 0 means the transfer will be completed immediately. Note: when you delay a transfer, the amount leaves your account immediately but is not delivered until the date/time you chose.

A one-off transfer **cannot be cancelled** by you, regardless of when the transfer is scheduled to arrive. If you do not have enough of the asset to cover the amount and the fees, it will be automatically cancelled.

<Tabs groupId="KeytoKeytransferOnce">
<TabItem value="KeytoKeytransferOnceLinuxcmd" label="Linux / OSX command line example">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
    "transfer":{
        "fromAccountType": "ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_GENERAL",
        "to":"recipient-Vega-public-key",
        "asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount":"10000000000000000000",
        "oneOff":{ 
            "deliverOn": 0
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoKeytransferOnceWincmd" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{\"transfer\": ^
    { ^
        \"fromAccountType\":\"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\":\"ACCOUNT_TYPE_GENERAL\", ^
        \"to\":\"recipient-Vega-public-key\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"10000000000000000000\", ^
        \"oneOff\":{ ^
            \"deliverOn\":0 ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>

### Recurring transfer to Vega key
In a recurring transfer, the assets move from your account to the nominated account at the end of each [epoch](../../concepts/vega-chain/network.md#epochs).

You'll need the following information to set up a recurring transfer: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of that epoch.
* `factor`: Written as a decimal less than 1.0. Factor is used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount will be transferred each time. 

If you do not have enough to cover each transfer and its fee, the transfer will automatically be cancelled. Otherwise, the transfer will repeated indefinitely, unless you add the optional parameter to end the recurring transfer:
* `endEpoch`: The number of the epoch in which you want the last transfer to be made.

<Tabs groupId="KeytoKeytransferRepeat">
<TabItem value="KeytoKeytransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
    "transfer":{
        "fromAccountType":"ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_GENERAL",
        "to": "KEY",
        "asset": "fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount": "10000000000000000000",
        "recurring": {
            "startEpoch": 1,
            "endEpoch": 10,
            "factor": "1"
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoKeytransferRepeatcmdWin" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{\"transfer\": ^
    { ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"to\":\"KEY\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"10000000000000000000\", ^
        \"recurring\":{ ^
            \"startEpoch\": 1, ^
            \"endEpoch\": 10, ^
            \"factor\": \"1\" ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>

## Funding trading rewards
Trading rewards are funded using recurring transfers to a reward account, which holds the assets for reward pools. The assets move from your account to the nominated reward account at the end of each epoch.

Trading rewards can be used to incentivise:
* Placing market/limit orders that are filled (determined by amount of maker fees a party paid or received) 
* Providing liquidity by submitting orders to the book, which are then hit (determined by amount of liquidity fees a party received)
* Creating markets that attract good trading volume (determined based on value of <NetworkParameter frontMatter={frontMatter} param="rewards.marketCreationQuantumMultiple" hideValue={true} />, and the settlement asset's quantum)

:::info Read more
[Trading rewards](../../concepts/trading-on-vega/fees-rewards): Read about trading rewards, including the different rewards you can contribute to.
:::

You'll need the following information to set up a reward: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of that epoch.
* `factor`: Written as a decimal less than 1.0. Factor is used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount will be transferred each time. 

Recurring transfers can also set a [dispatch strategy](../../api/grpc/vega/vega.proto.mdx#dispatchstrategy) to distribute rewards based on [dispatch metrics](../../api/grpc/vega/vega.proto.mdx#dispatchmetric) that are tracked by the system. The recurring reward transfer below would reward the public key that proposed the markets specified, depending on their value.

The transfer will run indefinitely, unless you add the optional paramter to specify when to stop:
* `endEpoch`: The number of the epoch in which you want the last transfer to be made.
 
<Tabs groupId="KeytoPooltransferRepeat">
<TabItem value="KeytoPooltransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
    "transfer":{
        "fromAccountType": "ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS",
        "to":"0000000000000000000000000000000000000000000000000000000000000000",
        "asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount":"10000000000000000000",
        "recurring":{
            "startEpoch": 1,
            "endEpoch": 10,
            "factor": "1",
            "dispatchStrategy": {
                "assetForMetric": "fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
                "metric": "DISPATCH_METRIC_MARKET_VALUE",
                "markets": ["marketid"]
            }
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoPooltransferRepeatWincmd" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground ^
"{ ^
    \"transfer\":{ ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\": \"ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS\", ^
        \"to\":\"0000000000000000000000000000000000000000000000000000000000000000\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"reference\":\"reward\", ^
        \"recurring\":{ ^
            \"startEpoch\": 1, ^
            \"endEpoch\": 10, ^
            \"factor\": \"1\", ^
            \"dispatchStrategy\": { ^
                \"metric\": \"DISPATCH_METRIC_MARKET_VALUE\", ^
                \"markets\": [\"marketid\"] ^
            } ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>

### Publicising trading rewards
Once you've funded a reward pool, you can promote the reward, and the market it's relevant for, by sharing it with the community on [Discord ↗](https://vega.xyz/discord) and on the [Vega forum ↗](https://community.vega.xyz).

## Cancelling recurring transfers
To cancel a recurring transfer, you'll need the transfer's ID. To see the ID for every transfer your public key makes, [run a transfers REST query](../../api/rest/data-v2/trading-data-service-list-transfers.api.mdx).

One-off transfers cannot be cancelled.

<Tabs groupId="canceltransfer">
<TabItem value="canceltransferLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{ "cancelTransfer": { "transferId": "123" }}'
```
</TabItem>
<TabItem value="canceltransferWincmd" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network fairground "{ \"cancelTransfer\": {  \"transferId\": \"123\" }}"
``` 
</TabItem>
</Tabs>
