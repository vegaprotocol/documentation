---
title: Wallet Concepts
hide_title: false
---
Vega Wallet is an app that lets you manage wallets and cryptographic key pairs. Key pairs are used to sign and send transactions in a secure way. 

Read on to understand the basic concepts of wallets and keys, and how they work. 

## Cryptographic keys
Each cryptographic key pair includes a public key and a private key. 

Those keys are associated with an entity that needs to authenticate their identity, or sign and send transaction data. The signature is generated through combining the signer's private key with the data being sent in the transaction. Data that is signed with the private key can only be verified with its corresponding public key.

Signing a transaction proves the signer acknowledges a transaction is valid, and initiated by the holder of the private key. Signing with the private key is the ultimate proof to verify the authenticity of something.

The network's validator nodes check and authenticate transactions automatically as they come in.

**Public key**: A public key can be published or shared. 

**Private key**: A private is saved in your wallet file, but is never displayed and is kept secret. A private key should never be shared, and it's safer that it's also never displayed. 

## Wallet 
Key pairs are stored within an encrypted wallet file, and the information can only be accessed with a passphrase. This ensures you don't have to manage key pairs yourself, or risk exposing your private key. 

The wallet file can hold any number of key pairs, and you can have more than one wallet file, each with its own set of key pairs. When you use the Vega Wallet app to create a wallet, that wallet file and its configuration details are stored on your computer. 

— Basic Wallet diagram

### Wallet name
Since you can have more than one wallet, each wallet needs a unique name so that you can identify the wallet you want to connect with. Rather than creating auto-generated wallet names, a Vega Wallet app will prompt you to name (and create a passphrase for) every wallet you create.

When you are asked to input a wallet name in order to connect your wallet, for example on the token dApp, or Vega Console, this is to confirm which wallet you want to use, in case you have multiple wallets. You'll also need to input the passphrase for your wallet. 

—Multiply wallet diagram where each wallet has its own keys and a name. 

### Wallet passphrase
The wallet passphrase decrypts the information inside your wallet file so that you can use your key pair(s) to interact with an app. Unlocking access to your wallet via a Vega app allows you to associate VEGA, deposit collateral, and place trades, among other things. 

Every time you want to use a wallet or its keys, you’ll need to use the passphrase to unlock (decrypt) the file's information. 

— Diagram with passphrase and wallet 

### Recovery phrase
When a wallet is created using a Vega Wallet app, the app provides you with a recovery phrase. Every wallet has a recovery phrase attached to it. That recovery phrase is only displayed by the Vega Wallet app once, and it must be saved somewhere secure and private.

You may find yourself in a situation where you can't access your wallet. Perhaps you are using a different computer, or you deleted your wallet. If you delete the wallet file (for example by running the command to delete a wallet), no software will be able to interact with those keys, and thus, the assets associated with the keys. 

A wallet can be restored, as long as you have the wallet's recovery phrase. Without the recovery phrase, you cannot restore your wallet, and you lose access to those keys.

The best ways to save your recovery phrase:
* Write it down on paper and store the paper in a safe place
* Save each wallet's recovery phrase in its own file in an encrypted folder or computer

A recovery phrase is made up of a list of words. The list of words, in the order that they're displayed, store all the information needed to recover a wallet. 

As long as the exact words, in the exact order, are used to restore keys, then the calculation of the private keys will always have the same result. While a recovery phrase is displayed as a set of words to be human-readable, that set translates into a long string of data.

(Link to further reading about mnemonic phrases) 

-Recovery phrase diagram

## Signing transactions
Each transaction needs to have a digital signature attached to it, which ensures ownership of that transaction. The signature is created by your cryptographic keys. Every transaction has a different digital signature that depends on the private key of the user signing the transaction.

When signing a transaction, you'll be asked for your passphrase when you issue a transaction -- the Vega wallet software needs to access the keys to create a signature.

Once a transaction is signed and submitted using the Vega wallet, the transaction is gossiped to the validator nodes. The nodes then verify the signature using the signer's public key, and agree to execute the transaction by adding it to the block. 

—diagram of signing a transaction. User > message ‘scroll’ > choose wallet> choose key pair to stamp it > message becomes wax sealed letter (bundled with signature) > goes to Vega network  

