---
title: Get started with Vega Wallet
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Vega Wallet is available to use as a desktop app. Set-up takes less than 5 minutes, from downloading the software to connecting to a Vega dApp.

## Download and start the Vega Wallet desktop app

### Download, save and open app
#### 1. Download and save the file 

Get the latest version of the Vega Wallet desktop app from the [GitHub releases page](https://github.com/vegaprotocol/vegawallet-desktop/releases). 

Keep track of where you've saved the file, because you will need to know where to look for it to use it.

Click through the tabs below to find out which download file you need. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">
  
For Windows devices with an AMD processor (aka x86-64): 
Download `vegawallet-desktop-windows-amd64.zip`

For Windows devices with an ARM processor ([See Windows FAQ](https://support.microsoft.com/en-us/windows/windows-arm-based-pcs-faq-477f51df-2e3b-f68f-31b0-06f5e4f8ebb5#ID0EFD=Windows_11):   
</TabItem>
<TabItem value="mac" label="MacOS">

For Macs with an AMD processor (aka x86-64):
Download `vegawallet-desktop-darwin-amd64.zip`

For Macs with an M1 processor ([See Apple guidance](https://support.apple.com/en-us/HT211814)): 
Download `vegawallet-desktop-darwin-arm64.zip`
  
</TabItem>

<TabItem value="linux" label="Linux">

Download `vegawallet-desktop-linux-amd64.zip`
</TabItem>
</Tabs>

#### 2. Extract the file
Click on the compressed folder to get access to the app. 

#### 3. Start the app 
Double-click on the Vega Wallet desktop app icon to start the desktop app. 

## Generate new wallet
If you don't already have a Vega wallet, create a new wallet. 

1. Open the app
2. Click on "Create new wallet" 
3. Enter a wallet name of your choice, and a passphrase. 
4. Your first keypair will be created for you. You can create more keys for that wallet but you only need one to start interacting with Vega. 
5. Choose a Vega network to connect to: Click on the arrow in the bottom bar of the app. 

## Restore existing wallet
If you already have a Vega wallet with keys, recover the wallet using your recovery phrase. 

1. Open the app. 
2. Click on "Use recovery phrase"
3. Enter your recovery phrase, exactly in the order that it was first presented to you. 
4. Choose your wallet version (1 or 2). 
5. Choose a Vega network to connect to: Click on the arrow in the bottom bar of the app. 

## Troubleshooting
The Vega Wallet desktop app does not yet have the full functionality of the CLI wallet app.

### Not yet supported
To do any of the following, you will need to use the **[CLI wallet](docs/tools/vega-wallet/cli-wallet/)**:
* Customise key details
* Isolate keys
* Build and send commands 

### Wallet recovery provides wrong keys 
#### Problem
You recover a wallet using your recovery phrase, and the public key you see doesn't match the key you expect (such as if you expected that key to have assets associated with it, and it doesn't). 

#### Possible solutions
* Choose the alternate wallet version number alongside your recovery phrase. If you recovered and chose "version 2", then you should try using the same recovery phrase but choose "version 1". 
* Ensure that your recovery phrase includes the exact same words, in the exact same order, as they were provided to you when you first created your wallet. 

### Reporting bugs
[Nolt](https://vega-testnet.nolt.io/): If you discover a bug or are having problems with the Desktop Wallet app, report them on Nolt. 
