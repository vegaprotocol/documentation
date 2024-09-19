---
title: Transfer assets
sidebar_position: 3
hide_title: true
description: One-off or recurring asset transfers between Vega keys or asset pools
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';

:::tip Looking to transfer from a network-managed account?
If you want to transfer assets from accounts such as an insurance pool to fund trading rewards, see the tutorial on how to [propose transferring an asset](../proposals/asset-transfer-proposal.md).
:::

# Transfers
Use transfers to send assets to **another Vega key**, from **vested to general accounts** for the same key, or to a **reward pool** to fund trading rewards. 

Key-to-key, and account-to-account transfers can be one-off, or they can be set up to send assets repeatedly, for as long as the key/account sending the assets has enough money to keep the transfers funded and fees paid.

Transfers to fund reward pools can only be recurring, though they can be set up to limit for how long they supply a reward pool, or be cancelled.

### Requirements
* **Enough of the asset** to transfer and pay the transfer fee each time
* **Vega public key** the assets are sent from. The **same key pair** must sign the transaction
* **Public key or [account type](../../api/grpc/vega/vega.proto.mdx#accounttype)** the assets are going to. (Either the number or `ACCOUNT_TYPE_.."`)
* **[Asset ID](../../api/rest/data-v2/trading-data-service-list-assets.api.mdx)** for the asset to transfer
* **Transfer amount**. It must be written with no decimal point, but include all decimal places. Note: The amount in the below examples is based on an 18 decimal point asset, and so these would transfer 1 tVEGA

## Key-to-key transfers
A key-to-key, or account-to-account transfer allows you to transfer assets between two Vega keys. You'll need enough of the asset to transfer the nominated amount, as well as enough to pay the transfer fee.

### One-off transfer to Vega key
Use `deliverOn` to set a **delivery date/time** for when the transfer arrives with the recipient account. `deliverOn` only accepts Unix time in nanoseconds. Setting it to 0 means the transfer will be completed immediately. Note: when you delay a transfer, the amount leaves your account immediately but is not delivered until the date/time you chose.

A one-off transfer **cannot be cancelled** by you, regardless of when the transfer is scheduled to arrive. If you do not have enough of the asset to cover the amount and the fees, it will be automatically cancelled.

<Tabs groupId="KeytoKeytransferOnce">
<TabItem value="KeytoKeytransferOnceLinuxcmd" label="Linux / OSX command line example">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
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
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
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
In a recurring transfer, the assets move from your account to the nominated account at the end of each [epoch](../../concepts/chain/network.md#epochs).

You'll need the following information to set up a recurring transfer: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of that epoch.
* `factor`: Written as a decimal less than 1.0. Factor is used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount will be transferred each time. 

If you do not have enough to cover each transfer and its fee, the transfer will automatically be cancelled. Otherwise, the transfer will repeated indefinitely, unless you add the optional parameter to end the recurring transfer:
* `endEpoch`: The number of the epoch in which you want the last transfer to be made.

<Tabs groupId="KeytoKeytransferRepeat">
<TabItem value="KeytoKeytransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
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
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
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

## Funding trading and validator metric rewards
Trading rewards, as well as validator metric-based rewards, are funded using recurring transfers to a reward account, which holds the assets for reward pools. The assets move from your account to the nominated reward account at the end of each epoch.

These rewards can be used to incentivise:
* Placing market/limit orders that are filled (determined by amount of maker fees a party paid or received) 
* Certain types of trading activities, like keeping a large position open or making consistent returns
* Providing liquidity by submitting orders to the book, which are then hit (determined by amount of liquidity fees a party received)
* Creating markets that attract good trading volume (determined based on value of <NetworkParameter frontMatter={frontMatter} param="rewards.marketCreationQuantumMultiple" hideValue={true} />, and the settlement asset's quantum)
* Consensus and standby validators that have a ranking score higher than 0

:::info Read more
[Trading rewards](../../concepts/trading-framework/discounts-rewards.md): Read about trading rewards, including the different rewards you can contribute to.
:::

 
### Fields used to fund trading rewards

You'll need the following information to set up a reward: 
* `startEpoch`: The number of the epoch in which you want the first transfer to be made. It will initiate at the end of that epoch.
* `factor`: Written as a decimal less than 1.0. Factor is used to determine what portion of the full `amount` is transferred in each epoch. Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount will be transferred each time. 

Recurring transfers can also set a [dispatch strategy](../../api/grpc/vega/vega.proto.mdx#dispatchstrategy) to distribute rewards based on [dispatch metrics](../../api/grpc/vega/vega.proto.mdx#dispatchmetric) that are tracked by the system. The recurring reward transfer below would reward the public key that proposed the markets specified, depending on their value.

The transfer will run indefinitely, unless you add the optional paramter to specify when to stop:
* `endEpoch`: The number of the epoch in which you want the last transfer to be made.

The `destinationType` must be the account type that matches the reward category. For example, to propose that the 'average position' reward will pay out, you'll need to set the destination type as `ACCOUNT_TYPE_REWARD_AVERAGE_POSITION`, and then choose the complementary reward category, known as the `metric`. The asset you choose then determines which market(s) the reward targets.

You will need to define the dispatch strategy, which includes the  metric, the length of time to measure performance, the asset used to evaluate performance, and other fields. 

| Dispatch strategy field | Description | Accepted values |
| ----------- | ----------- | ----------- |
| `assetForMetric` | Asset that's used to evaluate how someone performs, such as the settlement asset for the market(s) relevant to the reward | Any asset enabled on the network |
| `metric` | Specific reward category the transfer is funding | DISPATCH_METRIC_MAKER_FEES_PAID; DISPATCH_METRIC_MAKER_FEES_RECEIVED; DISPATCH_METRIC_LP_FEES_RECEIVED; DISPATCH_METRIC_MARKET_VALUE; DISPATCH_METRIC_AVERAGE_POSITION; DISPATCH_METRIC_RELATIVE_RETURN; DISPATCH_METRIC_RETURN_VOLATILITY; DISPATCH_METRIC_REALISED_RETURN; DISPATCH_METRIC_VALIDATOR_RANKING |
| `markets` | Optional: Used to choose which market(s) are in scope | Any trading market's ID |
| `stakingRequirement` | Optional: Sets a minimum number of tokens that need to be staked for a party to be considered eligible for the reward | Number, if omitted it defaults to 0 |
| `notionalTimeWeightedAveragePositionRequirement` | Optional: Sets a minimum notional TWAP required for a party to be considered eligible to receive rewards | Defaults to 0 | 
| `windowLength` | Number of epochs in which performance against the reward metric is measured | Any number between 1 and 100 inclusive |
| `transferInterval` | Optional: Number of epochs between transfers. For example, if set to 4, funds will be transferred every 4 epochs with the first transfer occurring 4 epochs after the transaction is processed. If left blank, it transfers every epoch. | Any number between 1 and 100 inclusive |
| `lockPeriod` | Number of epochs to keep earned rewards in the recipient's reward vesting account before moving to their vested account |
| `entityScope` | defines the entities within scope | ENTITY_SCOPE_INDIVIDUALS; ENTITY_SCOPE_TEAMS |
| `individualScope` | To be used if the eligible reward recipients should be individuals, and that can then be further focused to determine who is eligible | INDIVIDUAL_SCOPE_ALL; INDIVIDUAL_SCOPE_IN_TEAM; INDIVIDUAL_SCOPE_NOT_IN_TEAM |
| `teamScope` | To be used if the eligible reward recipients need to be in a team, and rewards are to be calculated based on team performance. | Leave blank if allowing all teams, otherwise provide an array of team IDs. See example below |
| `distributionStrategy` | Sets how the participants should be ranked, and what other factors to consider. |  DISTRIBUTION_STRATEGY_PRO_RATA; DISTRIBUTION_STRATEGY_RANK |
| `capRewardFeeMultiple` | Optional value that sets by how much the reward payout amount is to be capped in relation to fees paid and rewards accrued. It will set each participant's actual reward amount received to be whichever is smaller of: full earned reward amount, or the `capRewardFeeMultiple` × participant's fees paid this epoch. | |

#### Example dispatch strategy snippet

```json title="Targeted at specific teams"
"dispatchStrategy": {
  "assetForMetric": "b340c130096819428a62e5df407fd6abe66e444b89ad64f670beb98621c9c663",
  "metric": "DISPATCH_METRIC_AVERAGE_POSITION",
  "windowLength": "2",
  "transferInterval": "4",
  "entityScope": "ENTITY_SCOPE_TEAMS",
  "teamScope": [
    "0fc06d09f0805f1da96dd171af4a6e38dc6d443e135c855c7990a1ebe395b26f",
    "a33c89f67e0e8afda3165d34aeddba6082c674c3aa4ea17ece5213ef598c3558" ],
  "distributionStrategy": "DISTRIBUTION_STRATEGY_PRO_RATA"
```

<Tabs groupId="KeytoPooltransferRepeat">
<TabItem value="KeytoPooltransferRepeatLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{
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
                "markets": ["marketid_goeshere"],
                "windowLength": "number of epochs",
                "transferInterval": "number of epochs",
                "entityScope": "ENTITY_SCOPE_INDIVIDUALS",
                "individualScope": "INDIVIDUAL_SCOPE_ALL",
                "distributionStrategy": "DISTRIBUTION_STRATEGY_YOU_WANT",
            "capRewardFeeMultiple": "0.2"


            }
        }
    }
}'
```
</TabItem>
<TabItem value="KeytoPooltransferRepeatWincmd" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 ^
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
                \"markets\": [\"marketidgoeshere\"], ^
                \"windowLength\": \"numberofepochs\" ^
                \"transferInterval\": \"numberofepochs\" ^
                \"entityScope\": \"ENTITY_SCOPE_INDIVIDUALS\", ^
                \"individualScope\": \"INDIVIDUAL_SCOPE_ALL\", ^
                \"distributionStrategy\": \"DISTRIBUTION_STRATEGY_YOU_WANT\", ^
            \"capRewardFeeMultiple\": \"0.2\"

            } ^
        } ^
    } ^
}"
```
</TabItem>
</Tabs>

## Cancelling recurring transfers
To cancel a recurring transfer, you'll need the transfer's ID. To see the ID for every transfer your public key makes, [run a transfers REST query](../../api/rest/data-v2/trading-data-service-list-transfers.api.mdx).

One-off transfers cannot be cancelled.

<Tabs groupId="canceltransfer">
<TabItem value="canceltransferLinuxcmd" label="Linux / OSX command line">

```bash
vegawallet transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 '{ "cancelTransfer": { "transferId": "123" }}'
```
</TabItem>
<TabItem value="canceltransferWincmd" label="Windows command line example">

```bash
vegawallet.exe transaction send --wallet "wallet-name" --pubkey "pubkey" --network mainnet1 "{ \"cancelTransfer\": {  \"transferId\": \"123\" }}"
``` 
</TabItem>
</Tabs>