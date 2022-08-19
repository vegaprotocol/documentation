---
title: Transfer assets
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can send assets to another Vega key or to a reward pool using transfers. Transfers can be one-off, or they can be set up to happen over and over again, at least while the key sending the assets has enough money to keep the transfers going. 

### Key requirements
To set up a transfer, you'll need:
* **Vega public key** that the assets are coming from
* **Public key or [account type](../grpc/vega/vega.proto.mdx#accounttype)** (either the number or `ACCOUNT_TYPE_.."`) that the assets are going to
* **[Asset ID](../graphql/queries/assets-connection.mdx)** for the asset you want to transfer. 
* Use the **same key pair** to sign the transaction, because the funds have to come from a key you control
* **Transfer amount**, which must be written with no decimal point, but include all decimal places. The amount in the below examples is based on an 18 decimal point asset, and so these transfers would allot 1 tVEGA for transferring

## One-off transfers
For one-off transfers, you can set a delivery date/time for when the transfer arrives with the recipient account. The `deliverOn` field sets whether the transfer is delivered immediately or at a predetermined date/time. 

`deliverOn` only accepts Unix time in seconds. Setting it to 0 means the transfer will be completed immediately. Note: when you delay a transfer, the amount leaves your account but is not delivered until the date/time you chose.

### One-off transfer to Vega key

<Tabs groupId="KeytoKeytransferOnce">
<TabItem value="KeytoKeytransferOnceLinuxcmd" label="Linux / OSX command line example">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
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
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1^
"{\"transfer\":^
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

<!--### One-off transfer to reward pool

<Tabs groupId="KeytoPooltransferOnce">
<TabItem value="KeytoPooltransferOnceLinuxcmd" label="Linux / OSX command line example">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
    "transfer":{
        "fromAccountType": "ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_GLOBAL_REWARD",
        "to":"0000000000000000000000000000000000000000000000000000000000000000",
        "asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount":"10000000000000000000",
        "oneOff":{
            "deliverOn": 0
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoPooltransferOnceWincmd" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
"{ ^
    \"transfer\": { ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\":\"ACCOUNT_TYPE_GLOBAL_REWARD\", ^
        \"to\":\"0000000000000000000000000000000000000000000000000000000000000000\", ^
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
-->

## Recurring transfers
For a recurring transfer, the assets move from your account to the nominated account at the end of each epoch.

You'll need the following information to set up a recurring transfer: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of this epoch.
* `factor`: Written as a decimal less than 1.0, this is the factor used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount you have available will be transferred each time. 

Recurring transfers can also optionally set a [DispatchStrategy](../grpc/vega/vega.proto.mdx#dispatchstrategy), which can be used to distribute rewards based on [Dispatch Metrics](../grpc/vega/vega.proto.mdx#dispatchmetric) that are tracked by the system. The recurring reward pool transfer below would reward the public key that proposed the markets specified, depending on their value.

### Recurring transfer to Vega key

<Tabs groupId="KeytoKeytransferRepeat">
<TabItem value="KeytoKeytransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
    "transfer":{
        "fromAccountType":"ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_GENERAL",
        "to": "KEY",
        "asset": "fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount": "10000000000000000000",
        "recurring": {
            "startEpoch": 1,
            "factor": "2"
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoKeytransferRepeatcmdWin" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1^
"{\"transfer\": ^
    { ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"to\":\"KEY\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"10000000000000000000\", ^
        \"recurring\":{ ^
            \"startEpoch\": 1, ^
            \"factor\": \"3\" ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>
 

<!--
### Recurring transfer to reward pool

<Tabs groupId="KeytoPooltransferRepeat">
<TabItem value="KeytoPooltransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
    "transfer":{
        "fromAccountType": "ACCOUNT_TYPE_GENERAL",
        "toAccountType": "ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS",
        "to":"0000000000000000000000000000000000000000000000000000000000000000",
        "asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55",
        "amount":"10000000000000000000",
        "recurring":{
            "startEpoch": 1,
            "factor": "3",
            "dispatchStrategy": {
                "assetForMetric": "123",
                "dispatchMetric": "DISPATCH_METRIC_MARKET_VALUE",
                "marketIdsInScope": ["marketid"]
            }
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoPooltransferRepeatWincmd" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
"{ ^
    \"transfer\":{ ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\": \"ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS\", ^
        \"to\":\"0000000000000000000000000000000000000000000000000000000000000000\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"10000000000000000000\", ^
        \"reference\":\"reward\", ^
        \"recurring\":{ ^
            \"startEpoch\": 1, ^
            \"factor\": \"3\", ^
            \"dispatchStrategy\": { ^
                \"dispatchMetric\": \"DISPATCH_METRIC_MARKET_VALUE\", ^
                \"marketIdsInScope\": [\"marketid\"] ^
            } ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>
-->

### Cancelling recurring transfers
To cancel a recurring transfer, you'll need the transfer's ID. To see the ID for every transfer your public key makes, [run a transfers GraphQL query](../graphql/queries/transfers-connection.mdx) to see the ID for every transfer you make.

<Tabs groupId="canceltransfer">
<TabItem value="canceltransferLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1\
    '{ "cancelTransfer": { "transferId": "123" }}'
```
</TabItem>
<TabItem value="canceltransferWincmd" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 "{ \"cancelTransfer\": {  \"transferId\": \"123\" }}"
``` 
</TabItem>
</Tabs>
