---
sidebar_position: 3
title: Vega Wallet
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# How to use Vega Wallet APIs

:::danger Broken links
* Wallet API reference
* All Python (gRPC) code excerpts
:::

## Introduction

To submit orders and other commands on Vega, users need to sign transactions with a private and public key pair. Users on Vega are pseudonymous and are referenced by their public keys. To assist with API integration there is a **REST API service** served from the Vega Wallet software providing signing and key management. 

:::info
For more detail on how keys or signing work on a Vega network, see the section on [Wallets and Signing](../../vega-wallet/signing).
:::

The Vega Wallet software can store many wallets, and each wallet can store many key pairs. 

Common actions for a wallet include; **logging in**, **retrieving a key pair** and **signing transactions** (such as an order submission). There are several useful how-to guides below that will help with management of keys and signing.


## Logging in to an existing wallet

Connect to a Vega Wallet server and log in. This can be either a hosted wallet, one you run yourself locally or stored in the cloud. The resulting `token` will be used to authenticate with the wallet for other actions (such as signing):

<GitPod />

<Tabs groupId="codesamples1">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#L46-L50
```

See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#L61-L65
```

See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.

</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *log in to an existing wallet*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#login_wallet
```

  See also [Wallet API reference](/wallet-api/#logging-in-to-a-wallet) for further query detail.
</TabItem>
</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `token` | A JSON Web Token (JWT) used to provide authentication with methods on the wallet service (pass in headers as Bearer token). |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#L10-L13
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

## Creating a new wallet

Connect to a wallet server to create a new wallet. As mentioned earlier, this can be either a hosted wallet, one you run yourself locally or stored in the cloud. Just like logging in, once a new wallet has been created, a `token` will be returned and it will be used to authenticate with the wallet for other actions (such as signing):

<GitPod />

<Tabs groupId="codesamples2">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#L46-L50
```

See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#L46-L50
```

See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.

</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *create a new wallet*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#create_wallet
```

See also [Wallet API reference](/wallet-api/#create-a-wallet) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `token` | A JSON Web Token (JWT) used to provide authentication with methods on the wallet service (pass in headers as Bearer token). |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#L2-L5
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

## Generating a new private and public key pair

Once authenticated with Vega Wallet, it is possible to generate one or more new key pairs (private and public keys) to sign transactions for the Vega network. For detailed information on key pairs, see the section on [Wallets and Signing](../wallets-and-deposits/wallet#what-is-a-key-pair). Note that the private key is *not* returned. Your public key will be used as your `party` identifier on Vega:

<GitPod />

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#L58-L62
```

See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#L70-L84
```

See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.

</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *generate a new key pair*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#generate_keypair
```

See also [Wallet API reference](/wallet-api/#generate-a-new-key-pair) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `algo` | The encryption algorithm used. |
| `meta` | Any meta-data associated with the public/private key pair. As passed with the creation request. |
| `pub` | The public key value. |
| `tainted` | `true` if the key is tainted, `false` otherwise. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#L18-L29
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

## Listing key pairs for a wallet

Retrieve a list of all key pairs for a wallet. Note that private keys are *not* returned:

<GitPod />

<Tabs groupId="codesamples4">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#L72-L75
```

See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#L89-L96
```

See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.

</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for *key pairs*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#get_keys
```

See also [Wallet API reference](/wallet-api/#list-keys) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `keys` | A list of zero or more keys for the authenticated wallet. *See example response (below)*. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#L34-L55
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::

## Signing a transaction

Connect and call sign transaction on a Vega Wallet server. Note: it is possible to set the `propagate` field to `true`. This instructs the wallet to submit the signed transaction directly to the Vega node specified in its config file:

<GitPod />

<Tabs groupId="codesamples5">
<TabItem value="shell-rest" label="Shell (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.sh#L89-L103
```

See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.

</TabItem>
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet.py#L115-L127
```

See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.

</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to *sign a transaction*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#import_client
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/wallet-with-Vega-API-client.py#sign_tx
```

See also [Wallet API reference](/wallet-api/#sign-a-transaction) for further query detail.

</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `sig` | The signature info including encryption algorithm and version. |
| `tx` | Base64 encoded Vega command message e.g. `OrderSubmission`, `OrderAmendment`, etc. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/response-examples.txt#L71-L79
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/wallet/).
:::



## What's next?
* Learn how to [Submit an order](submit-order.md) or [Cancel orders](cancel-order.md).
