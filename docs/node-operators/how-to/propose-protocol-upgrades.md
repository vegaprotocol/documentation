---
sidebar_position: 3
title: Propose and coordinate a protocol upgrade
hide_title: false
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The protocol upgrade feature allows the nodes running a network to automatically update to the latest version of the Vega protocol, without requiring manual intervention. This can be particularly useful in situations where the protocol is critical to the functioning of the system and any downtime or disruption needs to be minimised.

Protocol upgrades are possible by using Vega Visor, a process runner that manages the the processes of a Vega validator node and a data node. Visor starts and stops node processes, tells the node when to take a snapshot, and coordinates upgrades to the protocol. 

A protocol upgrade involves two main parts: 
* Submitting a transaction to initiate the upgrade on a specific block
* Using a process manager, Vega Visor, to coordinate the rollout of the upgrade

## Submit transaction to initiate upgrade
Any consensus validator can submit a proposal for a protocol upgrade. 

The proposal transaction needs to include details about the proposed version and the block height in which to stop the network and upgrade. Submitting the proposal triggers a vote among consensus validators.

Use the Vega Wallet CLI to submit the following command: 

```shell 
vega protocol_upgrade_proposal
``` 

Once the proposal has been submitted, it is reviewed by other validators who then can approve or reject it by voting on the proposal. 

## Visor coordinates upgrade 
If the upgrade proposal is approved (more than 2/3 of consensus validators have voted on the proposal), Visor is responsible for coordinating the rollout of the upgrade across all the nodes on the chosen block height. 

This includes stopping the currently running nodes, ensuring that the new binaries are the correct software version, and starting new nodes. Visor also includes features such as restart capability, which allows Visor to retry the start-up several times before failing. 

You can configure the number of restart attempts in the Visor config, located at `VISOR_HOME_PATH/config.toml`

## Read more about Visor
Read detailed information about Vega Visor, including how it works, how the config is set up and how you can edit it in the [full software description ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#readme).

You can also read the [architecture overview ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#architecture) and [upgrade flow ↗](https://github.com/vegaprotocol/vega/tree/develop/visor#upgrade-flow) topics in the Visor readme.
