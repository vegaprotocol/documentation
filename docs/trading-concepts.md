# Trading concepts

## Position management & margin
Vega's margining system implements automated cross margining. Cross margining, which means gains on one market can be released and used as margin on another, is supported between all markets.  More detailed explanation is available in [Section 6 of the protocol whitepaper](https://vega.xyz/papers/vega-protocol-whitepaper.pdf#page21). However the basic calculation is relatively straightforward.

Vega works with four margin levels:
* **Search level**: When the margin balance drops below the search level (but is still above the maintenance level) the network will try to allocate an additional amount (up to the current initial margin level) from your collateral, if possible, to be used for margin:
  * m<sup>search</sup> := α<sup>search</sup> * m<sup>maintenance</sup>, where α<sup>search</sup> is a constant and α<sup>search</sup> > 1.
* **Initial level**: The amount that will be transferred from your collateral to be used as margin when an order is placed or trade executed. To avoid a margin search as soon as position is open, the initial margin level is set above the search level:
  * m<sup>initial</sup> := α<sup>initial</sup> * m<sup>maintenance</sup>, where α<sup>initial</sup> is a constant and α<sup>initial</sup> > α<sup>search</sup>.
* **Release level**: Once a trader's margin balance exceeds the margin release level, the position is considered overcollateralised and funds are released back to collateral so that the margin balance is equal to the current initial margin level:
  * m<sup>release</sup> := α<sup>release</sup> * m<sup>maintenance</sup>, where α<sup>release</sup> is a constant and α<sup>release</sup> > α<sup>initial</sup>.
* **Maintenance margin**: This is implied by the risk model and corresponds to the minimum amount required to cover adverse market moves with a given probability level. As soon as the margin balance drops below the maintenance margin level, the position close-out process gets initiated.

### Margins on open orders
Vega will charge margin on open orders, because if your order gets hit you will need the margin to keep it open. The protocol shouldn't allow you to enter a trade that will immediately need to be closed out. The liquidity you see on the order book should also be real, in that sense that it's supported by collateral and thus available to trade.

### Calculating the margin on open orders
Vega calculates the largest long / short position. If the long is the riskiest, the margin algorithm multiplies by a 'risk factor long' and by the 'mark price' (for futures). If it is the short, then the algorithm multiplies the position by the 'risk factor short' and by the 'mark price'. These capture the outcome of probabilistic distribution of future market moves, and are market specific.

Example: (see explanation below screenshot)

Image to be uploaded - <img alt="Calculating margin on open orders" src="/images/2-calculate-margin-open-orders.png" width="500" />

There is an open sell order of size 1 on the book. The risk factor for short positions is 0.074347011. The current mark price is 0.02690. So minimum margin = 0.2690 x 0.074347011 = 0.00200 (rounded to 5 decimal places).

**Margin on open positions**
Here the calculation is a little more complicated as it takes into account "slippage" as seen currently on the order book.

Example: (see explanation below screenshot)

<img alt="Calculating margin on an open positions" src="/images/3-margin-open-positions.png" width="500" />

The trader has an open short position of size 1 and no open orders. The risk factor for short positions is 0.074347011. The current mark price is 0.02672. The best offer price is 0.02676 and it has enough volume so that theoretically the position could be closed-out at that price. So maintenance margin = 0.02672 x 0.074347011 + max (0, 0.02676 - 0.02672) = 0.00203 (rounded to 5 decimal places), where the second term in the sum is the "slippage" component. Other margin levels are derived from the maintenance margin using the scaling factors that form part of the market configuration.

### Initial margin calculation
The initial margin is the minimum amount of collateral required to enter a new trade, based on trades across the risk universe.

A market parameter will specify α<sup>initial</sup> > α<sup>search</sup> and the minimum collateral amount required for a new trade to be entered into is the initial margin. m<sup>initial</sup>:= (1 + α<sup>initial</sup>) m<sup>maintenance</sup>

Having the initial margin level m<sup>initial</sup> higher than the margin search level (1 + α<sup>search</sup>) m<sup>maintenance</sup> ensures that a small negative price move won't lead to a situation where the network has to attempt to allocate more collateral to this risk universe immediately after a trade has been entered into.

### Mark-to-market
Settlement instructions are generated based on the change in market value of the open positions of a party.

When the mark price changes, the network calculates settlement cash flows for each party.

The process is repeated each time the mark price changes until the maturity date for the market is reached.

### Margin search and release

### Close-outs
In most cases, the allocated margin should cover market swings. If the swing is bigger than the margin is collateralised for, then money is pulled from the collateral to cover the requirement.  If a trader has no more collateral, and their allocated margin is below the maintenance margin, the trader gets closed out and any margin balance remaining after the close-out is transferred to the market's insurance pool. In the unlikely event that the insurance pool balance is insufficient to cover the entire balance, loss socialisation will get applied.

