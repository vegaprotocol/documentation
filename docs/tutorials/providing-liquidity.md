---
title: Providing liquidity using APIs
hide_title: false
---

In this tutorial, you'll learn how to build a liquidity commitment order to provide liquidity on a live market created with Vega. You'll need to actively manage your liquidity commitment, so you'll also learn how to amend your order, as well as cancel it. 

If you proposed a market that was enacted and want to change your liquidity provision shape, skip down to **[amending a liquidity commitment](/docs/tutorials/providing-liquidity#amending-a-liquidity-commitment)**.

## Providing liquidity
Supplying liquidity to a market keeps open orders resting on the order book, to keep a relatively balanced set of orders available. Participants who provide liquidity earn from liquidity fees, which are paid by the *price takers* on each trade.

**[Fees]**: Learn more about the fee structure. 

In order to qualify to receive a portion of the liquidity fees, the liquidity provider must commit an amount of the underlying market asset. The party placing the orders must have enough available collateral to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment. Once the order is committed, the commitment amount is stored in a bond account. 

If orders from the liquidity shape are filled, the collateral to cover the margin comes from your general collateral account. 

### Shapes for liquidity commitment orders
The placement of the orders on the book is decided by two shapes. The shapes are created by the liquidity provider, and they define at which price levels the orders will be placed, and what weight each price level will have. 

Vega then calculates the size of the liquidity order placed at each price level using: the total bond amount, the current price, and the weight on each level. As the prices on the order book move, Vega will recalculate the order sizes and prices and update the orders.

The shape of the orders placed for a liquidity provision can influence how likely they are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away.

## Using the sample-api-scripts helper scripts
**[Sample API scripts](https://github.com/vegaprotocol/sample-api-scripts/README.md)**: Vega supplies a GitHub repository that contains a set of sample scripts that perform many of the basic actions you can do with the Vega protocol. 

### Setting up the helper scripts
Inside the root folder there is a credentials file that can be customised to your Vega network. For more information about running the scripts please see the [README.md](https://github.com/vegaprotocol/sample-api-scripts/#readme) in the root of the repository.

## Creating a liquidity commitment
There are two ways to provide liquidity to a market: supplying the bond amount and order shape when proposing a market, or sending **send a `liquidityProvisionSubmission` message** once the market is live and trading. This tutorial focuses on the second option. 

[Market proposals]: Read about how to propose a market.

The liquidity provision submission must include:

* The market’s unique ID (Confirm it’s in a state that accepts liquidity commitments), denoted as `marketId`
* Liquidity commitment amount: The amount of asset that you want to allocate to providing liquidity. The amount will be moved into a bond account during the duration of your liquidity commitment, denoted as `commitmentAmount`
* Proposed liquidity fee level: The scaling factor for the fee you wish to receive when your order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Denoted as `fee`
* A set of liquidity buy and sell order shapes (denoted as `buys` and `sells`), which include:
    * Offset: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more postion risk
    * Proportion: The proportion of your committed collateral allocated to this order, as a weight
    * Reference price: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. (See a full list of applicable reference price levels in the [API documentation](https://docs.vega.xyz/protodocs/vega/vega.proto#peggedreference)), denoted as `reference`

To submit the liquidity provision message, you'll also need: 
* Public key: The public key being used to place the liquidity commitment
* Propagate: Can be true or false - if true, then the liquidity commitment will be signed and sent as a transaction to the nodes. If you prefer to manually submit the transaction, set propogate to false and include the data in a transaction

#### Balancing position risk with margin cost

There's an intrinsic relationship between position risk and margin cost when committing liquidity to a market. Offsets further from a market's current trading prices (large offsets) require more margin but have lower position risk, whereas offsets closer to a market's current trading prices (small offsets) require less margin but have higher position risk. 

For example, a liquidity provider plans to commit the approximate equivalent of 1 million USD to a liquidity commitment: If their position risk is low (larger offsets) then about 5-10% can be reserved for the bond. If their position risk is higher (smaller offsets), and a provider manages their positions and margin carefully, the provider would need to reserve more to commit to the bond.

### API script
In the [`sample-api-scripts` repo](https://github.com/vegaprotocol/sample-api-scripts/), there is a folder named `submit-create-liquidity-provision`, which has a set of scripts to create a new liquidity provision.

You can see in the python script that the most important part is the description of the commit amount and price levels:

```
submission = {
    "liquidityProvisionSubmission": {
        "marketId": marketID,
        "commitmentAmount": "100",              
        "fee": "0.01",
        "buys": [                               
            {
                "offset": "1",                      
                "proportion": "1",
                "reference": "PEGGED_REFERENCE_MID"
            },
            {
                "offset": "2",
                "proportion": "2",
                "reference": "PEGGED_REFERENCE_MID"
            }
        ],
        "sells": [
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

:::info
You can try out your liquidity provision shape on Fairground, the Vega testnet. (How?)
:::

## Amending a liquidity commitment
The Vega system does not take into account your current position when it creates the orders from your liquidity provision shape. Therefore, if you are currently long or short, the orders created will be the same. For example, if you create a shape that is more likely to result in a long position, then over time you are likely to become longer. 

As you are required to have enough margin to cover you position, this puts more strain on your margin account as your position grows.

One way you can help control your margin requirements is to change the shape of liquidity provision order to help reduce your position. For this, you can use the `liquidityProvisionAmendment` command.

### API script
In the below example, the shape is being changed to increase the chance that sell orders will be matched. This will help to reduce the size of a long position. The activity of the market itself will control exactly what gets filled, and the shape of your orders does not guarantee your orders will be filled.

To execute a test liquidity provision amend you can run this following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.sh
```


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

## Cancelling a liquidity commitment
If you no longer want to keep a liquidity commitment open for a market, you can cancel your commitment using the `liquidityProvisionCancellation`. This will remove any orders created as part of your supplied shape and it will return the bond amount back into your general account.

If there is not enough liquidity left in the market after you cancel, it will force the market into a liquidity auction where it will stay until there is enough new liquidity supplied to bring it back out into continuous trading.

### API script
To test a liquidity provision cancellation on testnet, or see how a cancellation is built, you can use the following script from the `samples-api-scripts` repo:
```
sample-api-scripts> submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.sh
```

```
submission = {
    "liquidityProvisionCancellation": {
        "marketId": marketID,
    },
    "pubKey": pubkey,
    "propagate": True
}
```

## Viewing existing liquidity provisions
You can view the list of participants supplying liquidity to market in two easy ways: using the endpoint or a Vega Tool. 

1. One, by querying the REST endpoint for a node given the partyID and marketID:

`https://<node address>/liquidity-provisions/party/{party}/market/{market}`

2. Alternatively, you can use the `vegatools` command line tool to view the details about the liquidity providers for a given market. The repo for this tool can be found here: `https://github.com/vegaprotocol/vegatools`

To see the current liquidity commitments for a market on testnet, you can use this command line:

`vegatools liquiditycommitment -a=n06.testnet.vega.xyz:3007`

![Vega Tool for liquidity commitment](/img/tutorials/vegatools-liquidity-commitment.png)

## What can go wrong when providing liquidity?
If you run out of margin to maintain your position, Vega will use some of your bond to cover the margin requirements. You will get charged a fee when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller.