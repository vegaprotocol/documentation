---
title: Integrate the wallet service [rename?]
hide_title: false
sidebar_position: 2
---

This guide will walk you through how to set up the Vega  Wallet from scratch to use when building a Vega dApp, or integrating with CI/CD. 

You can find the current working CI/CD implementation in the [front-end GitHub repo ↗](https://github.com/vegaprotocol/frontend-monorepo/blob/develop/.github/actions/setup-vegawallet/action.yml).

Depending on your end-goal, you may be able to skip some steps. API token-related steps are only needed for end-to-end and CI/CD integration. Also, if you already have Vega Wallet prepared and configured, you may only need the last step to run the wallet.

1. **Create two files for your `passphrase` and `recovery` phrase** - `passphrase` will be used as a wallet and API token password (you may want to use two different ones), and `recovery` will contain recovery phrase of the wallet you want to use (you can skip it if you don’t have a wallet yet, and want to create a new one).

2. **Download and install the Vega Wallet software.** 
    There are two ways you can do that:

    a. Download the latest release of the [Vega software ↗](https://github.com/vegaprotocol/vega/releases) and unzip it to a shared location. To test if it worked, run the `vega version` command.
    
    b. Clone the [Vega repo ↗](https://github.com/vegaprotocol/vega). Make sure you have installed `go`. Read the guide for [getting started with Go for Vega ↗](https://github.com/vegaprotocol/vega/blob/develop/GETTING_STARTED.md#installing-golang) if you need help. Set up the `GOBIN` environment and add it to `PATH` (e.g. `export GOBIN="$HOME/go/bin; export PATH=$GOBIN/:$PATH`. Run `go install ./…` to install the binaries. Verify by running the command `vega version`.

3. **Initialise the wallet** using the command below to create new, fresh wallet files. 

    ```bash
        vega wallet init -f --home <WALLET_PATH>
    ```

    The `--home <WALLET_PATH>` flag sets your wallet location. Skip it in this step, and all following steps, if you want to use default location.

    The `-f` flag overwrites any existing wallet configuration at the home location.

4. **Create a new wallet or import an existing wallet or wallets.** You can create/import as many wallets as you want.
    
    a. To create a new wallet: 

    ```bash
    vega wallet create -w <WALLET_NAME> -p passphrase --home  <WALLET_PATH>
    ````

    b. To import the wallet using the recovery phrase:  
    ```bash
    vega wallet import -w <WALLET_NAME> --recovery-phrase-file recovery -p passphrase --home <WALLET_PATH>
    ```

5. **Create additional public keys** (optional) with the following command: 

    ```bash
    vega wallet key generate -w <WALLET_NAME> -p passphrase --home <WALLET_PATH>
    ````

6. **Import network config.** You can do that two ways. See more details in the [manage networks guide](../../../tools/vega-wallet/cli-wallet/latest/guides/manage-networks):
    
    a. Using the config URL: 

    ```
    vega wallet network import --from-url <CONFIG_URL> -f --home <WALLET_NAME>`.  
    ```

    The `-f` flag overwrites the config if one already exists.

    Example: To import `fairground` network use: `vega wallet network import --from-url https://github.com/vegaprotocol/networks-internal/blob/main/fairground/vegawallet-fairground.toml`.

    b. Using a file: If you want to import network config for a local Vega Capsule network use the following command:

    ```bash
    vega wallet network import --force --from-file <CONFIG_FILE> --home <WALLET_PATH>
    ```

7. If you need to **obtain a long lived token** for testing purposes, do the following:

    a. Initialise the API token with the following command: 
    
    ```bash
    vega wallet api-token init --passphrase-file passphrase --home <WALLET_PATH>
    ```
    
    b. Then, generate the API token for a single wallet: 
    
    ```bash
    vega wallet api-token generate --wallet-name <WALLET_NAME> --tokens-passphrase-file passphrase  --wallet-passphrase-file passphrase --home <WALLET_PATH>
    ````

    c. Copy the generated API token and use it in your dApp, tests, or CI. This is the token that is otherwise obtained using the `client.connect_wallet` request.

8. Now, **start the service** you need:

    a. For general purpose use, run the command: 
    
    ```bash
    vega wallet service run -n <NETWORK_NAME> --home <WALLET_PATH>
    ```

    b.  For tests or CI, a more complex command should be used:

    ```bash
    vega wallet service run -n <NETWORK_NAME> --load-tokens --tokens-passphrase-file passphrase --no-version-check --automatic-consent --home <WALLET_PATH>
    ````

    `--load-tokens` allows you to use the API token that you set up in the previous step.
    `--no-version-check` allows you to skip network compatibility verification.
    `--automatic-consent` allows the wallet to automatically approve any transactions that come from connected dApps.

Once you set up a wallet for the first time, you will probably only need to run the `service run` command and update the binaries when a new version is released. 

**If you need help using the wallet software**, use the Vega Wallet `--help` flag. If you’re stuck on a command, use `vega wallet -h` for general guidance, or, for example, `vega wallet api-token generate -h` to read details about a specific command.