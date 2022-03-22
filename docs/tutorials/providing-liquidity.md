---
title: Providing liquidity using APIs
hide_title: false
---

In this tutorial, you'll learn how to build a liquidity provision order to provide liquidity on a live market created with Vega. You'll have to actively manage your liquidity commitment, so you'll also learn how to amend your order, as well as cancel it. 

If you proposed a market that was enacted and want to change your liquidity provision shape, skip down to [amending a liquidity commitment]. 
<!---Notes to cover: 
* Description and information for each piece of code, what it does and general, high-level guidelines of how this kind of thing works.
* Question: is anything about the sample scripts testnet-specific that needs to be highlighted/changed?
* LP on Vega is manual, not automatic. Once you choose the shape, you'll need to keep track of it and actively manage your LP. 
* You'll need enough collateral to cover the orders and the margin. If not... penalties and closeouts.
* Add section that links to Vega Tool to track liquidity commitment, and an explanation of how to go about using it. --->


## Using the sample-api-scripts helper scripts
**[Sample API scripts](https://github.com/vegaprotocol/sample-api-scripts/README.md)**: Vega supplies a GitHub repository that contains a set of sample scripts that perform many of the basic actions you can do with the Vega protocol. 

### Setting up the helper scripts
Inside the root folder there is a credentials file that can be customised to your Vega network. For more information about running the scripts please see the [README.md](https://github.com/vegaprotocol/sample-api-scripts/#readme) in the root of the repository.

## What is liquidity provision?
Supplying liquidity to a market keeps open orders resting on the order book, to keep a relatively balanced set of orders available. Participants who provide liquidity earn from liquidity fees, which are paid by the *price takers* on each trade.

[Fees]: Learn more about the fee structure. 

In order to qualify to receive a portion of the liquidity fees, the liquidity provider must commit an amount of the underlying market asset. Once it's committed, it is stored in a bond account. 

If orders from your liquidity shape are filled, the collateral to cover the margin comes from your general collateral account. 

### Shapes for liquidity commitment orders
The placement of the orders on the book is decided by two shapes. The shapes are created by the liquidity provider, and they define at which price levels the orders will be placed, and what weight each price level will have. 

Vega then calculates the size of the liquidity order placed at each price level using: the total bond amount, the current price, and the weight on each level. As the prices on the order book move, Vega will recalculate the order sizes and prices and update the orders.

The shape of the orders placed for a liquidity provision can influence how likely they are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away.

## Terms used in liquidity provision orders

* Commitment amount: The amount of asset that you want to allocate to providing liquidity. The amount will be moved into a bond account during the duration of your liquidity commitment. 
* Fee: The fee is defined on a scale from 0 to 1. In the example below, `0.01 * total trade amount` is what would be charged on each trade.
* Buy side shape: 
* Sell side shape: 
* Reference price: In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders
* Weight level: Weights help to scale the commitment amount. Add up all the weights and then use the total to scale each weight for each price level.
* Propagate true/false: True - Sign it, and also send it onto a node. False - Sign it, and return it so it can be sent in a separate transaction
 
## Creating a liquidity provision order
There are two ways to create liquidity provision orders. The first is to supply the bond amount and shape in the same message as the governance message that created the market.

[Market proposals]: Read about how to propose a market. 

If the market is already live and trading, then there is a second option - to **send a `liquidityProvisionSubmission` message**. As most participants interested in providing liquidity will not be creating their own market, this tutorial concentrates on the second option. 

In the [`sample-api-scripts` repo](https://github.com/vegaprotocol/sample-api-scripts/), there is a folder named `submit-create-liquidity-provision`, which has a set of scripts to create a new liquidity provision. 

You can see in the python script that the most important part is the description of the commit amount and price levels:

```
submission = {
    "liquidityProvisionSubmission": {
        "marketId": marketID,                   <-- The market ID for the market you wish to supply liquidity to -->
        "commitmentAmount": "100",              <-- The amount of the asset you want to `bond`, or allocate to providing liquidity -->
        "fee": "0.01",                          <-- The scaling factor for the fee you wish to receive when your order is matched -->
        "buys": [                               <-- The buy side shape -->
            {
                "offset": "1",                      <-- How far from the reference price the price level should be set at -->
                "proportion": "1",                  <-- What weight this level should have -->
                "reference": "PEGGED_REFERENCE_MID" <-- The reference price for this price level -->
            },
            {
                "offset": "2",
                "proportion": "2",
                "reference": "PEGGED_REFERENCE_MID"
            }
        ],
        "sells": [                              <-- The sell side shape -->
            {
                "offset": "1",
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_MID"
            },
            {
                "offset": "2",
                "proportion": "2",
                "reference": "PEGGED_REFERENCE_MID"
            },
            {
                "offset": "3",
                "proportion": "5",
                "reference": "PEGGED_REFERENCE_MID"
            }
        ]
    },
    "pubKey": pubkey,                             <-- The public key you're using to place the liquidity commitment -->
    "propagate": True
}
```

To execute a test liquidity provision creation you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-create-liquidity-provision/submit-create-liquidity-provision-order.sh
```

:::info
You can try out your liquidity provision shape on Fairground, the Vega testnet. (How?)
:::

## Amending a liquidity commitment
The Vega system does not take into account your current position when it creates the orders from your liquidity provision shape. Therefore, if you are currently long or short, the orders created will be the same. For example, if you create a shape that is more likely to result in a long position, then over time you are likely to become longer. 

As you are required to have enough margin to cover you position, this puts more strain on your margin account as your position grows. 

One way you can help control your margin requirements is to change the shape of liquidity provision order to help reduce your position. For this, you can use the `liquidityProvisionAmendment` command.

```
submission = {
    "liquidityProvisionAmendment": {
        "marketId": marketID,
        "commitmentAmount": "100",
        "fee": "0.01",
        "buys": [
            {
                "offset": "10",                             <-- We choose an offset further away from the reference to reduce our chance of getting filled -->
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_BEST_BID"
            }
        ],
        "sells": [
            {
                "offset": "1",                              <-- This order will be very close to best ask price and is very likely to be matched -->
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_BEST_ASK"
            }
        ]
    },
    "pubKey": pubkey,
    "propagate": True
}

```

In the above example, the shape is being changed to increase the chance that sell orders will be matched. This will help to reduce the size of a long position. The activity of the market itself will control exactly what gets filled, and the shape of your orders does not guarantee your orders will be filled.

To execute a test liquidity provision amend you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.sh
```

## Cancelling a liquidity provision
If you no longer want to keep a liquidity commitment open for a market, you can cancel your commitment using the `liquidityProvisionCancellation`. This will remove any orders created as part of your supplied shape and it will return the bond amount back into your general account.

```
submission = {
    "liquidityProvisionCancellation": {
        "marketId": marketID,
    },
    "pubKey": pubkey,
    "propagate": True
}
```

If there is not enough liquidity left in the market after you cancel, it will force the market into a liquidity auction where it will stay until there is enough new liquidity supplied to bring it back out into continuous trading.

To test a liquidity provision cancellation on testnet, or see how a cancellation is built, you can use the following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.sh
```

## Viewing existing liquidity provisions
You can view the list of participants supplying liquidity to market in two easy ways: using the endpoint or a Vega Tool. 

1. One, by querying the REST endpoint for a node given the partyID and marketID:

`https://<node address>/liquidity-provisions/party/{party}/market/{market}`

2. Alternatively, you can use the `vegatools` command line tool to view the details about the liquidity providers for a given market. The repo for this tool can be found here: `https://github.com/vegaprotocol/vegatools`

To see the current liquidity commitments for a market on testnet, you can use this command line:

`vegatools liquiditycommitment -a=n06.testnet.vega.xyz:3007`

<-- link to picture vegatools-liquidity-commitment.png in same folder as this file -->

## What can go wrong when using liquidity provisions?
If you run out of margin to maintain your position, Vega will use some of your bond to cover the margin requirements. You will get charged a fee when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller.
