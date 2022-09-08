---
sidebar_position: 3
title: Become a standby validator
sidebar_label: Standby
---
import NetworkParameter from '@site/src/components/NetworkParameter';

To become a standby validator, a validator must first be a [candidate](candidate-validators), then pass a certain validator score.

The number of standby nodes is limited to <NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} /> × <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" name="the number of consensus nodes" />.

They are promoted to [consensus validator](consensus) if they pass certain criteria.

## Requirements
1. Run a validating node
2. Self-stake at least <NetworkParameter frontMatter={frontMatter} param="reward.staking.delegation.minimumValidatorStake" formatter="governanceToken" suffix="tokens" hideName={true} /> with the key used to set up the node
3. Maintain a [validator score](validator-score) in the top (<NetworkParameter frontMatter={frontMatter} param="network.validators.ersatz.multipleOfTendermintValidators" hideName={true} /> × <NetworkParameter frontMatter={frontMatter} param="network.validators.multisig.numberOfSigners" hideName={true} />)

## How standby validators are chosen
If there are free slots for one or more standby validators, and there are nodes that have submitted the transaction to join (and satisfy all joining conditions), they are added as standby validators in the next epoch.

If a node that submits the transaction to join has a higher score than the lowest scoring standby validator (scaled up by the incumbent factor), then it will become a standby validator and the lowest scoring standby validator is removed from the standby set.

Note: A node that has a ranking score of 0 (meaning they have no stake and a performance score of 0) for longer than 10 epochs is removed from Vega and will have to resubmit their request to become a validator.

## Performance score

The performance score for *new* standby validators is set to 0. The performance score of a standby validator is calculated based on them successfully submitting transactions.

Validator candidates that have submitted a transaction to become consensus validating nodes will need to send a hash of block number `b`, separately signed by the three required keys and submitted, during each epoch and every set number of blocks (`numBlocks`). 

`numBlocks` = the higher of (the lower of (50 and the epoch duration in seconds) and (epoch duration in seconds x 0.01)

The message with the signed block hash must be in blocks `b+numBlocks` to `b+numBlocks` to count as successfully delivered.

The network will verify this to confirm that the validator owns the keys. 

`b` is defined as: 
* The first time, it is the block number in which the joining transaction was included
* Subsequent times, it is incremented by `numBlocks`

The network will keep track of the last 10 times a standby validator was meant to submit the transactions, and the performance score is the number of times this has been verified, divided by 10.