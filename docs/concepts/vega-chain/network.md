---
sidebar_position: 4
title: Network
vega_network: TESTNET
hide_title: false
---

## Network life
Vega networks will, at least initially, run for a limited time only. 

There are several reasons for this decision, including: 

- Limited network life makes it efficient to upgrade the protocol by starting again, as it avoids the need to deal with multiple versions of the code. Upgrades to a running chain need to respect and be able to recalculate the deterministic state for earlier blocks, so all versions of critical code must remain in the system. 
- It allows for rapid iteration, as the ability to start new chains for new features is simpler.
- Once there is a network with trading, the thousands of transactions per second will generate a lot of data. Given that most instruments expire, this allows for new markets to be created on a new chain, allowing an old market/chain to come to an end rather than keeping the history and data forever.

### Network checkpoints 
The network's validators periodically store checkpoints of all important state parameters such as balances and governance proposals. 

Checkpoints allow the chain to be restarted from a previously valid state in the event of consensus failure, or a critical issue being discovered. 

Those checkpoints happen at defined intervals, and on every deposit and withdrawal request. 

1. Each validator node calculates the hash of the checkpoint file and then sends this through consensus to ensure all the nodes in the network agree on the state. 
2. If/when a network is taken down, the checkpoint file's hash is added to the genesis block. 
3. At network start-up, a validator submits a restore transaction with the checkpoint file. 
4. All other validators verify the checkpoint against their own, restore the state and then allow other transactions on the network. 