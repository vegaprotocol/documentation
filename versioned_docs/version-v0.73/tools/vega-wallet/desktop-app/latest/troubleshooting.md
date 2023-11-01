---
sidebar_position: 2
title: Troubleshooting
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { NetworkConfigAddress, NetworkConfigAddressText } from '@site/src/components/NetworkConfigAddress';
import CodeBlock from '@theme/CodeBlock';


If you have issues with the Vega Wallet desktop app, you may find the solution below. If not, see the [reporting bugs](#reporting-bugs) section below.

## Wallet will not connect
If you have trouble connecting, especially after a software release to the network you're using, you may need to delete your network configuration and use the default configuration. This is particularly likely after the 0.71.4 release as most of the node endpoints have changed.

### Possible solution
1. Navigate to `Manage network`.
2. Remove the network.
3. Restart the app.

Once you remove the network and restart the app, the app will download the latest version of the config for you.

## Missing features
To do any of the following, you will need to use the **[CLI wallet](../../cli-wallet)** app:
* Customise key details
* Isolate keys
* Build and send transactions 

## 'Wallet already exists' error when recovering wallet
### Problem
You recover a wallet using your recovery phrase. When you enter the wallet name, you get an error of `Wallet with this name already exists`. 

### Solution
A wallet with the same name already exists on your device. You can change the name of the wallet you are trying to restore, or you can use your existing wallet with the Vega Wallet desktop app. On the onboarding screen, choose `Use existing` to connect to an existing Vega wallet. 

If you see the error message `Wallet with this name already exists` but you do not see that wallet on the Wallets screen, then report the issue on the **[feedback board](https://github.com/vegaprotocol/feedback/discussions/)**. 

## Wallet recovery provides wrong keys 
### Problem
You recover a wallet using your recovery phrase, and the public key you see doesn't match the key you expect (such as if you expected that key to have assets associated with it, and it doesn't). 

### Possible solutions
* Choose the alternate key derivation version number alongside your recovery phrase. If you recovered and chose "version 2", then you should try using the same recovery phrase but choose "version 1".
* Ensure that your recovery phrase includes the exact same words, in the exact same order, as they were provided to you when you first created your wallet.

## Reporting bugs
**[Report on the feedback board](https://github.com/vegaprotocol/feedback/discussions/)**: If you discover a bug or are having problems with the Desktop Wallet app, report them on Vega's feedback board. 
