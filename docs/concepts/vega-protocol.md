# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. Vega will support creation proposals for markets and assets, and change proposals for network parameters, markets and assets, as well as freeform proposals for community suggestions. 

Governance proposals for restricted mainnet are limited to network parameter change proposals, as trading is not enabled. 

### Lifecycle of a proposal 
1. VEGA tokenholder creates and submits a proposal. 
1. Governance proposal is accepted by the validator nodes as a transaction.
1. The nodes decided whether to validate the proposal. This is when the network parameters that validate the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated. If not specified on the proposal, this is also when the required participation rate and majority for success are defined, based on the existing network parameters, and copied to the proposal. The proposal is immutable once entered.
1. If valid, the the proposal is considered 'active' for the proposal period as defined on the proposal, which must be at least as long as the minimum duration for the proposal type, specified by a network parameter.
1. During the proposal period, network participants who are eligible to vote on the proposal can submit votes for or against the proposal.
1. When the proposal period closes, the network calculates the outcome by:
   - comparing the total number of votes cast as a percentage of the number eligible to be cast, to the minimum participation requirement. If the minimum is not reached, the proposal is rejected.
	- comparing the number of positive votes as a percentage of all votes cast (maximum one vote counted per party) to the required majority. 
1. If the required majority of "for" votes was met, the action described in the proposal will be taken (proposal is enacted) on the enactment date, which is defined by the proposal and must be at least the minimum enactment period for the proposal type/subtype (which is specified by a network parameter) _after_ voting on the proposal closes.

Any actions that result from the outcome of the vote are covered in other spec files.

### Network parameters
### Voting on proposals 
## Collateral management 
The collateral for restricted mainnet is exclusively VEGA, which is used for staking and rewards. 
 
<< tip: You'll need a Vega Wallet for staking, and for receiving rewards. You'll be able to see your account balance on token.vega.xyz.>>
 
### On-chain network treasury (restricted mainnet) (WIP)
In restricted mainnet, rewards for nominating a validator are funded by the on-chain network treasury. (confirm)

The on-chain treasury is a set of accounts that are funded by parties, deposits, or by direct transfers, and uses tokenholder governance to allocate funds to rewards, grants, and other initiatives.

When the funds are required, they are transferred to the recipient account, either by direct governance action (i.e. voting on a specific proposed transfer) or by mechanisms controlled by governance, such as a periodic transfer.

The recipient account could be a party's general account, a reward pool account, or a market's insurance pool account (when there are markets). 

#### Funding network treasury 
The restricted mainnet treasury is funded by XXXX. 

The on-chain treasury account can receive collateral via two funding methods: deposit or transfer. Only deposits are enabled for funding the treasury in restricted mainnet. On-chain treasury **deposits** are made using a Vega bridge, at which point the deposited funds appear in the network treasury account. 

#### Allocating network treasury collateral (WIP) (needed?)

Allocation is the process of deploying collateral from the on-chain treasury for various purposes. 
Allocation transfers funds from the on-chain treasury account for an asset to another account. 

Reward calculation mechanics etc. never directly allocate funds from the on-chain treasury account but instead would be expected to create their own account(s) to which funds are first allocated via one of the methods below. This protects the on-chain treasury from errant or wayward mechanisms that may otherwise drain the funds if configured incorrectly or exploited by a malicious actor.

  ### Depositing 
  ### Withdrawing