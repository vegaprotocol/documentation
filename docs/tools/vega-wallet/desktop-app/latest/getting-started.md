---
title: Get started with Vega Wallet
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can now connect to an existing Vega wallet, or create a new wallet, using the Vega Wallet desktop app.

Set-up takes less than 5 minutes, from downloading the software to connecting to a Vega dApp.

:::caution Software version compatibility
The Vega Wallet desktop app has release and pre-release versions available. The newest pre-release version is generally the version compatible with the latest testnet release, while the release version is compatible with the Vega mainnet.
:::

## Download and start the Vega Wallet desktop app

### Download, save and open app
#### 1. Download and save the file 

Get the latest version of the Vega Wallet desktop app from the [GitHub releases page](https://github.com/vegaprotocol/vegawallet-desktop/releases). 

Keep track of where you've saved the file, because you will need to know where to look for it to use it.

Click through the tabs below to find out which download file you need. 

<Tabs groupId="operating-systems">
<TabItem value="windows" label="Windows">

You'll need Windows 8 or newer to use the desktop app.

**For Windows devices with an AMD processor (aka x86-64)**: 

Download `vegawallet-desktop-windows-amd64.zip`

**For Windows devices with an ARM processor** ([See Windows FAQ](https://support.microsoft.com/en-us/windows/windows-arm-based-pcs-faq-477f51df-2e3b-f68f-31b0-06f5e4f8ebb5#ID0EFD=Windows_11)):

Download `vegawallet-desktop-windows-arm64.zip`

You may need to change your system preferences for this specific instance, in order to run Vega Wallet. If you open the file from downloads, you may get a message from Windows Defender saying it prevented an unrecognised app from starting. Click 'More info' and then 'Run anyway'.

![Windows SmartScreen, click more info](/img/software-prompt-images/smartscreen1.png)

![Windows SmartScreen, click more info](/img/software-prompt-images/smartscreen2.png)

If you do not have WebView2 installed on your computer, you will be prompted to install it. Click "OK" to install and continue.

![Windows SmartScreen, click more info](/img/software-prompt-images/webview2.png)

</TabItem>
<TabItem value="mac" label="MacOS">

**For Macs with an AMD processor (aka x86-64)**:

You'll need MacOS 10.13 (High Sierra) or newer to use the desktop app.

Download `vegawallet-desktop-darwin-amd64.zip`

**For Macs with an M1 processor** ([See Apple guidance](https://support.apple.com/en-us/HT211814)): 

Download `vegawallet-desktop-darwin-arm64.zip`
  
</TabItem>

<TabItem value="linux" label="Linux">

Linux is generally supported, though the minimum version is unknown.

Download `vegawallet-desktop-linux-amd64.zip`
</TabItem>
</Tabs>

#### Antivirus software
If you are running antivirus software, you may need to ‘allowlist’ or ‘whitelist’ the Vega Wallet software, so that your antivirus provider doesn’t quarantine the software and block you from using it.

#### 2. Extract the file
Click on the compressed folder to get access to the app. 

#### 3. Start the app 
Double-click on the Vega Wallet desktop app icon to start the desktop app. 

## Use existing wallet 
If you previously created a Vega wallet, such as using the CLI app, the first time you use the Vega Wallet desktop app you can choose to use an existing wallet. 

If you are updating to a new version of the Vega Wallet desktop app, the app will load your existing Vega wallet (or wallets) on the wallet screen.

## Generate new wallet
If you don't already have a Vega wallet, create a new wallet. 

1. Open the app
2. Click on "Create new wallet" 
3. Enter a wallet name of your choice, and a passphrase. 
4. Your first keypair will be created for you. You can create more keys for that wallet but you only need one to start interacting with Vega. 
5. Choose a Vega network to connect to: Click on the arrow in the bottom bar of the app. If you do not have any network configuration, you can use the .toml URLs in the [manage networks guide](../../cli-wallet/latest/guides/manage-networks#network-urls) to import a network.

## Restore wallet
If your Vega wallet was created on a different device, or you lost access to it but have the recovery phrase, you can recover the wallet using that recovery phrase. 

1. Open the app. 
2. Click on "Use recovery phrase"
3. Enter your recovery phrase, exactly in the order that it was first presented to you. 
4. Identify if your wallet was version 1 or 2 by choosing the version number. 
5. Choose a Vega network to connect to: Click on the arrow in the bottom bar of the app. If you do not have any network configuration, you can use the .toml URLs in the [manage networks guide](../../cli-wallet/latest/guides/manage-networks#network-urls) to import a network.

## Updating the app
It's recommended that you keep the Vega Wallet app up-to-date, to take advantage of the latest features. 

To update to the latest version:

1. (Optional) Delete the old version of the Vega Wallet app, so you can keep track of which is the latest version. Currently, downloading a new version does not overwrite the previous one. Deleting the app will not delete your wallets or keys. 
2. Download the latest version for your operating system from [GitHub](https://github.com/vegaprotocol/vegawallet-desktop/releases).
3. Click on the compressed folder to get access to the new app file. 
4. Open the latest version of the Vega Wallet desktop app.


## Troubleshooting
The Vega Wallet desktop app does not yet have the full functionality of the CLI wallet app.

### Not yet supported
To do any of the following, you will need to use the **[CLI wallet](../../cli-wallet)** app:
* Customise key details
* Isolate keys
* Build and send transactions 

### 'Wallet already exists' error when recovering wallet
#### Problem
You recover a wallet using your recovery phrase. When you enter the wallet name, you get an error of `Wallet with this name already exists`. 

#### Solution
The wallet you are trying to recover already exists on your device. You can use your existing wallet with the Vega Wallet desktop app. On the onboarding screen, choose `Use existing` to connect to an existing Vega wallet. 

If you see the error message `Wallet with this name already exists` but you do not see that wallet on the Wallets screen, then report the issue on the **[feedback board](https://github.com/vegaprotocol/feedback/discussions/)**. 

### Wallet recovery provides wrong keys 
#### Problem
You recover a wallet using your recovery phrase, and the public key you see doesn't match the key you expect (such as if you expected that key to have assets associated with it, and it doesn't). 

#### Possible solutions
* Choose the alternate wallet version number alongside your recovery phrase. If you recovered and chose "version 2", then you should try using the same recovery phrase but choose "version 1".
* Ensure that your recovery phrase includes the exact same words, in the exact same order, as they were provided to you when you first created your wallet.

## No networks available
If you chose not to import the available networks when setting up the wallet app, you will need to import them manually. Use the .toml URLs in the [manage networks guide](../../cli-wallet/latest/guides/manage-networks#network-urls) to import a network.

### Reporting bugs
**[Report on the feedback board](https://github.com/vegaprotocol/feedback/discussions/)**: If you discover a bug or are having problems with the Desktop Wallet app, report them on Vega's feedback board. 
