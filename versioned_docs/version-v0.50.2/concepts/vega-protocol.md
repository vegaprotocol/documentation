# Vega Protocol 
## Governance
Governance allows the Vega network to arrive at on-chain decisions, where tokenholders can create proposals that other tokenholders can vote to approve or reject. 

The restricted Vega mainnet supports on-chain proposals for changing network parameters. Vega also supports freeform proposals for community suggestions that will not be enacted on-chain.

Taking part in governance by voting, or by proposing additions/changes with community support, is a way for tokenholders and community members to contribute to improve the network, and to add value for other network participants.

:::info 
Try out proposing markets and assets using [Fairground](https://fairground.wtf), Vega's testnet. 
:::

### Lifecycle of a governance proposal 
Proposing an addition or change to the network requires community support. It's worth considering what it contributes to the network, and if it would have enough support to pass a governance vote. You'll have a better chance of positively contributing to the network if you confirm there is support off-chain before submitting a proposal.

#### 1. Sense checking proposal idea (off-chain)
Before submitting a proposal, it's recommended that you share an outline of your proposed action informally in a new topic on the [community forum](https://community.vega.xyz/c/governance/25) in the Governance Proposals section, with a "sense-check" tag. You can find out if there is sufficient interest in making a change.

On mainnet, proposals can be submitted for changing network parameters, and making a freeform proposal (for changes that will not change network behaviour).

#### 2. Formalising proposal (off-chain)
Once the proposal details are refined, share the detailed proposal in the same topic you created for your sense check, and change the tag to "formalise". 

Including as much detail as possible gives other community members the opportunity to fully understand your proposal. Include the rationale for the proposal (and IPFS hash for more details), the specifics of the proposed addition/change, and the data (JSON or similar) that would be submitted on-chain. Invite debate and discussion to amend the proposal until it reaches a final state, ready to submit.

When formalising the proposal, it is worth ensuring that any fields that are dependent on a range set by network parameters are correctly defined. See the network parameters and their values on the [Vega block explorer](https://explorer.vega.xyz/network-parameters).

#### 3. Submitting proposal and telling the community (on-chain and off-chain)
Tokenholders can submit a governance proposal to the network using the command line or via a script.

The Vega public key of the proposer must have enough VEGA staked to submit a proposal. 

Proposals are first checked by the wallet, then verified by the nodes before entering into the voting period you set. A proposal must have all of the relevant information, in the correct format, and in some cases within the accepted range - otherwise it will be rejected immediately. 

A proposal is immutable once entered.

Once a proposal is submitted and accepted, rally the community to vote on the proposal by announcing it on the [forum](https://community.vega.xyz/), [Discord](https://vega.xyz/discord), and through your own networks to vote on the proposal. 

:::info 
Read the **[proposals guides](../tutorials/proposals/)** to see what information needs to be in a proposal, and how to submit them using the command line. 
:::

##### Validating a proposal
* The governance proposal is checked and then accepted by the wallet as a transaction.
* The validator nodes then check and validate the proposal. This is when the proposal data that defines the minimum duration, minimum time to enactment, minimum participation rate, and required majority are evaluated against the network's requirements, defined in [network parameters](https://explorer.vega.xyz), which are different depending the type of proposal.
* If the above conditions are not met, the proposal will be rejected and will not be available for a vote. **You'll need to fix and re-submit the proposal.**


#### 4. Voting 
VEGA tokenholders can vote for or against any active proposals, as long as the tokens they want to vote with are associated with their key. It's not necessary to nominate validators, but the tokens must be associated to the Vega key used for voting. 

* The number of tokens associated with the voting key determines how much weight the vote has (and for 'market parameter change' proposals, liquidity providers' market share is also taken into account). 
* Each Vega public key with a non-zero token balance gets one vote, and the key votes with the full weight of all the tokens that key has staked.
* Tokens used for voting are not locked or transferred: they can be used for staking as well as for voting on any/all active proposals.
* While the voting period is open, a public key can vote multiple times, but only the most recent vote will count at the proposal's close.
* The Vega key used for voting will need to have more than 0 tokens when a vote is submitted, as well as when votes are counted at the proposal's closing date/time, otherwise the vote is disregarded.

##### How the outcome is calculated 
* The network compares the weight of all valid votes cast as a percentage of the total weight that could vote, to the minimum participation requirement - `participation_rate = SUM (weightings of ALL valid votes cast) / max total weighting possible`
* The network compares the weight of all 'for' votes, as a percentage of the weight of all votes cast, to the required majority - `for_rate = SUM (weightings of votes cast for) / SUM (weightings of all votes cast)`
* If the minimum for both is reached, the proposal is enacted. If at least one is not reached, the proposal fails.


:::info
Vote on active proposals on the **[Vega token dApp](https://token.vega.xyz/governance)**.
:::

#### 5. Enacting changes
If a proposal receives enough token weight in favour within the enactment period, the change/addition is accepted (except for a freeform proposal), and will be enacted on the enactment date defined in the proposal. If a proposal doesn't require an enactment date and time, then it will be enacted immediately.

Note the enactment date must be at least the minimum enactment period for the proposal type/subtype (specified by a network parameter for each proposal type) after voting closes.

## Network parameter governance
There are certain parameters within Vega that influence the behaviour of the system and can be changed by on-chain governance. Vega tokenholders can define the optimal network configuration by creating and voting on network parameter proposals.

Network parameters can only be added and removed with Vega core software releases.

A network parameter is defined by:
* Name
* Type
* Value
* Constraints
* Governance update policy

**Read more:** [Guide to submitting a network parameter proposal using the command line](../tutorials/proposals/network-parameter-proposal.md)

### Thresholds for network parameters
Some network parameters need to be more difficult to change than others. Therefore, the protocol needs to know for each network parameter what governance thresholds apply for ascertaining a proposal's ability to change the parameter's value. Specifically, those thresholds are:

* `MinimumProposalPeriod`
* `MinimumPreEnactmentPeriod`
* `MinimumRequiredParticipation` 
* `MinimumRequiredMajority`

There are groups of network parameters that will use the same values for the thresholds. Importantly, these `minimum` levels are themselves network parameters, and therefore subject to change. See the current network parameters and their values on the [Vega block explorer](https://explorer.vega.xyz/network-parameters).

Consider a network parameter that specifies the proportion of fees that goes to validators (`feeAmtValidators`), with change thresholds:

* `MinimumProposalPeriod = 30 days`
* `MinimumPreEnactmentPeriod = 10 days`
* `MinimumRequiredParticipation = 60%`
* `MinimumRequiredMajority = 80%`

A proposal to change the `feeAmtValidators.MinimumProposalPeriod` would need to pass all of the thresholds listed above.

  
## Asset/token management
In restricted mainnet, the VEGA token can be used for nominating validators and for voting on governance proposals. In a future version, it will be possible to deposit and withdraw assets used for trading.


### Withdrawals
VEGA tokens can only be withdrawn if they are not staked.

When a participant decides they want to remove their assets from the Vega network, they'll need to submit a withdrawal request via a Vega app or the API.

This request, if valid, will put through Vega consensus, wherein the validators will sign a multi-signature withdrawal order bundle, and assign an expiry. If the withdrawal is not completed by the participant before the expiry, the tokens are returned to their collateral account. 

To move the assets into the participant's Ethereum wallet, they need to submit the bundle to the ERC20 bridge. The bridge validates the bundle and then releases the funds to the Ethereum wallet.

Once a successful withdrawal transaction has occurred, the ERC20 bridge will emit an `Asset_Withdrawn` event, and confirms to the Vega network that the withdrawal has been completed.

**Read more**: [ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#withdraw_asset)

#### Diagram: Withdrawals
![Withdrawal diagram](/img/concept-diagrams/diagram-withdraw.png)

#### Withdrawing staked (unlocked) VEGA
VEGA (an ERC20 token) used for staking is associated with a Vega key. To withdraw unlocked tokens and withdraw them, they must be dissociated first.

Rewards accrued through staking are not associated automatically. To stake those tokens or transfer them, they need to be withdrawn from the Vega key that the rewards are credited to, and sent to an Ethereum wallet.

:::info
Track and withdraw staking rewards on the [Vega token withdrawals page](https://token.vega.xyz/withdraw).
:::

**Read more**: 
* [VEGA token](./vega-chain#vega-token) for more details about the VEGA token

### On-chain network treasury 
In restricted mainnet, rewards for nominating a validator will be distributed from the on-chain network treasury, in the form of VEGA tokens. 

The on-chain network treasury is a set of accounts that are funded by parties, deposits, or by direct transfers to allocate funds for rewards, grants, and other initiatives.