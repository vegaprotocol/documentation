# Vega Protocol 
 ## Transaction messages 
 (to include protobufs of CORE txs (i.e. ones that actually appear in TM blocks)) 
 ## Governance protocol
  ### Market creation
  ### Market updates
  ### Parameter changes
  ### Voting on proposals
  ### Asset creation
 ## Trading protocol
  ### Submitting an order
Traders can submit orders into any market that is active - i.e. not in a protective auction, or matured, expired, or settled. Orders will only be accepted if sufficient margin can be allocated from a trader's available collateral. 

If, during continuous trading, an order is going to be matched with another order on the book for the same party (wash trade), then execution of that order will be stopped and the order will be cancelled and removed (if on the book). 

   #### Order sizes
Order sizes can be fractional, as long as the order is within the maximum number of decimal places allowable. Any order containing more precision that this will be rejected.  If a market requires that orders are specified using integers, fractional order sizes does not apply and 1 is the smallest increment. A market's decimal places are specified in the market framework (link).

   #### Amending an order
Amendments that change price or increase size will be executed as an atomic cancel and replace, meaning the time priority will be lost (i.e. as if the original order was cancelled and removed from the book and a new order submitted with the modified values). 

   #### Cancelling an order
   #### Order types/Times in force
   ### Batch operations on orders
 ## Collateral protocol
 Intro. 
 
 The collateral for alpha mainnet is exclusively VEGA, which is used for staking and rewards. 
 
 << tip: You'll need a Vega Wallet for staking, and for receiving rewards. You'll be able to see your account balance on token.vega.xyz.>>
 
  ### Network treasury (alpha mainnet) (WIP)
  The Network Treasury is a set of accounts (up to 1 per asset supported by the network via ther asset framework) that are funded by parties, deposits, or by direct transfers (e.g. a portion of fees, or from insurance pools at market closure). 
The purpose of the Network Treasury is to allow funding to be allocated to rewards, grants, etc. by token holder governance.

The funds in the network treasury are spent by being transferred to another account, either by direct governance action (i.e. voting on a specific proposed transfer) or by mechanisms controlled by governance, such as a periodic transfer, which may have network parameters that control the frequency of transfers, calculation of the amount, etc.. 
These transfers may be to a party general account, reward pool account, or insruance pool account for a market.
There is no requirement or expectation of symmetry between funds flowing into the Network Treasury and funds flowing out.
For example, the treasury account may be seeded by funds held by the team or investors, or through the issuance of tokens at various irregular points in time, and these funds may then be allocated to incentives/rewards, grants, etc. on a different schedule.

#### Funding (WIP)

Funding is how the on-chain treasury account receives collateral to be allocated later.

##### Funding by transfer (WIP)

A transfer may specify the network treasury as the destination of the transfer. 
The funds, if available would be transferred instantly and irrevocably to the network treasury account for the asset in question (the treasury account for the asset will be created if it doesn’t exist).

- Transfer from protocol mechanics: there may be a protocol feature such as the charging of fees or handling of expired insurance pool balances that specifies the Netwok Treasury as destination in a transfer. (Not required for MVP/Sweetwater)

- Transfer by governance: a [governance proposal](./0028-governance.md) can be submitted to transfer funds either from a market's insurance pool or from the network wide per-asset insurance pool into the on chain treasury account for the asset. (Not required for Sweetwater)

- Transfer transaction: a transaction submitted to the network may request to transfer funds from an account controlled by the owner’s private key (i.e. an asset general account) to the Network Treasury. (TODO: Not required for MVP/Sweetwater)


##### Funding by deposit (WIP)

A deposit via a Vega bridge may directly specify the Network Treasury as the destination for the deposited funds. The deposited funds would then appear in the Network Treasury account. 


#### Allocation (WIP)

Allocation is the process of deploying collateral from the on-chain treasury for various purposes. 
Allocation transfers funds from the on-chain treasury account for an asset to another account. 
Reward calculation mechanics etc. never directly allocate funds from the on-chain treasury account but instead would be expected to create their own account(s) to which funds are first allocated via one of the methods below. This protects the on-chain treasury from errant or wayward mechanisms that may otherwise drain the funds if configured incorrectly or exploited by a malicious actor.


##### Allocation maximums (WIP)

There are two network parameters that control transfers from the treasury:

- `max_transfer_fraction` specifies the maximum fraction of the on chain treasury balances that can be allocated (transferred out) in any one allocation. Validation: must be strictly positive. Must be less than or equal to 1. Default 1. This single parameter applies to each per-asset treasury account.
- `max_transfer_amount` specifies the maximum absolute amount that can be allocated (transferred out) from the network treasury in any one allocation. Validation: must be strictly positive. Must be less than or equal to 1. Default 1. This single parameter applies to each per-asset treasury account.


##### Direct allocation by governance (WIP)

A governance proposal may be submitted to transfer funds on enactment from the on-chain treasury to certain account types. Please see [the governance spec]() for a description of this.


##### Periodic automated allocation to reward pool account (WIP)

For each on chain reward pool account (i.e. each combination of reward scheme and asset that rewards are made in) there may be a network parameter:

- `<reward_scheme_id>.<asset_id>.periodic_allocation`: a data structure with three elements:
	- `max_fraction_per_period`
	- `max_amount_per_period`
	- `period_length_seconds`

This parameter must be defaulted as empty for each reward scheme that's created, which ensures that periodic automated allocation will not happen for any reward scheme unless separately enabled through a separate governance process. That is, periodic allocation should not be able to be configured in the same proposal that creates the reward scheme itself.

For each period of duration `period_length_seconds` a transfer is made from the on-chain treasury to a user's reward pool account. in question as described in the governance initiated transfers spec (including network wide amount limits, etc.) (TODO: link), where the following are used for the transfer details:
- `source_type` =  network treasury
- `source` = blank (only one per asset)
- `type` =  "best effort"
- `asset` = the `asset_id` matching the one in network parameter name
- `amount` = `max_amount_per_period`
- `fraction_of_balance` = `max_fraction_per_period`
- `destination_type` = "reward pool"
- `destination` = the `reward_scheme_id` matching the one in network parameter name

The transfer occurs immediately per once every `period_length_seconds` and does not require voting, etc. as the governance proposal used to set the parameters for the periodic transfer has already approved it.

  ### Depositing 
  ### Withdrawing
  ### Adding assets (link to governance) 
 ## Supplying data
