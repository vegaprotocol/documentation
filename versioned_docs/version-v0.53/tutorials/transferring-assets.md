---
title: Transfer assets
hide_title: true
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transfer between keys
Send assets to **another Vega key** using transfers. 

Key-to-key transfers can be one-off, or they can be set up to send assets repeatedly, for as long as the key sending the assets has enough money to keep the transfers funded and fees paid.

### Requirements
* **Enough of the asset** to transfer and pay the transfer fee each time
* **Vega public key** the assets are sent from. The **same key pair** must sign the transaction
* **Public key** the assets are going to
* **[Asset ID](../api/graphql/queries/assets-connection.mdx)** for the asset to transfer
* **Transfer amount**. It must be written with no decimal point, but include all decimal places. Note: The amount in the below examples is based on an 18 decimal point asset, and so these would transfer 1 tVEGA

<!--## Key-to-key transfers
A key-to-key transfer allows you to transfer assets between two Vega keys. You'll need enough of the asset to transfer the nominated amount, as well as enough to pay the transfer fee. -->

### One-off transfer to Vega key
You can set a **delivery date/time** for when the transfer arrives with the recipient account. The `deliverOn` field sets whether the transfer is delivered immediately or at a predetermined date/time. 

`deliverOn` only accepts Unix time in seconds. Setting it to 0 means the transfer will be completed immediately. Note: when you delay a transfer, the amount leaves your account but is not delivered until the date/time you chose.

A one-off transfer cannot be cancelled, regardless of when the transfer is scheduled to arrive.

<Tabs groupId="KeytoKeytransferOnce">
<TabItem value="KeytoKeytransferOnceLinuxcmd" label="Linux / OSX command line example">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{
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
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
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
For a recurring transfer, the assets move from your account to the nominated account at the end of each epoch.

You'll need the following information to set up a recurring transfer: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of this epoch.
* `factor`: Written as a decimal less than 1.0, this is the factor used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount you have available will be transferred each time. 

If you do not have enough to cover each transfer and its fee, the transfer will automatically be cancelled. Otherwise, the transfer will repeated indefinitely, unless you add the optional parameter to end the recurring transfer:
* `endEpoch`: The number of the epoch in which you want the last transfer to be made

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
            "endEpoch": 10,
            "factor": "1"
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoKeytransferRepeatcmdWin" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
"{\"transfer\": ^
    { ^
        \"fromAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"toAccountType\": \"ACCOUNT_TYPE_GENERAL\", ^
        \"to\":\"KEY\", ^
        \"asset\":\"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55\", ^
        \"amount\":\"10000000000000000000\", ^
        \"recurring\":{ ^
            \"startEpoch\": 1, ^
            \"startEpoch\": 10, ^
            \"factor\": \"1\" ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>

## Cancelling recurring transfers
To cancel a recurring transfer, you'll need the transfer's ID. To see the ID for every transfer your public key makes, [run a transfers GraphQL query](../api/graphql/queries/transfers-connection.mdx).

One-off transfers cannot be cancelled.

<Tabs groupId="canceltransfer">
<TabItem value="canceltransferLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{ "cancelTransfer": { "transferId": "123" }}'
```
</TabItem>
<TabItem value="canceltransferWincmd" label="Windows command line example">

```bash
vegawallet.exe command send --wallet "wallet-name" --pubkey "pubkey" --network fairground "{ \"cancelTransfer\": {  \"transferId\": \"123\" }}"
``` 
</TabItem>
</Tabs> 
