---
title: Commit liquidity
hide_title: false
description: Commit liquidity onto a market and manage that commitment
---

In this tutorial, you'll learn: 
* How to build a liquidity commitment order to provide liquidity on a live market created with Vega. 
* How to actively manage your liquidity commitment by amending and/or cancelling your orders.
* How to set up the sample scripts the tutorial is based on. The scripts are available in Python and Bash, but the tutorial uses Python.

At the end of the tutorial, find troubleshooting tips as well as more resources for understanding the mechanics of liquidity provision on Vega. 

## Tactics for providing liquidity
The Vega protocol allows liquidity to be priced individually for each market, so liquidity providers can earn more on markets with little LP competition, and fees are lower on markets where there are many participants committing liquidity. 

Providing liquidity on a market can be done using a combination of two tactics: standard [limit orders](../concepts/trading-on-vega/orders#limit-order) and a liquidity commitment. Participants who place limit orders on a market are rewarded for supplying orders. Typically liquidity providers would aim to meet some of their liquidity obligation using standard limit orders, which give them the most control over their strategy. 

This section focuses on submitting and maintaining a liquidity commitment. This involves submitting one liquidity commitment that keeps a series of orders active and funded on a market. The buy and sell shapes submitted as part of the liquidity commitment can be used alongside standard limit orders to provide liquidity.

The orders created from a liquidity commitment are not defined by actual numerical prices or sizes, but by liquidity shapes, which are dependent on a reference price level the provider chooses, the LP price and the liquidity commitment amount. The order price follows the reference price level as the market moves, and which orders are deployed depends on the LP price range defined when the market is proposed.

You can always increase your commitment, whereas lowering your commitment may not be possible. If you start with a very small commitment, you can experiment with the offsets and then slowly increase your commitment.

:::caution
Providing liquidity means you'll need to actively manage your commitment. While there is a way to amend or cancel your liquidity commitment order, if your amendment would drop the market below its required [target stake](./../concepts/liquidity/provision#target-stake-for-a-market), then your amendment would not be accepted.
:::

### Rewarding liquidity providers
Participants who provide liquidity earn from liquidity fees, which are paid by the *price takers* on each trade.

In your liquidity commitment submission, you need to propose a fee factor, as a decimalised number that is converted to perecentage. Your proposed fee factor is used, with other proposed fee factors, to determine the market's liquidity fee. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower, and whether you propose a higher (or lower) factor, you are still a liquidity provider. The proposed fees are used to calculate the actual fee each participant will pay on a trade in that market.

:::note Read more 
[Liquidity rewards](./../concepts/liquidity/rewards-penalties.md)
:::

### Shapes for commitment
In essence, a liquidity commitment submission is a set of pegged orders grouped by order book size, with a proportion set for each order within an order 'shape'. The order automatically updates the price and size as needed to meet an LP's commitment, and automatically refreshes the volume after trading to ensure continuous liquidity provision.

You define the order placement on the book using two shapes: buy shape and sell shape. The script example below shows how to set up your shapes by defining what proportion of orders each price level will have, and the distances (offset) for the price levels where the orders will be placed, based on the reference price level you choose to peg to (`PEGGED_REFERENCE_BEST_BID`, `PEGGED_REFERENCE_MID` or `PEGGED_REFERENCE_BEST_ASK`).

You can influence how likely the specific orders within the liquidity commitment are to get matched with incoming orders through the order shapes. Orders using a lower offset number are closer to the best bid/ask price, and are more likely to be filled than orders with higher offsets that are thus further away, in particular in relation to the LP price range set per market, which specifies the range of price levels over which automated liquidity commitment orders will be deployed.

Vega then calculates the size of the liquidity order placed at each price level. As the prices on the order book move, the protocol will recalculate the order sizes and prices, and update the orders.

:::note Read more
[Order shapes](./../concepts/liquidity/provision.md#order-shapes): See details on how volume and size are calculated for liquidity commitment orders. 
:::

### Balancing position risk with margin cost
Liquidity providers must be vigilant of both margin risk and position risk. Your liquidity commitment will generate orders, and those orders require margin. If you have insufficient margin, the protocol will take collateral from your general account. If the orders created from your commitment are hit by trades, you will have an open position, and therefore be at risk of the market moving against you, leaving you with unrealised losses.

## Using the sample helper scripts
**[Sample API scripts](https://github.com/vegaprotocol/sample-api-scripts)**: This GitHub repository has a set of sample scripts that perform many of the basic actions you can do with the Vega protocol, including submitting, amending, and cancelling liquidity commitments.

When using the scripts, you will receive a message that the transactions have been submitted, but won't get a response about whether or not they've been accepted. 

For liquidity provision, use the tools below under **[Viewing existing liquidity provisions](#viewing-existing-liquidity-provisions)** to check on them. 

### Setting up the helper scripts
Inside the scripts root folder there is a credentials file that must be customised with your wallet credentials, and can also be customised to interact with a specific network.

For more information about running the scripts, including the tools or applications required for these scripts to work, please see the **[README](https://github.com/vegaprotocol/sample-api-scripts#readme)** in the root of the repository.

:::tip
Once you clone the repository, you'll find the script files on your computer by searching for `sample-api-scripts`. You'll need to edit the script files using a text or code editor. Be sure to confirm the network you want to connect to, and change the values you want for your liquidity provision, including the market ID and commitment details.
:::

#### List available markets
Test your script set-up is working by running the script to list available markets. 

You'll need  to identify which market you want to supply liquidity to, and add the market ID to your credentials file. Remember to change the market ID in your credentials file if you want to provide liquidity on a different market in the future. See a list of all markets and market IDs by running the following script:

```bash
python3 get-markets-and-market-data/get-markets-and-marketdata.py
```

## Creating a liquidity commitment
This tutorial describes how to create, amend or cancel, and send a liquidity commitment submission, using Python. Note: There are also scripts available for Bash.

**The liquidity provision submission must include**:
* The **market’s unique ID**, denoted as `marketId` - Confirm that the market is in a state to accept liquidity commitment, and is not a rejected market, has not had trading terminated, or has not been settled 
* **Liquidity commitment amount**: The amount of funds that you want to allocate to providing liquidity. The amount will be moved into a bond account during the duration of your liquidity commitment, denoted as `commitmentAmount`
* **Proposed liquidity fee**: The scaling factor for the fee you are bidding to receive when your order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Note: Your proposed fee is used along with other proposed fees and commitments to determine the actual fee percentage for the market. [Learn how all proposed fee levels influence the market's fees]). Denoted as `fee` Denoted as `fee`

* A set of liquidity **buy and sell order shapes** (denoted as `buys` and `sells`), which include:
    * **Offset**: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders.
    * **Proportion**: The proportion of your committed collateral allocated to this order, as a weight
    * **Reference price**: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
    
    (See a full list of applicable reference price levels in the [API documentation](./../api/grpc/vega/vega.proto.mdx#PeggedReference)), denoted as `reference`

**To submit the liquidity provision message, you'll also need**: 

* Public key: The public key being used to place the liquidity commitment
* Propagate: Is true or false. Propogate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected

### API script
In the [`sample-api-scripts`](https://github.com/vegaprotocol/sample-api-scripts/) repo, there is a folder named [`submit-create-liquidity-provision`](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-create-liquidity-provision), which has a set of scripts to create a new liquidity provision using the `liquidityProvisionSubmission` command.

You can see in the liquidity commitment Python script below that the most important part is the description of the commitment amount, which includes the offset and proportion for each shape.

The **reference price** in this example is pegged to the mid price, which means in this commitment the offsets define the spread.

However, if you want a dynamic spread that would change depending on how far apart the priced limit orders on the book are, you could peg your buys to the best bid and sells to the best offer.

The **commitment amount** is interpreted by the asset decimal place, and expressed in an integer. In the example below, if the asset has a decimal precision of 2, the commitment amount would be 100.

The **offset** is interpreted by the market decimal place. In the example below, if the target market had a decimal precision of 3, and a mid price of 100.123 (internally represented as 100123), the offset of 1 will place the volume at 100.124 as a decimal.


```python
submission = {
    "liquidityProvisionSubmission": {
        "marketId": marketID,
        "commitmentAmount": "10000",              
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

### Edit and run the script
To run the script with your own values, you will need to edit the file, save it and run the following script from the `samples-api-scripts` repo:

```bash
python3 submit-create-liquidity-provision/submit-create-liquidity-provision-order.py
```

## Amending a liquidity commitment
When amending a liquidity commitment, the network will always allow you to provide more liquidity. However, reducing your liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If you were to reduce your commitment to the point where the market would drop below its required [target stake](./../concepts/liquidity/provision.md#target-stake), then your amendment would not be accepted.

The protocol does not take into account your current position when it creates the orders from your liquidity provision shape. Regardless of if you are already long or short, the orders created will be the same, so you will need to actively manage your orders as your position changes. For example, if you create a shape that is more likely to result in a long position, then over time you are likely to become longer. As you are required to have enough margin to cover you position, this puts more strain on your margin account as your position grows.

One way you can help control your margin requirements is to change the shape of liquidity provision order to help reduce your position. For this, you can use the `liquidityProvisionAmendment` command.

Submitting an amendment will replace the entire set of orders with the ones in your amendment transaction. If you want to keep any of your orders, you'll need to add them into your amendment.

### API script
In the below example, the shape is being changed to increase the chance that sell orders will be matched. This would help to reduce the size of a long position. The activity of the market itself will control exactly what gets filled, and the shape of your orders does not guarantee your orders will be filled.

In the following example, you can see the offset was chosen to be further away for the *best bid* price, but closer to the *best ask* price:

```python
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

### Edit and run the script
To run the script with your own values, you will need to edit the file, save it and run the following script from the `samples-api-scripts` repo:

```bash
python3 submit-amend-liquidity-provision/submit-amend-liquidity-provision-order.py
```

## Cancelling a liquidity commitment
If you no longer want to keep a liquidity commitment open for a market, you can cancel your commitment using the `liquidityProvisionCancellation`. This will remove any orders created as part of your supplied shape and it will return the bond amount back into your general account.

If cancelling a commitment would leave a market without enough liquidity, then the cancellation will not be accepted. 

### API script
If you no longer want to commit open orders through a liquidity provision, you will need to cancel it. If there are any positions open from your liquidity orders, they will not be cancelled when you cancel your liquidity commitment. 

### Run the script
To cancel a liquidity commitment, or see how a cancellation is built, you can use the following script from the `samples-api-scripts` repo:

```bash
python3 submit-cancel-liquidity-provision/submit-cancel-liquidity-provision-order.py
```

```python
submission = {
    "liquidityProvisionCancellation": {
        "marketId": marketID, <--The marketID is pre-filled based on the details in your credentials file
    },
    "pubKey": pubkey,
    "propagate": True
}
```

## Viewing existing liquidity provisions
You can view the list of participants supplying liquidity to a market in two ways: using the endpoint or a Vega Tool. 

**Use the endpoint**

Querying the REST endpoint for a node given the partyID (public key) and marketID:
`https://<node address>/liquidity-provisions/party/{party}/market/{market}`

**Use the Vega Tool**

Using the `vegatools` command line tool to view the liquidity providers for a given market. 

[Vega Tools repo](https://github.com/vegaprotocol/vegatools): Try the liquidity commitment tool, under the `liquiditycommitment` folder. Check the **[README.md](https://github.com/vegaprotocol/vegatools#vegatools)** file for how to set up the Vega Tools.  

To see the current liquidity commitments for a market on testnet, use this command line:

```bash
vegatools liquiditycommitment -a=n06.testnet.vega.xyz:3007
```

![Vega Tool for liquidity commitment](/img/tutorials/vegatools-liquidity-commitment.png)

## What can go wrong when providing liquidity?
If you do not have enough collateral in your margin and general accounts to maintain your position, Vega will use some (or all) of your bond to cover the margin requirements. You will get charged a penalty when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller. **You could lose all the money in your margin and general accounts as well as your bonded amount if you do not actively manage your commitment.**

If you don't actively manage your liquidity commitment shapes, market movements could mean that the limit orders created from your commitment can push your position much longer or shorter than you intend.
