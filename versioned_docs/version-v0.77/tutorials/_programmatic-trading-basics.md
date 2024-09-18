---
title: Programmatic trading basics
sidebar_position: 1
hide_title: false
description: Start bot development for submitting orders with this guide.
---

In this tutorial you'll learn the basics about how to use Vega and the Vega Wallet to submit orders using the APIs, so you can build bots or other software to interact with a network using the Vega software.

:::note Network for tutorial
This guide suggests using Fairground, the Vega testnet, as well as Sepolia (test Ethereum) for testing purposes.
:::

This guide covers how to:

1.  [Set up your Vega Wallet](#set-up-your-vega-wallet)
2.  [Find a market to trade on](#find-a-market-to-trade-on)
3.  [Get testnet assets using Console](#get-testnet-assets-using-console)
4.  [Deposit assets](#deposit-assets)
5.  [Get market information](#get-market-information)
6.  [Send transactions via the Vega Wallet](#send-transactions-via-the-vega-wallet)
7.  [Submit an order to place a trade](#submit-an-order-to-place-a-trade)
8.  [Cancel an order](#cancel-an-order)
9.  [Monitor trades and overall positions](#monitor-trades-and-overall-positions)
10. [See example bot code in Go](#bot-code)

This tutorial uses Linux commands. The overall guide will also work for Windows and MacOS, but you may need to update the command format. Each example command with a file path has a `$HOME` variable, which you should replace with your home path.

## Set up your Vega Wallet 

### Download the Vega Wallet software

Each network, such as testnet, will have a compatible version of the CLI Wallet software, which should be used to interact with it. The Vega Wallet software manages wallets and the keys within them, and allows you to approve or reject site connections and transactions.

You can also sign transactions directly from your application with a signer library if one exists for the language you're using, but this is out of scope of this guide. You can refer to two [example libs in the example code section](#signer-libraries).

:::note Read more
[Create a wallet](../tools/vega-wallet/cli-wallet/create-wallet): See a step-by-step guide to creating a Vega Wallet for testnet.
:::

Check the docs site top bar to see what software version the network you need is running on, and download the equivalent version on [GitHub ↗](https://github.com/vegaprotocol/vega/releases).

Choose the `vegawallet-<os>-<arch>.zip` for your machine, then unpack the file and make sure the resulting `vegawallet` executable is placed in your path. Run `vegawallet software version` to check if the right version is loaded.

### Create a wallet and public/private keypair
If you want to place or manage orders, you'll need to have a wallet to hold your private/public keypair, which is required for sending in new transactions. Once you've created a wallet, you'll also need to create a long life token for your application to prevent you from having to verify every transaction manually.

For all example commands below we are assuming the existence of the folder `vega` in your home directory which you will used to store all configuration and runtime files.

1. Choose a name for your first wallet, and secure it with a passphrase.
`vegawallet --home=/$HOME/vega/wallet create --wallet=<WalletName>`

2. Create a token password file for the long lived tokens
`echo “password” > /$HOME/vega/tokenpassword.txt`

3. Initialise the long lived token support
`vegawallet --home=/$HOME/vega/wallet api-token init --passphrase-file=/vega/tokenpassword.txt`

4. Create an api token for the new wallet
`vegawallet --home=/$HOME/vega/wallet api-token generate --wallet-name=<WalletName> --tokens-passphrase-file=tokenpassword.txt`

The last step will produce an API token that you must save or take note of, as it will be needed later when communicating with the wallet. You'll receive an output something like: 
`✓ The API token has been successfully generated: qqjkzoby9aXCN9K0zcAn1OhbWTzCsFvugK5AHRf1iuJxIEWG43fyEK28cbEmtRiT`

### Set up network config
The wallet service needs to know which network it will be connecting to. To do this, download a configuration file from the relevant network repo. The file contains the addresses of the nodes on the network it can connect to.

:::note Read more
[Manage networks](../tools/vega-wallet/cli-wallet/guides/manage-networks): Read about how to get specific network details and troubleshoot any issues.
:::

Download the wallet configuration file for the testnet network called fairground.

```
mkdir /$HOME/vega/wallet/config/wallet-service/networks
cd /$HOME/vega/wallet/config/wallet-service/networks
curl https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml > testnet.toml
```

### Start the wallet service

Start the wallet service by running:

```
vegawallet --home=/$HOME/vega/wallet service run --network=testnet --load-tokens
```


## Find a market to trade on

### Find a market using the API
To place a trade, rather than the market name, you'll need to find the market ID of the market you want to trade on. 

Get a list of all the markets by using a node URL and the markets endpoint. For example, for testnet you can use: `https://n08.testnet.vega.xyz/api/v2/markets`. 

From this JSON output, you can see the market ID, as well as the asset ID for the market's settlement asset.

### Find a market using Console
You could, instead, use the Console trading interface to see the current markets and what state they're in, and take note of the market ID and settlement assset ID. Visit `https://console.fairground.wtf/`.

### Check the wallet service is running correctly
Once you're on the Console dApp, click on the button that says “CONNECT VEGA WALLET” and then click “CONNECT VEGA WALLET” again. 

Choose your wallet and allow Console to connect to your wallet. If this works, then the wallet is running correctly and can be used by your bot for trading.

When connecting, you'll be given a prompt similar to this one: 
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

## Get testnet assets using Console

* Connect to your wallet in [Console ↗](https://console.fairground.wtf/).
* Select the “MARKETS” option on the top toolbar, if you haven't picked a market from the pop-up market selector.
* For the market you wish to trade on, click on the settlement asset. This will open an asset details dialog. Select the contract address to see details of the asset’s smart contract on Etherscan.
* Select “Contract” in the middle toolbar. 
* Select “Write” in the buttons below.
* Select “Connect to Web3” and allow it to connect to your web3 wallet.
* Further down the page, choose the faucet option, select it and click “Write”. This will create and transfer some of the asset to your Ethereum address.

## Deposit assets
Before submitting any orders, you'll need to deposit assets to the wallet you created above. This can be done from the Console dApp, or directly with the smart contract. 

You'll need Sepolia ETH to pay for the Ethereum transaction gas.

### Deposit using Etherscan
You'll need the following information available:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset

:::note Ethereum addresses
Contract and bridge addresses for the **fairground testnet network** are in the [networks-internal GitHub repo ↗](https://github.com/vegaprotocol/networks-internal/blob/main/fairground/templates/smart_contracts.json). 
:::

Ensure the token you want to deposit is listed:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Read Contract"
* Click "is_asset_listed"
* Paste in the ERC20 token address and click "Query"
* Ensure the result says "true"

Approve bridge to 'spend' the token:

* Go to etherscan.io/address/[erc20_token_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "approve"
* Under "spender" paste the erc20_bridge_logic_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeroes to account for the asset's decimals)
* Click "Write" and follow the wallet prompts

Run the deposit asset function:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "deposit_asset"
* Under "asset_source" paste in erc20_token_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeroes)
* Under "vega_public_key" paste in your vega wallet public key
* Click "Write" and follow the wallet prompts

## Get market information
If you plan to add orders into the order book using limit orders, rather than have them fill immediately (market orders), then you'll need to know the current state of the market so you can accurately price the new orders you are sending. 

Follow the REST documentation to [query the current market depth for the market](../api/rest/data-v2/trading-data-service-get-latest-market-depth.api.mdx).

There is also a subscription service available using REST to give you the market depth data in real time as things change in the market.

## Send transactions via the Vega Wallet
To enter transactions into the network, you'll need to use Vega Wallet to encode and send the data packets. Every transaction sent to the wallet needs a minimum set of headers. 

The origin and authorization fields must be populated.

| Header Name     | Value                | Example     |
| --------------- | -------------------- | ----------- |
| Origin          | User defined name for the trading process | mybot       |
| Authorization   | String consisting of the constant “VWT“ and long lived token generated from the wallet | `VWT <oHmxvahukhhUMs9OWObPZkaLB7Si2Ycfk5t4Pitp2FX4iYvgvGUPWTv3xKAIkOjQ>` |

The origin field can be any name that identifies the project you are working on. The Authorization field must be the long life token generated at the start and should be formatted as `VWT <token>`

### Template for sending request
The template below allows you to send a transaction that uses your authorization token and pulls from a file you'll have created with the JSON request.

In the following sections, you'll learn how to format 'submit order' and 'cancel order' commands. 

```
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <YOUR_AUTHORIZATION_TOKEN>" localhost:1789/api/v2/requests -d @<FILE-CONTAINING-JSON-REQUEST>
```

### Get your public key
You need to provide your public key when sending a transaction to the network, so that the transaction can be decoded. You can get your public key from the wallet using the “client.list_keys” method. 

Perform a POST request with the following body:

```json
{
  "id": "1",
  "jsonrpc": "2.0",
  "method": "client.list_keys"
}
```

This will generate a response similar to this:

```
{"jsonrpc":"2.0","result":{"keys":[{"name":"Key 1","publicKey":"bb4bff0825f45210ce8fab46f0086bfb4c8d47707b011ce294b3fbb9a5b4125c"}]},"id":"1"}
```

If the wallet has more than one keypair, all keypairs will be listed in the same response. If you only have one keypair, you can use the publicKey value returned in future transactions.

## Submit an order to place a trade
Copy the following JSON into a file and update the fields you require for your own order. Then, use the curl below to send your order submission to the network.

When choosing your price, be sure to account for decimal places, as well as the position decimal places. For example, for testnet you can find the information for the specific market using: `https://n08.testnet.vega.xyz/markets`. 

```json
{
  "id":"1",
  "jsonrpc":"2.0",
  "method":"client.send_transaction",
  "params":
  {
    "publicKey":"YOUR_PUBLIC_KEY",
    "sendingMode":"TYPE_SYNC",
    "transaction":
    {
      "orderSubmission":
      {
        "market_id":"MARKET_ID_TO_TARGET",
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
Then send the order using the following command:

```
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <TOKEN>" localhost:1789/api/v2/requests -d @sendtrade.json
```

## Cancel an order
Copy the following JSON into a file and update the fields you require for your own order. Then, use the curl below to send your order cancellation to the network.

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

Send the order cancellation using the following command:

`curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <TOKEN>" localhost:1789/api/v2/requests -d @sendcancel.json`

## Monitor trades and overall positions
You can use the curl command to subscribe to the endpoints that return order and position information using REST:

* [Subscribe to positions - reference documentation](../api/rest/data-v2/trading-data-service-observe-positions.api.mdx)
* [Subscribe to orders - reference documentation](../api/rest/data-v2/trading-data-service-observe-orders.api.mdx)

## Example code 

### Signer libraries 
Refer to the following example libraries for submitting signed transactions via gRPC, bypassing the Vega Wallet. Note, these may not be actively maintained, so you should test before using either on an active network.

* [Authenticator (Go) ↗](https://github.com/MM0819/vega-protocol-auth-go)
* [Authenticator (Java) ↗](https://github.com/MM0819/vega-protocol-auth-java)

### Bot code
If you want to use Go to perform the same actions, see the sample bot at [github.com/jeremyletang/vegamm ↗](https://github.com/jeremyletang/vegamm). Note that this code may not be actively maintained, so you should to test it before using it on an active network.