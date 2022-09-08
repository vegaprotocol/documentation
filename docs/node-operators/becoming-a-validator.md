---
sidebar_position: 2
title: Becoming a validator
hide_title: false
---
import NetworkParameter from '@site/src/components/NetworkParameter';

There are strict criteria for validators on Vega.

## Set up a validating node and announce it on chain
Set up and run a node (an implementation of the Vega protocol) then submit a transaction using your keys.

 receive a response that the network has verified key ownership (see below)

How to set up a node ↗

## Self stake
You must stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" hideName={true} formatter="governanceToken" suffix="tokens"/> that you own.

When staking, you must use the same key you used to set up the node.

Your stake and rewards can be boosted if other token holders delegate to you once the network is live.

## Create a validator profile and share with the community
Describe the experience you have, security practices and policies, how you will ensure maximum uptime (reliability), how you'll meet suitable performance standards, share your communication channels for questions and the role you intend to take in Vega's governance. Share your profile with the community to attract staker delegation.

[Create a validators profile on the forum ↗](https://community.vega.xyz/c/mainnet-validator-candidates/23)

[Join the Validators Discord channel ↗](https://discord.com/channels/720571334798737489/869236034116943903)

## Become a standby validator 
Validators have a pending status until they have a high enough validator score to become a standby validator (limited to [0] x the number of consensus validators). Standby validators and the tokenholders who stake them, receive a portion of the rewards based on the stake they have as an incentive for readiness to become a consensus validator.

## Become a consensus validator
Consensus validators (limited to [13]) are those with the highest validator score (which includes performance score and total stake). Consensus validators receive infrastructure fees paid on each trade and a proportion of that is distributed to their stakers

Learn more about validator roles, staking rewards and penalties ↗

## Maintain your node
To maintain your position and your rewards, you must maintain a high validator score, actively submitting and verifying transactions and stake.

How to maintain a node ↗