Note that (link->) price monitoring should assure that large swings occur only due to genuine changes in market participants' view of the true average price of the traded instrument and not as a result of short-lived artefacts of market microstructure.

### Position resolution

## Pre-trade and trade

### Order types

### Continuous trading

### Auctions
Auctions are a trading mode that collect orders during a set period, called an auction call period. The auction call period's ending is based on the condition that the auction aims to meet. Auctions that are based on market conditions are triggered automatically.

During the call period, no trades are created, but all orders are queued. At the conclusion of the call period, trades are produced in a single action known as an auction uncrossing. During the uncrossing, auctions always try to maximise the traded volume, subject to the requirements of the orders placed.

The Vega protocol supports several types of auctions:

* Opening auctions: Every continuous trading market opens with an auction. Their purpose is to calibrate a market and help with price discovery
* Price monitoring auctions: A market will go into a price monitoring auction if generating a trade would result in a price that is larger than the theoretical bounds implied by the risk model, and the market's price monitoring settings. The trade is not generated, the orders that instigated that trade remain on the order book, and the market goes into an auction, the length of which is defined by price monitoring settings (chosen during the market proposal)
* Liquidity monitoring auctions: A market will go into a liquidity monitoring auction if the total commitment from liquidity providers (total stake) drops too low relative to the estimate of the market's liquidity demand (target stake), or if the best bid and/or best ask price implied by limit orders from market participants are not available
* Frequent batch auctions: A trading mode set for a market in its inception, that has trading occur only through repeated auctions, as opposed to continuous trading (Not yet available)

### Fees
The Vega protocol does not charge gas fees, but rather has a fee structure that rewards participants who fill essential roles for a decentralised trading infrastructure.

Fees are incurred on every trade on a market in continuous trading, but it is the price taker who pays the fee. During a market's opening auction, no fees are collected.

The price taker is the party that traded using a market order, or placed a limit order that traded immediately. The price maker (the party whose passive order was on the book prior to the trade) obtains part of the fee as a reward for providing liquidity.

An order may cross with more than one other order, creating multiple trades, which incur fees for each. Because of how the trade value for fee purposes is calculated (see below), the amount you'll pay for each order is the same, regardless of how many trades it takes to fill the order.

Fees are calculated and collected in the settlement currency of the market, and collected from your collateral. The fee is divided between the maker, the infrastructure provider, and the liquidity provider(s) for each market.

* Infrastructure portion of the fee, which is paid to validators as a reward for running the infrastructure of the network, is transferred to the infrastructure fee pool for that asset. It is then periodically distributed to the validators.
* Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker).
* Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market.

The trading fee is calculated using the following formulas:

* Total fee = (infrastructure fee factor + maker fee factor + liquidity fee factor) x Trade value for fee purposes
* Trade value for fee purposes = notional value of the trade = size of trade x price of trade (This is true for futures, but may be calculated differently for other products.)

#### Example
If you were to place an order for 100 futures at USDC50, the trade value for fee purposes is 100 x USDC50 = USDC5000.

In this example, each fee is 0.001, meaning total fee factor is 0.003.

USDC5000 x 0.003 = USDC15

The fee is the same irrespective of the number of transactions the order gets filled in, as long as they trade at the same price.

The fee factors are set through the following network parameters: `market.fee.factors.infrastructureFee`, `market.fee.factors.makerFee`, `market.fee.factors.liquidityFee`.

### Positions and netting

## Market protection

### Price monitoring

### Liquidity monitoring

### Insurance pools
Each market has its own insurance pool set aside. However, there's also a general insurance pool per asset. It sits there until there are markets that use that asset. When a market expires, the insurance pool funds from that market go into the bigger insurance pool, which other markets that use the same collateral currency can pull from. Insurance pools grow in two scenarios: if a trader gets closed out, and if a liquidity provider pays a fine for failing to provide their committed liquidity. (link to liquidity provision)

If a trader's deployed margin on the market is insufficient to cover a mark to market (MTM) settlement liability, Vega will search the trader's available balance of the settlement asset. If this search is unable to cover the full liability, the trader will be considered distressed and undergo position resolution, and the market's insurance pool (for that settlement asset) will be utilised to make up the difference required to cover the MTM loss amount. Should the funds in the insurance pool be insufficient for that, (link ->)loss socialisation will be applied.

## Market governance

### New market proposal

#### Market

#### Tradable instrument

#### Instrument

### Market / instrument parameters

### Risk models and parameters

### Changing models

### Thresholds and rules

## Network governance

### Parameters

### Changing parameters

### Threshold and rules

