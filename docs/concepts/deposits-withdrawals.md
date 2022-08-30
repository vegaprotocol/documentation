---
sidebar_position: 4
title: Deposits and withdrawals
hide_title: false
---
Assets used for trading, paying fees, funding rewards, and providing liquidity need to be deposited using a bridge contract, and can be withdrawn back into an Ethereum wallet if they are not being used for margin or liquidity commitment.

:::tip Tools you'll need
To deposit or withdraw, you'll need a [Vega Wallet](../tools/vega-wallet/index.md) and an Ethereum wallet, such as MetaMask. 
:::

Once an asset is deposited, it's available in your general account, from which it then may be held in other account types depending on what you use the assets for. 

:::note Read more 
[Accounts](./accounts.md): Learn about different accounts that your assets can be held in. 
:::

### Deposits
Only assets that have been proposed and enacted through governance can be used on the Vega network.

To use assets on the Vega network, for example to take part in markets, you'll need to deposit it: 
* The assets need to be available in an Ethereum wallet that you have access to
* You'll need to approve the deposit to the Ethereum network, which gives the Vega bridge access to that asset in your Ethereum wallet
* After approving, choose an amount to deposit. This deposit will have to accepted on the Ethereum network and the Vega network before the assets can be used


:::info Try it out
Deposit assets using the [Vega Console trading interface](https://console.fairground.wtf), in the Portfolio section.
:::

The first assets that will be available for interacting with markets on Vega will be ERC-20 assets, the only bridge currently available. An asset's ERC-20 token contract needs to be available on the bridge before it can be used, which happens in the governance and enactment process for new assets.

An asset can then be deposited into the ERC20 bridge contract. The funds in that smart contract will then be made available to the user's chosen Vega public key. 

Note: Associated and deposited are not equivalent, as deposited tokens are held within the ERC-20 bridge contract, and associated tokens stay in an Ethereum wallet or in the vesting contract.

### Lifetime deposit limits 
During alpha mainnet, the ERC-20 bridge smart contract limits how much can ever be deposited from an Ethereum address. This is done in an abundance of caution, to assure users in the face of recent bridge hacks that they would have only a small amount at risk at any point. 

If, however, a user wanted to bypass those limits and understood the risks to their assets, they could run `exempt_depositor()` on the [ERC-20 bridge contract](./../api/bridge/contracts/ERC20.md) for each asset, after which transactions greater than deposit limit for the asset would be allowed.

### Depositing ERC-20 assets
Deposits go through the ERC0-20 bridge smart contract. Every type of asset supported by and voted into Vega will have a bridge, but for the time being there is only an ERC-20 bridge.

When a participant wants to deposit assets onto a Vega key, they need to call a deposit function on the ERC20 bridge that contains how much of the specified asset the Vega key will receive.

Once deposited, the assets are held in an asset pool for security and to make contract updates easier/less risky.

:::info Go deeper
Before running the deposit function, you must run the ERC20-standard approve function to authorise the bridge smart contract as a spender of the target token. This will only allow a specific amount of that token to be used by the bridge. This can be done directly or through a Vega app.

Read about the ERC-20 token standard: [EIP-20: Token Standard proposal](https://eips.ethereum.org/EIPS/eip-20)
:::

After a successful deposit transaction, wheter done directly or through Vega Console, the `Asset_Deposited` event will be emitted for use by the Vega event queue.

The transaction is recognised by the Vega event queue and packaged as an event, which is then submitted to the validator nodes to verify the event contents against an Ethereum node that Vega validators also run.

Once the transaction is verified, the Vega public key submitted in the transaction will be credited with the deposited asset.

:::info Read more
[ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#deposit_asset)
:::

### Diagram: Deposits
![Deposit diagram](/img/concept-diagrams/diagram-deposit.png)

## Withdrawing assets
Assets used for trading and related activities can only be withdrawn if they are not being held in bond for liquidity or in the margin account for active orders. 

VEGA tokens can only be withdrawn if they are not staked and/or locked.

To remove their assets from the Vega network, submit a withdrawal request via a Vega app, such as the Vega Console trading interface, or the API.

This request, if valid, will put through Vega consensus, wherein the validators will sign a multi-signature withdrawal order bundle to the ERC-20 bridge, and assign an expiry. The bridge validates the bundle and then releases the funds to the Ethereum wallet.

If the withdrawal is not completed by the participant before the expiry, the tokens are returned to their collateral account. 

If it's successful withdrawal transaction, the ERC20 bridge will emit an `Asset_Withdrawn` event, and confirms to the Vega network that the withdrawal has been completed.

:::info Read more
[ERC20 bridge logic API documentation](../api/bridge/contracts/ERC20_Bridge_Logic.md#withdraw_asset)
:::

### Diagram: Withdrawals
![Withdrawal diagram](/img/concept-diagrams/diagram-withdraw.png)

### Withdrawing staked (unlocked) VEGA
VEGA (an ERC20 token) used for staking is associated with a Vega key. To withdraw unlocked tokens and withdraw them, they must be dissociated first.

Rewards accrued through staking are not associated automatically. To stake those tokens or transfer them, they need to be withdrawn from the Vega key that the rewards are credited to, and sent to an Ethereum wallet.

:::tip Try it
Track and withdraw testnet staking rewards on the [Vega token withdrawals page for testnet](https://token.fairground.wtf/withdraw).
:::

:::info Read more
[VEGA token](./vega-chain#vega-token) for more details about the VEGA token
:::