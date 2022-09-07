---
title: Provide liquidity
hide_title: false
---

In this tutorial, you'll learn: 
* How to build a liquidity commitment order to provide liquidity on a live market created with Vega. 
* How to actively manage your liquidity commitment by amending and/or cancelling your orders.
* How to set up the sample scripts the tutorial is based on. The scripts are available in Python and Bash, but the tutorial uses Python.

<!-- If you proposed a market that was enacted and want to change your liquidity provision shape, skip down to **[amending a liquidity commitment](#amending-a-liquidity-commitment)**. -->

At the end of the tutorial, find troubleshooting tips as well as more resources for understanding the mechanics of liquidity provision on Vega. 

## Overview
The Vega protocol allows liquidity to be priced individually for each market, so liquidity providers can earn more on markets with little LP competition, and fees are lower on markets where there are many participants committing liquidity. 

Supplying liquidity to a market keeps open orders resting on the order book, to keep a relatively balanced set of orders available. Those orders are not defined by actual numerical prices or sizes, but by liquidity shapes, which are dependent on a reference price level the provider chooses and the liquidity commitment amount. The order price follows the reference price level as the market moves.

:::caution
Providing liquidity means you'll need to actively manage your commitment. While there is a way to amend or cancel your liquidity commitment order, they'll only be possible to do if the market can function without your liquidity commitment.
:::

### Liquidity fees
Participants who provide liquidity earn from liquidity fees, which are paid by the *price takers* on each trade. Liquidity fees are defined based on the commitments and proposed fee levels chosen by the providers, not by the protocol.

To qualify to receive a portion of the liquidity fees, the liquidity provider must commit an amount of the market's settlement asset, and propose a fee level. Once the fee for the market is set, all liquidity orders charge that fee.

The party placing the orders must have enough available collateral to meet the size of their chosen commitment amount, and cover the margin required to support the orders generated from that commitment. Once the order is committed, the commitment amount is stored in a bond account.

If orders from the liquidity shapes are filled, the collateral to cover the margin comes from the party's general collateral account.

Read more: [Resources](#resources)

### Shapes for liquidity commitment orders
In essence, liquidity commitment orders are sets of pegged orders grouped by order book size, with a proportion set for each order within an order 'shape'. The overall volume depends on the remaining liquidity obligation, the mid-price, and the risk model parameters, but the sizes of orders relative to each other can still be controlled.

Those orders use a special batch order type that automatically updates price and size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision.

The placement of the orders on the book is defined by two shapes: buy shape and sell shape. The shapes are created by the liquidity provider, and they define what weight each price level will have, and the distances of the price levels at which the orders will be placed from the the chosen price level (current best mid, mid, or best offer).

Vega then calculates the size of the liquidity order placed at each price level using: the total bond amount, the current price, and the weight on each level. As the prices on the order book move, Vega will recalculate the order sizes and prices and update the orders.

The shape of the orders placed for a liquidity provision can influence how likely they are to get matched with incoming orders. Orders closer to the best bid/ask price are more likely to be filled than orders further away.

#### Balancing position risk with margin cost
There's an intrinsic relationship between position risk and margin cost when committing liquidity to a market. Offsets further from a market's current trading prices (large offsets) generate large orders for the same weighting and require more margin, but have a lower likelihood of becoming positions, whereas offsets closer to a market's current trading prices (small offsets) require less margin but have higher likelihood of being hit and creating a position that needs to be managed. 

For example, a liquidity provider plans to commit the approximate equivalent of 1 million USD to a liquidity commitment: If their position risk is low (larger offsets) then about 5-10% can be reserved for the bond. If their position risk is higher (smaller offsets), and a provider manages their positions and margin carefully, the provider would need to reserve more to commit to the bond.

## Using the sample helper scripts
**[Sample API scripts](https://github.com/vegaprotocol/sample-api-scripts)**: This GitHub repository has a set of sample scripts that perform many of the basic actions you can do with the Vega protocol, including submitting, amending, and cancelling liquidity commitments.

When using the scripts, you will receive a message that the transactions have been submitted, but won't get a response about whether or not they've been accepted. 

For liquidity provision, use the tools below under **[Viewing existing liquidity provisions](#viewing-existing-liquidity-provisions)** to check on them. 

### Setting up the helper scripts
Inside the scripts root folder there is a credentials file that must be customised with your wallet credentials, and can also be customised to interact with a specific network.

For more information about running the scripts, including the tools or applications required for these scripts to work, please see the **[README](https://github.com/vegaprotocol/sample-api-scripts#readme)** in the root of the repository.

:::tip
Once you clone the repository, you'll find the script files on your computer by searching for `sample-api-scripts`. You'll need to edit the script files using a text or code editor, with the values you want for your liquidity provision, including the market ID and commitment details.
:::

#### List available markets
You'll need  to identify which market you want to supply liquidity to, and add the market ID to your credentials file. Remember to change the market ID in your credentials file if you want to provide liquidity on a different market in the future. See a list of all markets and market IDs by running the following script:

```bash
python3 get-markets-and-market-data/get-markets-and-marketdata.py
```

## Creating a liquidity commitment
There are two ways to provide liquidity to a market: supplying the bond amount and order shape when proposing a market, or **sending a `liquidityProvisionSubmission` message** once the market is live and trading. 

This tutorial focuses on the second option, using Python. Note: There are also scripts available for Bash.

<!-- [Market proposals]: Read about how to propose a market.-->

**The liquidity provision submission must include**:

* The market’s unique ID, denoted as `marketId` - Confirm that the market is in a state to accept liquidity commitment, and is not a rejected market, has not had trading terminated, or has not been settled 
* Liquidity commitment amount: The amount of funds that you want to allocate to providing liquidity. The amount will be moved into a bond account during the duration of your liquidity commitment, denoted as `commitmentAmount`
* Proposed liquidity fee: The scaling factor for the fee you are bidding to receive when your order is matched, on a scale between 0 and 1. For example, a fee level of 0.01 would mean `0.01 * total trade amount` is charged. Note: Your proposed fee is used along with other proposed fees and commitments to determine the actual fee percentage for the market. Denoted as `fee`

* A set of liquidity buy and sell order shapes (denoted as `buys` and `sells`), which include:
    * Offset: How many ticks away from the reference price you want your orders to be. The tick size is the smallest decimal place the market allows for orders. There is a tradeoff between larger offsets, which have higher margin cost but less position risk, versus smaller offsets, which have smaller margin cost but more postion risk
    * Proportion: The proportion of your committed collateral allocated to this order, as a weight
    * Reference price: The price that you want the order offset to reference. You can choose from the market’s mid price, best bid price, or the best ask price. In the examples below, the reference price is pegged to the mid-price, which means as the mid-price moves, so do the LP orders. This would be useful if, for example, you wanted to always provide a spread of 10 ticks, then you could peg your first orders 5 ticks from the mid price on each side.
    
    (See a full list of applicable reference price levels in the [API documentation](https://docs.vega.xyz/protodocs/vega/vega.proto#peggedreference)), denoted as `reference`

**To submit the liquidity provision message, you'll also need**: 

* Public key: The public key being used to place the liquidity commitment
* Propagate: Is true or false. Propogate is used to define if you want the liquidity commitment sent to the nodes for processing immediately (true), or if you want to manually submit the orders in a transaction (false). Note: If you choose to manually submit, it must be within the block tolerance level or it will be rejected

### API script
In the [`sample-api-scripts`](https://github.com/vegaprotocol/sample-api-scripts/) repo, there is a folder named [`submit-create-liquidity-provision`](https://github.com/vegaprotocol/sample-api-scripts/tree/master/submit-create-liquidity-provision), which has a set of scripts to create a new liquidity provision using the `liquidityProvisionSubmission` command.

You can see in the liquidity commitment Python script below that the most important part is the description of the commitment amount, which includes the offset and proportion for each shape. 

The reference price in this example is pegged to the mid price, which means in this commitment the offsets define the spread. 

However, if you want a dynamic spread that would change depending on how far apart the priced limit orders on the book are, you could peg your buys to the best bid and sells to the best offer.


```python
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

### Edit and run the script
To run the script with your own values, you will need to edit the file, save it and run the following script from the `samples-api-scripts` repo:

```bash
python3 submit-create-liquidity-provision/submit-create-liquidity-provision-order.py
```

## Amending a liquidity commitment
When amending a liquidity commitment, the network will always allow you to provide more liquidity. However, reducing your liquidity commitment will depend on the maximum amount that the market can reduce by given the current liquidity demand in the market. If you were to reduce your commitment to the point where the market would drop below its required stake threshold, then your amendment would not be accepted.

The Vega system does not take into account your current position when it creates the orders from your liquidity provision shape. 

Therefore, if you are currently long or short, the orders created will be the same. For example, if you create a shape that is more likely to result in a long position, then over time you are likely to become longer. As you are required to have enough margin to cover you position, this puts more strain on your margin account as your position grows.

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
If you run out of margin to maintain your position, Vega will use some of your bond to cover the margin requirements. You will get charged a fee when this happens and it reduces the amount of liquidity you have as your bond amount will be smaller.

## Resources 

<details><summary>Learn about earning liquidity fees</summary>
<p>

#### Liquidity fees
Liquidity providers receive a cut of the fees paid by price takers. 
   
The amount each liquidity provider receives depends on:
* The market's liquidity fee, or the percentage of a trade's value which is collected from the price taker for every trade, and combined in a pool 
* Their equity-like share of the market, which is based on the relative size of their commitment amount, and when they committed liquidity to the market
   
The fee percentage determines how much money goes into the pool, and a provider's equity-like share determines what percentage of that pool they receive. 
   
#### Liquidity fee  
As part of the liquidity commitment transaction, a liquidity provider submits their desired liquidity fee as a number between 0 and 1. That number is converted to a percentage, and fees are paid on each trade.
   
The proposed fees are used to calculate the actual fee each participant will pay on a trade in that market. Once the fee for the market is set, all liquidity orders charge that fee, regardless of whether the provider's submitted fee was higher or lower.

The fees can change as the market's target stake changes, or as liquidity providers change their commitment or stop providing liquidity altogether. (See the 'Liquidity monitoring and target stake' section for more info.)

#### How the fee is derived
The liquidity orders submitted are sorted into increasing fee order so that the lowest fee percentage bid is at the top, and the highest is at the bottom. 

The market's 'winning' fee depends on the liquidity commitment of the market (target stake) and the amount committed from each bidder. Vega processes the LP orders from top to bottom, adding up the commitment amounts until it reaches a level equal to, or greater than, the target stake. When that point is reached, the fee that was provided with the last processed liquidity order is used.

Initially, before a market opens for trading, the target stake is zero, as it's not possible to have a position on a market that's not opened yet. Hence by default the market's initial liquidity fee is the lowest proposed.

Once the market opens and its opening auction begins, a clock starts ticking. The protocol calculates the target stake, and the fee is continuously re-evaluated.

#### Liquidity fee example
In the example below, there are 3 liquidity providers all bidding for their chosen fee level, with the lowest fee bid at the top, and the highest at the bottom. 
<ul>
<li>[LP 1 stake = 120 ETH, LP 1 liquidity-fee-factor = 0.5%]</li>
<li>[LP 2 stake = 20 ETH, LP 2 liquidity-fee-factor = 0.75%]</li>
<li>[LP 3 stake = 60 ETH, LP 3 liquidity-fee-factor = 3.75%]</li>
</ul>
<ul>
<li>If the target stake = 119 then the needed liquidity is given by LP 1, thus market's liquidity-fee-factor is the LP 1 fee: 0.5%.</li>
<li>If the target stake = 123 then the needed liquidity is given by the combination of LP 1 and LP 2, and so the market's liquidity-fee-factor is LP 2 fee: 0.75%.</li>
<li>If the target stake = 240 then all the liquidity supplied above does not meet the estimated market liquidity demand, and thus the market's liquidity-fee-factor is set to the highest, LP 3's fee: 3.75%.</li>
</ul>

[**Fee level calculations**](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#example-for-fee-setting-mechanism): Read more on how the fee levels are calculated based on liquidity providers' proposed fee levels.
      
#### Equity-like share
Besides the amount they've committed, how much a provider receives in fees is also dependent on when they began to commit liquidity on the market. The amount is adjusted to provide a greater share of the pool to the liquidity providers that committed earlier, and more, in a market's lifetime. In effect, liquidity providers who commit to a market early benefit from helping to grow the market.
   
[Equity-like share calculations](https://github.com/vegaprotocol/specs/blob/master/protocol/0042-LIQF-setting_fees_and_rewarding_lps.md#calculating-liquidity-provider-equity-like-share): See the variables that go into calculating equity-like share. 

</p>
</details>

<details><summary>Learn about the penalties</summary>
<p>

#### Penalties for not fulfilling liquidity commitment
If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will search for funds in the general account for the relevant asset. If the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the liquidity provider's bond account, and a penalty will be applied and funds transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in liquidity commitment.

Should the funds in the bond account drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will be removed from the market. If there's an imbalance between total and target stake as a result, the market will go into liquidity auction.

If this happens while the market is transitioning from auction mode to continuous trading, a penalty will not be applied. 

Note: During an auction uncrossing, liquidity providers are not required to supply any orders that offer liquidity or would cause trades. However, they must maintain their liquidity commitment, and their liquidity orders are placed back on the order book when normal trading resumes.

The penalty formula defines how much will be removed from the bond account:

`bond penalty = market.liquidity.bondPenaltyParameter ⨉ shortfall`

<ul>
<li>`market.liquidity.bondPenaltyParameter` is a network parameter</li>
<li>shortfall refers to the absolute value of the funds that either the liquidity provider was unable to cover through their margin and general accounts, are needed for settlement (mark to market or product driven), or are needed to meet their margin requirements</li>
</ul>

</p>
</details>

<details><summary>Learn about liquidity monitoring and target stake</summary>
<p>

#### Liquidity monitoring
Besides the obvious appeal to traders, a liquid market also offers some risk management, particularly in a system that does not have a central counter-party. When a trader is distressed, their position can only be liquidated if there is enough volume on the order book to offload it.

In order to ensure there is enough liquidity to keep a market active and protect against insolvent parties, the network must be able to detect when the market's liquidity is too low. 

When a market's liquidity drops below the safe level, the market enters into a liquidity monitoring auction, and terminates the auction when the market liquidity level is back at a sufficiently high level. The liquidity mechanics of the Vega protocol mean there is an incentive (through fee-setting) to provide the necessary liquidity. 

There are two scenarios that can trigger liquidity monitoring mechanisms: 

**If a market has too little liquidity**: Vega continuously calculates whether each market has a sufficient amount committed. When markets are deemed insufficiently liquid, they are placed into auction.

**If a liquidity provider can't cover their commitment**: If the liquidity provider's margin account doesn't have enough funds to support their orders, the protocol will search for funds in the general account for the relevant asset. If the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the liquidity provider's bond account, and a penalty will be applied and funds transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account and attempt to top up the bond account to the amount specified in liquidity commitment.

Should the funds in the bond account drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will be removed from the market. If there's an imbalance between total and target stake (see below) as a result, the market will go into liquidity auction.

The liquidity obligation is calculated from the liquidity commitment amount using the stake_to_ccy_siskas network parameter as:

`liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

Note here `ccy` stands for 'currency'. Liquidity measure units are 'currency siskas', e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers, per each order book side, measured separately, is at least `liquidity_obligation_in_ccy_siskas`.

#### Target stake
The market's liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol to calculate the market's liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there's an imbalance between it and the total stake (sum of all liquidity commitments).
</p>
</details>
