# Trading concepts
 ## Position management & margin
  ### Initial margin calculation
  ### Mark-to-market
  ### Margin search and release 
  ### Close-outs
  ### Position resolution 
 ## Pre-trade and trade
  ### Order types
  ### Continuous trading
  ### Auctions
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

Example:

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
   Vega’s liquidity protocol is designed to incentivise a set of participants on each market to provide orders on the limit order book during continuous trading. 
   
   Any Vega participant with sufficient collateral can provide liquidity for a market by submitting a transaction to the network.
   
   Liquidity providers need to make a financial commitment. They receive rewards for providing liquidity, and penalties for not upholding their commitment. Rewards are collected by the protocol from the market’s fees, paid by price takers, and distributed to the market's liquidity providers according to their relative contributions.
   
   ### Commitments
   When liquidity providers make a liquidity commitment, the liquidity provider’s available collateral must be able to meet the size of the nominated commitment amount and the margins required to support the orders generated from that commitment.

   A liquidity commitment transaction must include:
     * Market identifier of the market, provided it is in a state that accepts liquidity provision
     * Liquidity commitment amount
     * Proposed liquidity fee level
     * A set of liquidity buy and sell orders

  If the liquidity provider’s margin account doesn’t have enough funds to support those orders, the protocol will search for funds in the general account for the appropriate asset. If even the general account doesn’t have sufficient amount to provide margin to support the orders, then the protocol will transfer the remaining funds from the bond account, and a penalty will be applied and transferred from the bond account to the market’s insurance pool. 
  
  The liquidity obligation will remain unchanged and the protocol will periodically search the liquidity provider’s general account for the appropriate asset and attempt to top up bond account to the amount specified in liquidity commitment. 
  
  Should the funds in the bond account eventually drop to 0 as a result of a collateral search, the liquidity provider will be marked for closeout and the liquidity provision will get removed from the market. If there’s an imbalance between total and target stake (see below) as a result, the market will go into liquidity auction as a consequence.
  
  The liquidity obligation is calculated from the liquidity commitment amount using the stake_to_ccy_siskas network parameter as:

   `liquidity_obligation_in_ccy_siskas = stake_to_ccy_siskas ⨉ liquidity_commitment`

   Note here `ccy` stands for ‘currency’. Liquidity measure units are ‘currency siskas’, e.g. ETH or USD siskas. This is because the calculation is basically `volume ⨉ probability of trading ⨉ price of the volume` and the price of the volume is in the said currency.

   Liquidity obligation is considered to be met when the `volume ⨉ probability of trading ⨉ price of orders` of all liquidity providers per each order book side measured separately is at least `liquidity_obligation_in_ccy_siskas`.
   
   The amount committed during the liquidity provision transaction is stored in a bond account (one per party per market). The deposits and withdrawals for the account are governed by the protocol and cannot be manually triggered. The funds will be deposited as part of the successful liquidity commitment transaction. They will remain there for as long as the liquidity provider is active, to act as a guarantee for the liquidity obligation taken on by the provider, to assure that the commitment is firm and the protocol can rely on that liquidity in any market conditions.
  
    #### Target stake
    The market’s liquidity requirement is derived from the maximum open interest observed over a rolling time window. This amount, called the target stake, is used by the protocol for calculating the market’s liquidity fee level from liquidity commitments, and triggering liquidity monitoring auctions if there’s an imbalance between target stake and total stake (sum of all liquidity commitments).
    
   ### Liquidity provision orders
   The buy and sell orders that are part of a liquidity commitment transaction are used to make up the remainder of the liquidity obligation if the liquidity supplied by the manually maintained orders falls short of it.

   Those orders a special batch order type that automatically updates price/size as needed to meet the commitment, and automatically refreshes its volume after trading to ensure continuous liquidity provision. They are essentially sets of pegged orders grouped by order book side, with a proportion of required volume specified for each order. Hence they are sometimes referred to as ‘shapes’, since the overall volume depends on the remaining liquidity obligation and the mid-price along with the risk model parameters, but the sizes of orders relative to each other can still be controlled.
   
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
  #### Settlement when closing out
  #### Settlement at expiry
  #### Mark to market settlement (link to m-t-m)
 
