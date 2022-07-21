---
weight: 94
title: Proposals and voting
---
# Governance proposals and voting

## Introduction

Members of the Vega community can view current governance proposals and choose to vote *for them*, or *against them*, using the governance asset of the network. For further background and explanation, please see the section on [governance]({{<relref "../trading-questions.md#governance">}}).

If you're looking specifically for a guide on how to create and propose a **new market** on Vega, please see the end-to-end API how-to guide on [Market Creation]({{<relref "create-market.md">}}).

## How do I see a list of proposals?

Connect to a Vega API server, and request a *list of proposals*:  

{{< columns >}}
{{< gitpod >}}

{{< tabs "codesamples1" >}}

{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#get_proposals" >}}

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetNewMarketProposals) for further query detail.
{{< /tab >}}

{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of governance proposals*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#get_proposals" >}}

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalsRequest) for further query detail.
{{< /tab >}}

{{< tab "Shell (GraphQL)" >}}
Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to query for a *list of proposals*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#get_proposals" >}}

  See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L73) for further query detail.
{{< /tab >}}

{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposals` | A list of zero or more proposals from the Vega network. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#example_proposals_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

{{< /columns >}}

## How do I see the status of a specific proposal?

Connect to a Vega API server, and request a *proposal by identifier*:  

{{< columns >}}
{{< gitpod >}}

{{< tabs "codesamples2" >}}

{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#get_proposal_detail" >}}

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetProposalByID) for further query detail.
{{< /tab >}}

{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *proposal by identifier*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#get_proposal_detail" >}}

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalByIDRequest) for further query detail.
{{< /tab >}}

{{< tab "Shell (GraphQL)" >}}
Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to request a *proposal by identifier*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#get_proposal_detail" >}}

  See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L82) for further query detail.
{{< /tab >}}

{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposal` | A proposal record will be returned if one is found matching the given identifier. Fields including `state` and `[yes/no]votes` will be returned for the proposal allowing a user to fully examine the current status. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#example_proposals_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

{{< /columns >}}

## How do I list proposals for a party (public key)?

Connect to a Vega API server, and request *proposals for a party*:  

{{< columns >}}
{{< gitpod >}}

{{< tabs "codesamples3" >}}

{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals.py#get_proposals_by_party" >}}

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/GetProposalsByParty) for further query detail.
{{< /tab >}}

{{< tab "Python (gRPC)" >}}
Make sure `vegaapiclient` is installed (from [PyPI](https://pypi.org/project/Vega-API-client/)):

```shell
pip install --upgrade Vega-API-client
```

This Python snippet code shows how to query for a *list of governance proposals*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#import_client" on >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-with-Vega-API-client.py#get_proposals_by_party" >}}

  See also [gRPC API reference](/api/grpc/#datanode.api.v1.GetProposalsByPartyRequest) for further query detail.
{{< /tab >}}

{{< tab "Shell (GraphQL)" >}}
Make sure `graphqurl` is installed (from [GitHub](https://github.com/hasura/graphqurl)):

```shell
npm install -g graphqurl
```

This snippet code shows how to query for a *list of proposals*:

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/manage-proposals-gql.sh#get_proposals_by_party" >}}

  See also [GraphQL API reference](/api/graphql/data-node/query.doc.html#L25) for further query detail.
{{< /tab >}}

{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `proposals` | A list of zero or more proposals from the Vega network. |

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/response-examples.txt#example_proposals_response" on >}}

{{< /expand >}}

:::info
For full example code, please visit the [repo on GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-votes/).
:::

{{< /columns >}}

## How do I vote for a proposal?

Voting for a proposal requires the use of staking tokens in the wallet owned by the calling party (public key). The minimum amount required is set in the [network parameters]({{<relref "create-market.md#where-do-i-find-the-current-network-parameters">}}) (see values ending in `minVoterBalance`).

:::info
At present the Vega testnet uses the **VEGA (testnet)** token for governance.  
Additionally, when a [Vega testnet network reset]({{<relref "../testnet.md#will-the-testnet-be-reset">}}) occurs, any user proposals including votes will be reset.
:::

For more information on how to check for token balances (including any used for governance/staking), please see the guide to retrieve party [positions and balances]({{<relref "positions-balances.md">}}).

### Log in to wallet and get public key

See the section on the [Wallet service]({{<relref "wallet.md">}}) to learn how to log in, list keys and select a public key.  

:::info
For a working **wallet example** used by this how-to guide, please visit the [API Samples GitHub](https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/) repo.
:::

### Vote for Proposal

After locating a proposal (`proposal_id`) using the listing calls shown above, to vote either **for** (YES) or **against** (NO), simply connect to a Vega API server and submit a vote for a *proposal*:  

{{< columns >}}
{{< gitpod >}}

{{< tabs "codesamples4" >}}
{{< tab "Python (REST)" >}}
  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#get_time" on >}}
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#prepare_vote" on >}}
{{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/propose-vote-enact-market.py#sign_tx_vote" >}}

  See also [REST API reference](/api/rest/data-node/api/v1/trading_data.html#operation/PrepareVote) for further query detail.
{{< /tab >}}
{{< /tabs >}}



If successful, the response will include:

| Field          |  Description  |
| :----------------- | :------------- |
| `signature` | A signed transaction message containing the vote data. In the same way as the market proposal message, if `propagate` is set to **true**, the signed data will be automatically forwarded by the wallet server to a node.

{{< expand "Example response" >}}

  {{< github-embed "https://github.com/vegaprotocol/sample-api-scripts/blob/master/propose-markets/response-examples.txt#example_sign_tx_vote_response" on >}}

{{< /expand >}}

{{< /columns >}}

## What's next?

 * Learn about [Streaming events]({{<relref "event-stream.md">}})
 * How to find and estimate [Trading fees]({{<relref "fees.md">}})
