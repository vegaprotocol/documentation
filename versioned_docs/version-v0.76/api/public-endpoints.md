---
sidebar_position: 5
title: Public API servers
hide_title: false
description: Vega's APIs are served over public addresses.
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Servers for Vega APIs
Due to the distributed nature of Vega, most of the APIs are served from a data node, and a few from a core node. This means there is no single API server, and users will need to choose a node to connect to.

This differs from centralised services, as you can't connect to an API server run by a single company, nor does it require a specific access token. When you want to perform an action on the network you'll need to sign the message containing the transaction details with a [wallet app](../tools/vega-wallet/index.md) or a signer library.

Validators, community members, and other service providers may operate public data nodes. These may have usage restrictions, rate limits, limited data retention, or other restrictions or terms. Check with the individual operator if you have specific needs.

Below, find a list of all the known public servers available for this network, and use them to connect to the API endpoints.

:::note Read more
[Data nodes](../concepts/vega-chain/data-nodes.md): Find out what a data node is, and if setting one up for yourself is right for you.
:::

## Node API servers: Fairground
<DataNodes frontMatter={frontMatter} />

## Node API servers: Validator testnet

<Tabs groupId="servers">
<TabItem value="REST" label="REST">

| Name        | Address     |
| ----------- | ----------- |
| api-validators-testnet | `https://api-validators-testnet.vega.rocks/` |
| rest.venom.tm.p2p.org | `https://rest.venom.tm.p2p.org` |
| vega-testnet.anyvalid.com | `https://vega-testnet.anyvalid.com` |
| testnet.vega.xprv.io/datanode | `https://testnet.vega.xprv.io/datanode` |
| rest.venom.tm.p2p.org | `https://rest.venom.tm.p2p.org` |
| vega-testnet.nodes.guru:3008 | `https://vega-testnet.nodes.guru:3008` |
| testnet.vega.greenfield.xyz | `https://testnet.vega.greenfield.xyz` |
| vega-testnet-data.commodum.io | `https://vega-testnet-data.commodum.io` |
| vega-rest.testnet.lovali.xyz | `https://vega-rest.testnet.lovali.xyz` |
| vega-test-data.bharvest.io | `https://vega-test-data.bharvest.io:3009` |

</TabItem>

<TabItem value="GraphQL" label="GraphQL">

| Name        | Address     |
| ----------- | ----------- |
| api-validators-testnet | `https://api-validators-testnet.vega.rocks/graphql/`|
| gql.venom.tm.p2p.org | `https://gql.venom.tm.p2p.org/graphql`|
| vega-testnet.anyvalid.com/graphql | `https://vega-testnet.anyvalid.com/graphql`|
| testnet.vega.xprv.io/datanode/query | `https://testnet.vega.xprv.io/datanode/query`|
| vega-testnet.anyvalid.com/graphql | `https://vega-testnet.anyvalid.com/graphql`|
| vega-testnet.nodes.guru | `https://vega-testnet.nodes.guru:3008/graphql`|
| testnet.vega.greenfield.xyz | `https://testnet.vega.greenfield.xyz/graphql`|
| vega-testnet-data.commodum.io | `https://vega-testnet-data.commodum.io/graphql`|
| vega-query.testnet.lovali.xyz | `https://vega-query.testnet.lovali.xyz:433/query`|
| vega-test-data.bharvest.io/graphql | `https://vega-test-data.bharvest.io/graphql`|

</TabItem>

<TabItem value="gRPC" label="gRPC">

| Name        | Address     |
| ----------- | ----------- |
| api.validators-testnet      | `api.validators-testnet.vega.rocks:3007`|
| grpc.venom.tm.p2p.org | `tls://grpc.venom.tm.p2p.org:443` |
| vega-testnet.anyvalid.com | `vega-testnet.anyvalid.com:3007`|
| testnet.grpc.vega.xprv.io | `tls://testnet.grpc.vega.xprv.io:443`|
| vega-testnet.nodes.guru | `vega-testnet.nodes.guru:3007`|
| testnet.vega.greenfield.xyz | `testnet.vega.greenfield.xyz:3007`|
| vega-testnet-data.commodum.io | `vega-testnet-data.commodum.io:3007`|
| vega-grpc.testnet.lovali.xyz | `tls://vega-grpc.testnet.lovali.xyz:433`|
| vega-test-data.bharvest.io | `vega-test-data.bharvest.io:3007`|

</TabItem>
</Tabs>