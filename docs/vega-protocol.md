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
   
## Collateral management
Intro. What is the collateral management in general? (TODO)
 
The collateral for alpha mainnet is exclusively VEGA, which is used for staking and rewards. 
 
<< tip: You'll need a Vega Wallet for staking, and for receiving rewards. You'll be able to see your account balance on token.vega.xyz.>>
 
### Network treasury (alpha mainnet) (WIP)
The Network Treasury is a set of accounts that are funded by parties, deposits, or by direct transfers (e.g. a portion of fees, or from insurance pools at market closure). 

The purpose of the Network Treasury is to allow funding to be allocated to rewards, grants, etc. by token holder governance.

The funds in the network treasury are spent by being transferred to another account, either by direct governance action (i.e. voting on a specific proposed transfer) or by mechanisms controlled by governance, such as a periodic transfer, which may have network parameters that control the frequency of transfers, calculation of the amount, etc.

These transfers may be to a party general account, reward pool account, or insruance pool account for a market.
There is no requirement or expectation of symmetry between funds flowing into the Network Treasury and funds flowing out.
For example, the treasury account may be seeded by funds held by the team or investors, or through the issuance of tokens at various irregular points in time, and these funds may then be allocated to incentives/rewards, grants, etc. on a different schedule.

#### Funding network treasury 

The on-chain treasury account can receive collateral via two funding methods: deposit or transfer. Network treasury **deposits** can be made using a Vega bridge, at which point the deposited funds would appear in the network treasury account. A **transfer** is done through a governance action. If the action passes, the funds would be transferred instantly and irrevocably to the network treasury account for the asset, and the treasury account for the asset will be created if it doesn’t exist. *Note: Transfers are not implemented for alpha mainnet.*

#### Allocating network treasury collateral (WIP)

Allocation is the process of deploying collateral from the on-chain treasury for various purposes. 
Allocation transfers funds from the on-chain treasury account for an asset to another account. 
Reward calculation mechanics etc. never directly allocate funds from the on-chain treasury account but instead would be expected to create their own account(s) to which funds are first allocated via one of the methods below. This protects the on-chain treasury from errant or wayward mechanisms that may otherwise drain the funds if configured incorrectly or exploited by a malicious actor.

  ### Depositing 
  ### Withdrawing
  ### Adding assets (link to governance) 
 ## Supplying data
