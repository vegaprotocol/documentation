---
title: Submit orders
hide_title: false
description: Start bot development for submitting orders with this guide.
---

[WIP]

This tutorial uses Linux/MacOs commands. The overall guide will also work for Windows, but you may need to update the commands. 

In this tutorial you'll learn how to:
* Download and set up Vega Wallet for headless software
* Find a market and its settlement asset
* Deposit assets using Console or directly via the smart contracts
* Encode and send transactions using Vega Wallet
* Submit orders (place trades)
* Cancel orders 
* Get current market information
* Monitor trades

Set up the Vega Wallet 

Downloading the vega wallet software

Each network such as testnet will have a matching version of the command line wallet which should be used to interact with it. For the current testnet we will be using version 0.67.3 which can be downloaded from here:

https://github.com/vegaprotocol/vega/releases/tag/v0.67.3

Choose the `vegawallet-<os>-<arch>.zip` for your machine then unpack the file and make sure the resulting `vegawallet` executable is placed in your path.
You can check by running `vegawallet software version` to see if the right version is loaded.

Creating a wallet and public/private keypair

If we want to place trades we must first have a wallet to hold our private/public keypair required for sending in new transactions. This is a 2 step process as we need to create a long life token to prevent us from needing to verify every transaction manually.

Create the named wallet and secure it with a password 
vegawallet --home=/vega/wallet create --wallet=<WalletName>
Create a token password file for the long lived tokens
Echo “password” > /vega/tokenpassword.txt
Initialise the long lived token support
vegawallet --home=/vega/wallet api-token init --passphrase-file=/vega/tokenpassword.txt
Create an api token for the new wallet
vegawallet --home=/vega/wallet api-token generate --wallet-name=<WalletName> --tokens-passphrase-file=tokenpassword.txt

The last step will produce an API token that you must save/remember as it will be needed later when communicating with the wallet.
“✓ The API token has been successfully generated: qqjkzoby9aXCN9K0zcAn1OhbWTzCsFvugK5AHRf1iuJxIEWG43fyEK28cbEmtRiT”


Start the wallet service
The wallet service needs to know which network it will be connecting to. To do this we must download a configuration file from github which contains the addresses of the nodes on the network it can connect to.

Download the testnet wallet configuration file
mkdir /vega/wallet/config/wallet-service/networks
cd /vega/wallet/config/wallet-service/networks
curl https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml > testnet.toml

Start the wallet service by running:
vegawallet --home=/vega/wallet service run --network=testnet --load-tokens

* Starting HTTP service at: 127.0.0.1:1789
Connect to the network and find the market you wish to trade on
  

Find a market
  
If you are going to trade on the Vega network you need to find the market ID of the market you are interested in. You can get a list of all the markets by going to a browser and entering the following URL (https://n08.testnet.vega.xyz/markets). From this JSON output we can see the ID for the settlement asset along with the marketID we will need to use later when sending in new orders.

Or you connect to the network using the console front end by going to this URL: https://console.fairground.wtf/

In console, choose the button top right that says “CONNECT VEGA WALLET” and then “CONNECT VEGA WALLET” again.
Check the console running the wallet and answer the questions around choosing a wallet and entering the password for it. If this works OK then the wallet is running correctly and can be used by your bot for trading.

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
Depositing funds to the new account using Console

Before we can send any trades we need to deposit some assets into the wallet we created above.This can be done from the console application. For testnet, you can faucet tokens and then download them. 

Load the fairground console application (https://console.fairground.wtf/)
Connect it to your vega wallet like above
Select the “MARKETS” option on the top toolbar
For the market you wish to trade on, select the settlement asset which will open an asset details dialog.
Select the contract address to go to a new website with details of the asset’s smart contract
Select “Contract” in the middle toolbar
Select “Write” in the buttons below
Select “Connect to Web3” and allow it to connect to your metamask wallet
Look down the page for the faucet option and select it and click “Write”. This will create and transfer some of the asset to your ethereum account. It will take 10 seconds or so to complete.
Go back to the console app and select the “PORTFOLIO” button on the top toolbar
In the bottom section select the “DEPOSITS” tab
Click the “DEPOSIT” button on the bottom right
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

Sending Request to the Wallet

curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT oHmxvahukhhUMs9OWObPZkaLB7Si2Zcfk5t4Pitp2FX4iYvgvGUPWTv3xKAIkOjD" localhost:1789/api/v2/requests -d @<file containing json request> 
Getting the public key

When we send transactions into the network we need to provide our public key so that transactions can be decoded. We get the public key from the wallet using the “client.list_keys” method. We perform a POST request with the following body:

{
  "id": "1",
  "jsonrpc": "2.0",
  "method": "client.list_keys"
}

Which generates a reply similar to this:


{"jsonrpc":"2.0","result":{"keys":[{"name":"Key 1","publicKey":"bb4bff0825f45210ce8fab46f0086bfb4c8d47707b011ce294b3fbb9a5b4125c"}]},"id":"1"}

If the wallet has more than one key pair set up, they will be listed in the same reply. In most cases you will only have one key pair and you can use the publicKey value returned in future transactions.




Placing a trade

Copy the following json into a file and update the fields you require for your own order. Then send the order using the following command:
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





Canceling a trade

Copy the following json into a file and update the fields you require for your own order. Then send the order using the following command:
curl -v -H "Content-Type: application/json" -H "Origin:mybot" -H "Authorization:VWT <TOKEN>" localhost:1789/api/v2/requests -d @sendcancel.json


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
Getting market information

If you plan to add orders into the order book you need to know the current state of the market so you can accurately price the new orders you are sending. Follow the documentation to query the current market depth for the market shown here:
https://docs.vega.xyz/testnet/api/rest/data-v2/trading-data-service-get-latest-market-depth

There is a subscription service available in gRPC and graphQL to give you the market depth data in real time as things change in the market.


How to monitor our trades and overall position

Subscribe to the endpoints which returns the trade/order information and the positions stream.

https://api.n00.testnet.vega.xyz/graphql/

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

Example bot code

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

