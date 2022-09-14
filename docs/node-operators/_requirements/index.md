---
title: Requirements
sidebar_position: 2
---
import NetworkParameter from '@site/src/components/NetworkParameter';

There are three types of validating nodes, with progressively higher requirements. All nodes should meet the minimum [hardware requirements](requirements/hardware).

:::info
All validating nodes begin as candidates, and can be promoted for high performance.
:::

| Node type | Role | Number of positions available | Reward |
| --- | --- | --- | --- |
| [Candidate](become-a-validator/candidate) | Ready to replace a standby node if a spot opens up | Unlimited | None |
| [Standby](become-a-validator/standby) | Ready to replace an underperforming consensus node | (<NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} /> × <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />) | <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.rewardFactor" hideName={true} suffix='×' /> |
| [Consensus](become-a-validator/consensus) | Keeps the network and transactions running | <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} /> | 1 × |