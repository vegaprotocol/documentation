# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Governance proposals for restricted mainnet are limited to network parameter change proposals, as trading is not available. 

Vega will support proposals for creating markets and assets, proposals for changing network parameters, markets and assets, and freeform proposals for community suggestions. 


### Lifecycle of a proposal 
1. VEGA tokenholder creates and submits a governance proposal. 
1. The governance proposal is accepted by the validator nodes as a transaction.
1. The nodes decide whether to validate the proposal. This is when the network parameters that validate the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated. If not specified on the proposal, the required participation rate and majority for success are defined based on the existing network parameters, and copied to the proposal. The proposal is immutable once entered.
1. If valid, the proposal is considered 'active' for the defined proposal period. That period must be at least as long as the minimum duration for the proposal type, specified by the network parameter.
1. During the proposal period, network participants who are eligible to vote on the proposal can submit votes for or against the proposal.
1. When the proposal period closes, the network calculates the outcome by:
   - comparing the total number of votes cast as a percentage of the number eligible to be cast, to the minimum participation requirement. If the minimum is not reached, the proposal is rejected.
	- comparing the number of 'for' votes as a percentage of all votes cast (maximum one vote counted per party) to the required majority. 
1. If the required majority of 'for' votes is met, the action described in the proposal will be taken (i.e., proposal is enacted) on the defined enactment date. Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter) _after_ voting closes.

### Voting on proposals 
--
How to vote for proposals and reiterate mainnet proposals are only network parameter. 

VEGA tokenholders can vote for or against any proposals. You can vote multiple times while voting is open, but only the most recent vote counts. 

A participant's vote uses all tokens associate with their Vega key. Any amount of tokens greater than 0 

Tokens used for governance are not locked or transferred, and can still be staked and used to vote for all active proposals. 

The Vega key used for voting will need to have more than 0 when you submit, as well as when the vote is counted. 

In restricted mainnet, only proposals for changes to network parameter changes will be available. 

## Collateral management 
The collateral for restricted mainnet is exclusively VEGA, which is used for staking and rewards. 
 
:::info
You'll need a Vega Wallet for staking and receiving rewards. Connect to wallets and see your account balance on token.vega.xyz. CoinList
custodial users should confirm with CoinList how staking works for them.
:::

### Deposits
For restricted mainnet, the deposits function for Vega is not required. Instead of depositing, tokens must be associated to a Vega key to stake. 

[Read more about staking VEGA tokens.](/docs/concepts/vega-chain#staking-on-vega)

The first assets that will be available for interacting with markets on Vega will be ERC20 assets. They will need to be deposited into the ERC20 bridge contract. The funds in that smart contract will then be made available to the parties you registered with the network.

:::info: 
Follow a step-by-step guide to depositing testnet collateral for trading on Fairground on the [Fairground docs](https://docs.fairground.vega.xyz/docs/console/#how-to-deposit-tokens-to-use-on-vega).
:::

### Withdrawals
In restricted mainnet, the only assets that are available to withdraw are rewards accrued through staking tokens to network validators. 

To stake those rewards, the recipient will need to withdraw them from their Vega key that the rewards are credited to, and sent to their Ethereum wallet. After withdrawing, the tokens can associated with a Vega key. 

Note: Associated and deposited are not equivalent, as deposited tokens are held within the ERC20 bridge contract, and associated tokens stay in an Ethereum wallet or in the vesting contract. 

:::info: 
Track and withdraw rewards on the [token site withdrawals page](https://token.vega.xyz/withdraw).
:::

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens. 

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.