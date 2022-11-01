---
sidebar_position: 5
title: Deposits and withdrawals
hide_title: false
---
Assets used for trading, paying fees, funding rewards, and providing liquidity need to be deposited using a bridge contract, and can be withdrawn back into an Ethereum wallet if they are not being used for margin or liquidity commitment.

Once an asset is deposited, it's available in your general account, from which it then may be held in other account types depending on what you use the assets for. 

:::tip Tools you'll need
To deposit or withdraw, you'll need a [Vega Wallet](../tools/vega-wallet/index.md) and an Ethereum wallet, such as MetaMask. 
:::

:::note Read more 
[Accounts](./accounts.md): Learn about different accounts that your assets can be held in. 
:::

## Deposits
Only assets that have been proposed and enacted through governance can be used on the Vega network.

To use assets on the Vega network, for example to take part in markets, you'll need to deposit them: 
* The assets need to be available in an Ethereum wallet that you have access to
* You'll need to approve the deposit to the Ethereum network, which gives the Vega bridge access to that asset in your Ethereum wallet
* After approving, choose an amount to deposit. This deposit will have to accepted on the Ethereum network and the Vega network before the assets can be used


:::info Try it out
Deposit assets using the [Vega Console trading interface](https://console.fairground.wtf), in the Portfolio section.
:::

The first assets that will be available for interacting with markets on Vega will be ERC-20 assets, the only bridge currently available. An asset's ERC-20 token contract needs to be available on the bridge before it can be used, which happens in the governance and enactment process for new assets.

An asset can then be deposited into the ERC-20 bridge contract. The funds in that smart contract will then be made available to the user's chosen Vega public key. 

Note: Associated and deposited are not equivalent, as deposited tokens are held within the ERC-20 bridge contract, and associated tokens are held in the staking bridge contract (or in the vesting contract for locked/unredeemed tokens). The difference is that tokens deposited to the ERC-20 bridge are under the control of the Vega network whereas those associated with a Vega key remain solely in the control of the original holder -- you cannot lose your associated/steked tokens.

### Lifetime deposit limits 
During alpha mainnet, the ERC-20 bridge smart contract limits how much can ever be deposited from an Ethereum address. This is done in an abundance of caution, to assure users in the face of recent bridge hacks that they would have only a small amount at risk at any point. 

If, however, a user wanted to bypass those limits and understood the risks to their assets, they could run `exempt_depositor()` on the [ERC-20 bridge contract](../api/bridge#erc20-asset-bridge) for each asset, after which transactions greater than deposit limit for the asset would be allowed.

### Depositing ERC-20 assets
Deposits go through the ERC0-20 bridge smart contract. Every type of asset supported by and voted into Vega will have a bridge, but for the time being there is only an ERC-20 bridge.

When a participant wants to deposit assets onto a Vega key, they need to call a deposit function on the ERC20 bridge specifying the Vega public key to deposit to, and the quantity of the specified asset that the Vega key should receive. For this to succeed, the briodge contract must be [approved](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20-approve-address-uint256-) for at least the amount of the deposit.

Once deposited, the assets are held in the [asset pool smart contract](../api/bridge/index.md#erc20-asset-bridge) for security, as the bridge can be disconnected by a quroum of validators to prevent it accessing funds if a bug is found and withdrawals need to be stopped temporarily. This also makes contract updates easier and less risky.

:::note Go deeper
Before running the deposit function, you must run the ERC20-standard approve function to authorise the bridge smart contract as a spender of the target token. This will only allow a specific amount of that token to be used by the bridge. This can be done directly or through a Vega app.

Read about the ERC-20 token standard: [EIP-20: Token Standard proposal ↗](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20)
:::

After a successful deposit transaction, wheter done directly or through Vega Console, the `Asset_Deposited` event will be emitted for use by the Vega event queue.

The transaction is recognised by the Vega event queue and packaged as an event, which is then submitted to the validator nodes to verify the event contents against an Ethereum node that Vega validators also run.

Once the transaction is verified, the Vega public key submitted in the transaction will be credited with the deposited asset.

:::note Read more
[ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#deposit_asset)
:::

### Diagram: Deposits

#### How a user interacts with withdrawals
![User centric deposit diagram](/static/img/concept-diagrams/user-centric-withdraw-dark.png)

#### How Ethereum and Vega interact in withdrawals
![Deposit diagram](/img/concept-diagrams/diagram-deposit.png)

## Withdrawing assets
**Assets used for trading** and related activities can only be withdrawn if they're in a general account. That means that, among other things, they can't be in bond for liquidity provision or in a margin account for active orders or positions. 

**VEGA tokens** can only be withdrawn from the staking bridge if they are not staked and/or locked.

To remove assets from the Vega network, submit a withdrawal request via a Vega app, such as the Vega Console trading interface, or using [the smart contract](../api/bridge#staking-bridge).

This request, if valid, will be put through consensus - the validators sign a multi-signature withdrawal order bundle for the ERC-20 bridge. The bridge validates the bundle and then releases the funds to the chosen Ethereum wallet.


If it's a successful withdrawal transaction, the ERC20 bridge will emit an `Asset_Withdrawn` event, and confirms to the Vega network that the withdrawal has been completed.

:::note Read more
[ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#withdraw_asset)
:::

### Withdrawal limits
Withdrawals can have limits associated with them, where trying to withdraw above a certain amount will cause that withdrawal to be delayed by a set time. If a validator is compromised or otherwise issues a bad withdrawal, the delay gives Vega a chance to stop the withdrawal before it's too late.

The two parts of a withdrawal limit are:
* **Withdrawal threshold**: Set per asset through governance, requesting to withdraw that amount (and above) will trigger a withdrawal delay. Initially this will be 0, that is, all withdrawals will be subject to some delay to reduce the risk of bridge and other exploits draining the protocol.
* **Withdrawal delay**: Set for all assets on the ERC-20 bridge, this is the time that a withdrawal is delayed before it's completed
* [Query for asset details](../api/rest/data-v2/trading-data-service-get-asset) (under erc20) for each asset's threshold and delay.

If you choose an amount to withdraw that is higher than the withdrawal threshold, the multi-signature bundle will only be usable after the withdrawal delay has passed, after which the assets can be moved into an Ethereum wallet.

Once the delay time has passed, and the bundle is valid, **the withdrawal must be completed by submitting the bundle to Ethereum and paying the gas fee required. Usually this will be done by the party wishing to receive the funds**. This can be done using Vega Console or another user interface, or manually using the [smart contract](../api/bridge/contracts/ERC20_Bridge_Logic#withdraw_asset) and an Ethereum RPC node.

:::tip Query for data
You can see the threshold and delay for withdrawals in [Vega Console ↗](https://console.fairground.wtf).

Alternatively, see the withdraw threshold using a GraphQL query for the asset, and its asset source [ERC20](../api/graphql/objects/erc20.mdx).
:::

### Diagrams: Withdrawals
#### How a user interacts with withdrawals
![User-centric withdrawal diagram](img/../../../static/img/concept-diagrams/user-centric-withdraw-dark.png)

#### How Ethereum and Vega interact in withdrawals
![Withdrawal diagram](/img/concept-diagrams/diagram-withdraw.png)

### Withdrawing staked (unlocked) VEGA
VEGA (an ERC20 token) used for staking is associated with a Vega key. To withdraw unlocked tokens and withdraw them, they must be dissociated first.

Rewards accrued through staking are not associated automatically. To stake those tokens or transfer them, they need to be withdrawn from the Vega key that the rewards are credited to, and sent to an Ethereum wallet.

:::tip Try it
Track and withdraw testnet staking rewards on the [Vega token withdrawals page for testnet ↗](https://token.fairground.wtf/withdraw).

Alternatively, use the [smart contract](../api/bridge/contracts/ERC20_Bridge_Logic#withdraw_asset) and an Ethereum RPC node to run the withdraw function.
:::

:::note Read more
[VEGA token](./vega-chain#vega-token) for more details about the VEGA token
:::
