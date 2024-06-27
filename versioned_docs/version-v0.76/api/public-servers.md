---
sidebar_position: 5
title: Public servers
hide_title: false
description: Vega's APIs are served over public addresses.
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Due to the distributed nature of Vega, to submit API requests you'll need to choose a node address to connect to, as there is no single API server. You do not need an API key or authentication to connect.

This differs from centralised services, as you can't connect to an API server run by a single company, nor does it require a specific access token. When you want to perform an action on the network you'll need to sign the message containing the transaction details with a [wallet app](../tools/vega-wallet/index.md) or a signer library.

Validators, community members, and other service providers may operate public data nodes. These may have usage restrictions, rate limits, limited data retention, or other restrictions or terms. Check with the individual operator if you have specific needs.

Below, find a list of all the known public servers available for this network, and use them to connect to the API endpoints.

:::note Read more
[Data nodes](../concepts/vega-chain/data-nodes.md): Find out what a data node is, and if setting one up for yourself is right for you.
:::

## Node API endpoints: Mainnet
<DataNodes frontMatter={frontMatter} />