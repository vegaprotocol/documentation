---
title: Submit orders
hide_title: false
description: Start bot development for submitting orders with this guide.
---
This tutorial uses Linux/MacOs commands. The overall guide will also work for Windows, but you may need to update the commands. 

In this tutorial you'll learn how to:

1. Download and set up Vega Wallet for headless software
2. Find a market and its settlement asset
3. Deposit assets using Console or directly via the smart contracts
4. Encode and send transactions using Vega Wallet
5. Submit orders (place trades)
6. Cancel orders 
7. Get current market information
8. Monitor trades

## Set up the Vega Wallet 

### Download the Vega Wallet software

Each network, such as testnet, will have a compatible version of the CLI Wallet software, which should be used to interact with it. The Vega Wallet software manages wallets and the keys within them, and allows you to approve or reject site connections and transactions.

:::read more Create a wallet
[Create a wallet](../tools/vega-wallet/cli-wallet/latest/create-wallet): See a step-by-step guide to creating a Vega Wallet for testnet.
:::

Check the docs site top bar to see what software version the network you need is running on, and download the equivalent version on [GitHub](https://github.com/vegaprotocol/vega/releases).

Choose the `vegawallet-<os>-<arch>.zip` for your machine, then unpack the file and make sure the resulting `vegawallet` executable is placed in your path. Run `vegawallet software version` to check if the right version is loaded.

### Creating a wallet and public/private keypair

If you want to place trades, you'll need to have a wallet to hold our private/public keypair required for sending in new transactions. This is a 2 step process as we need to create a long life token to prevent us from needing to verify every transaction manually.

1. Choose a name for your first wallet, and secure it with a passphrase.
`vegawallet --home=/vega/wallet create --wallet=<WalletName>`

2. Create a token password file for the long lived tokens
`echo “password” > /vega/tokenpassword.txt`

3. Initialise the long lived token support
`vegawallet --home=/vega/wallet api-token init --passphrase-file=/vega/tokenpassword.txt`

4. Create an api token for the new wallet
`vegawallet --home=/vega/wallet api-token generate --wallet-name=<WalletName> --tokens-passphrase-file=tokenpassword.txt`

The last step will produce an API token that you must save or take note of, as it will be needed later when communicating with the wallet. You'll receive an output something like: 
`✓ The API token has been successfully generated: qqjkzoby9aXCN9K0zcAn1OhbWTzCsFvugK5AHRf1iuJxIEWG43fyEK28cbEmtRiT`

### Set up network config
The wallet service needs to know which network it will be connecting to. To do this, download a configuration file from the relevant network repo. The file contains the addresses of the nodes on the network it can connect to.

:::read more
[Manage networks](../tools/vega-wallet/cli-wallet/latest/guides/manage-networks): Read about how to get specific network details and troubleshoot any issues.
:::

Download the wallet configuration file for the testnet network called fairground.

```
mkdir /vega/wallet/config/wallet-service/networks
cd /vega/wallet/config/wallet-service/networks
curl https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml > testnet.toml
```

### Start the wallet service

Start the wallet service by running:

`vegawallet --home=/vega/wallet service run --network=testnet --load-tokens`


## Find a market to trade on

### Find a market using the API
To place a trade, rather than the market name, you'll need to find the market ID of the market you want to trade on. 

Get a list of all the markets by using a node URL and the markets endpoint. For example, for testnet you can use: `https://n08.testnet.vega.xyz/markets`. 

From this JSON output, you can see the market ID, as well as the asset ID for the market's settlement asset.

### Find a market using Console
You could, instead, use the Console trading interface to see the current markets and what state they're in, and take note of the market ID and settlement assset ID. Visit `https://console.fairground.wtf/`.

Once you're on the Console dApp, click on the button that says “CONNECT VEGA WALLET” and then click “CONNECT VEGA WALLET” again. 

Choose your wallet and allow Console to connect to your wallet. If this works, then the wallet is running correctly and can be used by your bot for trading.

When connecting, you'll be given a prompt similar to this one, when connecting: 
```
> The application "console.fairground.wtf" wants to connect to your wallet.
? Do you approve connecting your wallet to this application? (yes/no) yes
* Connection approved.
> Here are the available wallets:
    - TestBot
? Which wallet do you want to use? TestBot
> Enter the passphrase for the wallet "TestBot":
* The connection to the wallet has been successfully established.

> The application "console.fairground.wtf" requires the following permissions for "TestBot":
    - public_keys: read
? Do you want to grant these permissions? (yes/no) yes
* Permissions update approved.
* The permissions have been successfully updated.
```
## Faucet testnet assets using Console
Connect to your wallet in [Console](https://console.fairground.wtf/).

Select the “MARKETS” option on the top toolbar, if you haven't picked a market from the pop-up market selector.

For the market you wish to trade on, click on the settlement asset. This will open an asset details dialog. Select the contract address to see details of the asset’s smart contract on Etherscan.

Select “Contract” in the middle toolbar. 

Select “Write” in the buttons below.

Select “Connect to Web3” and allow it to connect to your Ethereum wallet.

Further down the page, choose the faucet option, select it and click “Write”. This will create and transfer some of the asset to your Ethereum address.

## Deposit assets [WIP]
Before submitting any orders, you'll need to deposit assets to the wallet you created above. This can be done from the Console dApp, or directly with the smart contract. For testnet, you can faucet tokens and then download them. 

### Deposit using Console
Go back to the console app and select the “PORTFOLIO” button on the top toolbar. 

In the bottom section select the “DEPOSITS” tab.
Click the “DEPOSIT” button on the bottom right.
Connect your ethereum wallet to the app to popular the “From address”
Select the asset we just faucetted in the asset dropdown
Enter the amount of the asset you would like to transfer, taking into account the maximum limits shown above the data entry field.
Hit the “DEPOSIT” button to perform the transfer
After a few seconds the funds will be transferred and you will see a new entry in the DEPOSITS tab for your transfer. The funds are now ready to be used for trading.
Sending transactions via the wallet

To enter transactions into the network we use the wallet to perform the encoding and sending of the data packets. Every transaction sent to the wallet needs a minimum set of headers. The origin and the authorization fields must be populated.


Header Name
Value
Example
Origin
User defined name for the trading process
mybot
Authorization
A string consisting of the constant “VWT “ and the long lived token generated from the vega wallet
VWT <oHmxvahukhhUMs9OWObPZkaLB7Si2Ycfk5t4Pitp2FX4iYvgvGUPWTv3xKAIkOjQ>


The origin field can be any name that identifies the project you are working on. The Authorization field must be the long life token generated at the start and should be formatted as “VWT <token>”

## Sending Request to the Wallet

```
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT oHmxvahukhhUMs9OWObPZkaLB7Si2Zcfk5t4Pitp2FX4iYvgvGUPWTv3xKAIkOjD" localhost:1789/api/v2/requests -d @<file containing json request>
```

## Getting the public key

When we send transactions into the network we need to provide our public key so that transactions can be decoded. We get the public key from the wallet using the “client.list_keys” method. We perform a POST request with the following body:

```json
{
  "id": "1",
  "jsonrpc": "2.0",
  "method": "client.list_keys"
}
```

Which generates a reply similar to this:

```
{"jsonrpc":"2.0","result":{"keys":[{"name":"Key 1","publicKey":"bb4bff0825f45210ce8fab46f0086bfb4c8d47707b011ce294b3fbb9a5b4125c"}]},"id":"1"}
```

If the wallet has more than one key pair set up, they will be listed in the same reply. In most cases you will only have one key pair and you can use the publicKey value returned in future transactions.




## Placing a trade

Copy the following json into a file and update the fields you require for your own order. Then send the order using the following command:

```
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <TOKEN>" localhost:1789/api/v2/requests -d @sendtrade.json

{
  "id":"1",
  "jsonrpc":"2.0",
  "method":"client.send_transaction",
  "params":
  {
    "publicKey":"bb4bff0825f45210ce8fab46f0086bfb4c8d47707b011ce294b3fbb9a5b4125c",
    "sendingMode":"TYPE_SYNC",
    "transaction":
    {
      "orderSubmission":
      {
        "market_id":"10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2",
        "price":"500000",
        "size":1,
        "side":1,
        "time_in_force":1,
        "type":1
      }
    }
  }
}
```


## Cancelling a trade

Copy the following json into a file and update the fields you require for your own order. Then send the order using the following command:
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <TOKEN>" localhost:1789/api/v2/requests -d @sendcancel.json

```json
{
  "id":"1",
  "jsonrpc":"2.0",
  "method":"client.send_transaction",
  "params":
  {
    "publicKey":"bb4bff0825f45210ce8fab46f0086bfb4c8d47707b011ce294b3fbb9a5b4125c",
    "sendingMode":"TYPE_SYNC",
    "transaction":
    {
      "orderCancellation":
      {
        "market_id":"10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2"
      }
    }
  }
}
```

## Getting market information

If you plan to add orders into the order book you need to know the current state of the market so you can accurately price the new orders you are sending. Follow the documentation to query the current market depth for the market shown here:
https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-get-latest-market-depth

There is a subscription service available in gRPC and graphQL to give you the market depth data in real time as things change in the market.


How to monitor our trades and overall position

Subscribe to the endpoints which returns the trade/order information and the positions stream.

https://api.n00.testnet.vega.xyz/graphql/

```graphql
subscription {
  orders(marketId: "", partyId: "") {
    id
    timeInForce
    side
    size
    remaining
    status
  }
}

subscription {
  positions(partyId: “") {
    marketId
    partyId
    openVolume
    realisedPNL
    unrealisedPNL
    averageEntryPrice
    updatedAt
  }
}
```

## Example bot code

If you want to use go code to perform the same actions, visit the sample bot at https://github.com/jeremyletang/vegamm. Note that this code may not be actively maintained, so you should to test it before using it on an active network.




Deposit and withdraw using smart contracts [WIP]


DEPOSIT
1. setup:
   * you have erc20 tokens you want to deposit (if using testnet, you can faucet the tokens you want to use)
   * you have your vega wallet public key
   * you have the erc20 bridge logic address
   * you have the erc20 token address
   * you have a funded wallet that can connect to Etherscan
1. ensure the token you want to deposit is listed
   * go to etherscan.io/address/[erc20_bridge_logic_address]
   * click "Contract"
   * click "Read Contract"
   * click "is_asset_listed"
   * paste in the ERC20 token address and click "Query"
   * ensure the result says "true"
1. approve bridge to spend token
   * go to etherscan.io/address/[erc20_token_address]
   * click "Contract"
   * click "Write Contract"
   * click "Connect to Web3" and follow instructions
   * click "approve"
   * under "spender" paste the erc20_bridge_logic_address
   * under "amount" enter the amount you want to deposit (ensure the correct number of zeroes)
   * click "Write" and follow the wallet prompts
1. run deposit asset
   * go to etherscan.io/address/[erc20_bridge_logic_address]
   * click "Contract"
   * click "Write Contract"
   * click "Connect to Web3" and follow instructions
   * click "deposit_asset"
   * under "asset_source" paste in erc20_token_address
   * under "amount" enter the amount you want to deposit (ensure the correct number of zeroes)
   * under "vega_public_key" paste in your vega wallet public key
   * click "Write" and follow the wallet prompts

WITHDRAW
1. prepare withdrawal transaction and send using Vega Wallet 
1. Query for withdrawal ID (https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-list-withdrawals)or calculate from the transaction signature (do this by sha3-ing the signature - export const determineId = (sig: string) => {
  return sha3_256(ethers.utils.arrayify('0x' + sig));
};)
1. retrieve signature bundle from Vega API: https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-get-withdrawal 
1. run withdrawal asset
   * ensure you have the withdrawal bundle from Vega retrieved in the previous step
   * go to etherscan.io/address/[erc20_bridge_logic_address]
   * click "Contract"
   * click "Write Contract"
   * click "Connect to Web3" and follow instructions
   * under "asset_source" paste in the erc20_token_address
   * for "amount" put in the EXACT amount from the withdrawal bundle
   * "target" is whatever Ethereum address the withdrawal order is for (need not be the running address)
   * "creation" is the creation data assigned by Vega and part of the withdrawal bundle
   * under "nonce" paste in the exact number from the withdrawal bundle
   * under "signatures" paste in the signature string from the withdrawal bundle, this will be very long
   * click "Write" and follow the wallet prompts

