---
title: Wallet Concepts
hide_title: false
---

Vega Wallet is an app that lets you manage your wallets and keys. 

## Cryptographic keys
Public key, private key. Private key is saved in your wallet file, but is never displayed. Rather than having to keep track of your key pairs, they are stored in a wallet file, so you don’t have to manage them yourself, or expose your private key. Cryptographic keys are used to sign messages, which tells a network that the transaction has come from your wallet. 

- [More on signing transactions](/docs/tools/vega-wallet/concepts/#signing-transactions)

## Wallet 
To have cryptographic keys, you need to create a wallet. This wallet holds keys, (like a keyring, but it calls it. A wallet). You can have as many keys in that wallet as you want. A wallet is a file that is saved on your computer. 

— Basic Wallet diagram

## Wallet name
You have to give your wallet a name. Why? You can have multiple wallets, and this helps you refer to which wallet you want to use. You can have as many wallets as you want, so you need to give each a name so you can refer to it. This is the name you’ll be asked for, for example on token app, or Vega Console, to confirm which wallet you want to use. You need to have a different name for each wallet. 

—Multiply wallet diagram where each wallet has its own keys and a name. 

## Wallet passphrase
File contains sensitive information, and so it needs a passphrase. You need to protect it on your local computer. You need to lock it (by using encryption - maybe further reading. 

As a result, every time you want to use that wallet or its keys, you’ll need to use the passphrase to unlock (decrypt) it. 

If you delete the wallet file, the software can’t interact with those keys anymore. You can restore as long as you have mnemonic. 

— Diagram with passphrase and wallet 

## Recovery phrase
When you create a wallet file, the app provides you with a recovery phrase, which you’ll need to save. Every wallet has a mnemonic attached to it. A list of words that store all the info needed to recover your wallet. (Link to further reading about mnemonic phrases - if needed). You will need to save this in a secure place. The recovery phrase allows you to restore your wallet. This is only displayed at the time of wallet creation and only once. Without the recovery phrase, you cannot restore your wallet, and you lose access to those keys. The best ways to save it are to write it down on paper and put the paper in a safe place, or save a file on an encrypted folder or computer. 

-Recovery phrase diagram 

## Interact with your wallet 
When you want to interact with Vega Wallet such as tools like console, token site. You will be asked for name of the wallet name you want to use, and its passphrase to decrypt it. 

## Signing transactions
Vega doesn’t have track of accounts, concept of a “user account” doesn’t exist, everything is a transaction. You need to sign a transaction with your cryptographic keys. 

What’s happening when you’re signing a transaction? (Be sure to use the Vega key that’s associated with the relevant assets you need for the transaction. If you want to issue a transaction, you may need to have the relevant tokens (but why)).  (Link off to transaction content maybe) 

—diagram of signing a transaction. User > message ‘scroll’ > choose wallet> choose key pair to stamp it > message becomes wax sealed letter (bundled with signature) > goes to Vega network  

