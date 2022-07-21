---
weight: 10
title: Vega Wallet
---
# How to use Vega Wallet APIs

## Introduction

To submit orders and other commands on Vega, users need to sign transactions with a private and public key pair. Users on Vega are pseudonymous and are referenced by their public keys. To assist with API integration there is a **REST API service** served from the Vega Wallet software providing signing and key management. 

:::info
For more detail on how keys or signing work on a Vega network, see the section on [Wallets and Signing](../../vega-wallet/signing).
:::

The Vega Wallet software can store many wallets, and each wallet can store many key pairs. 

Common actions for a wallet include; **logging in**, **retrieving a key pair** and **signing transactions** (such as an order submission). There are several useful how-to guides below that will help with management of keys and signing.


## Logging in to an existing wallet

Connect to a Vega Wallet server and log in. This can be either a hosted wallet, one you run yourself locally or stored in the cloud. The resulting `token` will be used to authenticate with the wallet for other actions (such as signing):

{{< columns >}}

{{< gitpod >}}

{{< tabs "codesamples1" >}}
{{< tab "Shell (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#login_wallet" >}}

  See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.
{{< /tab >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#login_wallet" >}}

  See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.
{{< /tab >}}
{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *log in to an existing wallet*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#login_wallet" >}}

  See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `token` | A JSON Web Token (JWT) used to provide authentication with methods on the wallet service (pass in headers as Bearer token). |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#example_login_wallet_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

{{< /columns >}}

## Creating a new wallet

Connect to a wallet server to create a new wallet. As mentioned earlier, this can be either a hosted wallet, one you run yourself locally or stored in the cloud. Just like logging in, once a new wallet has been created, a `token` will be returned and it will be used to authenticate with the wallet for other actions (such as signing):

{{< columns >}}

{{< gitpod >}}

{{< tabs "codesamples2" >}}
{{< tab "Shell (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#create_wallet" >}}

  See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.
{{< /tab >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#create_wallet" >}}

  See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.
{{< /tab >}}
{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *create a new wallet*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#create_wallet" >}}

  See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `token` | A JSON Web Token (JWT) used to provide authentication with methods on the wallet service (pass in headers as Bearer token). |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#example_create_wallet_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

{{< /columns >}}

## Generating a new private and public key pair

Once authenticated with Vega Wallet, it is possible to generate one or more new key pairs (private and public keys) to sign transactions for the Vega network. For detailed information on key pairs, see the section on [Wallets and Signing](../wallets-and-deposits/wallet#what-is-a-key-pair). Note that the private key is *not* returned. Your public key will be used as your `party` identifier on Vega:

{{< columns >}}

{{< gitpod >}}

{{< tabs "codesamples3" >}}
{{< tab "Shell (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#generate_keypair" >}}

  See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.
{{< /tab >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#generate_keypair" >}}

  See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.
{{< /tab >}}
{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *generate a new key pair*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#generate_keypair" >}}

  See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `algo` | The encryption algorithm used. |
| `meta` | Any meta-data associated with the public/private key pair. As passed with the creation request. |
| `pub` | The public key value. |
| `tainted` | `true` if the key is tainted, `false` otherwise. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#example_generate_keypair_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

{{< /columns >}}

## Listing key pairs for a wallet

Retrieve a list of all key pairs for a wallet. Note that private keys are *not* returned:

{{< columns >}}

{{< gitpod >}}

{{< tabs "codesamples4" >}}
{{< tab "Shell (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#get_keys" >}}

  See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.
{{< /tab >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#get_keys" >}}

  See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.
{{< /tab >}}
{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for *key pairs*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#get_keys" >}}

  See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `keys` | A list of zero or more keys for the authenticated wallet. *See example response (below)*. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#example_get_keys_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

{{< /columns >}}

## Signing a transaction

Connect and call sign transaction on a Vega Wallet server. Note: it is possible to set the `propagate` field to `true`. This instructs the wallet to submit the signed transaction directly to the Vega node specified in its config file:

{{< columns >}}

{{< gitpod >}}

{{< tabs "codesamples5" >}}
{{< tab "Shell (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#sign_tx" >}}

  See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.
{{< /tab >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#sign_tx" >}}}

  See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.
{{< /tab >}}
{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *sign a transaction*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#sign_tx" >}}

  See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `sig` | The signature info including encryption algorithm and version. |
| `tx` | Base64 encoded Vega command message e.g. `OrderSubmission`, `OrderAmendment`, etc. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#example_sign_tx_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

{{< /columns >}}

## What's next?
* Learn how to [Submit an order]({{<relref "submit-order.md">}}) or [Cancel orders]({{<relref "cancel-order.md">}}).
