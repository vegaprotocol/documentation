---
title: Providing liquidity using APIs
hide_title: false
---

In this tutorial, you'll learn how to build a liquidity provision order to provide liquidity on a live market created with Vega. You'll have to actively manage your liquidity commitment, so you'll also learn how to amend your order, as well as cancel it. 

If you proposed a market that was enacted and want to change your liquidity provision shape, skip down to [amend your liquidity commitment]. 
<!---Notes to cover: 
* Description and information for each piece of code, what it does and general, high-level guidelines of how this kind of thing works.
* Question: is anything about the sample scripts testnet-specific that needs to be highlighted/changed?
* LP on Vega is manual, not automatic. Once you choose the shape, you'll need to keep track of it and actively manage your LP. 
* You'll need enough collateral to cover the orders and the margin. If not... penalties and closeouts.
* Add section that links to Vega Tool to track liquidity commitment, and an explanation of how to go about using it. --->


# Using the sample-api-scripts helper scripts
Vega supplies a github repository that contains a set of sample scripts that perform many of the basic exchange actions. The repository can be found here: `https://github.com/vegaprotocol/sample-api-scripts`. Inside the root folder there is a credentials file that can be customised to your Vega network. For more information about running the scripts please see the README.md in the root of the repository.

# What is a liquidity provision?

Supplying liquidity to a market (having open orders resting on the book) is a way for traders to earn liquidity fees. In order to qualify for the fees the user must commit an amount of underlying market asset which is stored in a special account named the bond account. The placement of the orders on the book is decided by two shapes that are created by the user which define at which price levels the orders will be placed and what weight each price level will have. Vega then calculates using the total bond amount, the current price and the weight on each level, the size of the liquidity order placed at each price level. As the prices in the book move, Vega will recalculate the order sizes and prices and update the orders.

# Creating a liquidity provision

There are two ways to create liquidity, the first is supplying the bond amount and shape in the same message as the governance message that created the market. If the market is already up and running then you have a second option of sending a `liquidityProvisionSubmission` message. As most people will not e creating their own market we will concentrate on the second option. In the `sample-api-scripts` repo there is a folder name `submit-create-liquidity-provision` which has a set of scripts to create a new liquidity provision. If we look at the python script the important part is the description of the commit amount and price levels:

```
submission = {
    "liquidityProvisionSubmission": {
        "marketId": marketID,                   <-- This is the marketID for the market you wish ot supply liquidity -->
        "commitmentAmount": "100",              <-- This is the amount of `bond` you want to allocate to providing liquidity -->
        "fee": "0.01",                          <-- The amount of fee you wish to receive when your order is matched -->
        "buys": [                               <-- The buy side shape -->
            {
                "offset": "1",                      <-- How far from the reference price should the price level be -->
                "proportion": "1",                  <-- What weight should this level have -->
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
    "pubKey": pubkey,
    "propagate": True
}
```

To execute a test liquidity provision creation you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-create-liquidity-provision/submit-create-liquidity-provision-order.sh
```

# Amending a liquidity provision
The shape of the orders placed for a liquidity provision can influence how likely you are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away. The Vega system does not take into account your current position when it creates the orders from your liquidity provision shape. Therefore if you are currently long or short the orders created will be the same. If you create a shape that is more likely to result in a long position then over time you are likely to become more long. As you are required to have enough margin ot cover you position this puts more strain on your margin account as your position grows. One way you can help control your margin requirements is to change the shape of liquidity provision order to help reduce your position. For this we use the `liquidityProvisionAmendment` command.

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

In the above example the shape is being changed to increase the chance we get our sell orders matched, this will help us to reduce the size of a long position. The activity of the market itself will control exactly what gets filled and the shape of your orders do not guarantee your orders being filled.

To execute a test liquidity provision amend you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.sh
```


# Cancelling a liquidity provision

If you no longer want to partake in the liquidity provisioning for a market you can cancel your provision using the `liquidityProvisionCancellation`. This will remove any orders created as part of your supplied shape and it will return your bond amount back into your general account.

```
submission = {
    "liquidityProvisionCancellation": {
        "marketId": marketID,
    },
    "pubKey": pubkey,
    "propagate": True
}
```

If there is not enough liquidity left in the market after you cancel it will force the market into a liquidity auction where it will stay until there is enough new liquidity supplied to bring it back out into continuous trading.

To execute a test liquidity provision cancel you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.sh
```


# Viewing existing liquidity provisions

You can view the list of users supplying liquidity to market in two easy ways, first by querying the REST endpoint for a node given the partyID and marketID:

`https://<node address>/liquidity-provisions/party/{party}/market/{market}`

Secondly you can use the `vegatools` command line tool to view the details about the liquidity providers for a given market. The repo for this tool can be found here: `https://github.com/vegaprotocol/vegatools`

To see the current liquidity commitments for a market you can use this commandline:

`vegatools liquiditycommitment -a=n06.testnet.vega.xyz:3007`

<-- link to picture vegatools-liquidity-commitment.png in same folder as this file -->

# What can go wrong when using liquidity provisions?
If you run out of margin to maintain your position vega will use some of your bond to cover the margin requirements. You will get charged a fee when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller.


:::info
Test out your liquidity provision shape on Fairground, the Vega testnet. (How?)
:::
