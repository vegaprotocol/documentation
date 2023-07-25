---
title: Deposit assets
sidebar_position: 2
hide_title: false
description: How to deposit assets from an Ethereum wallet to Vega.
vega_network: TESTNET
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import NetworkParameter from '@site/src/components/NetworkParameter';
import EthAddresses from '@site/src/components/EthAddresses';

## Manually depositing using Etherscan

### What you need
You'll need the following information available:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset

### Bridge address 
The ERC-20 bridge logic address shown is for the Ethereum network that is compatible with the Vega network these docs are pointing to. 

<EthAddresses frontMatter={frontMatter} show={["ERC20Bridge"]} />

Contract and bridge addresses for the **validator-run testnet networks**, and for **mainnet**, in the [networks repo on GitHub ↗](https://github.com/vegaprotocol/networks).

### Confirm asset
Ensure the token you want to deposit is listed:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Read Contract"
* Click "is_asset_listed"
* Paste in the ERC20 token address and click "Query"
* Ensure the result says "true"

### Approve spend
Approve bridge to 'spend' the token:

* Go to etherscan.io/address/[erc20_token_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "approve"
* Under "spender" paste the erc20_bridge_logic_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeros to account for the asset's decimals)
* Click "Write" and follow the wallet prompts

### Run deposit function
Run the deposit asset function:

* Go to etherscan.io/address/[erc20_bridge_logic_address]
* Click "Contract"
* Click "Write Contract"
* Click "Connect to Web3" and follow instructions
* Click "deposit_asset"
* Under "asset_source" paste in erc20_token_address
* Under "amount" enter the amount you want to deposit (ensure the correct number of zeros)
* Under "vega_public_key" paste in your Vega wallet public key
* Click "Write" and follow the wallet prompts

✅ Your deposit is then complete and your assets will be available to use on Vega.


## Code samples for depositing
If you want to build a UI or script for depositing, see the following code samples to get started with building your integration.

The code samples below use testnet networks on Vega and Ethereum to approve and deposit testnet VEGA.

:::warn Keep your keys safe
Don't save your private key in GitHub or any other publicly available place.
:::

### What you need
Collect the following information:
* Vega public key you want to deposit to
* ERC-20 bridge logic address
* Token address for the asset
* Bridge smart contract ABI in JSON
* Ethereum chain ID

To get the contract ABI JSON
1. Visit the smart contract. Confirm you are using the correct smart contract.
* [Sepolia testnet]
* [Ethereum mainnet](https://etherscan.io/address/0x23872549cE10B40e31D6577e0A920088B0E0666a#code)
2. Scroll down to Contract ABI
3. Click on Export ABI and choose JSON Format

You'll also need to have set up an Infura, Pokt or another Ethereum rpc endpoint.

### JavaScript code samples 

### Approve spend

```
const { ethers, Contract, Wallet } = require("ethers");
const tokenABI = require("./abis/erc20.json");

// you'll need an Ethereum rpc endpoint
const URL = "https://sepolia.infura.io/v3/<your infura key>";

// the Ethereum chain you are interacting with
const ETHEREUM_CHAIN_ID = 11155111; // sepolia

// Ethereum wallet private key
const PRIVATE_KEY = "<your private key>";

// testnet VEGA
const ASSET_ADDRESS = "0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9";

// spender is the collateral bridge address
const SPENDER = "0xcC68d87cAEF9580E3F383d6438F7B3F2C71E3fe5";

// amount in lowest denomination this is equivalent to
// 0.000000000000000001 VEGA
const AMOUNT = "1";

// create json rpc provider
const provider = new ethers.JsonRpcProvider(URL, ETHEREUM_CHAIN_ID);

// create signer
const signer = new Wallet(PRIVATE_KEY, provider);

// instantiate token contract
const tokenContract = new Contract(ASSET_ADDRESS, tokenABI, signer);

const tx = await tokenContract.approve(SPENDER, AMOUNT);

console.log("approve tx", tx);
```

### Run deposit

```
const { ethers, Contract, Wallet } = require("ethers");
const collateralABI = require("./abis/collateral-bridge.json");

// you'll need an ethereum rpc endpoint
const URL = "https://sepolia.infura.io/v3/<your infura key>";

// the Ethereum chain you are interacting with
const ETHEREUM_CHAIN_ID = 11155111; // sepolia

// address of the Vega collateral bridge smart contract
const VEGA_COLLATERAL_BRIDGE_ADDRESS =
  "0xcC68d87cAEF9580E3F383d6438F7B3F2C71E3fe5";

// Ethereum wallet private key
const PRIVATE_KEY = "<your private key>";

// testnet VEGA
const ASSET_ADDRESS = "0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9";

// amount in lowest denomination this is equivalent to
// 0.000000000000000001 VEGA
const AMOUNT = "1";

// public key you wish to send assets to
const VEGA_PUBLIC_KEY =
  "a4b6e3de5d7ef4e31ae1b090be49d1a2ef7bcefff60cccf7658a0d4922651cce";

// create json rpc provider
const provider = new ethers.JsonRpcProvider(URL, ETHEREUM_CHAIN_ID);

// create signer
const signer = new Wallet(PRIVATE_KEY, provider);

// instantiate bridge contract
const bridgeContract = new Contract(
  VEGA_COLLATERAL_BRIDGE_ADDRESS,
  collateralABI,
  signer
);

// Amount must be lowest denomination.
// Note, you won't see the asset on your Vega key immediately because
// you must wait for the necessary number of confirmations on the Ethereum
// chain. This is set by the network parameter blockChains.ethereumConfig.confirmations.
// You must wait for Vega to pick up the successful deposit and credit your account
const tx = await bridgeContract.deposit_asset(
  ASSET_ADDRESS,
  AMOUNT,
  "0x" + VEGA_PUBLIC_KEY
);

console.log("deposit tx", tx);
```


### Python [WIP]

steps:
1. set up web3 object (tutorial etc code that someone else has done, ideally connecting to infura)
2. create the contract object from web3 (which contract you want to work with)
3. contractobject . function . build transaction (working with the contract)

this part actually takes care of both doing deposit and checking if it appears in vega
```
def erc20_deposits(
        self, context, token, trader, trader_eth, amount, confirm_event=True, confirm_wallet=True, already_scaled=False
    ):
        logging.info("erc20 Token deposit - start")
        if "str" in str(type(token)):
            token = Token(token)
        erc20_asset_id = self.get_vega_asset_id(token.address).strip("0x")
        pre_deposit_balance = accountsMod.GetPartyAccountBal(context, trader, "General", erc20_asset_id)
        pubkey = context["pubkeys"][trader]
        if not already_scaled:
            deposit_amt = token.erc20_token_formatter(fixed=amount)
        else:
            deposit_amt = amount
        logging.info(f"ERC20 Deposit {deposit_amt=} from eth account {trader_eth=} to {pubkey=}")

        start = get_time()
        deposit_logs = self.erc20_deposit_workflow(
            token, wallet_public_key=pubkey, test_eth_account=trader_eth, no_of_tokens_to_mint_override=deposit_amt
        )


    @timefunc
    def erc20_deposit_workflow(
        self,
        token, (object that represents the token - internal, includes address)
        wallet_public_key, (vega wallet)
        eth_account, (eth key to deposit from)
    ):
        asset_id = self.get_vega_asset_id(token.address)
        # Get balance of account [0] wallet

        pre_issue_eth_token_balance = token.getTokenWalletBalance(test_eth_account)
        logging.info(f"Token pre-issue balance={pre_issue_eth_token_balance}")
        if no_of_tokens_to_mint_override is not None:
            tokens = no_of_tokens_to_mint_override
        else:
            tokens = token.erc20_token_formatter()  # generate random tokens#

```

```
# use token contract to approve the bridge to spend
        approval_receipt = token.approve_transaction(self.address, tokens, test_eth_account)
        assert approval_receipt.status == 1, "unable to get receipt for erc20 token approval"
# use bridge contract instance to deposit tokens
        deposit_receipt, txn_hash = self.depositTokentoVegaWallet(
            token.address, tokens, wallet_public_key, test_eth_account
        )
        assert txn_hash, f"Failed to deposit ERC20 token with error: {deposit_receipt}"
```

the python bit
```
    def approve_transaction(self, contract_address, tokens_to_approve, ethereum_wallet, signer_key=None, timeout=10):
        """
        With erc20 token, it's very rare that you as the user iniate moving funds.
        it's usually another contract which is gonna transfer funds from your wallet to somewhere else.
        So we tell the contract of the erc20 token (e.g: DAI) that contract at address 0x....
        is allowed to transfer tokens from your eth wallet for a given amount.
        """
        txn_hash = None
        try:
            if signer_key is not None:  # Ganache, or hosted key case.
                txn = self.instance.functions.approve(contract_address, tokens_to_approve).build_transaction(
                    {
                        "from": ethereum_wallet,
                        "nonce": get_w3().eth.get_transaction_count(ethereum_wallet),
                        "gas": 75000,  # Apparently a reasonable upper limit for this transaction
                    }
                )
                signed_txn = get_w3().eth.account.sign_transaction(txn, signer_key)
                txn_hash = get_w3().eth.send_raw_transaction(signed_txn.rawTransaction)
            else:
                txn_hash = self.instance.functions.approve(contract_address, tokens_to_approve).transact(
                    {"from": ethereum_wallet}
                )
        except exceptions.ContractLogicError as exc:
            raise Exception(
                f"ContractLogicError / failed to approve {tokens_to_approve} contract {contract_address} using {ethereum_wallet} {exc}"
            ) from exc
        except Exception as error:
            raise Exception(
                f"failed to approve {tokens_to_approve} contract {contract_address} using {ethereum_wallet} {error}"
            ) from error

        approve_receipt = None
        count = 0
        while approve_receipt is None and (count < timeout):
            logging.debug("No receipt")
            try:
                count += 1
                approve_receipt = get_w3().eth.get_transaction_receipt(txn_hash)
                break
            except exceptions.ContractLogicError as error:
                logging.info(
                    f"get_w3().eth.get_transaction_receipt {txn_hash.hex()} produces ContractLogicError {error}"
                )
                pass
            except Exception as err:
                logging.info(f"get_w3().eth.get_transaction_receipt wia{txn_hash.hex()} produces error {err}")
                pass
            time.sleep(0.2)
        assert approve_receipt is not None, f"No contract receipt found for txn_hash {txn_hash.hex()}"
        assert approve_receipt.status == 1
        logging.info(f"Contract receipt generated with completed status")
        logging.info(f"Ethereum address {ethereum_wallet} approves transfer of {tokens_to_approve} tokens")
        event = self.process_approval_receipt(approve_receipt)
        assert event["value"] == tokens_to_approve
        return approve_receipt
        ```


        ```
            def process_approval_receipt(self, receipt):
        logging.info("Waiting for logs from approval receipt...")
        c = 0
        logs = None
        log_dict = {}
        while c < 25 and logs is None:
            logs = self.instance.events.Approval().process_receipt(receipt)
            logs_args = logs[0].get("args")
            log_dict = dict(logs_args)
            c += 1
            time.sleep(0.2)
        assert log_dict is not {}
        logging.info(f"Received logs from approval receipt...took {c} attempt(s)")
        return log_dict
        ```


  try:
            if signer_key is not None:  # Ganache, or hosted key case.
                txn = self.instance.functions.approve(contract_address, tokens_to_approve).build_transaction(
                    {
                        "from": ethereum_wallet,
                        "nonce": xxxxxxxxx, # Choose a nonce that's used only once for this transaction
                        "gas": XXXXXXX,  # Choose a reasonable upper limit for this transaction
                    }
                )
                signed_txn = get_w3().eth.account.sign_transaction(txn, signer_key)
                txn_hash = get_w3().eth.send_raw_transaction(signed_txn.rawTransaction)
            else:
                txn_hash = self.instance.functions.approve(contract_address, tokens_to_approve).transact(
                    {"from": ethereum_wallet}
                )

```