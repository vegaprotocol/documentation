---
sidebar_position: 13
title: Proposals and voting
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import GitPod from './_gitpod.mdx'

# Governance proposals and voting

:::danger Broken links
* [governance](https://docs.fairground.vega.xyz/docs/trading-questions/#governance)
* REST API reference
* GraphQL API reference
* gRPC API reference
:::

## Introduction

Members of the Vega community can view current governance proposals and choose to vote *for them*, or *against them*, using the governance asset of the network. For further background and explanation, please see the section on [governance](../trading-questions.md#governance).

If you're looking specifically for a guide on how to create and propose a **new market** on Vega, please see the end-to-end API how-to guide on [Market Creation](create-market.md).

## How do I see a list of proposals?

Connect to a Vega API server, and request a *list of proposals*:  

<GitPod />

<Tabs groupId="codesamples1">

<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#L91-L95
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetNewMarketProposals) for further query detail.
  
</TabItem>

<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of governance proposals*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L53-L56
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L89-L92
```

See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalsRequest) for further query detail.

</TabItem>

<TabItem value="shell-graphql" label="Shell (GraphQL)">

Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to query for a *list of proposals*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#L30-L62
```

  See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L73) for further query detail.
</TabItem>

</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposals` | A list of zero or more proposals from the Vega network. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#L2-L64
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

## How do I see the status of a specific proposal?

Connect to a Vega API server, and request a *proposal by identifier*:  

<GitPod />

<Tabs groupId="codesamples2">

<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#L119-L123
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetProposalByID) for further query detail.

</TabItem>

<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *proposal by identifier*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L53-L56
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L115-L118
```

See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalByIDRequest) for further query detail.

</TabItem>

<TabItem value="shell-graphql" label="Shell (GraphQL)">

Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to request a *proposal by identifier*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#L70-L102
```

  See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L82) for further query detail.
</TabItem>

</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposal` | A proposal record will be returned if one is found matching the given identifier. Fields including `state` and `[yes/no]votes` will be returned for the proposal allowing a user to fully examine the current status. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#L2-L64
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

## How do I list proposals for a party (public key)?

Connect to a Vega API server, and request *proposals for a party*:  

<GitPod />

<Tabs groupId="codesamples3">

<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#L107-L111
```

See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetProposalsByParty) for further query detail.

</TabItem>

<TabItem value="python-grpc" label="Python (gRPC)">

Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of governance proposals*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L53-L56
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#L115-L118
```

See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalsByPartyRequest) for further query detail.

</TabItem>

<TabItem value="shell-graphql" label="Shell (GraphQL)">

Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to query for a *list of proposals*:

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#L110-L144
```

See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L25) for further query detail.

</TabItem>

</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposals` | A list of zero or more proposals from the Vega network. |

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#L2-L64
```

</details>

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

## How do I vote for a proposal?

Voting for a proposal requires the use of staking tokens in the wallet owned by the calling party (public key). The minimum amount required is set in the [network parameters](create-market.md#where-do-i-find-the-current-network-parameters) (see values ending in `minVoterBalance`).

:::info
At present the Vega testnet uses the **VEGA (testnet)** token for governance.  
Additionally, when a [Vega testnet network reset](../testnet.md#will-the-testnet-be-reset) occurs, any user proposals including votes will be reset.
:::

For more information on how to check for token balances (including any used for governance/staking), please see the guide to retrieve party [positions and balances](positions-balances.md).

### Log in to wallet and get public key

See the section on the [Wallet service](wallet.md) to learn how to log in, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/) repo.
:::

### Vote for Proposal

After locating a proposal (`proposal_id`) using the listing calls shown above, to vote either **for** (YES) or **against** (NO), simply connect to a Vega API server and submit a vote for a *proposal*:

<GitPod />

<Tabs groupId="codesamples4">
<TabItem value="python-rest" label="Python (REST)">

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#L151-L155
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#L381-L389
```

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#L396-L400
```

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/PrepareVote) for further query detail.
</TabItem>
</Tabs>

If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A signed transaction message containing the vote data. In the same way as the market proposal message, if `propagate` is set to **true**, the signed data will be automatically forwarded by the wallet server to a node.

<details><summary>Example response</summary>

```js reference
https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/response-examples.txt#L19-L32
```

</details>



## What's next?

 * Learn about [Streaming events](event-stream.md)
 * How to find and estimate [Trading fees](fees.md)
