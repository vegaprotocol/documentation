---
title: Transfers
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can send assets to another Vega key or to a reward pool using transfers. Transfers can be one-off, or they can be set up to happen over and over again, at least while the key sending the assets has enough money to keep the transfers going. 

To set up a transfer, you'll need to know the Vega public key that the assets are coming from, the key or reward pool number that the assets are going to, as well as the asset ID for the asset you want to transfer. You'll need to use the same keypair to sign the transaction, because the funds have to come from a key you have control of.

## One-off transfers

* Amount must be written with no decimal point. The amount below, for example, is based on an 18 decimal point asset, and so this transfer would send 1 tVEGA to a public key.
* Deliver on X date, written in utc seconds using the `deliverOn` field. Setting it to 0 means send it immediately. 

### One-off transfer to Vega key

<Tabs groupId="KeytoKeytransferOnce">
<TabItem value="cmd" label="Linux / OSX command line example">

```
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground {"transfer":"fromAccountType":4,"toAccountType":4,"to":"recipient-Vega-public-key","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","oneOff"}:{"deliverOn":0}}}
```
</TabItem>
<TabItem value="cmd" label="Windows command line example">
to do 
</TabItem>
</Tabs>

### One-off transfer to reward pool

<Tabs groupId="KeytoPooltransferOnce">
<TabItem value="cmd" label="Linux / OSX command line example">

```
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":"fromAccountType":4,"toAccountType":12,"to":"0000000000000000000000000000000000000000000000000000000000000000","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","oneOff":{"deliverOn":0}}}'
```
</TabItem>
<TabItem value="cmd" label="Windows command line example">
to do 
</TabItem>
</Tabs>

## Recurring transfers

For a recurring transfer, the assets move at the end of each epoch.

You'll need to consider the following information to set up a recurring transfer: 
* start epoch: at the end of this epoch the first recurring transfer will be made
* end epoch (optional): at the end of this epoch the first recurring transfer will be made between, optional. If not specified the transfer run until cancelled.
* factor: decimal > 1.0 (a factor used with the amount specified for the transfer). Think of it like a percentage, so the number you include, when multiplied by 100, will equal what percentage of the amount you have available will be transferred each time. 

### Recurring transfer to Vega key

(deliver on is in utc seconds)

factor: percentage of full reward amount you specified that you want to pay each time to vega key

<Tabs groupId="KeytoKeytransferRepeat">
<TabItem value="cmd" label="Linux / OSX command line">

```
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":4,"to":"KEY","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","recurring":{"startEpoch":0, "endEpoch":"2", "factor":}}}'
```
</TabItem>
<TabItem value="cmd" label="Windows command line example">
to do 
</TabItem>
</Tabs>
 
### Recurring transfer to reward pool 
<Tabs groupId="KeytoPooltransferRepeat">
<TabItem value="cmd" label="Linux / OSX command line">

```
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":12,"to":"0000000000000000000000000000000000000000000000000000000000000000","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","recurring":{"startEpoch":0, "endEpoch":"2", "factor":}}}'
```
</TabItem>
<TabItem value="cmd" label="Windows command line example">
to do 
</TabItem>
</Tabs>

### Cancelling recurring transfers
To cancel a recurring transfer, you'll need the transfer's ID.

<Tabs groupId="canceltransfer">
<TabItem value="cmd" label="Linux / OSX command line">

```
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{ "cancelTransfer": "transfer_id" }'
```
</TabItem>
<TabItem value="cmd" label="Windows command line example">
to do 
</TabItem>
</Tabs>

-how to get transfer ID? 
