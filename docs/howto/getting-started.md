---
weight: 9
title: Getting started
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started 

**Welcome!** We're super excited that you've decided to take a dive into the API how-to guides. There's some important information to learn first and then we'll jump into running a query against an API on Vega.

## Understanding authentication on Vega

To **read** information from Vega node API endpoints, **authentication is not required**. However, to **write** information (such as submitting an order) to a Vega node API, you will need to **sign your transaction messages**.

:::info
If you'd like to skip ahead, code for signing using APIs is available in the [Wallet service]({{<relref "wallet.md">}}) how-to guide and explained more deeply in the section on [signing transactions]({{<relref "../vega-wallet/signing">}}).
:::

## Your first Vega API query

Let's dive straight in and request a **list of parties** trading on Vega:

:::info
The NODE URLs for the Vega testnet are available in the [APIs]({{<relref "../apis/#what-are-the-testnet-api-server-addresses">}}) section.
:::

{{< gitpod >}}

<Tabs groupId="codesamples3">
<TabItem value="shell-rest" label="Shell (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-parties.sh#get_parties" >}}
:::

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/Parties) for further query detail.
</TabItem>
<TabItem value="python-rest" label="Python (REST)">

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-parties.py#get_parties" >}}
:::

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/Parties) for further query detail.
</TabItem>
<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```
This Python snippet code shows how to query for *parties*:

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-parties-with-Vega-API-client.py#import_client" on >}}
:::

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/get-parties-with-Vega-API-client.py#get_parties" >}}
:::

See also [gRPC API reference](/api/grpc/#datanode.api.v1.PartiesResponse) for further query detail.
</TabItem>

</Tabs>



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `parties` | A list of zero or more parties. A party includes an `id` field which contains the **public key** (pub-key) related to that party. See example response (below). |<details><summary>Example response" >}}

<details><summary>Example response</summary>

:::danger Link to GitHub
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/response-examples.txt#example_parties_response" on >}}
:::

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/parties-and-accounts/).
:::

## Introducing Gitpod to run code samples

[Gitpod](https://gitpod.io/#https://github.com/vegaprotocol/sample-api-scripts) is an open source platform for running code samples directly in a browser with a built in code editor, terminal and sand boxed environment. It allows users to "click a button" and launch a fresh virtual environment in their browser, connected to their GitHub account, and get started developing on Vega immediately.

For each of the API how-to guides in the Vega documentation, the sample code fragments are captured directly from the [Sample-API-Scripts](https://github.com/vegaprotocol/sample-api-scripts) GitHub repository. On each API how-to there is a **ready to code** button, tapping this will launch a new Gitpod instance and drop the user into that repo with access to the sample code which can be run without checking out any code locally.

### Walk through video for Gitpod



### Steps to running samples on Gitpod

* Launch the [Gitpod environment](https://gitpod.io/#https://github.com/vegaprotocol/sample-api-scripts)
* Open the file `credentials` (from file tree)
* Enter your unique testnet hosted wallet details
* Save the file
* On terminal (bottom panel) run `source credentials`
* Locate a sample file to run, for example `./sample-api-scripts/parties-and-accounts/get-parties.sh` or `python3 ./parties-and-accounts/get-accounts.py` etc. Scripts are fully editable so you can enhance or start building on Vega.
* Observe terminal output from running the scripts.

## What's next?

 * Learn how to sign transactions with [Wallet service]({{<relref "wallet.md">}}) 
 * After that, [Submit an order]({{<relref "submit-order.md">}})