## Market data

## Liquidity mining

### Parameters

### Liquidity providers
Vega's liquidity protocol is designed to incentivise a set of participants on each market to provide orders on the limit order book during continuous trading.

Any Vega participant with sufficient collateral can provide liquidity for a market by submitting a transaction to the network.

Liquidity providers need to make a financial commitment. They receive rewards for providing liquidity, and penalties for not upholding their commitment. Rewards are collected by the protocol from the market's fees, paid by price takers, and distributed to the market's liquidity providers according to their relative contributions.

### Commitments
When liquidity providers make a liquidity commitment, the liquidity provider's available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment.

A liquidity commitment transaction must include:
* Market identifier of the market, provided it is in a state that accepts liquidity provision
* Liquidity commitment amount
* Proposed liquidity fee level
* A set of liquidity buy and sell orders

If the liquidity provider's margin account doesn't have enough funds to support those orders, the protocol will search for funds in the general account for the appropriate asset. If even the general account doesn't have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the bond account, and a penalty will be applied and transferred from the bond account to the market's insurance pool.

The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider's general account for the appropriate asset and attempt to top up bond account to the amount specified in liquidity commitment.

Should the funds in the bond account eventually drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will get removed from the market. If there's an imbalance between total and target stake (see below) as a result, the market will go into liquidity auction as a consequence.

The liquidity obligation is calculated from the liquidity commitment amount using the stake_to_ccy_siskas network parameter as:

`liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

Note here `ccy` stands for 'currency'. Liquidity measure units are 'currency siskas', e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers per each order book side measured separately is at least `liquidity_obligation_in_ccy_siskas`.

The amount committed during the liquidity provision transaction is stored in a bond account (one per party per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. The funds will be deposited as part of the successful liquidity commitment transaction. They will remain there for as long as the liquidity provider is active, to act as a guarantee for the liquidity obligation taken on by the provider, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.

#### Target stake
The market's liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol for calculating the market's liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there's an imbalance between target stake and total stake (sum of all liquidity commitments).

### Liquidity provision orders
The buy and sell orders that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by the manually maintained orders falls short of it.

Those orders a special batch order type that automatically updates price/size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision. They are essentially sets of pegged orders grouped by order book side, with a proportion of required volume specified for each order. Hence they are sometimes referred to as 'shapes', since the overall volume depends on the remaining liquidity obligation and the mid-price along with the risk model parameters, but the sizes of orders relative to each other can still be controlled.

Liquidity providers are not required to supply any orders that offer liquidity or trade during an auction uncrossing. They must maintain their stake however and their liquidity orders will be placed back on the book when normal trading resumes.

## Data sourcing framework

### Signed messages

### Filters

### Internal sources

## Fees and rewards

## Collateral

### Assets on Vega

### Accounts (general, margin, bond) and transfers, double entry accounting

### Bridges

#### Ethereum

## Market / product / trade lifecycle

### Settlement
  Vega executes settlement with a two step process:
  1. Collection -  The protocol collects from the margin accounts of those who, according to the settlement formula, are liable to pay collateral. The collection instruction will aim to collect all the owed collateral, starting with the trader's margin account for the market. Whatever is not available from the margin account (if any) is collected from the general account, and if there is any remaining, it is collected from the market's insurance pool (link). If the full required amount cannot be collected from all three accounts then as much as possible is collected and loss socialisation is enacted. 
 
  Collection will result in ledger entries being formulated. They adhere to double entry accounting and record the actual transfers that occurred on the ledger. The destination account is the *market settlement account* for the market, which will have a zero balance before the settlement process begins and after it completes.
 
 2. Distribution -  If all requested amounts are succesfully transferred to the market settlement account, then the amount collected will match the amount to be distributed and the settlement function will formulate instructions to distribute to the margin accounts of those whose moves have been positive according to the amount they are owed. 
 
 These transfers will debit from the market's market settlement account and be credited to the margin accounts of traders who have are due to receive an asset flow as a result of the settlement.
 
   #### Loss socialisation 
   If some collection transfers are not able to supply the full amount to the market settlement account due to some traders having insufficient collateral to handle the price / position (mark to market) move, and if the insurance pool can't cover the shortfall, then not enough funds can be collected to distribute the full amount of the mark to market gains made by traders on the other side. In that case, the funds that have been collected must be fairly distributed. This is called loss socialisation. 
 
  Loss socialisation is implemented by reducing the amount that is distributed to each trader with a mark to market gain, based on their relative position size. 
```
distribute_amount[trader] = mtm_gain[trader] * ( actual_collected_amount / target_collect_amount )
```
#### Settlement when closing out

#### Settlement at expiry

#### Mark to market settlement (link to m-t-m)
