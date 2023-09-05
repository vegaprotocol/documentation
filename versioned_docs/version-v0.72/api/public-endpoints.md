---
sidebar_position: 5
title: Public endpoints
hide_title: false
description: Vega's APIs are served over public endpoints.
vega_network: MAINNET
---

import Topic from '/docs/topics/_topic-development.mdx'
import DataNodes from '@site/src/components/DataNodes';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Due to the distributed nature of Vega, most of the APIs are served from a data node, and a few from a core node. This means there is no single API server, and users will need to choose a node to connect to.

This differs from centralised services, as you can't connect to an API server run by a single company, nor does it require a specific access token. When you want to perform an action on the network you'll need to sign the message containing the transaction details with a [wallet app](../tools/vega-wallet/index.md) or a signer library.

Validators, community members, and other service providers may operate public data nodes. These may have usage restrictions, rate limits, limited data retention, or other restrictions or terms. Check with the individual operator if you have specific needs.

Below, find a list of all the known public servers available for this network, and use them to connect to the API endpoints.

:::note Read more
[Data nodes](../concepts/vega-chain/data-nodes.md): Find out what a data node is, and if setting one up for yourself is right for you.
:::

## Node API endpoints: Mainnet
<DataNodes frontMatter={frontMatter} />
