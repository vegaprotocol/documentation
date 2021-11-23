# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

Governance proposals for restricted mainnet are limited to network parameter change proposals, as trading is not available. 

In future versions, Vega will support proposals for creating markets and assets, proposals for changing network parameters, markets and assets, and freeform proposals for community suggestions. 

:::info 
Try out proposing markets using [Fairground](https://fairground.wtf), Vega's testnet. 
:::

### Lifecycle of a governance proposal 
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
VEGA tokenholders can vote for or against any proposals. In restricted mainnet, Vega tokenholders will be able to define the optimal network configuration by creating and voting on network parameter proposals. 

* Any tokenholder with more than 0 tokens associated with a Vega key can vote on proposals. 
* The Vega key used for voting will need to have more than 0 tokens when a vote is submitted, as well as when votes are counted at the proposal's closing date/time, otherwise the vote is disregarded. 
* Tokens used for voting are not locked or transferred: they can be used for staking as well as for voting on any/all active proposals
* Each public key with a non-zero token balance gets one vote.
* While the voting period is open, a public key can vote multiple times but only the most recent vote will count at the proposal's close.

Tokenholders can create proposals using the APIs. 

:::info
Vote on proposals on the [Vega token governance page](https://token.vega.xyz/governance).
:::

## Collateral management 
The collateral for restricted mainnet is exclusively VEGA, which is used for staking and rewards. 
 
:::info
You'll need a Vega Wallet for staking and receiving rewards. Connect to wallets and see your account balance on the [Vega token website](https://token.vega.xyz). CoinList custodial users should confirm with CoinList how staking works for them.
:::

### Deposits
For restricted mainnet, the deposits function for Vega is not required. To stake, instead of depositing, tokens must be associated to a Vega key. Tokens used for staking stay in your Ethereum wallet, rather than being held in the ERC20 bridge contract. [Read more about staking VEGA tokens.](/docs/concepts/vega-chain#staking-on-vega)

The first assets that will be available for interacting with markets on Vega will be ERC20 assets. They will need to be deposited into the ERC20 bridge contract. The funds in that smart contract will then be made available to the user's chosen public key.

:::info
Follow a step-by-step guide to depositing testnet collateral for trading on Fairground on the [Fairground docs](https://docs.fairground.vega.xyz/docs/console/#how-to-deposit-tokens-to-use-on-vega).
:::

### Withdrawals
In restricted mainnet, the only assets that are available to withdraw are rewards accrued through staking tokens to network validators. 

To stake those rewards, the recipient must withdraw them from the Vega key the rewards are credited to, and send the tokens to their Ethereum wallet. After withdrawing, the tokens can be associated with a Vega key. 

Note: Associated and deposited are not equivalent, as deposited tokens are held within the ERC20 bridge contract, and associated tokens stay in an Ethereum wallet or in the vesting contract. 

:::info
Track and withdraw rewards on the [Vega token withdrawals page](https://token.vega.xyz/withdraw).
:::

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens. 

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.